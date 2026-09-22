const $ = function(id){return document.getElementById(id);};

const MODES={friends:"Jogar com amigos",random:"Aleatório",endless:"Aleatório crescente"};
const THEMES=[
  ["🎌","Anime"],["📺","Séries"],["🎬","Filmes"],["🧙","Personagens"],["🎮","Jogos"],["🐾","Animais"],
  ["⚽","Esportes"],["🍕","Comidas"],["💻","Tecnologia"],["🌎","Países e Lugares"],["🔬","Ciência"],["🎵","Música"],
  ["🧑‍🔧","Profissões"],["🌳","Natureza"],["📚","Livros"],["🦸","Super-heróis"],["🏫","Escola"],["✨","Outros"]
];
const DIFFICULTIES=["Muito fácil","Fácil","Médio","Difícil","Muito difícil","Especialista","Insano"];
const LANGUAGES=[
 ["pt","🇧🇷 Português"],["en","🇺🇸 English"],["es","🇪🇸 Español"],["fr","🇫🇷 Français"],["de","🇩🇪 Deutsch"],["it","🇮🇹 Italiano"],
 ["ja","🇯🇵 日本語"],["ko","🇰🇷 한국어"],["zh","🇨🇳 中文"],["ru","🇷🇺 Русский"]
];
const LATIN=Array.from("abcdefghijklmnopqrstuvwxyz");
const KEYBOARDS={
 pt:Array.from("abcdefghijklmnopqrstuvwxyzáàãâéêíóôõúç"),en:LATIN,es:Array.from("abcdefghijklmnñopqrstuvwxyzáéíóúü"),
 fr:Array.from("abcdefghijklmnopqrstuvwxyzàâçéèêëîïôûùüÿ"),de:Array.from("abcdefghijklmnopqrstuvwxyzäöüß"),
 it:Array.from("abcdefghijklmnopqrstuvwxyzàèéìíîòóùú"),ja:Array.from("あいうえおかきくけこさしすせそたちつてとなにぬねの"),
 ko:Array.from("가나다라마바사아자차카타파하"),zh:Array.from("的一是不了人我在有他这为之大来以个中上们"),
 ru:Array.from("абвгдеёжзийклмнопрстуфхцчшщъыьэюя")
};

const TRANSLATIONS={
 pt:{hello:"olá",world:"mundo",friend:"amigo",game:"jogo",house:"casa",cat:"gato",dog:"cachorro"},
 en:{hello:"hello",world:"world",friend:"friend",game:"game",house:"house",cat:"cat",dog:"dog"},
 es:{hello:"hola",world:"mundo",friend:"amigo",game:"juego",house:"casa",cat:"gato",dog:"perro"},
 fr:{hello:"bonjour",world:"monde",friend:"ami",game:"jeu",house:"maison",cat:"chat",dog:"chien"},
 de:{hello:"hallo",world:"welt",friend:"freund",game:"spiel",house:"haus",cat:"katze",dog:"hund"},
 it:{hello:"ciao",world:"mondo",friend:"amico",game:"gioco",house:"casa",cat:"gatto",dog:"cane"},
 ja:{hello:"こんにちは",world:"世界",friend:"友達",game:"ゲーム",house:"家",cat:"猫",dog:"犬"},
 ko:{hello:"안녕하세요",world:"세계",friend:"친구",game:"게임",house:"집",cat:"고양이",dog:"개"},
 zh:{hello:"你好",world:"世界",friend:"朋友",game:"游戏",house:"家",cat:"猫",dog:"狗"},
 ru:{hello:"привет",world:"мир",friend:"друг",game:"игра",house:"дом",cat:"кот",dog:"собака"},
};

