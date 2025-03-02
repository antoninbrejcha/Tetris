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

  canvas.width = 870;
  canvas.height = 1500;
  ctx.fillStyle = "orange";
  ctx.fillRect(0, 0, 870, 1500);
}
