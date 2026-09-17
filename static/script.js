const $ = (id) => document.getElementById(id);

const MODES = {
  friends: "Jogar com amigos",
  random: "Aleatório",
  endless: "Aleatório crescente",
};
const THEMES = [
  ["🎌","Anime"],["📺","Séries"],["🎬","Filmes"],["🧙","Personagens"],["🎮","Jogos"],["🐾","Animais"],["⚽","Esportes"],["🍕","Comidas"],
  ["💻","Tecnologia"],["🌎","Países e Lugares"],["🔬","Ciência"],["🎵","Música"],["🧑‍🔧","Profissões"],["🌳","Natureza"],["📚","Livros"],["🦸","Super-heróis"],["🏫","Escola"],["✨","Outros"]
];
const DIFFICULTIES = ["Muito fácil","Fácil","Médio","Difícil","Muito difícil","Especialista","Insano"];
const LANGUAGES = [
  ["pt","🇧🇷 Português"],["en","🇺🇸 English"],["es","🇪🇸 Español"],["fr","🇫🇷 Français"],["de","🇩🇪 Deutsch"],["it","🇮🇹 Italiano"],["ja","🇯🇵 日本語"],["ko","🇰🇷 한국어"],
  ["zh","🇨🇳 中文"],["ru","🇷🇺 Русский"],["uk","🇺🇦 Українська"],["el","🇬🇷 Ελληνικά"],["nl","🇳🇱 Nederlands"],["pl","🇵🇱 Polski"],["tr","🇹🇷 Türkçe"],["ar","🇸🇦 العربية"],
  ["hi","🇮🇳 हिन्दी"],["he","🇮🇱 עברית"],["sv","🇸🇪 Svenska"],["no","🇳🇴 Norsk"],["da","🇩🇰 Dansk"]
];
const KEYBOARDS = {
  pt:[..."abcdefghijklmnopqrstuvwxyzáàãâéêíóôõúç"],en:[..."abcdefghijklmnopqrstuvwxyz"],es:[..."abcdefghijklmnñopqrstuvwxyzáéíóúü"],fr:[..."abcdefghijklmnopqrstuvwxyzàâçéèêëîïôûùüÿ"],
  de:[..."abcdefghijklmnopqrstuvwxyzäöüß"],it:[..."abcdefghijklmnopqrstuvwxyzàèéìíîòóùú"],ja:[..."あいうえおかきくけこさしすせそたちつてとなにぬねの"],ko:[..."가나다라마바사아자차카타파하"],
  zh:[..."的一是不了人我在有他这为之大来以个中上们"],ru:[..."абвгдеёжзийклмнопрстуфхцчшщъыьэюя"],uk:[..."абвгґдеєжзиіїйклмнопрстуфхцчшщьюя"],el:[..."αβγδεζηθικλμνξοπρστυφχψω"],
  nl:[..."abcdefghijklmnopqrstuvwxyz"],pl:[..."aąbcćdeęfghijklłmnńoóprsśtuwyzźż"],tr:[..."abcçdefgğhıijklmnoöprsştuüvyz"],ar:[..."ابتثجحخدذرزسشصضطظعغفقكلمنهوي"],
  hi:[..."अआइईउऊएऐओऔकखगघचछजझटठडढतथदधनपफबभमयरलवशषसह"],he:[..."אבגדהוזחטיךכלםמןנסעףפץצקרשת"],sv:[..."abcdefghijklmnopqrstuvwxyzåäö"],no:[..."abcdefghijklmnopqrstuvwxyzæøå"],da:[..."abcdefghijklmnopqrstuvwxyzæøå"]
};
const LOCALIZED = {
  en:["cat","Animais",["It is a common domestic animal.","It is known for meowing.","Many people keep it as a pet."]],es:["gato","Animais",["Es un animal doméstico común.","Es conocido por sus maullidos.","Muchos lo tienen como mascota."]],fr:["chat","Animais",["C'est un animal domestique courant.","Il est connu pour ses miaulements.","Beaucoup l'ont comme animal de compagnie."]],de:["katze","Animais",["Ein häufiges Haustier.","Sie ist für ihr Miauen bekannt.","Viele Menschen halten sie als Haustier."]],it:["gatto","Animais",["È un animale domestico comune.","È noto per i suoi miagolii.","Molti lo tengono come animale da compagnia."]],
  ja:["猫","Animais",["家で飼われることが多い動物です。","鳴き声はニャーで知られています。","ペットとして人気があります。"]],ko:["고양이","Animais",["집에서 기르는 동물입니다.","야옹 소리로 유명합니다.","반려동물로 인기가 많습니다."]],zh:["猫","Animais",["常见的家养动物。","叫声常被描述为喵。","很多人把它当作宠物。"]],ru:["кот","Animais",["Это распространённое домашнее животное.","Он известен своим мяуканьем.","Многие держат его как питомца."]],uk:["кіт","Animais",["Поширена домашня тварина.","Відомий своїм нявканням.","Багато людей тримають його як улюбленця."]],el:["γάτα","Animais",["Είναι συνηθισμένο κατοικίδιο.","Είναι γνωστή για το νιαούρισμα.","Πολλοί την κρατούν ως κατοικίδιο."]],
  nl:["kat","Animais",["Een veelvoorkomend huisdier.","Bekend om zijn gemiauw.","Veel mensen houden hem als huisdier."]],pl:["kot","Animais",["Popularne zwierzę domowe.","Znany z miauczenia.","Wiele osób trzyma go jako pupila."]],tr:["kedi","Animais",["Yaygın bir evcil hayvandır.","Miyavlamasıyla bilinir.","Birçok insan onu besler."]],ar:["قط","Animais",["حيوان أليف شائع.","معروف بصوت المواء.","يربيه كثير من الناس في المنزل."]],hi:["बिल्ली","Animais",["यह एक आम पालतू जानवर है।","इसे म्याऊँ करने के लिए जाना जाता है।","बहुत से लोग इसे घर में पालते हैं।"]],he:["חתול","Animais",["זהו חיית מחמד נפוצה.","הוא ידוע ביללות שלו.","אנשים רבים מגדלים אותו בבית."]],sv:["katt","Animais",["Ett vanligt husdjur.","Den är känd för sitt jamande.","Många har den som sällskap."]],no:["katt","Animais",["Et vanlig kjæledyr.","Kjent for å mjaue.","Mange har den som kjæledyr."]],da:["kat","Animais",["Et almindeligt kæledyr.","Kendt for sin miaven.","Mange holder den som kæledyr."]]
};
const state = {mode:"random",theme:"Anime",difficulty:2,language:"pt",word:"",hints:[],hintCount:0,errors:0,score:0,streak:0,round:1,correct:0,timeLeft:Infinity,timer:null,guessed:new Set(),database:[],unlocked:false,finished:false};

