/* ELEMENTS */
const game = document.getElementById("game");
const track = document.getElementById("track");
const player = document.getElementById("player");
const levelsContainer = document.getElementById("levels");
const scoreEl = document.getElementById("score");
const levelDisplay = document.getElementById("levelDisplay");
const progressBar = document.getElementById("progressBar");

/* GAME DATA */
const LANES = 7;
const TOTAL_LEVELS = 100;
let unlockedLevels = Number(localStorage.getItem("unlockedLevels")) || 1;
let currentLevel = unlockedLevels;

let lane = 3;
let score = 0;
let gameOver = false;
let obstacleInterval;

/* CREATE LANES */
for(let i=0;i<LANES;i++){
  const l=document.createElement("div");
  l.className="lane";
  track.appendChild(l);
}

/* LEVEL BUTTONS */
function createLevels(){
  levelsContainer.innerHTML="";
  for(let i=1;i<=TOTAL_LEVELS;i++){
    const btn=document.createElement("div");
    btn.className="level";
    btn.innerText=i;
    if(i>unlockedLevels) btn.classList.add("locked");
    else btn.onclick=()=>{currentLevel=i;startGame()};
    levelsContainer.appendChild(btn);
  }
}
createLevels();

/* PLAYER */
function updateLane(){
  const laneWidth = game.clientWidth / LANES;
  player.style.left = (lane*laneWidth + laneWidth/2 - player.offsetWidth/2) + "px";
}
function moveLeft(){ if(lane>0){lane--;updateLane()} }
function moveRight(){ if(lane<LANES-1){lane++;updateLane()} }
function jump(){
  let h=0;
  const up=setInterval(()=>{
    h+=5;
    player.style.bottom=40+h+"px";
    if(h>=80){
      clearInterval(up);
      const down=setInterval(()=>{
        h-=5;
        player.style.bottom=40+h+"px";
        if(h<=0) clearInterval(down);
      },20);
    }
  },20);
}

/* OBSTACLES */
function createObstacle(){
  if(gameOver) return;
  const obs=document.createElement("div");
  obs.className="obstacle";
  obs.innerText="🔥";

  const l=Math.floor(Math.random()*LANES);
  const laneWidth = game.clientWidth / LANES;
  obs.style.left=(l*laneWidth + laneWidth/2 - 18)+"px";
  obs.style.top="-40px";
  game.appendChild(obs);

  let y=-40;
  const fall=setInterval(()=>{
    y+=4;
    obs.style.top=y+"px";

    const p=player.getBoundingClientRect();
    const o=obs.getBoundingClientRect();

    if(p.left<o.right && p.right>o.left && p.top<o.bottom && p.bottom>o.top){
      clearInterval(fall);
      gameOverFn();
    }

    if(y>game.clientHeight){
      clearInterval(fall);
      obs.remove();
      score++;
      scoreEl.innerText=score;
      progressBar.style.width=Math.min(score/(currentLevel*10)*100,100)+"%";
      if(score>=currentLevel*10) levelComplete();
    }
  },20);
}

/* GAME FLOW */
function startGame(){
  document.querySelector(".levels").style.display="none";
  game.style.display="block";
  score=0; gameOver=false; lane=3;
  scoreEl.innerText=0;
  levelDisplay.innerText="Level: "+currentLevel;
  progressBar.style.width="0%";
  updateLane();
  clearInterval(obstacleInterval);
  obstacleInterval=setInterval(createObstacle,900);
}

function gameOverFn(){
  gameOver=true;
  clearInterval(obstacleInterval);
  alert("Game Over");
  game.style.display="none";
  document.querySelector(".levels").style.display="flex";
}

function levelComplete(){
  clearInterval(obstacleInterval);
  alert("Level Complete!");
  unlockedLevels=Math.max(unlockedLevels,currentLevel+1);
  localStorage.setItem("unlockedLevels",unlockedLevels);
  createLevels();
  game.style.display="none";
  document.querySelector(".levels").style.display="flex";
}

/* KEYS */
document.addEventListener("keydown",e=>{
  if(e.key==="ArrowLeft") moveLeft();
  if(e.key==="ArrowRight") moveRight();
  if(e.key==="ArrowUp") jump();
});

/* INTRO REMOVE */
setTimeout(()=>document.getElementById("intro").remove(),2500);