const COMMON_TRANSLATIONS={
 pt:{goodbye:"tchau",please:"por favor",thanks:"obrigado",yes:"sim",no:"não",water:"água",food:"comida",school:"escola",student:"aluno",teacher:"professor",book:"livro",computer:"computador",help:"ajuda",word:"palavra",letter:"letra"},
 en:{goodbye:"goodbye",please:"please",thanks:"thank you",yes:"yes",no:"no",water:"water",food:"food",school:"school",student:"student",teacher:"teacher",book:"book",computer:"computer",help:"help",word:"word",letter:"letter"},
 es:{goodbye:"adiós",please:"por favor",thanks:"gracias",yes:"sí",no:"no",water:"agua",food:"comida",school:"escuela",student:"estudiante",teacher:"profesor",book:"libro",computer:"computadora",help:"ayuda",word:"palabra",letter:"letra"},
 fr:{goodbye:"au revoir",please:"s'il vous plaît",thanks:"merci",yes:"oui",no:"non",water:"eau",food:"nourriture",school:"école",student:"étudiant",teacher:"professeur",book:"livre",computer:"ordinateur",help:"aide",word:"mot",letter:"lettre"},
 de:{goodbye:"auf Wiedersehen",please:"bitte",thanks:"danke",yes:"ja",no:"nein",water:"Wasser",food:"Essen",school:"Schule",student:"Schüler",teacher:"Lehrer",book:"Buch",computer:"Computer",help:"Hilfe",word:"Wort",letter:"Buchstabe"},
 it:{goodbye:"arrivederci",please:"per favore",thanks:"grazie",yes:"sì",no:"no",water:"acqua",food:"cibo",school:"scuola",student:"studente",teacher:"insegnante",book:"libro",computer:"computer",help:"aiuto",word:"parola",letter:"lettera"},
 ja:{goodbye:"さようなら",please:"お願いします",thanks:"ありがとう",yes:"はい",no:"いいえ",water:"水",food:"食べ物",school:"学校",student:"学生",teacher:"先生",book:"本",computer:"コンピューター",help:"助け",word:"言葉",letter:"文字"},
 ko:{goodbye:"안녕히 가세요",please:"부탁합니다",thanks:"감사합니다",yes:"네",no:"아니요",water:"물",food:"음식",school:"학교",student:"학생",teacher:"선생님",book:"책",computer:"컴퓨터",help:"도움",word:"단어",letter:"글자"},
 zh:{goodbye:"再见",please:"请",thanks:"谢谢",yes:"是",no:"不",water:"水",food:"食物",school:"学校",student:"学生",teacher:"老师",book:"书",computer:"电脑",help:"帮助",word:"单词",letter:"字母"},
 ru:{goodbye:"до свидания",please:"пожалуйста",thanks:"спасибо",yes:"да",no:"нет",water:"вода",food:"еда",school:"школа",student:"ученик",teacher:"учитель",book:"книга",computer:"компьютер",help:"помощь",word:"слово",letter:"буква"},
};

const state={
 mode:"random",theme:"Anime",difficulty:2,language:"pt",word:"",hints:[],hintCount:0,
 errors:0,score:0,streak:0,round:1,correct:0,timeLeft:Infinity,timer:null,
 guessed:new Set(),usedWords:new Set(),database:[],unlocked:false,finished:false,
 playLanguage:"pt",languageFallback:false
};

