let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let winOrLose = "Playing";
let lastColorIndex = -1;
let gameSpeed = 1000;
let gameInterval;
let totalRowsDeleted = 0;

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

let gameBoardArray = [...Array(20)].map((e) => Array(12).fill(0));

let stoppedShapeArray = [...Array(20)].map((e) => Array(12).fill(0));

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
  let xR = 0,
    yR = 19;
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
  canvas.width = 936;
  canvas.height = 956;

  ctx.scale(2, 2);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(8, 8, 280, 462);

  tetrisLogo = new Image(161, 54);
  tetrisLogo.onload = DrawTetrisLogo;
  tetrisLogo.src = "tetrislogo.png";

  ctx.fillStyle = "black";
  ctx.font = "21px Arial";
  ctx.fillText("SCORE", 300, 98);

  ctx.strokeRect(300, 107, 161, 24);

  ctx.fillText(score.toString(), 310, 127);

  ctx.fillText("LEVEL", 300, 157);

  ctx.strokeRect(300, 171, 161, 24);

  ctx.fillText(level.toString(), 310, 190);

  ctx.fillText("WIN / LOSE", 300, 221);

  ctx.fillText(winOrLose, 310, 261);

  ctx.strokeRect(300, 232, 161, 95);

  ctx.fillText("CONTROLS", 300, 354);

  ctx.strokeRect(300, 366, 161, 104);

  ctx.font = "19px Arial";
  ctx.fillText("A : Move Left", 310, 388);
  ctx.fillText("D : Move Right", 310, 413);
  ctx.fillText("S : Move Down", 310, 438);
  ctx.fillText("E : Rotate Right", 310, 463);

  document.addEventListener("keydown", HandleKeyPress);

  CreateTetrominos();
  CreateTetromino();
  CreateCoordArray();
  DrawTetromino();
  SetGameInterval();
}

function DrawTetrisLogo() {
  ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino() {
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;
    gameBoardArray[x][y] = 1;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;

    ColoringTetromino(coorX, coorY);
  }
}

function HandleKeyPress(key) {
  if (winOrLose != "Game Over") {
    if (key.keyCode === 65) {
      direction = DIRECTION.LEFT;
      if (!HittingTheWall() && !CheckForHorizontalCollision()) {
        DeleteTetromino();
        startX--;
        DrawTetromino();
      }
    } else if (key.keyCode === 68) {
      direction = DIRECTION.RIGHT;
      if (!HittingTheWall() && !CheckForHorizontalCollision()) {
        DeleteTetromino();
        startX++;
        DrawTetromino();
      }
    } else if (key.keyCode === 83) {
      MoveTetrominoDown();
    } else if (key.keyCode === 69) {
      RotateTetromino();
    } else if (key.keyCode === 32) {
      key.preventDefault();
      DropTetromino();
    }
  }
  if ([32, 65, 68, 83, 69].includes(key.keyCode)) {
    key.preventDefault();
  }
}

function MoveTetrominoDown() {
  direction = DIRECTION.DOWN;
  if (!CheckForVerticalCollison()) {
    DeleteTetromino();
    startY++;
    DrawTetromino();
  }
}

