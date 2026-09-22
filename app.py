from __future__ import annotations

import json
import os
import random
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "words.json"

app = Flask(__name__, static_folder="static", static_url_path="/static")


def load_grouped_words() -> dict:
    with DATA_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if isinstance(data, dict) and isinstance(data.get("themes"), dict):
        return data["themes"]

    if isinstance(data, list):
        grouped = {}
        for item in data:
            grouped.setdefault(item.get("theme", "Outros"), []).append(item)
        return grouped

    return {}


def all_words() -> list[dict]:
    grouped = load_grouped_words()
    result = []

    for theme, items in grouped.items():
        for item in items:
            entry = dict(item)
            entry["theme"] = theme
            result.append(entry)

    return result


@app.get("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/data/<path:filename>")
def data_file(filename: str):
    return send_from_directory(BASE_DIR / "data", filename)


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "jogo-da-forca-api"})


@app.get("/api/words")
def words():
    return jsonify(load_grouped_words())


@app.get("/api/word")
def random_word():
    items = all_words()
    theme = request.args.get("theme", "").strip().casefold()
    language = request.args.get("language", "").strip().casefold()
    difficulty_raw = request.args.get("difficulty", "").strip()

    if theme:
        items = [item for item in items if str(item.get("theme", "")).casefold() == theme]
        if not items:
            return jsonify({
                "error": "theme_not_found",
                "message": "Nenhuma palavra encontrada para o tema informado.",
            }), 404

    if language:
        items = [item for item in items if str(item.get("language", "pt")).casefold() == language]
        if not items:
            return jsonify({
                "error": "language_not_found",
                "message": "Nenhuma palavra encontrada para o idioma informado.",
            }), 404

    if difficulty_raw:
        if not difficulty_raw.isdigit():
            return jsonify({
                "error": "invalid_difficulty",
                "message": "A dificuldade deve ser um número de 0 a 6.",
            }), 400
        level = max(0, min(6, int(difficulty_raw)))
        items = [
            item for item in items
            if int(item.get("difficulty", 3)) <= level + 1
        ]
        if not items:
            return jsonify({
                "error": "difficulty_not_found",
                "message": "Nenhuma palavra atende à dificuldade informada.",
            }), 404

    if not items:
        return jsonify({
            "error": "no_words",
            "message": "Nenhuma palavra disponível para os filtros informados.",
        }), 404

    return jsonify(random.choice(items))


ADMIN_PASSWORD = os.environ.get("FORCA_ADMIN_PASSWORD", "")


@app.post("/api/admin/check")
def admin_check():
    payload = request.get_json(silent=True) or {}
    password = str(payload.get("password", ""))
    valid = bool(ADMIN_PASSWORD) and password == ADMIN_PASSWORD
    return jsonify({"valid": valid})


TRANSLATIONS = {
    "pt": {"hello": "olá", "world": "mundo", "friend": "amigo", "game": "jogo", "house": "casa", "cat": "gato", "dog": "cachorro"},
    "en": {"hello": "hello", "world": "world", "friend": "friend", "game": "game", "house": "house", "cat": "cat", "dog": "dog"},
    "es": {"hello": "hola", "world": "mundo", "friend": "amigo", "game": "juego", "house": "casa", "cat": "gato", "dog": "perro"},
    "fr": {"hello": "bonjour", "world": "monde", "friend": "ami", "game": "jeu", "house": "maison", "cat": "chat", "dog": "chien"},
    "de": {"hello": "hallo", "world": "welt", "friend": "freund", "game": "spiel", "house": "haus", "cat": "katze", "dog": "hund"},
    "it": {"hello": "ciao", "world": "mondo", "friend": "amico", "game": "gioco", "house": "casa", "cat": "gatto", "dog": "cane"},
    "ja": {"hello": "こんにちは", "world": "世界", "friend": "友達", "game": "ゲーム", "house": "家", "cat": "猫", "dog": "犬"},
    "ko": {"hello": "안녕하세요", "world": "세계", "friend": "친구", "game": "게임", "house": "집", "cat": "고양이", "dog": "개"},
    "zh": {"hello": "你好", "world": "世界", "friend": "朋友", "game": "游戏", "house": "家", "cat": "猫", "dog": "狗"},
    "ru": {"hello": "привет", "world": "мир", "friend": "друг", "game": "игра", "house": "дом", "cat": "кот", "dog": "собака"},
    "uk": {"hello": "привіт", "world": "світ", "friend": "друг", "game": "гра", "house": "дім", "cat": "кіт", "dog": "собака"},
    "el": {"hello": "γεια", "world": "κόσμος", "friend": "φίλος", "game": "παιχνίδι", "house": "σπίτι", "cat": "γάτα", "dog": "σκύλος"},
    "nl": {"hello": "hallo", "world": "wereld", "friend": "vriend", "game": "spel", "house": "huis", "cat": "kat", "dog": "hond"},
    "pl": {"hello": "cześć", "world": "świat", "friend": "przyjaciel", "game": "gra", "house": "dom", "cat": "kot", "dog": "pies"},
    "tr": {"hello": "merhaba", "world": "dünya", "friend": "arkadaş", "game": "oyun", "house": "ev", "cat": "kedi", "dog": "köpek"},
    "ar": {"hello": "مرحبا", "world": "العالم", "friend": "صديق", "game": "لعبة", "house": "بيت", "cat": "قط", "dog": "كلب"},
    "hi": {"hello": "नमस्ते", "world": "दुनिया", "friend": "दोस्त", "game": "खेल", "house": "घर", "cat": "बिल्ली", "dog": "कुत्ता"},
    "he": {"hello": "שלום", "world": "עולם", "friend": "חבר", "game": "משחק", "house": "בית", "cat": "חתול", "dog": "כלב"},
    "sv": {"hello": "hej", "world": "värld", "friend": "vän", "game": "spel", "house": "hus", "cat": "katt", "dog": "hund"},
    "no": {"hello": "hei", "world": "verden", "friend": "venn", "game": "spill", "house": "hus", "cat": "katt", "dog": "hund"},
    "da": {"hello": "hej", "world": "verden", "friend": "ven", "game": "spil", "house": "hus", "cat": "kat", "dog": "hund"},
}


@app.post("/api/translate")
def translate():
    payload = request.get_json(silent=True) or {}
    text = str(payload.get("text", "")).strip()
    source = str(payload.get("source", "pt")).lower()
    target = str(payload.get("target", "en")).lower()

    if not text or source == target:
        return jsonify({"text": text, "source": source, "target": target})

    source_table = TRANSLATIONS.get(source, {})
    target_table = TRANSLATIONS.get(target, {})
    normalized = text.casefold()
    concept = next(
        (key for key, value in source_table.items() if value.casefold() == normalized),
        None,
    )
    result = target_table.get(concept, text) if concept else text

    return jsonify({"text": result, "source": source, "target": target})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=os.environ.get("FLASK_DEBUG", "0") == "1",
    )
