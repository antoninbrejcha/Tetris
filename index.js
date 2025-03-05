let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let coordinateArray = [...Array(gBArrayHeight)].map((e) =>
  Array(gBArrayWidth).fill(0)
);

let curTetromino = [
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 1],
];

let tetrominos = [];
let tetrominoColors = [
  "purple",
  "cyan",
  "blue",
  "yellow",
  "orange",
  "green",
  "red",
];
let curTetrominoColor;

let gameBoardArray = [...Array(gBArrayHeight)].map((e) =>
  Array(gBArrayWidth).fill(0)
);

let DIRECTION = {
  IDLE: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};
let direction;

class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    CreateCoordArray();
  }
}

document.addEventListener("DOMContentLoaded", SetupCanvas);

function CreateCoordArray() {
  let i = 0,
    j = 0;
  for (let y = 9; y <= 446; y += 23) {
    for (let x = 11; x <= 264; x += 23) {
      coordinateArray[i][j] = new Coordinates(x, y);
      i++;
    }
    j++;
    i = 0;
  }
}

function SetupCanvas() {
  canvas = document.getElementById("my-canvas");
  ctx = canvas.getContext("2d");
  /*let img = document.getElementById("console");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.scale(0.5, 0.5);
  ctx.drawImage(img, 0, 0);
  ctx.strokeRect(0, 0, img.width, img.height);
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2 - 200, 50, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();*/

  canvas.width = 1000;
  canvas.height = 1000;
  roundedRect(ctx, 0, 0, canvas.width, canvas.height, 75, "#ffd60a");
  displayBorder(ctx, 85, 50, 840, 600, 100, 80, 5, "black");
  let displayStartX = 250;
  let displayStartY = 60;
  let displayWidth = 500;
  let displayHeight = 500;
  display(
    ctx,
    displayStartX,
    displayStartY,
    displayWidth,
    displayHeight,
    "white"
  );

  function roundedRect(ctx, x, y, width, height, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
  }

  function displayBorder(
    ctx,
    x,
    y,
    width,
    height,
    offsetWidth,
    offsetHeight,
    radius,
    color
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + width / 2, y + height);
    ctx.lineTo(x + width / 2 - offsetWidth, y + height - offsetHeight);
    ctx.lineTo(x + radius, y + height - offsetHeight);
    ctx.arcTo(
      x,
      y + height - offsetHeight,
      x,
      y + height - offsetHeight - radius,
      radius
    );
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
  }

  function display(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  document.addEventListener("keydown", HandleKeyPress);
  CreateTetrominos();
  CreateTetromino();

  CreateCoordArray();
  DrawTetromino();
}

function DrawTetromino() {
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;
    gameBoardArray[x][y] = 1;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = curTetrominoColor;
    ctx.fillRect(coorX, coorY, 21, 21);
  }
}

function HandleKeyPress(key) {
  if (key.keyCode === 65) {
    direction = DIRECTION.LEFT;
    DeleteTetromino();
    startX--;
    DrawTetromino();
  }
}
