from __future__ import annotations

import json
import os
import random
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "words.json"

app = Flask(__name__, static_folder="static", static_url_path="/static")


def load_words() -> list[dict]:
    with DATA_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)
    return data if isinstance(data, list) else []


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
    return jsonify(load_words())


@app.get("/api/word")
def random_word():
    items = load_words()
    theme = request.args.get("theme", "").strip().lower()
    language = request.args.get("language", "").strip().lower()
    difficulty_raw = request.args.get("difficulty", "")

    if theme:
        items = [item for item in items if item.get("theme", "").lower() == theme]
    if language:
        items = [item for item in items if item.get("language", "pt").lower() == language]
    if difficulty_raw.isdigit():
        difficulty = int(difficulty_raw)
        items = [item for item in items if int(item.get("difficulty", 3)) <= difficulty + 1]

    return jsonify(random.choice(items or load_words()))


TRANSLATIONS = {
    ("pt", "en"): {"olá": "hello", "mundo": "world", "amigo": "friend", "jogo": "game", "casa": "house", "água": "water", "fogo": "fire", "gato": "cat", "cachorro": "dog"},
    ("en", "pt"): {"hello": "olá", "world": "mundo", "friend": "amigo", "game": "jogo", "house": "casa", "water": "água", "fire": "fogo", "cat": "gato", "dog": "cachorro"},
    ("pt", "es"): {"olá": "hola", "mundo": "mundo", "amigo": "amigo", "jogo": "juego", "casa": "casa", "água": "agua", "fogo": "fuego", "gato": "gato", "cachorro": "perro"},
    ("es", "pt"): {"hola": "olá", "mundo": "mundo", "amigo": "amigo", "juego": "jogo", "casa": "casa", "agua": "água", "fuego": "fogo", "gato": "gato", "perro": "cachorro"},
    ("pt", "fr"): {"olá": "bonjour", "mundo": "monde", "amigo": "ami", "jogo": "jeu", "casa": "maison", "água": "eau", "fogo": "feu"},
    ("fr", "pt"): {"bonjour": "olá", "monde": "mundo", "ami": "amigo", "jeu": "jogo", "maison": "casa", "eau": "água", "feu": "fogo"},
    ("pt", "de"): {"olá": "hallo", "mundo": "welt", "amigo": "freund", "jogo": "spiel", "casa": "haus", "água": "wasser", "fogo": "feuer"},
    ("de", "pt"): {"hallo": "olá", "welt": "mundo", "freund": "amigo", "spiel": "jogo", "haus": "casa", "wasser": "água", "feuer": "fogo"},
}


@app.post("/api/translate")
def translate():
    payload = request.get_json(silent=True) or {}
    text = str(payload.get("text", "")).strip()
    source = str(payload.get("source", "pt")).lower()
    target = str(payload.get("target", "en")).lower()

    if not text:
        return jsonify({"text": "", "source": source, "target": target})
    if source == target:
        result = text
    else:
        dictionary = TRANSLATIONS.get((source, target), {})
        result = dictionary.get(text.casefold(), text)

    return jsonify({"text": result, "source": source, "target": target})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG", "0") == "1")
