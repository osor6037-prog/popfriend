/* USERNAME */

let username =
localStorage.getItem("username");

if(!username){

  username =
  prompt("Enter your name");

  localStorage.setItem(
    "username",
    username
  );

}

/* ELEMENT */

const friend =
document.getElementById("friend");

const scoreEl =
document.getElementById("score");

const leaderboard =
document.getElementById("leaderboard");

let score = 0;

/* LOAD SCORE */

db.ref("scores/" + username)
.once("value")
.then((snapshot)=>{

  if(snapshot.exists()){

    score =
    snapshot.val();

    scoreEl.innerText =
    score.toLocaleString();

  }

});

/* POP */

function pop(x,y){

  score++;

  scoreEl.innerText =
  score.toLocaleString();

  /* OPEN */

  friend.src =
  "friend-open.png";

  friend.style.transform =
  "scale(.93)";

  friend.style.filter =
  "brightness(1.1)";

  setTimeout(()=>{

    friend.style.transform =
    "scale(1)";

    friend.style.filter =
    "brightness(1)";

  },80);

  setTimeout(()=>{

    friend.src =
    "friend-close.jpg";

  },250);

  /* SAVE */

  db.ref(
    "scores/" + username
  ).set(score);

  /* SOUND */

  const ctx =
  new(window.AudioContext ||
  window.webkitAudioContext)();

  const osc =
  ctx.createOscillator();

  const gain =
  ctx.createGain();

  osc.type = "square";

  osc.frequency.value = 300;

  gain.gain.value = 0.08;

  osc.connect(gain);

  gain.connect(ctx.destination);

  osc.start();

  osc.frequency.exponentialRampToValueAtTime(
    700,
    ctx.currentTime + 0.05
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + 0.08
  );

  osc.stop(ctx.currentTime + 0.08);

  /* POP TEXT */

  const text =
  document.createElement("div");

  text.className =
  "pop";

  text.innerText =
  "POP!";

  text.style.left =
  x + "px";

  text.style.top =
  y + "px";

  document.body.appendChild(text);

  setTimeout(()=>{

    text.remove();

  },600);

}

/* CLICK */

friend.addEventListener(
"click",(e)=>{

  pop(
    e.clientX,
    e.clientY
  );

});

/* SPACEBAR */

window.addEventListener(
"keydown",(e)=>{

  if(e.code === "Space"){

    pop(
      window.innerWidth/2,
      window.innerHeight/2
    );

  }

});

/* LEADERBOARD */

db.ref("scores")
.on("value",(snapshot)=>{

  const data =
  snapshot.val();

  if(!data) return;

  let arr =
  Object.entries(data);

  arr.sort((a,b)=>
    b[1]-a[1]
  );

  let html = "";

  arr.slice(0,10)
  .forEach((x,i)=>{

    html += `

      <div class="player">

        <span>
          #${i+1}
          ${x[0]}
        </span>

        <span>
          ${x[1]}
        </span>

      </div>

    `;

  });

  leaderboard.innerHTML =
  html;

});
