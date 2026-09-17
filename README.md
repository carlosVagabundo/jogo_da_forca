# 🎯 Jogo da Forca Ultimate

Jogo da forca web modular, responsivo e preparado para execução como página estática ou como aplicação Flask.

## Stack

- **HTML5**: estrutura da interface.
- **CSS3**: layout responsivo, componentes e visual.
- **JavaScript**: lógica do jogo, teclado, timer, pontuação, dicas, modos e tradução.
- **Python + Flask**: API para palavras aleatórias, tradução, verificação de saúde e painel administrativo.
- **JSON**: banco de palavras em `data/words.json`.

> No navegador, a linguagem correta é **JavaScript**. Java é uma tecnologia diferente; por isso o projeto usa Python + HTML + CSS + JavaScript.

## Estrutura

```text
jogo_da_forca/
├── app.py
├── index.html
├── requirements.txt
├── README.md
├── data/
│   └── words.json
└── static/
    ├── style.css
    └── script.js
```

## Recursos

- Jogar com amigos com palavra e até 3 dicas personalizadas.
- Modo aleatório com filtros de tema, idioma e dificuldade.
- Modo aleatório crescente com dificuldade progressiva e timer reiniciado a cada acerto.
- 8 erros por partida e personagem visual progressivo.
- Pontuação, sequência e rodada.
- Dicas progressivas conforme letras corretas são descobertas.
- Tempo de 30 segundos até 60 minutos e opção de tempo infinito.
- 18 temas e 7 níveis de dificuldade.
- 21 idiomas e teclado virtual adaptado ao idioma selecionado.
- Entrada por teclado físico e campo auxiliar para idiomas com IME.
- Tradutor integrado com suporte local e API Python.
- Painel Admin recolhível para testes: adicionar tempo, revelar palavra, remover erro, liberar dica, adicionar pontos e reiniciar rodada.
- Tela final com pontuação e palavra secreta quando a partida termina por erro ou tempo.

## Executar localmente

### 1. Criar ambiente virtual (opcional, recomendado)

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Linux/macOS:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Iniciar o Flask

```bash
python app.py
```

Abra `http://127.0.0.1:5000` no navegador.

## API

`GET /api/health` — verifica se a API está online.

`GET /api/words` — retorna o banco de palavras.

`GET /api/word?theme=Anime&language=pt&difficulty=3` — retorna uma palavra aleatória compatível com os filtros.

`POST /api/translate` — recebe JSON com `text`, `source` e `target`.

`POST /api/admin/check` — valida a senha administrativa configurada no servidor.

## Senha do painel Admin

Por segurança, a senha **não fica fixa no JavaScript**. O backend lê a variável de ambiente `FORCA_ADMIN_PASSWORD`.

Exemplo no PowerShell:

```powershell
$env:FORCA_ADMIN_PASSWORD="sua-senha"
python app.py
```

Sem a variável, o projeto usa `admin` como valor padrão de desenvolvimento. Para um ambiente real, altere essa variável.

## Execução sem Python

O frontend continua funcionando como página estática porque possui fallback local para o banco de palavras e para o tradutor. Para esse modo, basta abrir `index.html` em um navegador ou publicar os arquivos estáticos em um serviço como GitHub Pages.

A API Python é necessária para usar o backend Flask e os endpoints `/api/*`.

## Manutenção

Para adicionar palavras, edite `data/words.json`. Cada item segue o formato:

```json
{
  "word": "Python",
  "theme": "Tecnologia",
  "difficulty": 1,
  "language": "pt",
  "hints": ["Dica 1", "Dica 2", "Dica 3"]
}
```

Mantenha exatamente três dicas quando possível para preservar a progressão visual do jogo.