const escapeHTML = (v) => String(v).replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const normalizeChar = (v) => String(v||"").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const chars = (v) => Array.from(v||"");
const guessable = (c) => /[\p{L}\p{N}]/u.test(c);
const keyOf = (c) => normalizeChar(c);

function screen(id){["menu","config","game","result"].forEach(x=>$(x).classList.toggle("hidden",x!==id));$("status").textContent=id==="game"?"Jogando":id==="config"?"Configuração":id==="result"?"Resultado":"Menu";window.scrollTo({top:0,behavior:"smooth"});}
function languageOptions(){const html=LANGUAGES.map(([c,l])=>`<option value="${c}">${l}</option>`).join("");[$("lang"),$("from"),$("to")].forEach(s=>s.innerHTML=html);$("lang").value=state.language;$("from").value="pt";$("to").value="en";}
function timeOptions(){const list=[[30,"30 segundos"],[60,"1 minuto"],[180,"3 minutos"],[300,"5 minutos"],[600,"10 minutos"],[900,"15 minutos"],[1200,"20 minutos"],[1800,"30 minutos"],[3600,"60 minutos"],["inf","Tempo infinito"]];$("time").innerHTML=list.map(([v,l])=>`<option value="${v}">${l}</option>`).join("");$("time").value="180";}
function renderOptions(){
  $("themes").innerHTML=THEMES.map(([i,n])=>`<button type="button" class="opt ${state.theme===n?"selected":""}" data-theme="${escapeHTML(n)}">${i} ${escapeHTML(n)}${state.theme===n?" ✓":""}</button>`).join("");
  $("diffs").innerHTML=DIFFICULTIES.map((n,i)=>`<button type="button" class="opt ${state.difficulty===i?"selected":""}" data-diff="${i}">${i+1}. ${n}${state.difficulty===i?" ✓":""}</button>`).join("");
}
function setupMode(mode){state.mode=mode;$("custom").disabled=mode!=="friends";$("configTitle").textContent=MODES[mode];$("modeBadge").textContent=mode==="endless"?"Crescente":mode==="friends"?"Com amigos":"Aleatório";$("friendHints").classList.toggle("hidden",mode!=="friends");screen("config");}
async function database(){if(state.database.length)return state.database;try{const r=await fetch("data/words.json",{cache:"no-store"});if(!r.ok)throw 0;state.database=await r.json();}catch{state.database=[];}return state.database;}
function difficultyLimit(){return Math.min(6,state.difficulty+(state.mode==="endless"?Math.floor(state.streak/2):0));}
async function randomWord(){
  try{const q=new URLSearchParams({theme:state.theme,language:state.language,difficulty:String(difficultyLimit())});const r=await fetch(`/api/word?${q}`,{cache:"no-store"});if(!r.ok)throw 0;const item=await r.json();if(item&&item.word)return item;}catch{}
  const db=await database();
  if(state.language!=="pt"&&LOCALIZED[state.language]){const x=LOCALIZED[state.language];return{word:x[0],theme:x[1],difficulty:1,hints:x[2]};}
  let pool=db.filter(x=>x.theme===state.theme&&Number(x.difficulty)<=difficultyLimit()+1);if(!pool.length)pool=db.filter(x=>Number(x.difficulty)<=difficultyLimit()+1);return pool[Math.floor(Math.random()*pool.length)]||{word:"Python",hints:["É uma linguagem de programação.","É usada em aplicações e automação.","Também dá nome a uma cobra em inglês."]};
}
function friendHints(){return [$("friendHint1").value.trim(),$("friendHint2").value.trim(),$("friendHint3").value.trim()].filter(Boolean);}
async function startGame(){
  clearInterval(state.timer);state.finished=false;state.errors=0;state.score=0;state.streak=0;state.round=1;state.correct=0;state.hintCount=0;state.guessed.clear();state.unlocked=false;$("adminControls").classList.add("hidden");$("adminPass").value="";
  let item;if(state.mode==="friends"){const word=$("custom").value.trim();if(!word)return alert("Digite a palavra secreta.");item={word,hints:friendHints()};if(!item.hints.length)item.hints=["A palavra foi escolhida pelo anfitrião.","Observe as letras descobertas.","Use o tema como contexto."];}else item=await randomWord();
  state.word=String(item.word||"").trim();state.hints=(item.hints||[]).slice(0,3);screen("game");renderGame();runTimer();
}
function autoHints(){return state.correct>=6?3:state.correct>=4?2:state.correct>=2?1:0;}
function visibleHints(){return Math.max(state.hintCount,autoHints());}
function renderGame(){
  $("errors").textContent=`${state.errors}/8`;
  $("score").textContent=state.score;$("streak").textContent=state.streak;$("playerLabel").textContent=$("player").value.trim()||"Jogador";$("roundLabel").textContent=state.mode==="endless"?`Rodada ${state.round} • Nível ${difficultyLimit()+1}`:`Rodada ${state.round}`;
  $("hang").textContent=["🙂","😐","😟","😰","😨","😵","🥴","💀","☠️"][state.errors];
  const vh=visibleHints();$("hints").innerHTML=state.hints.map((h,i)=>`<div class="hint ${i<vh?"":"locked"}"><b>💡 Dica ${i+1}</b>${i<vh?escapeHTML(h):"🔒 Liberada conforme você joga"}</div>`).join("");
  $("word").innerHTML=chars(state.word).map(c=>guessable(c)?`<span>${state.guessed.has(keyOf(c))?escapeHTML(c):"_"}</span>`:`<span>${escapeHTML(c)}</span>`).join(" ");
  const keys=KEYBOARDS[state.language]||KEYBOARDS.en;const unique=[...new Set(keys)];$("keys").innerHTML=unique.map(c=>{const used=state.guessed.has(keyOf(c));return`<button type="button" data-char="${escapeHTML(c)}" class="${used?"used":""}" ${used?"disabled":""}>${escapeHTML(c.toLocaleUpperCase())}</button>`}).join("");$("keys").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>guess(b.dataset.char)));$("guessInput").value="";document.documentElement.lang=state.language;$("game").dir=["ar","he"].includes(state.language)?"rtl":"ltr";
}
function solved(){return chars(state.word).filter(guessable).every(c=>state.guessed.has(keyOf(c)));}
function guess(input){if(state.finished||$("game").classList.contains("hidden"))return;const c=chars(input)[0];if(!guessable(c))return;const key=keyOf(c);if(!key||state.guessed.has(key))return;state.guessed.add(key);if(chars(state.word).some(x=>keyOf(x)===key)){state.score+=10;state.correct+=1;}else{state.errors+=1;state.score=Math.max(0,state.score-5);}if(solved()){state.streak+=1;state.score+=50;if(state.mode==="endless")nextEndless();else finish(true);return;}if(state.errors>=8){finish(false);return;}renderGame();}
async function nextEndless(){state.round+=1;renderGame();const item=await randomWord();state.word=String(item.word||"").trim();state.hints=(item.hints||[]).slice(0,3);state.hintCount=0;state.correct=0;state.errors=0;state.guessed.clear();renderGame();runTimer();}
function configuredTime(){return $("time").value==="inf"?Infinity:Number($("time").value);}
function runTimer(){clearInterval(state.timer);state.timeLeft=configuredTime();updateTimer();if(state.timeLeft===Infinity)return;state.timer=setInterval(()=>{state.timeLeft-=1;updateTimer();if(state.timeLeft<=0)finish(false);},1000);}
function updateTimer(){$("timer").textContent=state.timeLeft===Infinity?"∞":`${Math.max(0,state.timeLeft)}s`;}
function finish(won){if(state.finished)return;state.finished=true;clearInterval(state.timer);screen("result");$("resultIcon").textContent=won?"🏆":"💀";$("resultTitle").textContent=won?"Você acertou!":"Fim de jogo";$("resultKicker").textContent=won?"PARTIDA CONCLUÍDA":"LIMITE ATINGIDO";$("resultText").textContent=`${$("player").value.trim()||"Jogador"}, sua pontuação foi ${state.score} pontos${state.mode==="endless"?` e sua sequência chegou a ${state.streak}.`:"."}`;$("resultSecret").innerHTML=`<strong>Palavra secreta:</strong> ${escapeHTML(state.word)}`;}