function escapeHTML(value){
 return String(value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});
}
function normalize(value){return String(value||"").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function letters(value){return Array.from(value||"");}
function guessable(char){return /[\p{L}]/u.test(char);}
function keyOf(char){return normalize(char);}

function screen(id){
 ["menu","config","game","result"].forEach(function(x){$(x).classList.toggle("hidden",x!==id);});
 $("status").textContent=id==="game"?"Jogando":id==="config"?"Configuração":id==="result"?"Resultado":"Menu";
 window.scrollTo({top:0,behavior:"smooth"});
}

function saveSettings(){
 try{localStorage.setItem("forca-settings",JSON.stringify({
  time:$("time").value,language:state.language,player:$("player").value,theme:state.theme,difficulty:state.difficulty
 }));}catch(_){}
}
function loadSettings(){
 try{
  const saved=JSON.parse(localStorage.getItem("forca-settings")||"null");
  if(!saved)return;
  if(LANGUAGES.some(function(x){return x[0]===saved.language;}))state.language=saved.language;
  if(THEMES.some(function(x){return x[1]===saved.theme;}))state.theme=saved.theme;
  if(Number.isInteger(saved.difficulty)&&saved.difficulty>=0&&saved.difficulty<DIFFICULTIES.length)state.difficulty=saved.difficulty;
  if(saved.player)$("player").value=saved.player;
 }catch(_){}
}

function setupSelects(){
 const languageHTML=LANGUAGES.map(function(x){return '<option value="'+x[0]+'">'+x[1]+"</option>";}).join("");
 [$("lang"),$("from"),$("to")].forEach(function(s){s.innerHTML=languageHTML;});
 $("lang").value=state.language;$("from").value="pt";$("to").value="en";

 const times=[[30,"30 segundos"],[60,"1 minuto"],[120,"2 minutos"],[180,"3 minutos"],[300,"5 minutos"],
 [600,"10 minutos"],[900,"15 minutos"],[1200,"20 minutos"],[1800,"30 minutos"],[3600,"60 minutos"],["inf","Tempo infinito"]];
 $("time").innerHTML=times.map(function(x){return '<option value="'+x[0]+'">'+x[1]+"</option>";}).join("");
 $("time").value="180";
 try{
  const saved=JSON.parse(localStorage.getItem("forca-settings")||"null");
  if(saved&&saved.time&&Array.from($("time").options).some(function(o){return o.value===String(saved.time);}))$("time").value=String(saved.time);
 }catch(_){}
}

function closeDropdowns(){
 $("themeMenu").classList.add("hidden");
 $("difficultyMenu").classList.add("hidden");
 $("themeSelectButton").setAttribute("aria-expanded","false");
 $("difficultySelectButton").setAttribute("aria-expanded","false");
}
function toggleDropdown(menuId,buttonId){
 const menu=$(menuId);
 const open=menu.classList.contains("hidden");
 closeDropdowns();
 menu.classList.toggle("hidden",!open);
 $(buttonId).setAttribute("aria-expanded",String(open));
}
function renderOptions(){
 $("themeMenu").innerHTML=THEMES.map(function(x){
  const selected=state.theme===x[1];
  return '<button type="button" class="dropdown-option '+(selected?"selected":"")+'" data-theme="'+escapeHTML(x[1])+'" role="option" aria-selected="'+selected+'"><span>'+x[0]+" "+escapeHTML(x[1])+"</span>"+(selected?"<strong>✓</strong>":"")+"</button>";
 }).join("");
 $("difficultyMenu").innerHTML=DIFFICULTIES.map(function(name,index){
  const selected=state.difficulty===index;
  return '<button type="button" class="dropdown-option '+(selected?"selected":"")+'" data-diff="'+index+'" role="option" aria-selected="'+selected+'"><span>'+(index+1)+". "+escapeHTML(name)+"</span>"+(selected?"<strong>✓</strong>":"")+"</button>";
 }).join("");
 const theme=THEMES.find(function(x){return x[1]===state.theme;})||THEMES[0];
 $("themeSelected").textContent=theme[0]+" "+theme[1];
 $("difficultySelected").textContent=(state.difficulty+1)+". "+DIFFICULTIES[state.difficulty];
}

async function loadDatabase(){
 if(state.database.length)return state.database;
 try{
  const response=await fetch(new URL("data/words.json",document.baseURI),{cache:"no-store"});
  if(!response.ok)throw new Error("Banco indisponível");
  const raw=await response.json();
  if(Array.isArray(raw))state.database=raw;
  else if(raw&&raw.themes&&typeof raw.themes==="object"){
   state.database=Object.entries(raw.themes).flatMap(function(pair){
    const theme=pair[0],items=pair[1];
    return Array.isArray(items)?items.map(function(item){return Object.assign({},item,{theme:theme});}):[];
   });
  }
 }catch(_){state.database=[];}
 return state.database;
}

function difficultyLimit(){
 return Math.min(6,state.difficulty+(state.mode==="endless"?Math.floor(state.streak/2):0));
}
function wordId(item){return normalize(item.word).replace(/\s+/g," ");}
function poolWordId(item){
 return normalize(item.theme||state.theme)+"::"+String(item.language||"pt").toLowerCase()+"::"+wordId(item);
}

async function randomWord(){
 const db=await loadDatabase();
 if(!db.length)return null;

 const level=difficultyLimit();
 const sameTheme=db.filter(function(item){return normalize(item.theme)===normalize(state.theme);});
 if(!sameTheme.length)return null;

 let pool=sameTheme.filter(function(item){return Number(item.difficulty||3)<=level+1;});
 if(!pool.length)pool=sameTheme.slice();

 const localized=pool.filter(function(item){
  return String(item.language||"pt").toLowerCase()===String(state.language||"pt").toLowerCase();
 });

 state.languageFallback=false;
 if(localized.length){
  pool=localized;
 }else{
  const defaultLanguagePool=pool.filter(function(item){
   return String(item.language||"pt").toLowerCase()==="pt";
  });
  if(!defaultLanguagePool.length)return null;
  pool=defaultLanguagePool;
  state.languageFallback=state.language!=="pt";
 }

 let fresh=pool.filter(function(item){return !state.usedWords.has(poolWordId(item));});
 if(!fresh.length){
  pool.forEach(function(item){state.usedWords.delete(poolWordId(item));});
  fresh=pool.slice();
 }

 const item=fresh[Math.floor(Math.random()*fresh.length)]||null;
 if(item){
  state.usedWords.add(poolWordId(item));
  state.playLanguage=String(item.language||"pt").toLowerCase();
 }
 return item;
}

function friendHints(){
 return [1,2,3].map(function(i){return $("friendHint"+i).value.trim();}).filter(Boolean).slice(0,3);
}

function configureMode(mode){
 state.mode=mode;
 $("custom").disabled=mode!=="friends";
 $("friendHints").classList.toggle("hidden",mode!=="friends");
 $("configTitle").textContent=MODES[mode];
 $("modeBadge").textContent=mode==="friends"?"Com amigos":mode==="endless"?"Crescente":"Aleatório";
 screen("config");
}

function setRoundWord(item){
 state.word=String(item&&item.word||"").trim();
 state.hints=Array.isArray(item&&item.hints)?item.hints.filter(Boolean).slice(0,3):[];
 if(!state.hints.length)state.hints=["Use o tema como contexto.","Observe as letras descobertas.","Tente letras comuns antes das raras."];
 state.correct=0;state.hintCount=0;state.guessed.clear();
}

async function startGame(){
 clearInterval(state.timer);
 state.finished=false;state.unlocked=false;state.errors=0;state.score=0;state.streak=0;
 state.round=1;state.correct=0;state.hintCount=0;state.guessed.clear();
 state.languageFallback=false;state.playLanguage=state.language;
 $("adminControls").classList.add("hidden");$("adminPass").value="";closeDropdowns();saveSettings();

 let item;
 if(state.mode==="friends"){
  const customWord=$("custom").value.trim();
  if(!customWord){alert("Digite a palavra secreta.");return;}
  const hints=friendHints();
  item={word:customWord,hints:hints.length?hints:["A palavra foi escolhida pelo anfitrião.","Observe as letras descobertas.","Use o tema como contexto."]};
 }else{
  item=await randomWord();
  if(!item){
   alert("Não há palavras disponíveis para esta combinação de tema, idioma e dificuldade.");
   return;
  }
 }

 setRoundWord(item);
 if(!state.word){alert("Não foi possível carregar uma palavra.");return;}
 screen("game");renderGame();runTimer();
}

function hintCountForProgress(){
 if(state.errors>=5)return 3;
 if(state.errors>=3)return 2;
 if(state.errors>=1)return 1;
 return 0;
}
function visibleHintCount(){return Math.min(3,Math.max(state.hintCount,hintCountForProgress()));}

function renderGame(){
 $("errors").textContent=state.errors+"/8";
 $("score").textContent=String(state.score);
 $("streak").textContent=String(state.streak);
 $("playerLabel").textContent=$("player").value.trim()||"Jogador";
 $("roundLabel").textContent=state.mode==="endless"
  ?"Rodada "+state.round+" • Nível "+(difficultyLimit()+1)
  :"Rodada "+state.round;
 $("hang").textContent=["🙂","😐","😟","😰","😨","😵","🥴","💀","☠️"][Math.min(8,state.errors)];

 const count=visibleHintCount();
 $("hints").innerHTML=state.hints.map(function(h,index){
  return '<div class="hint '+(index<count?"":"locked")+'"><b>💡 Dica '+(index+1)+"</b>"+
    (index<count?escapeHTML(h):"🔒 Liberada conforme você avança")+"</div>";
 }).join("");

 $("word").innerHTML=letters(state.word).map(function(char){
  if(!guessable(char))return "<span>"+escapeHTML(char)+"</span>";
  return '<span class="letter-slot">'+(state.guessed.has(keyOf(char))?escapeHTML(char):"_")+"</span>";
 }).join("");

 const keyboard=Array.from(new Set(KEYBOARDS[state.playLanguage]||LATIN));
 $("keys").innerHTML=keyboard.map(function(char){
  const used=state.guessed.has(keyOf(char));
  return '<button type="button" data-char="'+escapeHTML(char)+'" class="'+(used?"used":"")+'"'+
    (used?" disabled":"")+">"+escapeHTML(char.toLocaleUpperCase())+"</button>";
 }).join("");

 $("keys").querySelectorAll("button").forEach(function(button){
  button.addEventListener("click",function(){guess(button.dataset.char);});
 });
 document.documentElement.lang=state.playLanguage;
 $("game").dir=["ar","he"].includes(state.playLanguage)?"rtl":"ltr";
 const selectedLanguage=(LANGUAGES.find(function(item){return item[0]===state.language;})||["pt","🇧🇷 Português"])[1];
 $("roundLabel").textContent=state.mode==="endless"
  ?"Rodada "+state.round+" • Nível "+(difficultyLimit()+1)+" • "+(state.languageFallback?"Banco: Português":selectedLanguage)
  :"Rodada "+state.round+" • "+(state.languageFallback?"Banco: Português":selectedLanguage);
 updateTimer();
}

function solved(){
 return letters(state.word).filter(guessable).every(function(char){return state.guessed.has(keyOf(char));});
}

function guess(input){
 if(state.finished||$("game").classList.contains("hidden"))return;
 const character=letters(input)[0];
 if(!character||!guessable(character))return;
 const key=keyOf(character);
 if(!key||state.guessed.has(key))return;

 state.guessed.add(key);
 if(letters(state.word).some(function(char){return keyOf(char)===key;})){
  state.score+=10;state.correct+=1;
 }else{
  state.errors+=1;state.score=Math.max(0,state.score-5);
 }

 if(solved()){
  state.streak+=1;state.score+=50;
  if(state.mode==="endless")nextEndlessRound();else finish(true);
  return;
 }
 if(state.errors>=8){finish(false,"💥 Você atingiu 8 erros.");return;}
 renderGame();
}

async function nextEndlessRound(){
 state.round+=1;state.errors=0;state.correct=0;state.hintCount=0;state.guessed.clear();
 const item=await randomWord();
 if(state.finished)return;
 if(!item){finish(false,"Não há mais palavras disponíveis para esta configuração.");return;}
 setRoundWord(item);renderGame();runTimer();
}

function configuredTime(){return $("time").value==="inf"?Infinity:Number($("time").value);}
function runTimer(){
 clearInterval(state.timer);state.timeLeft=configuredTime();updateTimer();
 if(state.timeLeft===Infinity)return;
 state.timer=setInterval(function(){
  if(state.finished)return;
  state.timeLeft-=1;updateTimer();
  if(state.timeLeft<=0)finish(false,"⏰ O tempo acabou.");
 },1000);
}
function updateTimer(){$("timer").textContent=state.timeLeft===Infinity?"∞":Math.max(0,state.timeLeft)+"s";}

function finish(won,message){
 if(state.finished)return;
 state.finished=true;clearInterval(state.timer);screen("result");
 $("resultIcon").textContent=won?"🏆":"💀";
 $("resultTitle").textContent=won?"Você acertou!":"Fim de jogo";
 $("resultKicker").textContent=won?"PARTIDA CONCLUÍDA":"PARTIDA ENCERRADA";
 const player=$("player").value.trim()||"Jogador";
 $("resultText").textContent=message||player+", sua pontuação foi "+state.score+" pontos.";
 $("resultSecret").innerHTML="<strong>Palavra secreta:</strong> "+escapeHTML(state.word);
}

function exitGame(){
 if(state.finished)return;
 if(!confirm("Sair da partida agora? O progresso desta partida será perdido."))return;
 clearInterval(state.timer);state.finished=true;screen("menu");
}
function restartCurrentWord(){
 if(!state.word)return;
 clearInterval(state.timer);state.finished=false;state.errors=0;state.correct=0;state.hintCount=0;state.guessed.clear();
 renderGame();runTimer();
}

function translationTable(language){
 return Object.assign({},TRANSLATIONS[language]||{},COMMON_TRANSLATIONS[language]||{});
}

function normalizeTranslationText(value){
 return String(value||"").trim().toLocaleLowerCase();
}

function localTranslate(text,source,target){
 const sourceTable=translationTable(source),targetTable=translationTable(target);
 const normalized=normalizeTranslationText(text);

 const exactConcept=Object.keys(sourceTable).find(function(key){
  return normalizeTranslationText(sourceTable[key])===normalized;
 });
 if(exactConcept&&targetTable[exactConcept])return {text:targetTable[exactConcept],translated:true};

 const tokens=String(text).split(/([\p{L}\p{M}\p{N}]+|[^\p{L}\p{M}\p{N}]+)/u).filter(Boolean);
 let translatedAny=false;
 let failed=false;
 const result=tokens.map(function(token){
  if(!/[\p{L}\p{M}\p{N}]/u.test(token))return token;
  const concept=Object.keys(sourceTable).find(function(key){
   return normalizeTranslationText(sourceTable[key])===normalizeTranslationText(token);
  });
  if(concept&&targetTable[concept]){
   translatedAny=true;
   return targetTable[concept];
  }
  failed=true;
  return token;
 }).join("");

 return {text:translatedAny&&!failed?result:text,translated:translatedAny&&!failed};
}

async function translate(){
 const text=$("trText").value.trim(),source=$("from").value,target=$("to").value;
 if(!text){$("trResult").value="";$("translateStatus").textContent="";return;}
 if(source===target){
  $("trResult").value=text;
  $("translateStatus").textContent="Os idiomas são iguais.";
  return;
 }

 $("translateStatus").textContent="Traduzindo...";
 try{
  const response=await fetch(new URL("api/translate",document.baseURI),{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({text:text,source:source,target:target})
  });
  if(response.ok){
   const data=await response.json();
   if(data.text&&data.translated!==false){
    $("trResult").value=data.text;
    $("translateStatus").textContent="Tradução feita pelo backend Python.";
    return;
   }
  }
 }catch(_){}

 const local=localTranslate(text,source,target);
 $("trResult").value=local.text;
 $("translateStatus").textContent=local.translated
  ?"Tradução local disponível no GitHub Pages."
  :"Não há tradução cadastrada para esse texto.";
}

function toggleAdmin(){
 $("adminBody").classList.toggle("hidden");
 if(!$("adminBody").classList.contains("hidden"))$("adminPass").focus();
}
const ADMIN_LOCAL_PASSWORD="2209";

async function unlockAdmin(){
 const password=$("adminPass").value.trim();
 if(!password)return;

 if(password===ADMIN_LOCAL_PASSWORD){
  state.unlocked=true;
  $("adminControls").classList.remove("hidden");
  $("adminPass").value="";
  $("translateStatus").textContent="Painel Admin desbloqueado.";
  return;
 }

 try{
  const response=await fetch("api/admin/check",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({password:password})
  });
  const data=response.ok?await response.json():null;
  if(data&&data.valid){
   state.unlocked=true;
   $("adminControls").classList.remove("hidden");
   $("adminPass").value="";
   $("translateStatus").textContent="Painel Admin desbloqueado.";
   return;
  }
 }catch(_){}

 $("adminPass").value="";
 alert("Senha incorreta.");
}
function canAdmin(){return state.unlocked;}
function addTime(seconds){if(canAdmin()&&state.timeLeft!==Infinity){state.timeLeft+=seconds;updateTimer();}}
function revealWord(){
 if(!canAdmin())return;
 letters(state.word).filter(guessable).forEach(function(char){state.guessed.add(keyOf(char));});
 state.hintCount=3;renderGame();
}
function removeError(){if(canAdmin()&&state.errors>0){state.errors-=1;renderGame();}}
function nextHint(){if(canAdmin()){state.hintCount=Math.min(3,state.hintCount+1);renderGame();}}
function addScore(){if(canAdmin()){state.score+=100;renderGame();}}
function resetRound(){if(canAdmin())restartCurrentWord();}

