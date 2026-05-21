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
  openImg.src;

  setTimeout(()=>{

    friend.src =
    "friend-close.jpg";

  },800);

  /* SAVE */

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

/* CLICK */

friend.addEventListener(
"click",(e)=>{

  pop(
    e.clientX,
    e.clientY
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
