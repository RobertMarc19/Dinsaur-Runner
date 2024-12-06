const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

canvas.width = screenWidth;
canvas.height = screenHeight;

const miliseconds = 2000;
const dinosaurSize = 20;
let groundY = canvas.height - 50;
let isJumping = false;
let velocityY = 0;
let gravity = 0.5;
let playerScore = 0;

const dinosaur = {
  x: 50,
  y: groundY - dinosaurSize,
  width: 20,
  height: 20
}

let objects = [];
const obstacleWidth = 20;
const obstacleHeight = 20;

window.addEventListener("keydown", function (event) {
  if (event.key == "ArrowUp" && !isJumping) {
    velocityY = -10;
    isJumping = true; 
  } else if (event.key == "ArrowDown") {
    dinosaur.height = 10;
    dinosaur.y = groundY - dinosaurSize + 10;
  }
});

window.addEventListener("keyup", function (event) {
  if (event.key == "ArrowDown") {
    dinosaur.height = 20;
    dinosaur.y = groundY - dinosaurSize;
  }
})

function drawPlayground() {
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = "green";
  ctx.fillRect(dinosaur.x, dinosaur.y, dinosaur.width, dinosaur.height);
}

function jumping() {
  if (isJumping) {
    velocityY += gravity;
    dinosaur.y += velocityY;
    if (dinosaur.y > groundY - dinosaur.height) {
      dinosaur.y = groundY - dinosaur.height;
      velocityY = 0;
      isJumping = false;
    }
  }
  drawPlayground();
  requestAnimationFrame(jumping);
}

function spawnObjects() {
  const x = canvas.width;
  if (playerScore % 2 == 0) {
   y = groundY - obstacleHeight;
  } else {
   y = groundY - obstacleHeight - 10;
  }
  let speed = 3;
  objects.push({x, y, width: obstacleWidth, height: obstacleHeight, speed})
}

setInterval(spawnObjects, miliseconds);

function drawObstacles(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function checkCollision(dinosaur, obj) {
  if (obj.x < dinosaur.x + dinosaur.width &&
    obj.x + obj.width > dinosaur.x &&
    obj.y < dinosaur.y + dinosaur.height &&
    obj.y + obj.height > dinosaur.y) {
    return true;
  }
  return false;
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${playerScore}`, 10, 30);
}

function drawObjects() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < objects.length; ++i) {
    const obj = objects[i];
    obj.x -= obj.speed;
    drawObstacles(obj.x, obj.y, obstacleWidth, obstacleHeight, "black");
    if (checkCollision(dinosaur, obj)) {
      alert("Game over! Your score was: " + playerScore);
    }
    if (obj.x < 0) {
      objects.splice(i, 1);
      ++playerScore;
    }
  }
  drawScore();
}

function animationLoop() {
  drawObjects();
  requestAnimationFrame(animationLoop);
}

animationLoop();

drawPlayground();

jumping();
