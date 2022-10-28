'use strict';

let board;
let score = 0;
let result = 0;
const rows = 4;
const columns = 4;
let scoreDisplay;
let resultDisplay;
let gridDisplay;

window.onload = function () {
  scoreDisplay = document.querySelector('.score');
  resultDisplay = document.querySelector('.result');
  gridDisplay = document.querySelector('.grid');
  startGame();
};

function startGame() {
  // board = [
  //     [0-0, 0-1, 0-2, 0-3],
  //     [1-0, 1-1, 1-2, 1-3],
  //     [2-0, 2-1, 2-2, 2-3],
  //     [3-0, 3-1, 3-2, 3-3]
  // ];

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let tile = document.createElement('div');
      tile.id = i + '-' + j;
      let num = board[i][j];
      updateTile(tile, num);
      // document.getElementById('grid').append(tile);
      gridDisplay.append(tile);
    }
  }

  //Start game with 2 at any two places
  randomTwo();
  randomTwo();
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = ''; //clear the classList
  tile.classList.add('tile');
  if (num > 0) {
    tile.innerText = num.toString();
    if (num <= 32) {
      tile.classList.add('tile' + num.toString());
    } else {
      tile.classList.add('tile64');
    }
  }
}

document.addEventListener('keyup', e => {
  if (result >= 16) {
    playerWin();
  } else {
    if (e.code == 'ArrowLeft') {
      moveLeft();
      randomTwo();
    }
    if (e.code == 'ArrowRight') {
      moveRight();
      randomTwo();
    }
    if (e.code == 'ArrowUp') {
      moveUp();
      randomTwo();
    }
    if (e.code == 'ArrowDown') {
      moveDown();
      randomTwo();
    }
    scoreDisplay.innerText = score;
  }
});

function playerWin() {
  gridDisplay.classList.add('hidden');
  resultDisplay.classList.add('player--winner');
  resultDisplay.classList.remove('hidden');
  resultDisplay.innerText = 'You Win😉🎉';
}

function playerLose() {
  gridDisplay.classList.add('hidden');

  resultDisplay.classList.add('player--loser');
  resultDisplay.classList.remove('hidden');

  resultDisplay.innerText = 'Try Again!!';
}

/*
1st row : [2,2,2,0]

Moving Left
1. Clear Zeroes    [2,2,2]
2. Merge elements [4,0,2]
3. Clear Zeroes   [4,2]
4.  Add Zeroes    [4,2,0,0]
*/
function clearZeroes(row) {
  return row.filter(num => num != 0);
}

function addZeroes(row) {
  while (row.length < columns) {
    row.push(0);
  }
  return row;
}

function slide(row) {
  // 1. Clear Zeroes
  row = clearZeroes(row); //row = [2,2,2]

  // 2. Merge elements   row = [4,0,2]
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] += row[i + 1];
      row[i + 1] = 0;
      score += row[i];
    }
    if (result < row[i]) result = row[i];
  }
  // 3. Clear Zeroes
  row = clearZeroes(row); //row = [4,2]

  // 4.  Add Zeroes [4,2,0,0]
  row = addZeroes(row);

  return row;
}

function moveLeft() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];
    row = slide(row);
    board[i] = row; //Updating the row again in board.

    for (let j = 0; j < columns; j++) {
      let tile = document.getElementById(i + '-' + j);
      let num = board[i][j];
      updateTile(tile, num);
    }
  }
}

function moveRight() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];
    row.reverse();
    row = slide(row);
    row.reverse();
    board[i] = row; //Updating the row again in board.

    for (let j = 0; j < columns; j++) {
      let tile = document.getElementById(i + '-' + j);
      let num = board[i][j];
      updateTile(tile, num);
    }
  }
}

/*
1st column : [2,2,0,0]

Moving Left
1. Clear Zeroes   [2,2]
2. Merge elements [4]
3. Clear Zeroes   [4]
4.  Add Zeroes    [4,0,0,0]
*/
function moveUp() {
  for (let i = 0; i < rows; i++) {
    let column = [];
    for (let k = 0; k < columns; k++) {
      //[2,2,0,0]
      column.push(board[k][i]);
    }
    column = slide(column); //[4,0,0,0]

    for (let k = 0; k < columns; k++) {
      board[k][i] = column[k]; //Updating the column again in the board.
      let tile = document.getElementById(k + '-' + i);
      let num = board[k][i];
      updateTile(tile, num);
    }
  }
}

function moveDown() {
  for (let i = 0; i < rows; i++) {
    let column = [];
    for (let k = 0; k < columns; k++) {
      //[2,2,0,0]
      column.push(board[k][i]);
    }
    column.reverse(); //[0,0,2,2]
    column = slide(column); //[4,0,0,0]
    column.reverse(); //[0,0,0,4]

    for (let k = 0; k < columns; k++) {
      board[k][i] = column[k]; //Updating the column again in board
      let tile = document.getElementById(k + '-' + i);
      let num = board[k][i];
      updateTile(tile, num);
    }
  }
}

function randomTwo() {
  if (!hasEmptyTile()) {
    return;
  }
  let found = false;
  while (!found) {
    //find random row and column to place a 2 in
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    if (board[r][c] == 0) {
      board[r][c] = 2;
      let tile = document.getElementById(r + '-' + c);
      tile.innerText = '2';
      tile.classList.add('tile2');
      found = true;
    }
  }
}

function hasEmptyTile() {
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        //at least one zero in the board
        return true;
      }
    }
  }
  return false;
}
