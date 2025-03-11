let canvas;
let ctx;

let gBArrayHeight = 20; //pocet radku
let gBArrayWidth = 12; //pocet sloupcu
let startX = 4;
let startY = 0;

let score = 0;
let level = 1;
let lose = false;

/*//koridnace display
let displayStartX = 250;
let displayStartY = 60;
let displayWidth = 500;
let displayHeight = 500;*/

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
  "#7B2CBF",
  "#48CAE4",
  "#1749E4",
  "#FFEA00",
  "#E85D04",
  "#9EF01A",
  "#D00000",
];
let curTetrominoColor;

let gameBoardArray = [...Array(gBArrayHeight)].map((e) =>
  Array(gBArrayWidth).fill(0)
);

let stoppedShapeArray = [...Array(gBArrayHeight)].map((e) =>
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
  }
}

document.addEventListener("DOMContentLoaded", SetupCanvas);

function CreateCoordArray() {
  for (let i = 0; i < gBArrayHeight; i++) {
    for (let j = 0; j < gBArrayWidth; j++) {
      let x = 11 + j * 23;
      let y = 9 + i * 23;
      coordinateArray[i][j] = new Coordinates(x, y);
    }
  }
}

function SetupCanvas() {
  canvas = document.getElementById("my-canvas");
  ctx = canvas.getContext("2d");
  canvas.width = 936;
  canvas.height = 956;
  ctx.scale(2, 2);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  /*canvas.width = 1000;
  canvas.height = 1000;

  DrawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, 75, "#ffd60a");
  DrawDisplayBorder(ctx, 85, 50, 840, 600, 100, 80, 5, "black");
  DrawDisplay(
    ctx,
    displayStartX,
    displayStartY,
    displayWidth,
    displayHeight,
    "white"
  );*/

  ctx.strokeStyle = "black";
  ctx.strokeRect(8, 8, 280, 462);

  document.addEventListener("keydown", HandleKeyPress);

  CreateTetrominos();
  CreateTetromino();
  CreateCoordArray();
  DrawTetromino();
}

/*function DrawRoundedRect(ctx, x, y, width, height, radius, color) {
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

function DrawDisplayBorder(
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

function DrawDisplay(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}*/

function DrawTetromino() {
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;
    if (y >= 0 && y < gBArrayHeight && x >= 0 && x < gBArrayWidth) {
      gameBoardArray[y][x] = 1;
      let coorX = coordinateArray[y][x].x;
      let coorY = coordinateArray[y][x].y;
      ctx.fillStyle = curTetrominoColor;
      ctx.fillRect(coorX, coorY, 21, 21);
    }
  }
}

function HandleKeyPress(key) {
  if (lose === false) {
    if (key.keyCode === 65) { //A
      direction = DIRECTION.LEFT;
      if (!HittingTheWall() && !CheckForHorizontalCollision()) {
        DeleteTetromino();
        startX--;
        DrawTetromino();
      }
    } else if (key.keyCode === 68) { //D
      direction = DIRECTION.RIGHT;
      if (!HittingTheWall() && !CheckForHorizontalCollision()) {
        DeleteTetromino();
        startX++;
        DrawTetromino();
      }
    } else if (key.keyCode === 83) { //S
      MoveTetrominoDown();
    }
  }
}

function MoveTetrominoDown(){
  direction = DIRECTION.DOWN;
  if (!CheckForVerticalCollision()) {
    DeleteTetromino();
    startY++;
    DrawTetromino();
  }
}

function DeleteTetromino() {
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;
    if (y >= 0 && y < gBArrayHeight && x >= 0 && x < gBArrayWidth) {
      gameBoardArray[y][x] = 0;
      let coorX = coordinateArray[y][x].x;
      let coorY = coordinateArray[y][x].y;
      ctx.fillStyle = "white";
      ctx.fillRect(coorX, coorY, 21, 21);
    }
  }
}

function CreateTetrominos() {
  //T
  tetrominos.push([
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ]);
  //I
  tetrominos.push([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ]);
  //J
  tetrominos.push([
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ]);
  //[]
  tetrominos.push([
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ]);
  //L
  tetrominos.push([
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ]);
  //S
  tetrominos.push([
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
  ]);
  //Z
  tetrominos.push([
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ]);
}

function CreateTetromino() {
  let randomTetromino = Math.floor(Math.random() * tetrominos.length);
  curTetromino = tetrominos[randomTetromino];
  curTetrominoColor =
    tetrominoColors[Math.floor(Math.random() * tetrominoColors.length)];
}

function HittingTheWall() {
  for (let i = 0; i < curTetromino.length; i++) {
    let newX = curTetromino[i][0] + startX;
    if (newX <= 0 && direction === DIRECTION.LEFT) {
      return true;
    } else if (newX >= 11 && direction === DIRECTION.RIGHT) {
      return true;
    }
  }
  return false;
}

function CheckForHorizontalCollision() {
  let tetrominoCopy = curTetromino;
}