function DeleteTetromino() {
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;
    gameBoardArray[x][y] = 0;

    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = "white";
    ctx.fillRect(coorX, coorY, 21, 21);
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
  console.log("Selected tetromino index:", randomTetromino);
  curTetromino = tetrominos[randomTetromino];

  let randomColor;
  do {
    randomColor = Math.floor(Math.random() * tetrominoColors.length);
  } while (randomColor === lastColorIndex && tetrominoColors.length > 1);
  lastColorIndex = randomColor;
  curTetrominoColor = tetrominoColors[randomColor];
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

function CheckForVerticalCollison() {
  let tetrominoCopy = curTetromino;
  let collision = false;
  for (let i = 0; i < tetrominoCopy.length; i++) {
    let square = tetrominoCopy[i];
    let x = square[0] + startX;
    let y = square[1] + startY;
    if (direction === DIRECTION.DOWN) {
      y++;
    }
    if (typeof stoppedShapeArray[x][y + 1] === "string") {
      DeleteTetromino();
      startY++;
      DrawTetromino();
      collision = true;
      break;
    }
    if (y >= 20) {
      collision = true;
      break;
    }
  }
  if (collision) {
    if (startY <= 2) {
      winOrLose = "Game Over";
      ctx.fillStyle = "white";
      ctx.fillRect(310, 242, 140, 30);
      ctx.fillStyle = "black";
      ctx.fillText(winOrLose, 310, 261);
    } else {
      for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        stoppedShapeArray[x][y] = curTetrominoColor;
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

function CheckForHorizontalCollision() {
  var tetrominoCopy = curTetromino;
  var collision = false;
  for (var i = 0; i < tetrominoCopy.length; i++) {
    var square = tetrominoCopy[i];
    var x = square[0] + startX;
    var y = square[1] + startY;
    if (direction == DIRECTION.LEFT) {
      x--;
    } else if (direction == DIRECTION.RIGHT) {
      x++;
    }
    var stoppedShapeVal = stoppedShapeArray[x][y];
    if (typeof stoppedShapeVal === "string") {
      collision = true;
      break;
    }
  }

  return collision;
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
      if (startOfDeletion === 0) startOfDeletion = y;
      rowsToDelete++;
      for (let i = 0; i < gBArrayWidth; i++) {
        stoppedShapeArray[i][y] = 0;
        gameBoardArray[i][y] = 0;
        let coorX = coordinateArray[i][y].x;
        let coorY = coordinateArray[i][y].y;
        ctx.fillStyle = "white";
        ctx.fillRect(coorX, coorY, 21, 21);
      }
    }
  }
  if (rowsToDelete > 0) {
    totalRowsDeleted += rowsToDelete;
    console.log("Total rows deleted: " + totalRowsDeleted);
    score += 10;
    ctx.fillStyle = "white";
    ctx.fillRect(310, 109, 140, 19);
    ctx.fillStyle = "black";
    ctx.fillText(score.toString(), 310, 127);
    MoveAllRowsDown(rowsToDelete, startOfDeletion);
    UpdateGameSpeed();
  }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
  for (var i = startOfDeletion - 1; i >= 0; i--) {
    for (var x = 0; x < gBArrayWidth; x++) {
      var y2 = i + rowsToDelete;
      var square = stoppedShapeArray[x][i];
      var nextSquare = stoppedShapeArray[x][y2];

      if (typeof square === "string") {
        nextSquare = square;
        gameBoardArray[x][y2] = 1;
        stoppedShapeArray[x][y2] = square;

        let coorX = coordinateArray[x][y2].x;
        let coorY = coordinateArray[x][y2].y;
        
        ColoringTetromino(coorX, coorY, square);

        square = 0;
        gameBoardArray[x][i] = 0;
        stoppedShapeArray[x][i] = 0;
        coorX = coordinateArray[x][i].x;
        coorY = coordinateArray[x][i].y;
        ctx.fillStyle = "white";
        ctx.fillRect(coorX, coorY, 21, 21);
      }
    }
  }
}

function RotateTetromino() {
  let newRotation = [];
  let curTetrominoBU = [...curTetromino];
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0];
    let y = curTetromino[i][1];
    let newX = GetLastSquareX() - y;
    let newY = x;
    newRotation.push([newX, newY]);
  }
  let originalX = startX;
  let originalY = startY;
  if (IsValidPosition(newRotation, startX, startY)) {
    DeleteTetromino();
    curTetromino = newRotation;
    DrawTetromino();
    return;
  }
  for (let wallKickX = 1; wallKickX <= 2; wallKickX++) {
    if (IsValidPosition(newRotation, startX - wallKickX, startY)) {
      DeleteTetromino();
      startX -= wallKickX;
      curTetromino = newRotation;
      DrawTetromino();
      return;
    }
  }
  for (let wallKickX = 1; wallKickX <= 2; wallKickX++) {
    if (IsValidPosition(newRotation, startX + wallKickX, startY)) {
      DeleteTetromino();
      startX += wallKickX;
      curTetromino = newRotation;
      DrawTetromino();
      return;
    }
  }
  if (IsValidPosition(newRotation, startX, startY - 1)) {
    DeleteTetromino();
    startY -= 1;
    curTetromino = newRotation;
    DrawTetromino();
    return;
  }
  startX = originalX;
  startY = originalY;
}

function IsValidPosition(tetromino, posX, posY) {
  for (let i = 0; i < tetromino.length; i++) {
    let newX = tetromino[i][0] + posX;
    let newY = tetromino[i][1] + posY;
    if (newX < 0 || newX >= gBArrayWidth || newY < 0 || newY >= gBArrayHeight) {
      return false;
    }
    if (typeof stoppedShapeArray[newX][newY] === "string") {
      return false;
    }
  }

  return true;
}

