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

/* PRELOAD */

const openImg =
new Image();

openImg.src =
"friend-open.png";

const closeImg =
new Image();

closeImg.src =
"friend-close.jpg";

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

/* POP FUNCTION */

function pop(x,y){

  score++;

  scoreEl.innerText =
  score.toLocaleString();

  /* CHANGE IMAGE */

  friend.src =
  openImg.src;

  setTimeout(()=>{

    friend.src =
    closeImg.src;

  },120);

  /* SAVE SCORE */

  db.ref(
    "scores/" + username
  ).set(score);

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

/* HOLD CLICK PC */

let holdInterval;

friend.addEventListener(
"mousedown",(e)=>{

  pop(
    e.clientX,
    e.clientY
  );

  holdInterval =
  setInterval(()=>{

    pop(
      e.clientX,
      e.clientY
    );

  },80);

});

/* RELEASE */

window.addEventListener(
"mouseup",()=>{

  clearInterval(
    holdInterval
  );

});

/* MOBILE HOLD */

friend.addEventListener(
"touchstart",(e)=>{

  e.preventDefault();

  const touch =
  e.touches[0];

  pop(
    touch.clientX,
    touch.clientY
  );

  holdInterval =
  setInterval(()=>{

    pop(
      touch.clientX,
      touch.clientY
    );

  },80);

});

/* MOBILE RELEASE */

window.addEventListener(
"touchend",()=>{

  clearInterval(
    holdInterval
  );

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
        #${i+1} ${x[0]}
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