async function translate(){const text=$("trText").value.trim(),source=$("from").value,target=$("to").value;if(!text){$("trResult").value="";return;}if(source===target){$("trResult").value=text;return;}$("translateStatus").textContent="Traduzindo...";try{const r=await fetch("/api/translate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text,source,target})});if(!r.ok)throw 0;const x=await r.json();$("trResult").value=x.text||text;$("translateStatus").textContent="Usando o backend Python.";}catch{$("trResult").value=localTranslate(text,source,target);$("translateStatus").textContent="Modo local ativo.";}}
const TR={
  pt:{hello:"olá",world:"mundo",friend:"amigo",game:"jogo",house:"casa",cat:"gato",dog:"cachorro"},en:{hello:"hello",world:"world",friend:"friend",game:"game",house:"house",cat:"cat",dog:"dog"},es:{hello:"hola",world:"mundo",friend:"amigo",game:"juego",house:"casa",cat:"gato",dog:"perro"},fr:{hello:"bonjour",world:"monde",friend:"ami",game:"jeu",house:"maison",cat:"chat",dog:"chien"},de:{hello:"hallo",world:"welt",friend:"freund",game:"spiel",house:"haus",cat:"katze",dog:"hund"},it:{hello:"ciao",world:"mondo",friend:"amico",game:"gioco",house:"casa",cat:"gatto",dog:"cane"},
  ja:{hello:"こんにちは",world:"世界",friend:"友達",game:"ゲーム",house:"家",cat:"猫",dog:"犬"},ko:{hello:"안녕하세요",world:"세계",friend:"친구",game:"게임",house:"집",cat:"고양이",dog:"개"},zh:{hello:"你好",world:"世界",friend:"朋友",game:"游戏",house:"家",cat:"猫",dog:"狗"},ru:{hello:"привет",world:"мир",friend:"друг",game:"игра",house:"дом",cat:"кот",dog:"собака"},uk:{hello:"привіт",world:"світ",friend:"друг",game:"гра",house:"дім",cat:"кіт",dog:"собака"},el:{hello:"γεια",world:"κόσμος",friend:"φίλος",game:"παιχνίδι",house:"σπίτι",cat:"γάτα",dog:"σκύλος"},
  nl:{hello:"hallo",world:"wereld",friend:"vriend",game:"spel",house:"huis",cat:"kat",dog:"hond"},pl:{hello:"cześć",world:"świat",friend:"przyjaciel",game:"gra",house:"dom",cat:"kot",dog:"pies"},tr:{hello:"merhaba",world:"dünya",friend:"arkadaş",game:"oyun",house:"ev",cat:"kedi",dog:"köpek"},ar:{hello:"مرحبا",world:"العالم",friend:"صديق",game:"لعبة",house:"بيت",cat:"قط",dog:"كلب"},hi:{hello:"नमस्ते",world:"दुनिया",friend:"दोस्त",game:"खेल",house:"घर",cat:"बिल्ली",dog:"कुत्ता"},he:{hello:"שלום",world:"עולם",friend:"חבר",game:"משחק",house:"בית",cat:"חתול",dog:"כלב"},sv:{hello:"hej",world:"värld",friend:"vän",game:"spel",house:"hus",cat:"katt",dog:"hund"},no:{hello:"hei",world:"verden",friend:"venn",game:"spill",house:"hus",cat:"katt",dog:"hund"},da:{hello:"hej",world:"verden",friend:"ven",game:"spil",house:"hus",cat:"kat",dog:"hund"}
};
function localTranslate(text,source,target){const s=TR[source]||{},t=TR[target]||{};const concept=Object.keys(s).find(k=>s[k].toLocaleLowerCase()===text.toLocaleLowerCase());return concept&&t[concept]?t[concept]:text;}

function toggleAdmin(){$("adminBody").classList.toggle("hidden");if(!$("adminBody").classList.contains("hidden"))$("adminPass").focus();}
async function unlockAdmin(){
  const password=$("adminPass").value.trim();if(!password)return;
  try{const r=await fetch("/api/admin/check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});if(r.ok&&((await r.json()).valid)){state.unlocked=true;$("adminControls").classList.remove("hidden");$("adminPass").value="";return;}}catch{}
  if(password==="admin"){state.unlocked=true;$("adminControls").classList.remove("hidden");$("adminPass").value="";}else{alert("Senha incorreta.");$("adminPass").focus();}
}
function admin(){return state.unlocked;}
function addTime(n){if(!admin())return;if(state.timeLeft!==Infinity)state.timeLeft+=n;updateTimer();}
function revealWord(){if(!admin())return;chars(state.word).filter(guessable).forEach(c=>state.guessed.add(keyOf(c)));state.hintCount=3;renderGame();}
function removeError(){if(admin()&&state.errors>0){state.errors-=1;renderGame();}}
function nextHint(){if(admin()){state.hintCount=Math.min(3,state.hintCount+1);renderGame();}}
function addScore(){if(admin()){state.score+=100;renderGame();}}
function resetRound(){if(admin()){state.errors=0;state.correct=0;state.hintCount=0;state.guessed.clear();state.finished=false;renderGame();runTimer();}}
function handleInput(){const v=$("guessInput").value.trim();$("guessInput").value="";if(v)guess(v);}

$("themes").addEventListener("click",e=>{const b=e.target.closest("[data-theme]");if(b){state.theme=b.dataset.theme;renderOptions();}});
$("diffs").addEventListener("click",e=>{const b=e.target.closest("[data-diff]");if(b){state.difficulty=Number(b.dataset.diff);renderOptions();}});
document.querySelectorAll(".mode-card").forEach(b=>b.addEventListener("click",()=>setupMode(b.dataset.mode)));
$("back").addEventListener("click",()=>screen("menu"));$("start").addEventListener("click",startGame);$("guessBtn").addEventListener("click",handleInput);$("guessInput").addEventListener("keydown",e=>{if(e.key==="Enter")handleInput();});
$("toggleAdmin").addEventListener("click",toggleAdmin);$("unlock").addEventListener("click",unlockAdmin);$("adminPass").addEventListener("keydown",e=>{if(e.key==="Enter")unlockAdmin();});
document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addTime(Number(b.dataset.add))));$("reveal").addEventListener("click",revealWord);$("removeError").addEventListener("click",removeError);$("nextHint").addEventListener("click",nextHint);$("addScore").addEventListener("click",addScore);$("resetRound").addEventListener("click",resetRound);$("again").addEventListener("click",startGame);$("exit").addEventListener("click",()=>{clearInterval(state.timer);state.finished=true;screen("menu");});$("translate").addEventListener("click",translate);
$("lang").addEventListener("change",e=>{state.language=e.target.value;renderGame();});
document.addEventListener("keydown",e=>{if(state.finished||e.ctrlKey||e.altKey||e.metaKey)return;if(e.target.matches("input,select,textarea,button"))return;if(e.key.length===1)guess(e.key);});

languageOptions();timeOptions();renderOptions();database();
