import { randInt } from "./math";

export default class Sudoku {
  constructor(rows, columns) {
    this.board = [];
    this.generate(rows, columns);
    this.fill();
  }

  generate(rows = 2, columns = 2) {
    for (let i = 0; i < columns; i++) {
      this.board[i] = [];
      for (let j = 0; j < rows; j++) {
        this.board[i][j] = new Array(9).fill("empty");
      }
    }
  }

  fill() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        let values = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let c = randInt(0, 4);
        for (let k = 0; k < c; k++) {
          let randValue = values[randInt(0, values.length - 1)];
          let x = randInt(0, 2);
          let y = randInt(0, 2);

          let isFilled = this.set(j, i, x, y, randValue);

          while (!isFilled) {
            x = randInt(0, 2);
            y = randInt(0, 2);
            randValue = values[randInt(0, values.length - 1)];
            isFilled = this.set(j, i, x, y, randValue);
          }
        }
      }
    }
  }

  check(row, column, x, y, value) {
    if (value === "empty") return true;

    for (let i = 0; i < column; i++) {
      for (let j = 0; j < 3; j++) {
        if (+this.board[i][row][j * 3 + x] === +value) return false;
      }
    }
    for (let i = column + 1; i < this.board.length; i++) {
      for (let j = 0; j < 3; j++) {
        if (+this.board[i][row][j * 3 + x] === +value) return false;
      }
    }

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < 3; j++) {
        if (+this.board[column][i][y * 3 + j] === +value) return false;
      }
    }
    for (let i = row + 1; i < this.board[0].length; i++) {
      for (let j = 0; j < 3; j++) {
        if (+this.board[column][i][y * 3 + j] === +value) return false;
      }
    }

    return true;
  }

  checkIfValueExists(row, column, value) {
    if (value === "empty") return false;

    let arr = this.board[column][row].filter((e) => e !== "empty");

    return (
      arr.findIndex((e) => {
        return +e === +value;
      }) !== -1
    );
  }

  set(row, column, x, y, value) {
    if (
      !this.check(row, column, x, y, value) ||
      this.checkIfValueExists(row, column, value)
    )
      return false;

    this.board[column][row][y * 3 + x] = value;
    return true;
  }

  get(row, column, x, y) {
    return this.board[column][row][y * 3 + x];
  }
}
