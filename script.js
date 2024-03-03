"use-strict";
const GRID_WIDTH = 7;
const GRID_HEIGHT = 6;
let model = [];
let currentPlayer = 1;

window.addEventListener("load", start);

/* ############## CONTROLLER ################ */
function start() {
  createBoard();
  createModel();
  makeBoardClickable();
}

function selectCell(row, col) {
  const lowestEmptyRow = findLowestEmptyRow(col);

  if (lowestEmptyRow !== -1) {
    writeToCell(lowestEmptyRow, col, currentPlayer);
    displayBoard();
    if (checkForWinner(lowestEmptyRow, col)) {
      const winner = document.querySelector("#winner");
      winner.innerText = `Player ${currentPlayer} wins!`;
      removeEventlistener();
      return;
    }
    nextTurn();
  }
}

function findLowestEmptyRow(col) {
  for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
    if (readFromCell(row, col) === 0) {
      return row;
    }
  }
  return -1;
}

function nextTurn() {
  if (currentPlayer === 1) {
    currentPlayer = 2;
  } else if (currentPlayer === 2) {
    currentPlayer = 1;
  }
}

/* ############## VIEW ################ */

function makeBoardClickable() {
  document.querySelector("#board").addEventListener("click", boardClicked);
}

function removeEventlistener() {
  document.querySelector("#board").removeEventListener("click", boardClicked);
}

function boardClicked(evt) {
  const cell = evt.target;
  if (cell.classList.contains("cell")) {
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    selectCell(row, col);
    console.table(model);
  }
}

function displayBoard() {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const value = readFromCell(row, col);
      const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      switch (value) {
        case 0:
          cell.style.backgroundColor = "white";
          break;
        case 1:
          cell.style.backgroundColor = "red";
          break;
        case 2:
          cell.style.backgroundColor = "yellow";
          break;
      }
    }
  }
}

/* ############## MODEL ################ */

function createModel() {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const newRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      newRow[col] = 0;
    }
    model[row] = newRow;
  }
}

function createBoard() {
  const board = document.querySelector("#board");
  board.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-row", row);
      cell.setAttribute("data-col", col);
      board.appendChild(cell);
    }
  }
}

function writeToCell(row, col, value) {
  model[row][col] = value;
}

function readFromCell(row, col) {
  return model[row][col];
}

function checkForWinner(row, col) {
  const currentPlayerToken = currentPlayer;

  // Check horizontally
  let count = 0;
  for (let c = 0; c < GRID_WIDTH; c++) {
    if (readFromCell(row, c) === currentPlayerToken) {
      count++;
      if (count === 4) return true;
    } else {
      count = 0;
    }
  }

  // Check vertically
  count = 0;
  for (let r = 0; r < GRID_HEIGHT; r++) {
    if (readFromCell(r, col) === currentPlayerToken) {
      count++;
      if (count === 4) return true;
    } else {
      count = 0;
    }
  }

  // Diagonal check (down-right and up-right)
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      if (
        col + 3 < 7 &&
        row + 3 < 6 &&
        model[row][col] === currentPlayerToken &&
        model[row + 1][col + 1] === currentPlayerToken &&
        model[row + 2][col + 2] === currentPlayerToken &&
        model[row + 3][col + 3] === currentPlayerToken
      ) {
        return true;
      }
      if (
        col + 3 < 7 &&
        row - 3 >= 0 &&
        model[row][col] === currentPlayerToken &&
        model[row - 1][col + 1] === currentPlayerToken &&
        model[row - 2][col + 2] === currentPlayerToken &&
        model[row - 3][col + 3] === currentPlayerToken
      ) {
        return true;
      }
    }
  }
  return false;
}
