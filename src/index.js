import { floor, min } from "./js/math";
import Sudoku from "./js/Sudoku";


let canvas,
  ctx,
  sudoku,
  modal,
  modalEnd,
  modalStat,
  cell = {
    x: undefined,
    y: undefined,
    x1: undefined,
    y1: undefined,
  },
  startX,
  startY,
  bigSize,
  smallCellWidth,
  smallCellHeight;

window.addEventListener("load", () => {
  modal = document.querySelector(".modal");
  modalEnd = document.querySelector(".modal-end");
  let modalEndButton = modalEnd.querySelector("button");
  modalStat = modal.getBoundingClientRect();
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  init();

  canvas.addEventListener("mousedown", ({ offsetX: _x, offsetY: _y }) => {
    modal.classList.remove("active");

    if (
      _x < startX ||
      _x > startX + bigSize ||
      _y < startY ||
      _y > startY + bigSize
    )
      return;
    const x = floor(_x - startX);
    const y = floor(_y - startY);

    const bigCellX = floor(x / smallCellWidth);
    const bigCellY = floor(y / smallCellWidth);

    const smallCellX = floor(x / floor(smallCellWidth / 3)) - 3 * bigCellX;
    const smallCellY = floor(y / floor(smallCellHeight / 3)) - 3 * bigCellY;

    cell.x = bigCellX;
    cell.y = bigCellY;
    cell.x1 = smallCellX;
    cell.y1 = smallCellY;

    modal.classList.add("active");

    if (_x + modalStat.width / 2 > startX + bigSize) {
      modal.style.left = startX + bigSize - modalStat.width + "px";
    } else if (_x - modalStat.width / 2 < startX) {
      modal.style.left = startX + "px";
    } else {
      modal.style.left = _x - modalStat.width / 2 + "px";
    }

    if (_y + modalStat.height + 20 > startY + bigSize) {
      modal.style.top = startY + bigSize - modalStat.height + "px";
    } else {
      modal.style.top = _y + 20 + "px";
    }
  });

  modal.addEventListener("click", ({ target }) => {
    if (target.tagName !== "BUTTON") return;
    if (
      typeof sudoku.get(cell.x, cell.y, cell.x1, cell.y1) === "string" &&
      sudoku.get(cell.x, cell.y, cell.x1, cell.y1) !== "empty"
    )
      return;

    if (target.classList.contains("clear")) {
      sudoku.set(cell.x, cell.y, cell.x1, cell.y1, "empty");
      drawBoard();
      return;
    }

    sudoku.set(cell.x, cell.y, cell.x1, cell.y1, +target.dataset.value);
    drawBoard();
    modal.classList.remove("active");
    let isWinner = checkWinner();

    if (isWinner) {
      modalEnd.classList.add("active");
    }
  });

  modalEndButton.addEventListener("click", () => {
    init();
    modalEnd.classList.remove("active");
  });
});

function drawText(x, y, value, color, font) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.fillText(value, x, y);
}

function drawLine(x, y, x1, y1, color = "white", lineWidth = 1) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawField({
  startX,
  startY,
  width,
  height,
  color,
  lineWidth,
  columns = 3,
  rows = 3,
}) {
  for (let i = 0; i < columns - 1; i++) {
    drawLine(
      startX + (i + 1) * (width / columns),
      startY,
      startX + (i + 1) * (width / columns),
      startY + height,
      color,
      lineWidth
    );
  }

  for (let i = 0; i < rows - 1; i++) {
    drawLine(
      startX,
      startY + (i + 1) * (height / rows),
      startX + width,
      startY + (i + 1) * (height / rows),
      color,
      lineWidth
    );
  }
}

function drawValue(columns, rows) {
  const fontSize = (min(canvas.width, canvas.height) / 100) * 5;
  let _i_ = 0,
    _j_ = 0;
  for (let i = 0; i < columns * columns; i++) {
    if (_i_ === 3) _i_ = 0;
    for (let j = 0; j < rows * rows; j++) {
      if (_j_ === 3) _j_ = 0;
      let el = sudoku.get(floor(j / columns), floor(i / rows), _j_, _i_);
      if (el === "empty") el = "";

      let color = "white";

      if (typeof el === "string") color = "rgb(255, 0, 217)";

      drawText(
        startX + (smallCellWidth * j) / 3 + fontSize * 0.8,
        startY + (smallCellHeight * i) / 3 + fontSize * 1.45,
        el,
        color,
        `${fontSize}px Arial`
      );
      _j_++;
    }
    _i_++;
  }
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw big field
  drawField({
    startX: startX,
    startY: startY,
    width: bigSize,
    height: bigSize,
    columns: sudoku.board[0].length,
    rows: sudoku.board.length,
    lineWidth: 3,
  });

  // draw big field small fields
  for (let i = 0; i < sudoku.board.length; i++) {
    for (let j = 0; j < sudoku.board[0].length; j++) {
      drawField({
        startX: startX + j * smallCellWidth,
        startY: startY + i * smallCellHeight,
        width: smallCellWidth,
        height: smallCellHeight,
        columns: sudoku.board[0].length,
        rows: sudoku.board.length,
      });
    }
  }

  drawValue(sudoku.board[0].length, sudoku.board.length);
}

function setSizes() {
  modal.style.top = 0;
  modal.style.left = 0;
  modal.classList.remove("active");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  bigSize =
    min(canvas.width, canvas.height) -
    (min(canvas.width, canvas.height) / 100) * 5;
  smallCellWidth = bigSize / sudoku.board[0].length;
  smallCellHeight = bigSize / sudoku.board.length;

  startX = canvas.width / 2 - smallCellWidth - smallCellWidth / 2;
  startY = canvas.height / 2 - smallCellHeight - smallCellHeight / 2;
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  sudoku = new Sudoku(3, 3);

  setSizes();
  drawBoard();
}

function checkWinner() {
  for (let i = 0; i < sudoku.board.length; i++) {
    for (let j = 0; j < sudoku.board[i].length; j++) {
      for (let k = 0; k < sudoku.board[i][j].length; k++) {
        if (sudoku.board[i][j][k] === "empty") return false;
      }
    }
  }

  return true;
}

window.addEventListener("resize", () => {
  setSizes();
  drawBoard();
});