function GetLastSquareX() {
  let lastX = 0;
  for (let i = 0; i < curTetromino.length; i++) {
    let square = curTetromino[i];
    if (square[0] > lastX) lastX = square[0];
  }
  return lastX;
}

function DropTetromino() {
  let dropDistancePossible = 0;
  dropLoop: for (
    let potentialDrop = 1;
    potentialDrop < gBArrayHeight;
    potentialDrop++
  ) {
    for (let i = 0; i < curTetromino.length; i++) {
      let x = curTetromino[i][0] + startX;
      let y = curTetromino[i][1] + startY + potentialDrop;
      if (y >= gBArrayHeight) {
        dropDistancePossible = potentialDrop - 1;
        break dropLoop;
      }
      if (typeof stoppedShapeArray[x][y] === "string") {
        dropDistancePossible = potentialDrop - 1;
        break dropLoop;
      }
    }
    dropDistancePossible = potentialDrop;
  }
  if (dropDistancePossible > 0) {
    DeleteTetromino();
    startY += dropDistancePossible;
    DrawTetromino();
    PlaceTetromino();
  }
}

function PlaceTetromino() {
  for (let i = 0; i < curTetromino.length; i++) {
    let square = curTetromino[i];
    let x = square[0] + startX;
    let y = square[1] + startY;
    stoppedShapeArray[x][y] = curTetrominoColor;
  }
  CheckForCompletedRows();
  CreateTetromino();
  direction = DIRECTION.IDLE;
  startX = 4;
  startY = 0;
  DrawTetromino();
  for (let i = 0; i < curTetromino.length; i++) {
    let square = curTetromino[i];
    let x = square[0] + startX;
    let y = square[1] + startY;
    if (typeof stoppedShapeArray[x][y] === "string") {
      winOrLose = "Game Over";
      ctx.fillStyle = "white";
      ctx.fillRect(310, 242, 140, 30);
      ctx.fillStyle = "black";
      ctx.fillText(winOrLose, 310, 261);
      break;
    }
  }
}

function darkenHexColor(hexColor, percentage) {
  hexColor = hexColor.replace('#', '');
  
  let r = parseInt(hexColor.substr(0, 2), 16);
  let g = parseInt(hexColor.substr(2, 2), 16);
  let b = parseInt(hexColor.substr(4, 2), 16);
  
  r = Math.floor(r * (1 - percentage / 100));
  g = Math.floor(g * (1 - percentage / 100));
  b = Math.floor(b * (1 - percentage / 100));
  
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  
  return '#' + 
    r.toString(16).padStart(2, '0') + 
    g.toString(16).padStart(2, '0') + 
    b.toString(16).padStart(2, '0');
}

function ColoringTetromino(coorX, coorY, color){
  let tetroColor = color || curTetrominoColor;
  ctx.fillStyle = tetroColor;
  ctx.fillRect(coorX, coorY, 21, 21);
  
  ctx.fillStyle = darkenHexColor(tetroColor, 15);
  ctx.fillRect(coorX + 3, coorY + 3, 15, 15);

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(coorX + 3, coorY + 3);
  ctx.lineTo(coorX + 10, coorY + 3);
  ctx.lineTo(coorX + 10, coorY + 6);
  ctx.lineTo(coorX + 6, coorY + 6);
  ctx.lineTo(coorX + 6, coorY + 10);
  ctx.lineTo(coorX + 3, coorY + 10);
  ctx.lineTo(coorX + 3, coorY + 3);
  ctx.fill();
}

function SetGameInterval() {
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = window.setInterval(function () {
    if (winOrLose != "Game Over") {
      MoveTetrominoDown();
    }
  }, gameSpeed);
}

function UpdateGameSpeed() {
  let newLevel = Math.floor(score / 10) + 1;
  if (newLevel > level) {
    level = newLevel;
    gameSpeed = Math.max(200, 1000 - (level - 1) * 50);
    console.log("Level: " + level + ", Speed: " + gameSpeed + "ms");
    ctx.fillStyle = "white";
    ctx.fillRect(310, 171, 140, 24);
    ctx.fillStyle = "black";
    ctx.fillText(level.toString(), 310, 190);
    SetGameInterval();
  }
}
