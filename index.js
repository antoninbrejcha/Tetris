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
  ctx.fillStyle = "white";
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
    if (key.keyCode === 65) {
      //A
      direction = DIRECTION.LEFT;
      if (!HittingTheWall() && !CheckForHorizontalCollision()) {
        DeleteTetromino();
        startX--;
        DrawTetromino();
      }
    } else if (key.keyCode === 68) {
      //D
      direction = DIRECTION.RIGHT;
      if (!HittingTheWall() && !CheckForHorizontalCollision()) {
        DeleteTetromino();
        startX++;
        DrawTetromino();
      }
    } else if (key.keyCode === 83) {
      //S
      MoveTetrominoDown();
    } else if (key.keyCode === 69) {
      //E
      RotateTetromino();
    }
  }
}

function MoveTetrominoDown() {
  direction = DIRECTION.DOWN;
  if (!CheckForVerticalCollision()) {
    DeleteTetromino();
    startY++;
    DrawTetromino();
  }
}

window.setInterval(function () {
  if (lose === false) {
    MoveTetrominoDown();
  }
}, 1000);

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

function CheckForVerticalCollision() {
  let tetrominoCopy = curTetromino;
  let collison = false;
  for (let i = 0; i < tetrominoCopy.length; i++) {
    let square = tetrominoCopy[i];
    let x = square[0] + startX;
    let y = square[1] + startY;
    if (direction === DIRECTION.DOWN) {
      y++;
    }
    if (gameBoardArray[y+1][x] === 1) {
      if (typeof stoppedShapeArray[y+1][x] === "string") {
        DeleteTetromino();
        startY++;
        DrawTetromino();
        collison = true;
        break;
      }
      if (y >= 20) {
        collison = true;
        break;
      }
    }

    if (collison) {
      if (startY <= 2) {
        lose = true;
        alert("Game Over");
      } else {
        for (let i = 0; i < tetrominoCopy.length; i++) {
          let square = tetrominoCopy[i];
          let x = square[0] + startX;
          let y = square[1] + startY;
          stoppedShapeArray[y][x] = curTetrominoColor;
        }
        CheckForCompletedRows();
        CreateTetromino();
        direction = DIRECTION.IDLE;
        startX = 4;
        startY = 0;
        DrawTetromino();
      }
    }
  }
}

function CheckForHorizontalCollision(){
  let tetrominoCopy = curTetromino;
  let collison = false;
  for (let i = 0; i < tetrominoCopy.length; i++) {
    let square = tetrominoCopy[i];
    let x = square[0] + startX;
    let y = square[1] + startY;
    if (direction === DIRECTION.LEFT) {
      x--;
    } else if (direction === DIRECTION.RIGHT) {
      x++;
    }
    let stoppedShapeVal = stoppedShapeArray[y][x];
    if (typeof stoppedShapeVal === "string") {
      collison = true
      break;
    }
  }
  return collison;
}

function CheckForCompletedRows() {
  let rowsToDelete = 0;
  let startOfDeletion = 0;
  for (let y = 0; y < gBArrayHeight; y++) {
    let completed = true;
    for (let x = 0; x < gBArrayWidth; x++) {
      let square = stoppedShapeArray[x][y];
      if (square === 0 || typeof square === "undefined") {
        completed = false;
        break;
      }
    }
    if (completed) {
      if (startOfDeletion === 0) {
        startOfDeletion = y;
      }
      rowsToDelete++;
      for (let i = 0; i < gBArrayWidth; i++) {
        stoppedShapeArray[y][i] = 0;
        gameBoardArray[y][i] = 0;
        let coorX = coordinateArray[y][i].x;
        let coorY = coordinateArray[y][i].y;
        ctx.fillStyle = "white";
        ctx.fillRect(coorX, coorY, 21, 21);
      }
    }
  }
  if (rowsToDelete > 0) {
    score += 10;
    MoveAllRowsDown(rowsToDelete, startOfDeletion);
  }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
  for (let i = startOfDeletion - 1; i >= 0; i--) {
    for (let x = 0; x < gBArrayWidth; x++) {
      let y2 = i + rowsToDelete;
      let square = stoppedShapeArray[i][x];
      let square2 = stoppedShapeArray[y2][x];
      if (typeof square === "string") {
        square2 = square;
        gameBoardArray[y2][x] = 1;
        stoppedShapeArray[y2][x] = square;
        let coorX = coordinateArray[y2][x].x;
        let coorY = coordinateArray[y2][x].y;
        ctx.fillStyle = square2;
        ctx.fillRect(coorX, coorY, 21, 21);
        square = 0;
        gameBoardArray[i][x] = 0;
        stoppedShapeArray[i][x] = 0;
        coorX = coordinateArray[i][x].x;
        coorY = coordinateArray[i][x].y;
        ctx.fillStyle = "white";
        ctx.fillRect(coorX, coorY, 21, 21);
      }
    }
  }
}

function RotateTetromino(){
  let newRotation = new Array();
  let tetrominoCopy = curTetromino;
  let curTetrominoBU;
  for (let i = 0; i < tetrominoCopy.length; i++) {
    curTetrominoBU = [...curTetromino];
    let x = tetrominoCopy[0][i];
    let y = tetrominoCopy[1][i];
    let newX = (GetLastSquareX() - y);
    let newY = x;
    newRotation.push([newX, newY]);
  }
  DeleteTetromino();
  try {
    curTetromino = newRotation;
    DrawTetromino();
  } catch (e) {
    if (e instanceof TypeError) {
      curTetromino = curTetrominoBU;
      DeleteTetromino();
      DrawTetromino();
    }
  }
}

function GetLastSquareX(){
  let lastX = 0;
  for (let i = 0; i < curTetromino.length; i++) {
    let square = curTetromino[i];
    if (square[0] > lastX) {
      lastX = square[0];
    }
  }
  return lastX;
}