function bindEvents(){
 $("themeSelectButton").addEventListener("click",function(e){e.stopPropagation();toggleDropdown("themeMenu","themeSelectButton");});
 $("difficultySelectButton").addEventListener("click",function(e){e.stopPropagation();toggleDropdown("difficultyMenu","difficultySelectButton");});
 $("themeMenu").addEventListener("click",function(event){
  const button=event.target.closest("[data-theme]");if(!button)return;
  state.theme=button.dataset.theme;renderOptions();saveSettings();closeDropdowns();
 });
 $("difficultyMenu").addEventListener("click",function(event){
  const button=event.target.closest("[data-diff]");if(!button)return;
  state.difficulty=Number(button.dataset.diff);renderOptions();saveSettings();closeDropdowns();
 });
 document.addEventListener("click",function(event){if(!event.target.closest(".dropdown"))closeDropdowns();});
 document.addEventListener("keydown",function(event){
  if(event.key==="Escape"){closeDropdowns();return;}
  if(state.finished||event.ctrlKey||event.altKey||event.metaKey)return;
  const tag=(event.target.tagName||"").toLowerCase();
  if(["input","textarea","select"].includes(tag))return;
  if(event.key.length===1)guess(event.key);
 });

 document.querySelectorAll(".mode-card").forEach(function(button){button.addEventListener("click",function(){configureMode(button.dataset.mode);});});
 $("back").addEventListener("click",function(){clearInterval(state.timer);closeDropdowns();screen("menu");});
 $("start").addEventListener("click",startGame);
 $("again").addEventListener("click",startGame);
 $("exit").addEventListener("click",function(){clearInterval(state.timer);state.finished=true;screen("menu");});
 $("exitGame").addEventListener("click",exitGame);
 $("restartGame").addEventListener("click",restartCurrentWord);

 $("toggleAdmin").addEventListener("click",toggleAdmin);
 $("unlock").addEventListener("click",unlockAdmin);
 $("adminPass").addEventListener("keydown",function(event){if(event.key==="Enter")unlockAdmin();});
 document.querySelectorAll("[data-add]").forEach(function(button){button.addEventListener("click",function(){addTime(Number(button.dataset.add));});});
 $("reveal").addEventListener("click",revealWord);
 $("removeError").addEventListener("click",removeError);
 $("nextHint").addEventListener("click",nextHint);
 $("addScore").addEventListener("click",addScore);
 $("resetRound").addEventListener("click",resetRound);

 $("translate").addEventListener("click",translate);
 $("lang").addEventListener("change",function(event){state.language=event.target.value;saveSettings();});
 $("time").addEventListener("change",saveSettings);
 $("player").addEventListener("input",saveSettings);
}

setupSelects();
loadSettings();
$("lang").value=state.language;
renderOptions();
bindEvents();
loadDatabase();
