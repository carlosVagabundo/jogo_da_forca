const $ = function(id) { return document.getElementById(id); };

const MODES = { friends:"Jogar com amigos", random:"Aleatório", endless:"Aleatório crescente" };
const THEMES = [
  ["🎌","Anime"],["📺","Séries"],["🎬","Filmes"],["🧙","Personagens"],["🎮","Jogos"],["🐾","Animais"],
  ["⚽","Esportes"],["🍕","Comidas"],["💻","Tecnologia"],["🌎","Países e Lugares"],["🔬","Ciência"],["🎵","Música"],
  ["🧑‍🔧","Profissões"],["🌳","Natureza"],["📚","Livros"],["🦸","Super-heróis"],["🏫","Escola"],["✨","Outros"]
];
const DIFFICULTIES = ["Muito fácil","Fácil","Médio","Difícil","Muito difícil","Especialista","Insano"];
const LANGUAGES = [
  ["pt","🇧🇷 Português"],["en","🇺🇸 English"],["es","🇪🇸 Español"],["fr","🇫🇷 Français"],["de","🇩🇪 Deutsch"],["it","🇮🇹 Italiano"],
  ["ja","🇯🇵 日本語"],["ko","🇰🇷 한국어"],["zh","🇨🇳 中文"],["ru","🇷🇺 Русский"],["uk","🇺🇦 Українська"],["el","🇬🇷 Ελληνικά"],
  ["nl","🇳🇱 Nederlands"],["pl","🇵🇱 Polski"],["tr","🇹🇷 Türkçe"],["ar","🇸🇦 العربية"],["hi","🇮🇳 हिन्दी"],["he","🇮🇱 עברית"],
  ["sv","🇸🇪 Svenska"],["no","🇳🇴 Norsk"],["da","🇩🇰 Dansk"]
];
const KEYBOARDS = {
  pt:[..."abcdefghijklmnopqrstuvwxyzáàãâéêíóôõúç"], en:[..."abcdefghijklmnopqrstuvwxyz"],
  es:[..."abcdefghijklmnñopqrstuvwxyzáéíóúü"], fr:[..."abcdefghijklmnopqrstuvwxyzàâçéèêëîïôûùüÿ"],
  de:[..."abcdefghijklmnopqrstuvwxyzäöüß"], it:[..."abcdefghijklmnopqrstuvwxyzàèéìíîòóùú"],
  ja:[..."あいうえおかきくけこさしすせそたちつてとなにぬねの"], ko:[..."가나다라마바사아자차카타파하"],
  zh:[..."的一是不了人我在有他这为之大来以个中上们"], ru:[..."абвгдеёжзийклмнопрстуфхцчшщъыьэюя"],
  uk:[..."абвгґдеєжзиіїйклмнопрстуфхцчшщьюя"], el:[..."αβγδεζηθικλμνξοπρστυφχψω"],
  nl:[..."abcdefghijklmnopqrstuvwxyz"], pl:[..."aąbcćdeęfghijklłmnńoóprsśtuwyzźż"],
  tr:[..."abcçdefgğhıijklmnoöprsştuüvyz"], ar:[..."ابتثجحخدذرزسشصضطظعغفقكلمنهوي"],
  hi:[..."अआइईउऊएऐओऔकखगघचछजझटठडढतथदधनपफबभमयरलवशषसह"], he:[..."אבגדהוזחטיךכלםמןנסעףפץצקרשת"],
  sv:[..."abcdefghijklmnopqrstuvwxyzåäö"], no:[..."abcdefghijklmnopqrstuvwxyzæøå"], da:[..."abcdefghijklmnopqrstuvwxyzæøå"]
};

const state = {
  mode:"random",theme:"Anime",difficulty:2,language:"pt",word:"",hints:[],hintCount:0,
  errors:0,score:0,streak:0,round:1,correct:0,timeLeft:Infinity,timer:null,guessed:new Set(),
  database:[],unlocked:false,finished:false,
};

