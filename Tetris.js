// Import from game-ui.js
import { showGameOver } from "./game-ui.js";

// Make level accessible to other modules for scoring
window.level = level;

let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let gameOver = false;
let lastColorIndex = -1;
let gameSpeed = 1000;
let gameInterval;
let totalRowsDeleted = 0;

let lockDelayActive = false;
let lockDelayTimer = null;

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
    for (let x = 102; x <= 355; x += 23) {
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
  canvas.width = 956;
  canvas.height = 956;

  ctx.scale(2, 2);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  DrawGameBoard();

  ctx.lineWidth = 24;
  ctx.strokeStyle = "#815AC0";
  ctx.strokeRect(84, -8, 310, 492);

  ctx.beginPath();
  ctx.moveTo(94, 0);
  ctx.lineTo(94, 478);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#6247AA";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(66, 0);
  ctx.lineTo(66, 478);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#815AC0";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(74, 0);
  ctx.lineTo(74, 478);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#c19ee0";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(78, 0);
  ctx.lineTo(78, 478);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#A06CD5";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(384, 0);
  ctx.lineTo(384, 478);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#c19ee0";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(388, 0);
  ctx.lineTo(388, 478);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#A06CD5";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(404, 0);
  ctx.lineTo(404, 478);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#6247AA";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(412, 0);
  ctx.lineTo(412, 478);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#815AC0";
  ctx.stroke();

  drawText(
    ctx,
    "LeVeL",
    38,
    0,
    80,
    "Tiny5",
    ["#c19ee0", "#A06CD5", "#6247AA"],
    0.65
  );
  drawText(
    ctx,
    "ScOrE",
    450,
    0,
    80,
    "Tiny5",
    ["#c19ee0", "#A06CD5", "#6247AA"],
    0.65
  );

  drawScore(ctx, level, 38, 285, 70, "Tiny5", 0.8);
  drawScore(ctx, score, 450, 285, 70, "Tiny5", 0.8);

  document.fonts.ready.then(() => {
    drawWithGoogleFont();
  });

  document.addEventListener("keydown", HandleKeyPress);

  CreateTetrominos();
  CreateTetromino();
  CreateCoordArray();
  DrawTetromino();
  SetGameInterval();
}

function drawText(ctx, text, x, y, fontSize, fontFamily, colors, lineHeight) {
  ctx.font = `${fontSize}px ${fontFamily}`;
  let characters = text.split("");
  let currentY = y;

  for (let i = 0; i < characters.length; i++) {
    let char = characters[i];
    let charWidth = ctx.measureText(char).width;

    let centeredX = x - charWidth / 2;

    let topHeight = fontSize * 0.35;
    let middleHeight = fontSize * 0.2;
    let bottomHeight = fontSize * 0.45;

    let baselineY = currentY + fontSize * 0.8;

    ctx.save();
    ctx.beginPath();
    ctx.rect(centeredX, currentY, charWidth, topHeight);
    ctx.clip();
    ctx.fillStyle = colors[0];
    ctx.fillText(char, centeredX, baselineY);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.rect(centeredX, currentY + topHeight, charWidth, middleHeight);
    ctx.clip();
    ctx.fillStyle = colors[1];
    ctx.fillText(char, centeredX, baselineY);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.rect(
      centeredX,
      currentY + topHeight + middleHeight,
      charWidth,
      bottomHeight
    );
    ctx.clip();
    ctx.fillStyle = colors[2];
    ctx.fillText(char, centeredX, baselineY);
    ctx.restore();

    currentY += fontSize * lineHeight;
  }
}

function drawScore(ctx, text, x, y, fontSize, fontFamily, lineHeight) {
  ctx.font = `${fontSize}px ${fontFamily}`;
  let textStr = text.toString();
  let characters = textStr.split("");
  let currentY = y;
  for (let i = 0; i < characters.length; i++) {
    let char = characters[i];
    let charWidth = ctx.measureText(char).width;

    let centeredX = x - charWidth / 2;
    let baselineY = currentY + fontSize * 0.8;

    ctx.fillStyle = "black";
    ctx.fillRect(centeredX - 4, currentY, charWidth, fontSize);

    ctx.fillStyle = "white";
    ctx.fillText(char, centeredX, baselineY);

    currentY += fontSize * lineHeight;
  }
}

function DrawGameBoard() {
  ctx.fillStyle = "#F7FF99";
  ctx.fillRect(99, 8, 280, 462);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.strokeRect(98, 6, 282, 464);
}

