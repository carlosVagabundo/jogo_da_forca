# 🎯 Jogo da Forca Ultimate

Jogo da forca modular, responsivo e preparado para dois cenários:

1. GitHub Pages: executa a versão estática com HTML + CSS + JavaScript + JSON.
2. Flask/Python: executa a aplicação local com API, tradução e validação do painel Admin.

> Para aplicações web, a tecnologia do navegador usada neste projeto é JavaScript. Java é outra tecnologia.

## Estrutura

    jogo_da_forca/
    ├── .github/
    │   └── workflows/
    │       ├── deploy-pages.yml
    │       └── validate.yml
    ├── app.py
    ├── index.html
    ├── requirements.txt
    ├── README.md
    ├── .gitignore
    ├── data/
    │   └── words.json
    └── static/
        ├── script.js
        └── style.css

## Banco de palavras

O arquivo data/words.json agora é organizado por seções de tema. Em JSON não existe div; o equivalente correto é um objeto com uma chave para cada tema.

Exemplo:

    {
      "themes": {
        "Anime": [],
        "Séries": [],
        "Filmes": [],
        "Personagens": [],
        "Jogos": [],
        "Animais": []
      }
    }

Cada tema possui várias palavras com dificuldade, idioma e três dicas. Para adicionar conteúdo, basta editar a lista do tema correspondente.

## Recursos

- Jogar com amigos.
- Palavra secreta personalizada.
- Até 3 dicas personalizadas no modo com amigos.
- Modo aleatório.
- Modo aleatório crescente.
- 8 erros por rodada.
- Timer de 30 segundos a 60 minutos e tempo infinito.
- 18 temas.
- 7 níveis de dificuldade, com conteúdo dos níveis 1 a 7 em todos os temas.
- 21 opções de idioma/teclado.
- Banco atual com 162 palavras; as palavras cadastradas atualmente estão em português.
- Quando não houver uma palavra cadastrada no idioma escolhido, o jogo informa isso na rodada e usa português também no teclado para manter a partida jogável.
- Teclado virtual adaptado ao idioma disponível.
- Teclado físico sem interferir em campos de texto, senha ou seleção.
- Dicas progressivas durante a partida.
- Pontuação e sequência.
- Tela final com pontuação e palavra secreta.
- Configurações salvas no navegador.
- Fallback local de palavras para continuar jogando sem API.
- Painel Admin recolhível quando o Flask está ativo.

## Por que o GitHub Pages não estava funcionando?

O GitHub Pages publica arquivos estáticos. Ele não executa o servidor Flask/Python do app.py. O projeto anterior tentava acessar endpoints de API que só existem quando o Flask está rodando.

Agora o frontend foi corrigido para:

- carregar data/words.json diretamente no navegador;
- usar caminhos relativos compatíveis com um repositório publicado em github.io/NOME-DO-REPOSITORIO/;
- não depender do Flask para sortear palavras;
- respeitar tema, dificuldade e idioma disponível sem cair silenciosamente em outra categoria;
- não depender do Flask para iniciar uma partida;
- usar o tradutor local como fallback;
- deixar o Admin protegido pelo backend disponível apenas na versão Flask.

## Publicar no GitHub Pages

O repositório agora contém .github/workflows/deploy-pages.yml. O workflow publica automaticamente o site estático a cada push na branch main, usando as ações oficiais de Pages.

No GitHub:

1. Abra Settings do repositório.
2. Entre em Pages.
3. Em Build and deployment > Source, selecione GitHub Actions.
4. Vá em Actions e confirme que Deploy to GitHub Pages terminou com sucesso.
5. Abra a URL informada pelo GitHub.

O index.html permanece na raiz porque o artefato publicado precisa conter o arquivo de entrada no nível superior.

## Executar localmente com Python

Windows PowerShell:

    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    python app.py

Linux/macOS:

    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    python app.py

Depois abra http://127.0.0.1:5000

## Painel Admin

O painel Admin usa o backend Flask para validar a senha.

Configure a senha com variável de ambiente:

    $env:FORCA_ADMIN_PASSWORD="sua-senha"
    python app.py

Por segurança, a senha não fica gravada no JavaScript do navegador.

No GitHub Pages, o backend não está ativo, então as funções Admin protegidas pelo servidor ficam indisponíveis.

## API

- GET /api/health
- GET /api/words
- GET /api/word?theme=Anime&language=pt&difficulty=3
- POST /api/translate
- POST /api/admin/check

## Validação automática

O workflow validate.yml verifica:

- sintaxe do Python;
- estrutura do words.json;
- sintaxe do JavaScript;
- referências básicas do frontend estático.

## Manutenção

Para adicionar uma palavra, coloque este objeto dentro do tema desejado em data/words.json:

    {
      "word": "Exemplo",
      "difficulty": 2,
      "language": "pt",
      "hints": [
        "Dica mais fácil",
        "Dica intermediária",
        "Dica mais específica"
      ]
    }