function escapeHTML(value){return String(value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
function normalizeChar(value){return String(value||"").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function chars(value){return Array.from(value||"");}
function guessable(char){return /[\p{L}]/u.test(char);}
function keyOf(char){return normalizeChar(char);}

function saveSettings(){
  try{localStorage.setItem("forca-settings",JSON.stringify({
    time:$("time").value,language:state.language,player:$("player").value,theme:state.theme,difficulty:state.difficulty
  }));}catch(_){}
}
function loadSettings(){
  try{
    const saved=JSON.parse(localStorage.getItem("forca-settings")||"null");
    if(!saved)return;
    if(saved.language&&LANGUAGES.some(function(x){return x[0]===saved.language;}))state.language=saved.language;
    if(Number.isInteger(saved.difficulty)&&saved.difficulty>=0&&saved.difficulty<=6)state.difficulty=saved.difficulty;
    if(THEMES.some(function(x){return x[1]===saved.theme;}))state.theme=saved.theme;
    if(saved.player)$("player").value=saved.player;
  }catch(_){}
}
function screen(id){
  ["menu","config","game","result"].forEach(function(x){$(x).classList.toggle("hidden",x!==id);});
  $("status").textContent=id==="game"?"Jogando":id==="config"?"Configuração":id==="result"?"Resultado":"Menu";
  window.scrollTo({top:0,behavior:"smooth"});
}

function languageOptions(){
  const html=LANGUAGES.map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>';}).join("");
  [$("lang"),$("from"),$("to")].forEach(function(s){s.innerHTML=html;});
  $("from").value="pt";$("to").value="en";$("lang").value=state.language;
}
function timeOptions(){
  const list=[[30,"30 segundos"],[60,"1 minuto"],[120,"2 minutos"],[180,"3 minutos"],[300,"5 minutos"],[600,"10 minutos"],
    [900,"15 minutos"],[1200,"20 minutos"],[1800,"30 minutos"],[3600,"60 minutos"],["inf","Tempo infinito"]];
  $("time").innerHTML=list.map(function(x){return '<option value="'+x[0]+'">'+x[1]+"</option>";}).join("");
  $("time").value="180";
  try{
    const saved=JSON.parse(localStorage.getItem("forca-settings")||"null");
    if(saved&&saved.time) $("time").value=String(saved.time);
  }catch(_){}
}

function closeDropdowns(except){
  document.querySelectorAll(".dropdown-menu").forEach(function(menu){
    if(!except||menu.id!==except)menu.classList.add("hidden");
  });
  if(!except){
    $("themeSelectButton").setAttribute("aria-expanded","false");
    $("difficultySelectButton").setAttribute("aria-expanded","false");
  }
}
function toggleDropdown(menuId,buttonId){
  const menu=$(menuId),wasClosed=menu.classList.contains("hidden");
  closeDropdowns(menuId);
  menu.classList.toggle("hidden",!wasClosed);
  $(buttonId).setAttribute("aria-expanded",String(wasClosed));
}
function renderOptions(){
  $("themeMenu").innerHTML=THEMES.map(function(item){
    const selected=state.theme===item[1];
    return '<button type="button" class="dropdown-option '+(selected?"selected":"")+'" data-theme="'+escapeHTML(item[1])+'" role="option" aria-selected="'+selected+'">'+
      '<span>'+item[0]+" "+escapeHTML(item[1])+"</span>"+(selected?"<strong>✓</strong>":"")+"</button>";
  }).join("");
  $("difficultyMenu").innerHTML=DIFFICULTIES.map(function(name,index){
    const selected=state.difficulty===index;
    return '<button type="button" class="dropdown-option '+(selected?"selected":"")+'" data-diff="'+index+'" role="option" aria-selected="'+selected+'">'+
      '<span>'+(index+1)+". "+escapeHTML(name)+"</span>"+(selected?"<strong>✓</strong>":"")+"</button>";
  }).join("");
  const theme=THEMES.find(function(x){return x[1]===state.theme;})||THEMES[0];
  $("themeSelected").textContent=theme[0]+" "+theme[1];
  $("difficultySelected").textContent=(state.difficulty+1)+". "+DIFFICULTIES[state.difficulty];
}

async function database(){
  if(state.database.length)return state.database;
  try{
    const response=await fetch(new URL("data/words.json",document.baseURI).toString(),{cache:"no-store"});
    if(!response.ok)throw new Error("words.json indisponível");
    const raw=await response.json();
    if(Array.isArray(raw))state.database=raw;
    else if(raw&&raw.themes&&typeof raw.themes==="object"){
      state.database=Object.keys(raw.themes).reduce(function(all,theme){
        const items=Array.isArray(raw.themes[theme])?raw.themes[theme]:[];
        return all.concat(items.map(function(item){return Object.assign({},item,{theme:theme});}));
      },[]);
    }
  }catch(_){state.database=[];}
  return state.database;
}

function difficultyLimit(){
  return Math.min(6,state.difficulty+(state.mode==="endless"?Math.floor(state.streak/2):0));
}

async function randomWord(){
  const db=await database();
  if(!db.length){
    return {word:"Python",theme:"Tecnologia",difficulty:1,language:"pt",
      hints:["É algo usado para criar programas.","É conhecido por automação e dados.","Também é o nome inglês de uma cobra."]};
  }

  let pool=db.filter(function(item){
    return item.theme===state.theme &&
      Number(item.difficulty||3)<=difficultyLimit()+1 &&
      (!item.language || item.language===state.language || state.language==="pt");
  });

  if(!pool.length){
    pool=db.filter(function(item){
      return item.theme===state.theme && Number(item.difficulty||3)<=difficultyLimit()+1;
    });
  }
  if(!pool.length)pool=db.filter(function(item){return Number(item.difficulty||3)<=difficultyLimit()+1;});
  return pool[Math.floor(Math.random()*pool.length)]||db[Math.floor(Math.random()*db.length)];
}

function friendHints(){
  return [$("friendHint1").value.trim(),$("friendHint2").value.trim(),$("friendHint3").value.trim()].filter(Boolean).slice(0,3);
}

async function startGame(){
  clearInterval(state.timer);
  state.finished=false;state.errors=0;state.score=0;state.streak=0;state.round=1;state.correct=0;
  state.hintCount=0;state.guessed.clear();state.unlocked=false;
  $("adminControls").classList.add("hidden");$("adminPass").value="";closeDropdowns();saveSettings();

  let item;
  if(state.mode==="friends"){
    const customWord=$("custom").value.trim();
    if(!customWord){alert("Digite a palavra secreta.");return;}
    const customHints=friendHints();
    item={word:customWord,hints:customHints.length?customHints:[
      "A palavra foi escolhida pelo anfitrião.","Observe as letras descobertas.","Use o tema como contexto."
    ]};
  }else item=await randomWord();

  state.word=String(item.word||"").trim();
  state.hints=Array.isArray(item.hints)?item.hints.slice(0,3):[];
  if(!state.hints.length)state.hints=["Use o tema como contexto.","Observe as letras descobertas.","Tente as letras mais comuns."];
  if(!state.word){alert("Não foi possível carregar uma palavra.");return;}

  screen("game");renderGame();runTimer();
}

function autoHints(){
  const harder=state.difficulty>=3;
  if(harder)return state.correct>=8?3:state.correct>=6?2:state.correct>=4?1:0;
  return state.correct>=7?3:state.correct>=5?2:state.correct>=3?1:0;
}
function visibleHints(){return Math.min(3,Math.max(state.hintCount,autoHints()));}

function renderGame(){
  $("errors").textContent=state.errors+"/8";$("score").textContent=state.score;$("streak").textContent=state.streak;
  $("playerLabel").textContent=$("player").value.trim()||"Jogador";
  $("roundLabel").textContent=state.mode==="endless"?"Rodada "+state.round+" • Nível "+(difficultyLimit()+1):"Rodada "+state.round;
  $("hang").textContent=["🙂","😐","😟","😰","😨","😵","🥴","💀","☠️"][Math.min(8,state.errors)];

  const count=visibleHints();
  $("hints").innerHTML=state.hints.map(function(h,index){
    return '<div class="hint '+(index<count?"":"locked")+'"><b>💡 Dica '+(index+1)+"</b>"+(index<count?escapeHTML(h):"🔒 Liberada conforme você avança")+"</div>";
  }).join("");

  $("word").innerHTML=chars(state.word).map(function(char){
    if(!guessable(char))return "<span>"+escapeHTML(char)+"</span>";
    return '<span class="letter-slot">' +(state.guessed.has(keyOf(char))?escapeHTML(char):"_")+ "</span>";
  }).join("");

  const keyboard=KEYBOARDS[state.language]||KEYBOARDS.en;
  const unique=Array.from(new Set(keyboard));
  $("keys").innerHTML=unique.map(function(char){
    const used=state.guessed.has(keyOf(char));
    return '<button type="button" data-char="'+escapeHTML(char)+'" class="'+(used?"used":"")+'"'+
      (used?" disabled":"")+">"+escapeHTML(char.toLocaleUpperCase())+"</button>";
  }).join("");
  $("keys").querySelectorAll("button").forEach(function(button){
    button.addEventListener("click",function(){guess(button.dataset.char);});
  });
  document.documentElement.lang=state.language;
  $("game").dir=["ar","he"].includes(state.language)?"rtl":"ltr";
}

function solved(){
  return chars(state.word).filter(guessable).every(function(char){return state.guessed.has(keyOf(char));});
}

function guess(input){
  if(state.finished||$("game").classList.contains("hidden"))return;
  const character=chars(input)[0];
  if(!character||!guessable(character))return;
  const key=keyOf(character);
  if(!key||state.guessed.has(key))return;

  state.guessed.add(key);
  if(chars(state.word).some(function(char){return keyOf(char)===key;})){
    state.score+=10;state.correct+=1;
  }else{
    state.errors+=1;state.score=Math.max(0,state.score-5);
  }

  if(solved()){
    state.streak+=1;state.score+=50;
    if(state.mode==="endless")nextEndless();else finish(true);
    return;
  }
  if(state.errors>=8){finish(false);return;}
  renderGame();
}

async function nextEndless(){
  state.round+=1;state.errors=0;state.correct=0;state.hintCount=0;state.guessed.clear();
  const item=await randomWord();
  if(state.finished)return;
  state.word=String(item.word||"").trim();
  state.hints=Array.isArray(item.hints)?item.hints.slice(0,3):[];
  renderGame();runTimer();
}

function configuredTime(){return $("time").value==="inf"?Infinity:Number($("time").value);}
function runTimer(){
  clearInterval(state.timer);state.timeLeft=configuredTime();updateTimer();
  if(state.timeLeft===Infinity)return;
  state.timer=setInterval(function(){
    state.timeLeft-=1;updateTimer();
    if(state.timeLeft<=0)finish(false);
  },1000);
}
function updateTimer(){$("timer").textContent=state.timeLeft===Infinity?"∞":Math.max(0,state.timeLeft)+"s";}

function finish(won){
  if(state.finished)return;
  state.finished=true;clearInterval(state.timer);screen("result");
  $("resultIcon").textContent=won?"🏆":"💀";
  $("resultTitle").textContent=won?"Você acertou!":"Fim de jogo";
  $("resultKicker").textContent=won?"PARTIDA CONCLUÍDA":"LIMITE ATINGIDO";
  $("resultText").textContent=($("player").value.trim()||"Jogador")+", sua pontuação foi "+state.score+
    " pontos"+(state.mode==="endless"?" e sua sequência chegou a "+state.streak+".":".");
  $("resultSecret").innerHTML="<strong>Palavra secreta:</strong> "+escapeHTML(state.word);
}

async function translate(){
  const text=$("trText").value.trim(),source=$("from").value,target=$("to").value;
  if(!text){$("trResult").value="";$("translateStatus").textContent="";return;}
  if(source===target){$("trResult").value=text;$("translateStatus").textContent="Os idiomas são iguais.";return;}
  $("translateStatus").textContent="Traduzindo...";

  try{
    const response=await fetch("api/translate",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({text:text,source:source,target:target})
    });
    if(response.ok){
      const result=await response.json();
      $("trResult").value=result.text||text;$("translateStatus").textContent="Usando o backend Python.";return;
    }
  }catch(_){}

  $("trResult").value=localTranslate(text,source,target);
  $("translateStatus").textContent="Modo local: dicionário básico.";
}

const TR={
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
  uk:{hello:"привіт",world:"світ",friend:"друг",game:"гра",house:"дім",cat:"кіт",dog:"собака"},
  el:{hello:"γεια",world:"κόσμος",friend:"φίλος",game:"παιχνίδι",house:"σπίτι",cat:"γάτα",dog:"σκύλος"},
  nl:{hello:"hallo",world:"wereld",friend:"vriend",game:"spel",house:"huis",cat:"kat",dog:"hond"},
  pl:{hello:"cześć",world:"świat",friend:"przyjaciel",game:"gra",house:"dom",cat:"kot",dog:"pies"},
  tr:{hello:"merhaba",world:"dünya",friend:"arkadaş",game:"oyun",house:"ev",cat:"kedi",dog:"köpek"},
  ar:{hello:"مرحبا",world:"العالم",friend:"صديق",game:"لعبة",house:"بيت",cat:"قط",dog:"كلب"},
  hi:{hello:"नमस्ते",world:"दुनिया",friend:"दोस्त",game:"खेल",house:"घर",cat:"बिल्ली",dog:"कुत्ता"},
  he:{hello:"שלום",world:"עולם",friend:"חבר",game:"משחק",house:"בית",cat:"חתול",dog:"כלב"},
  sv:{hello:"hej",world:"värld",friend:"vän",game:"spel",house:"hus",cat:"katt",dog:"hund"},
  no:{hello:"hei",world:"verden",friend:"venn",game:"spill",house:"hus",cat:"katt",dog:"hund"},
  da:{hello:"hej",world:"verden",friend:"ven",game:"spil",house:"hus",cat:"kat",dog:"hund"}
};

function localTranslate(text,source,target){
  const sourceTable=TR[source]||{},targetTable=TR[target]||{},normalized=text.toLocaleLowerCase();
  const concept=Object.keys(sourceTable).find(function(key){return sourceTable[key].toLocaleLowerCase()===normalized;});
  return concept&&targetTable[concept]?targetTable[concept]:text;
}

function toggleAdmin(){
  $("adminBody").classList.toggle("hidden");
  if(!$("adminBody").classList.contains("hidden"))$("adminPass").focus();
}

async function unlockAdmin(){
  const password=$("adminPass").value.trim();
  if(!password)return;
  try{
    const response=await fetch("api/admin/check",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({password:password})
    });
    if(response.ok&&(await response.json()).valid){
      state.unlocked=true;$("adminControls").classList.remove("hidden");$("adminPass").value="";return;
    }
  }catch(_){}
  alert("Senha incorreta ou backend indisponível.");$("adminPass").focus();
}

function admin(){return state.unlocked;}
function addTime(seconds){if(admin()){if(state.timeLeft!==Infinity)state.timeLeft+=seconds;updateTimer();}}
function revealWord(){if(admin()){chars(state.word).filter(guessable).forEach(function(c){state.guessed.add(keyOf(c));});state.hintCount=3;renderGame();}}
function removeError(){if(admin()&&state.errors>0){state.errors-=1;renderGame();}}
function nextHint(){if(admin()){state.hintCount=Math.min(3,state.hintCount+1);renderGame();}}
function addScore(){if(admin()){state.score+=100;renderGame();}}
function resetRound(){
  if(!admin())return;
  state.errors=0;state.correct=0;state.hintCount=0;state.guessed.clear();state.finished=false;renderGame();runTimer();
}

$("themeSelectButton").addEventListener("click",function(){toggleDropdown("themeMenu","themeSelectButton");});
$("difficultySelectButton").addEventListener("click",function(){toggleDropdown("difficultyMenu","difficultySelectButton");});

$("themeMenu").addEventListener("click",function(event){
  const button=event.target.closest("[data-theme]");
  if(!button)return;
  state.theme=button.dataset.theme;renderOptions();saveSettings();closeDropdowns();
});
$("difficultyMenu").addEventListener("click",function(event){
  const button=event.target.closest("[data-diff]");
  if(!button)return;
  state.difficulty=Number(button.dataset.diff);renderOptions();saveSettings();closeDropdowns();
});

document.addEventListener("click",function(event){
  if(!event.target.closest(".dropdown"))closeDropdowns();
});
document.addEventListener("keydown",function(event){
  if(event.key==="Escape")closeDropdowns();
});

document.querySelectorAll(".mode-card").forEach(function(button){
  button.addEventListener("click",function(){setupMode(button.dataset.mode);});
});
function setupMode(mode){
  state.mode=mode;$("custom").disabled=mode!=="friends";
  $("configTitle").textContent=MODES[mode];
  $("modeBadge").textContent=mode==="endless"?"Crescente":mode==="friends"?"Com amigos":"Aleatório";
  $("friendHints").classList.toggle("hidden",mode!=="friends");
  screen("config");
}

$("back").addEventListener("click",function(){clearInterval(state.timer);closeDropdowns();screen("menu");});
$("start").addEventListener("click",startGame);

$("toggleAdmin").addEventListener("click",toggleAdmin);
$("unlock").addEventListener("click",unlockAdmin);
$("adminPass").addEventListener("keydown",function(event){if(event.key==="Enter")unlockAdmin();});

document.querySelectorAll("[data-add]").forEach(function(button){
  button.addEventListener("click",function(){addTime(Number(button.dataset.add));});
});
$("reveal").addEventListener("click",revealWord);
$("removeError").addEventListener("click",removeError);
$("nextHint").addEventListener("click",nextHint);
$("addScore").addEventListener("click",addScore);
$("resetRound").addEventListener("click",resetRound);

$("again").addEventListener("click",startGame);
$("exit").addEventListener("click",function(){clearInterval(state.timer);state.finished=true;screen("menu");});

$("translate").addEventListener("click",translate);
$("lang").addEventListener("change",function(event){state.language=event.target.value;saveSettings();});
$("time").addEventListener("change",saveSettings);
$("player").addEventListener("input",saveSettings);

document.addEventListener("keydown",function(event){
  if(state.finished||event.ctrlKey||event.altKey||event.metaKey)return;

  const tag=(event.target.tagName||"").toLowerCase();
  if(tag==="input"||tag==="textarea"||tag==="select")return;

  if(event.key.length===1){
    guess(event.key);
  }
});

languageOptions();
timeOptions();
loadSettings();
$("lang").value=state.language;
renderOptions();
database();
if(state.staticSite)$("status").title="Versão estática em execução no GitHub Pages";
