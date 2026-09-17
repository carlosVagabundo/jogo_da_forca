from flask import Flask, jsonify, request, render_template
import random

app = Flask(__name__)

WORDS = [
    {"word":"Naruto","theme":"Anime","hints":["Faz parte do universo de Naruto.","É conhecido como um ninja.","Sua história envolve a Vila da Folha."]},
    {"word":"Itachi","theme":"Anime","hints":["Faz parte do universo de Naruto.","É irmão mais velho de Sasuke Uchiha.","Pertence ao clã Uchiha."]},
    {"word":"Tanjiro","theme":"Anime","hints":["Faz parte do universo de Demon Slayer.","É companheiro de Zenitsu e Inosuke.","Usa técnicas de respiração."]},
    {"word":"Goku","theme":"Anime","hints":["Faz parte do universo de Dragon Ball.","É um guerreiro Saiyajin.","Seu rival mais conhecido é Vegeta."]},
    {"word":"Tails","theme":"Jogos","hints":["Faz parte do universo de Sonic.","É um dos aliados mais conhecidos de Sonic.","É famoso por usar duas caudas."]},
    {"word":"Minecraft","theme":"Jogos","hints":["É um jogo de construção e exploração.","Possui blocos e criaturas.","Tem modos de sobrevivência e criativo."]},
    {"word":"Brasil","theme":"Países e Lugares","hints":["É um país da América do Sul.","Tem o português como idioma oficial.","É conhecido pela diversidade cultural e natural."]},
    {"word":"Python","theme":"Tecnologia","hints":["É uma linguagem de programação.","É muito usada em automação e ciência de dados.","Seu nome também está ligado a uma cobra."]}
]

@app.get('/')
def home():
    return render_template('index.html')

@app.get('/api/word')
def random_word():
    theme = request.args.get('theme', '')
    pool = [w for w in WORDS if not theme or w['theme'].lower() == theme.lower()]
    return jsonify(random.choice(pool or WORDS))

@app.get('/api/words')
def words():
    return jsonify(WORDS)

@app.post('/api/translate')
def translate():
    data = request.get_json(silent=True) or {}
    text = str(data.get('text', '')).strip()
    source = data.get('source', 'pt')
    target = data.get('target', 'en')
    dictionary = {
        ('pt','en'):{'olá':'hello','mundo':'world','amigo':'friend','jogo':'game'},
        ('en','pt'):{'hello':'olá','world':'mundo','friend':'amigo','game':'jogo'},
        ('pt','es'):{'olá':'hola','mundo':'mundo','amigo':'amigo','jogo':'juego'},
        ('es','pt'):{'hola':'olá','mundo':'mundo','amigo':'amigo','juego':'jogo'}
    }
    result = dictionary.get((source,target), {}).get(text.lower(), text)
    return jsonify({'text': result, 'source': source, 'target': target})

if __name__ == '__main__':
    app.run(debug=True)
