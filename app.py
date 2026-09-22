from __future__ import annotations

import json
import os
import random
import re
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


ADMIN_PASSWORD = os.environ.get("FORCA_ADMIN_PASSWORD", "2209")


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
}


COMMON_TRANSLATIONS = {
    "pt": {"goodbye": "tchau", "please": "por favor", "thanks": "obrigado", "yes": "sim", "no": "não", "water": "água", "food": "comida", "school": "escola", "student": "aluno", "teacher": "professor", "book": "livro", "computer": "computador", "help": "ajuda", "word": "palavra", "letter": "letra"},
    "en": {"goodbye": "goodbye", "please": "please", "thanks": "thank you", "yes": "yes", "no": "no", "water": "water", "food": "food", "school": "school", "student": "student", "teacher": "teacher", "book": "book", "computer": "computer", "help": "help", "word": "word", "letter": "letter"},
    "es": {"goodbye": "adiós", "please": "por favor", "thanks": "gracias", "yes": "sí", "no": "no", "water": "agua", "food": "comida", "school": "escuela", "student": "estudiante", "teacher": "profesor", "book": "libro", "computer": "computadora", "help": "ayuda", "word": "palabra", "letter": "letra"},
    "fr": {"goodbye": "au revoir", "please": "s'il vous plaît", "thanks": "merci", "yes": "oui", "no": "non", "water": "eau", "food": "nourriture", "school": "école", "student": "étudiant", "teacher": "professeur", "book": "livre", "computer": "ordinateur", "help": "aide", "word": "mot", "letter": "lettre"},
    "de": {"goodbye": "auf Wiedersehen", "please": "bitte", "thanks": "danke", "yes": "ja", "no": "nein", "water": "Wasser", "food": "Essen", "school": "Schule", "student": "Schüler", "teacher": "Lehrer", "book": "Buch", "computer": "Computer", "help": "Hilfe", "word": "Wort", "letter": "Buchstabe"},
    "it": {"goodbye": "arrivederci", "please": "per favore", "thanks": "grazie", "yes": "sì", "no": "no", "water": "acqua", "food": "cibo", "school": "scuola", "student": "studente", "teacher": "insegnante", "book": "libro", "computer": "computer", "help": "aiuto", "word": "parola", "letter": "lettera"},
    "ja": {"goodbye": "さようなら", "please": "お願いします", "thanks": "ありがとう", "yes": "はい", "no": "いいえ", "water": "水", "food": "食べ物", "school": "学校", "student": "学生", "teacher": "先生", "book": "本", "computer": "コンピューター", "help": "助け", "word": "言葉", "letter": "文字"},
    "ko": {"goodbye": "안녕히 가세요", "please": "부탁합니다", "thanks": "감사합니다", "yes": "네", "no": "아니요", "water": "물", "food": "음식", "school": "학교", "student": "학생", "teacher": "선생님", "book": "책", "computer": "컴퓨터", "help": "도움", "word": "단어", "letter": "글자"},
    "zh": {"goodbye": "再见", "please": "请", "thanks": "谢谢", "yes": "是", "no": "不", "water": "水", "food": "食物", "school": "学校", "student": "学生", "teacher": "老师", "book": "书", "computer": "电脑", "help": "帮助", "word": "单词", "letter": "字母"},
    "ru": {"goodbye": "до свидания", "please": "пожалуйста", "thanks": "спасибо", "yes": "да", "no": "нет", "water": "вода", "food": "еда", "school": "школа", "student": "ученик", "teacher": "учитель", "book": "книга", "computer": "компьютер", "help": "помощь", "word": "слово", "letter": "буква"},
}

def translation_table(language: str) -> dict:
    table = dict(TRANSLATIONS.get(language, {}))
    table.update(COMMON_TRANSLATIONS.get(language, {}))
    return table

def normalize_translation_text(value: str) -> str:
    return str(value or "").strip().casefold()

def translate_local_text(text: str, source: str, target: str) -> tuple[str, bool]:
    source_table = translation_table(source)
    target_table = translation_table(target)
    normalized = normalize_translation_text(text)

    concept = next(
        (key for key, value in source_table.items() if normalize_translation_text(value) == normalized),
        None,
    )
    if concept and target_table.get(concept):
        return target_table[concept], True

    parts = re.split(r"(\W+)", text, flags=re.UNICODE)
    translated = False
    failed = False
    result_parts = []
    for part in parts:
        if not part or not any(ch.isalnum() for ch in part):
            result_parts.append(part)
            continue
        concept = next(
            (key for key, value in source_table.items() if normalize_translation_text(value) == normalize_translation_text(part)),
            None,
        )
        if concept and target_table.get(concept):
            result_parts.append(target_table[concept])
            translated = True
        else:
            result_parts.append(part)
            failed = True

    result = "".join(result_parts)
    return (result, True) if translated and not failed else (text, False)


@app.post("/api/translate")
def translate():
    payload = request.get_json(silent=True) or {}
    text = str(payload.get("text", "")).strip()
    source = str(payload.get("source", "pt")).lower()
    target = str(payload.get("target", "en")).lower()

    if not text or source == target:
        return jsonify({"text": text, "source": source, "target": target})

    if source not in TRANSLATIONS or target not in TRANSLATIONS:
        return jsonify({
            "text": text,
            "source": source,
            "target": target,
            "translated": False,
            "error": "unsupported_language",
        }), 400

    result, translated = translate_local_text(text, source, target)
    return jsonify({
        "text": result,
        "source": source,
        "target": target,
        "translated": translated,
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=os.environ.get("FLASK_DEBUG", "0") == "1",
    )
