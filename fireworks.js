//get canv
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const loaderEl = document.querySelector(".loader");
const button = document.querySelector("button");
const fireworkSound = new Audio();
const tl = gsap.timeline();
const numb = document.querySelectorAll('.numb');
let colorreq;
let headers = null;
let power = window.innerWidth < 768 ? 5 : 8;
let fireworks = [];
let letters;
let hue = 0;
//letters to init after the initial animation 
const lets = ["2", "0", "2", "3"];

const animTl = gsap.timeline({
  defaults: { ease: "none" },
  repeat: -1,
  yoyo: true,
  repeatDelay: 1,
  paused: true,
});

//set sound effect
fireworkSound.src = "sound-x.mp3";
fireworkSound.pause();

//set stage 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function initColor(){
  hue++;
  numb.forEach((num) => {
    num.style.color = `hsl(${hue}, 100%, 50%)`
  })
  colorreq = requestAnimationFrame(initColor);
}
initColor();



function stopOpacAnim(){
  numb.forEach((num) => {
    num.classList.remove('x');
  })
}

//tween letters
function tweenGS() {
  const maxTime = 15;
  animTl
    .add("p1")
    .to(n4, { y: "-=160",repeat: 19, duration: maxTime / 14 }, "p1")
    .to(n5, { y: "-=240",repeat: 19, duration: maxTime / 13 }, "p1")
    .to(n6, { y: "-=160",duration: maxTime / 12 }, "p1")
    .to(n7, { y: "-=240",repeat: 22, duration: maxTime / 10 }, "p1");
  gsap.to(animTl, 5, {
    progress: 1,
    ease: "power3.inOut",
    onComplete: () => {
      stopOpacAnim();
      cancelAnimationFrame(colorreq);
      finishInit();
      fire();
      init();
    },
  });
}

tweenGS();


//initial 
function finishInit() {
  const tl = gsap.timeline();
  tl.to(".numb", 3, {
    ease: "power3.inOut",
    y: Math.random() * window.innerHeight,
    rotate: 0,
    autoAlpha: 0,
  });
  tl.play();
}

//firework class contains properties, methods regarding the firework animation

class Firework {
  constructor(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.gravity = 0.03;
    this.friction = 0.99;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.alpha -= 0.01;
  }
}

//letters class contains properties, methods regarding the letter animation

class Letter {
  constructor(char, fontSize, x, y, color) {
    var xRange, yRange;

    xRange = 4;
    yRange = 15;

    this.char = char;
    this.fontSize = fontSize;
    this.x = x;
    this.y = y;
    this.vx = -xRange / 2 + Math.random() * xRange;
    this.vy = -yRange - Math.random() * yRange;
    this.gravity = 0.2;
    this.color = color;
    this.angle = Math.random() * 360;
    this.alpha = 1;
  }

  draw(ctx) {
    var letter;
    letter = this.char.toUpperCase();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.angle * 180) / Math.PI);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.font = this.fontSize + "em Monospace";
    ctx.fillText(letter, -ctx.measureText(letter).width / 2, 20);
    ctx.restore();
  }
}

//pushing objects
function loader() {
  fireworkSound.pause();
  fireworkSound.currentTime = 0;
  fireworkSound.play();
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  const fireworksLimit = 300;
  const angleIncrement = (Math.PI * 2) / fireworksLimit;
  for (let i = 0; i < fireworksLimit; i++) {
    fireworks.push(
      new Firework(x, y, `hsl(${Math.random() * 360}, 100%, 50%)`, {
        x: Math.cos(angleIncrement * i) * (Math.random() * power),
        y: Math.sin(angleIncrement * i) * (Math.random() * power),
      })
    );
  }
}


// drawing/updating objects
function LoadFireworks() {
  ctx.fillStyle = "rgba(0,0,0,0.10)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((fire, i) => {
    fire.update();

    if (
      fire.x > window.innerWidth ||
      fire.x < 0 ||
      fire.y > window.innerHeight ||
      fire.y < 0 ||
      fire.alpha < 0
    ) {
      fireworks.splice(i, 1);
    }
  });
}

//firework RequestAnimationFrame
function fire() {
  if (fireworks.length < 600) {
    loader();
  }

  LoadFireworks();
  requestAnimationFrame(fire);
}


//resize event to check if the window is resized ? kind of responsive behaviour  
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  power = window.innerWidth < 768 ? 5 : 8;
});

loader();


function init() {
  letters = [];
  intialletters = ["G", "O", "O", "D", " ", "B", "Y", "E!"];
  for (var i = 0; i < intialletters.length; i++) {
    letters.push(
      new Letter(
        intialletters[i],
        2 + Math.random() * 7,
        Math.random() * window.innerWidth,
        window.innerHeight + 5000,
        `hsl(${Math.random() * 360}, 100%, 50%`
      )
    );
  }

  /* Start the animation */
  drawFrame();
}

//Letters requestAnimationFrame 
function drawFrame() {
  window.requestAnimationFrame(drawFrame, canvas);
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (letters.length < 4) {
    keywords();
  }

  letters.forEach(renderLetter);
}

//render letter
function renderLetter(letter, index) {
  letter.x += letter.vx;
  letter.vy += letter.gravity;
  letter.y += letter.vy;
  letter.alpha -= 0.001;
  if (window.innerHeight <= 600) {
    if (letter.y >= window.innerHeight * 5) letters.splice(letter, index);
  } else {
    if (letter.y >= window.innerHeight * 2.5) letters.splice(letter, index);
  }

  if(letter.alpha < 0){
    letters.splice(letter, index);
  }

  letter.draw(ctx);
}

//leywords to push
function keywords() {
  var currentLetter;

  currentLetter = lets[Math.floor(Math.random() * lets.length)];
  letters.push(
    new Letter(
      currentLetter,
      2 + Math.random() * 7,
      Math.random() * innerWidth,
      innerHeight - 200,
      `hsl(${Math.random() * 360}, 100%, 50%)`
    )
  );
}

