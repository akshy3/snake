let canvas = document.getElementById("canvas");
let canvasContext = canvas.getContext("2d");

const BOARD_SIZE = 30;
let windowWidth = window.innerWidth - 3;
let windowHeight = window.innerHeight - 3;

if (window.innerWidth > window.innerHeight) {
  canvas.height = windowHeight - (windowHeight % BOARD_SIZE);
  canvas.width = canvas.height;
} else {
  canvas.width = windowWidth - (windowWidth % BOARD_SIZE);
  canvas.height = canvas.width;
}
let welcomeDiv = document.getElementById("welcome-screen");
let playButton = document.getElementById("play-button");
let eatSound = new Audio("./assets/eat-sound.wav");
let gameOverSound = new Audio("./assets/game-over-sound.wav");

const ONE_BLOCK = canvas.width / BOARD_SIZE;
let snake;
let food;
let snakeLength = 0;
let direction;
let fps = 80;
let snakePrevX, snakePrevY;
let game;
let isGameover = true;
let playerHighscore = 0;
//
let lastFrameTime = 0;
// const FRAME_INTERVAL = 1000 / 15; // 15 frames per second
const FRAME_INTERVAL = 1000 / 10; // 10 frames per second

let highscoreUpdate = () => {
  document.getElementById("highscore").innerText = playerHighscore;
};
function initialization() {
  snake = [
    {
      x: (BOARD_SIZE * ONE_BLOCK) / 2,
      y: (BOARD_SIZE * ONE_BLOCK) / 2,
    },
  ];
  snakeLength = 0;
  fps = 80;
  direction = null;
  highscoreUpdate();
}

function randomizeFood() {
  food = {
    x: Math.floor(Math.random() * BOARD_SIZE) * ONE_BLOCK,
    y: Math.floor(Math.random() * BOARD_SIZE) * ONE_BLOCK,
  };
}

function draw() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  for (i in snake) {
    canvasContext.fillStyle = "red";
    canvasContext.fillRect(snake[i].x, snake[i].y, ONE_BLOCK, ONE_BLOCK);
  }

  canvasContext.fillStyle = "green";
  canvasContext.fillRect(food.x, food.y, ONE_BLOCK, ONE_BLOCK);
  canvasContext.fillStyle = "white";
  canvasContext.font = "20px Arial";
  canvasContext.fillText("Score: " + snakeLength, 20, 20);
}
function checkCollision() {
  if (
    snake[0].x == 0 - ONE_BLOCK ||
    snake[0].y == 0 - ONE_BLOCK ||
    snake[0].x == canvas.width ||
    snake[0].y == canvas.height
  ) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      gameOver();
    }
  }

  if (snake[0].x == food.x && snake[0].y == food.y) {
    //eat food
    snake.push({ x: snakePrevX, y: snakePrevY });
    randomizeFood();
    snakeLength = snake.length - 1;
    eatSound.play();
  }
}
function handleKeyDown(e) {
  if (e.key == "ArrowUp" && direction != "down") {
    direction = "up";
  }
  if (e.key == "ArrowDown" && direction != "up") {
    direction = "down";
  }
  if (e.key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }
  if (e.key == "ArrowRight" && direction != "left") {
    direction = "right";
  }
}
const oppositeDirection = (dir) => {
  switch (dir) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      return null;
  }
};
function handleSwipe(e) {
  if (e.detail.dir != oppositeDirection(direction)) {
    direction = e.detail.dir;
  }
}

function move() {
  snakePrevX = snake[0].x;
  snakePrevY = snake[0].y;

  switch (direction) {
    case "up":
      snake[0].y = snake[0].y - ONE_BLOCK;
      break;
    case "down":
      snake[0].y = snake[0].y + ONE_BLOCK;
      break;
    case "left":
      snake[0].x = snake[0].x - ONE_BLOCK;
      break;
    case "right":
      snake[0].x = snake[0].x + ONE_BLOCK;
      break;
  }
  for (let i = 1; i < snake.length; i++) {
    let tempX = snake[i].x;
    let tempY = snake[i].y;

    snake[i].x = snakePrevX;
    snake[i].y = snakePrevY;

    snakePrevX = tempX;
    snakePrevY = tempY;
  }
}
function gameLoop(timestamp) {
  if (isGameover) return;
  const elapsed = timestamp - lastFrameTime;

  if (elapsed > FRAME_INTERVAL) {
    lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL);
    move();
    draw();
    checkCollision();
  }
  requestAnimationFrame(gameLoop);
}

function startGame() {
  initialization();
  canvas.style.display = "block";
  welcomeDiv.style.display = "none";
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("swiped", handleSwipe);
  randomizeFood();
  // game = setInterval(gameLoop, fps);
  lastFrameTime = performance.now();
  isGameover = false;
  gameLoop();
}
function welcomeScreen() {
  canvas.style.display = "none";
  welcomeDiv.style.display = "block";
}

async function gameOver() {
  // clearInterval(game);
  isGameover = true;
  gameOverSound.play();
  if (snakeLength > playerHighscore) {
    playerHighscore = snakeLength;
  }
  await new Promise((r) => setTimeout(r, 500));

  // alert("game over!");
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("swiped", handleSwipe);
  highscoreUpdate();
  welcomeScreen();
}