function DrawTetromino() {
  highlightTetrominoColumns();
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
  if (window.gameState !== "game") {
    return;
  }
  if (gameOver == false) {
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
  ClearingGameBoard();
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;
    gameBoardArray[x][y] = 0;

    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = "#F7FF99";
    ctx.fillRect(coorX - 1, coorY - 1, 23, 23);
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
      gameOver = true;
      showGameOver(score, level);
      return true;
    }
    if (!lockDelayActive) {
      lockDelayActive = true;
      lockDelayTimer = setTimeout(function () {
        if (lockDelayActive) {
          for (let i = 0; i < curTetromino.length; i++) {
            let square = curTetromino[i];
            let x = square[0] + startX;
            let y = square[1] + startY;
            stoppedShapeArray[x][y] = curTetrominoColor;
          }
          lockDelayActive = false;
          CheckForCompletedRows();
          CreateTetromino();
          direction = DIRECTION.IDLE;
          startX = 4;
          startY = 0;
          DrawTetromino();
        }
      }, 500);
    }
  } else {
    if (lockDelayActive && direction === DIRECTION.DOWN) {
      clearTimeout(lockDelayTimer);
      lockDelayActive = false;
    }
  }

  return collision;
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
        ctx.fillStyle = "#F7FF99";
        ctx.fillRect(coorX - 1, coorY - 1, 23, 23);
      }
    }
  }
  if (rowsToDelete > 0) {
    totalRowsDeleted += rowsToDelete;
    console.log(
      "Total rows deleted: " + totalRowsDeleted + ", Score: " + score
    );
    score = totalRowsDeleted * 10;
    MoveAllRowsDown(rowsToDelete, startOfDeletion);
    drawScore(ctx, score, 450, 285, 70, "Tiny5", 0.8);
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
        ctx.fillStyle = "#F7FF99";
        ctx.fillRect(coorX - 1, coorY - 1, 23, 23);
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
    if (lockDelayActive) {
      clearTimeout(lockDelayTimer);
      lockDelayActive = false;
    }
    DeleteTetromino();
    startY += dropDistancePossible;
    DrawTetromino();
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
      gameOver = true;
      alert("Game Over");
      break;
    }
  }
}

function modifyHexColor(hexColor, percentage, opacity) {
  hexColor = hexColor.replace("#", "");

  let r = parseInt(hexColor.substr(0, 2), 16);
  let g = parseInt(hexColor.substr(2, 2), 16);
  let b = parseInt(hexColor.substr(4, 2), 16);

  r = Math.floor(r * (1 - percentage / 100));
  g = Math.floor(g * (1 - percentage / 100));
  b = Math.floor(b * (1 - percentage / 100));

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  let alphaValue = opacity / 100;

  return `rgba(${r}, ${g}, ${b}, ${alphaValue})`;
}

function ColoringTetromino(coorX, coorY, color) {
  let tetroColor = color || curTetrominoColor;
  ctx.fillStyle = tetroColor;
  ctx.fillRect(coorX, coorY, 21, 21);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(coorX, coorY, 21, 21);

  ctx.fillStyle = modifyHexColor(tetroColor, 15, 100);
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
    if (window.gameState === "game" && gameOver == false) {
      MoveTetrominoDown();
    }
  }, gameSpeed);
}

function UpdateGameSpeed() {
  let newLevel = Math.floor(score / 10) + 1;
  if (newLevel > level) {
    level = newLevel;
    window.level = level;
    gameSpeed = Math.max(200, 1000 - (level - 1) * 30);
    console.log("Level: " + level + ", Speed: " + gameSpeed + "ms");
    drawScore(ctx, level, 38, 285, 70, "Tiny5", 0.8);
    SetGameInterval();
  }
}

function highlightTetrominoColumns() {
  let columnsToHighlight = {};
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;
    if (columnsToHighlight[x] === undefined || y > columnsToHighlight[x]) {
      columnsToHighlight[x] = y;
    }
  }

  ctx.fillStyle = modifyHexColor(curTetrominoColor, 25, 15);
  for (let col in columnsToHighlight) {
    col = parseInt(col);
    let lowestTetrominoY = columnsToHighlight[col];
    let highlightStartY = coordinateArray[col][lowestTetrominoY].y + 21;
    let highlightX = coordinateArray[col][0].x;
    let nextPlacedPieceY = gBArrayHeight;
    for (let y = lowestTetrominoY + 1; y < gBArrayHeight; y++) {
      if (typeof stoppedShapeArray[col][y] === "string") {
        nextPlacedPieceY = y;
        break;
      }
    }
    let highlightEndY;
    if (nextPlacedPieceY < gBArrayHeight) {
      highlightEndY = coordinateArray[col][nextPlacedPieceY].y;
    } else {
      highlightEndY = coordinateArray[col][gBArrayHeight - 1].y + 21;
    }
    let highlightHeight = highlightEndY - highlightStartY;
    if (highlightHeight > 0) {
      ctx.fillRect(highlightX, highlightStartY, 21, highlightHeight);
    }
  }
}

function ClearingGameBoard() {
  DrawGameBoard();
  for (let x = 0; x < gBArrayWidth; x++) {
    for (let y = 0; y < gBArrayHeight; y++) {
      if (typeof stoppedShapeArray[x][y] === "string") {
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ColoringTetromino(coorX, coorY, stoppedShapeArray[x][y]);
      }
    }
  }
}

// Function to reset the game
function resetGame() {
  // Clear game arrays
  gameBoardArray = [...Array(20)].map((e) => Array(12).fill(0));
  stoppedShapeArray = [...Array(20)].map((e) => Array(12).fill(0));

  // Reset game variables
  score = 0;
  level = 1;
  window.level = level; // Update global level for scoring
  gameOver = false;
  totalRowsDeleted = 0;
  gameSpeed = 1000;
  startX = 4;
  startY = 0;
  direction = DIRECTION.IDLE;

  // Clear any existing lock delay
  if (lockDelayActive) {
    clearTimeout(lockDelayTimer);
    lockDelayActive = false;
  }

  // Clear the canvas and redraw
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  DrawGameBoard();

  // Reset UI elements
  drawScore(ctx, level, 38, 285, 70, "Tiny5", 0.8);
  drawScore(ctx, score, 450, 285, 70, "Tiny5", 0.8);

  // Create new tetromino
  CreateTetromino();
  DrawTetromino();

  // Reset game interval
  SetGameInterval();
}

// Add this function to the window object so it can be accessed by game-ui.js
window.resetGame = resetGame;
