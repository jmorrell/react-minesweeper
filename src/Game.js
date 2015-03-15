var {Record, Set} = require('immutable');

var Board = require('./Board');
var CellState = require('./CellState');
var Location = require('./Location');

var Cell = Record({
  state: CellState.HIDDEN,
  hasBomb: false,
  x: 0,
  y: 0,
});

function generateBoard(height, width, numBombs) {
  if (height * width - 1 < numBombs) {
    numBombs = height * width - 1;
  }

  // set up us the bomb
  var bombs = Set();
  while (bombs.size < numBombs) {
    bombs = bombs.add(new Location({
      x: Math.floor(Math.random() * height),
      y: Math.floor(Math.random() * width),
    }));
  }

  var board = new Board(height, width);

  // hey guys! Remember for loops!?
  for (var x = 0; x < height; x++) {
    for (var y = 0; y < width; y++) {
      var location = new Location({x, y})
      board = board.setLocation(x, y, new Cell({
        x,
        y,
        hasBomb: bombs.contains(location),
      }));
    }
  }

  return board;
}

function getNeighborBombCount(board, x, y) {
  return board
    .getNeighbors(x, y)
    .map(({hasBomb}) => hasBomb ? 1 : 0)
    .reduce((a, b) => a + b);
}

function getNeighborFlagCount(board, x, y) {
  return board
    .getNeighbors(x, y)
    .map(({state}) => state === CellState.FLAGGED ? 1 : 0)
    .reduce((a, b) => a + b);
}

function isGameOver(board) {
  return board.data
    .some(cell => cell.state === CellState.EXPLODED);
}

function playNeighbors(board, x, y) {
  for (let cell of board.getNeighbors(x, y)) {
    board = playMove(board, cell.x, cell.y);
  }
  return board;
}

function playMove(board, x, y) {
  if (isGameOver(board) || !board.isValidLocation(x, y)) {
    return board;
  }

  var cell = board.getLocation(x, y);
  if (
    cell.state === CellState.EXPOSED ||
    cell.state === CellState.FLAGGED
  ) {
    return board;
  }

  if (!cell.hasBomb) {
    cell = cell.set('state', CellState.EXPOSED);
    board = board.setLocation(x, y, cell);

    if (getNeighborBombCount(board, x, y) === 0) {
      board = playNeighbors(board, x, y);
    }
  } else {
    cell = cell.set('state', CellState.EXPLODED);
    board = board.setLocation(x, y, cell);
  }

  return board;
}

function markCell(board, x, y) {
  var cell = board.getLocation(x, y);

  switch(cell.state) {
    case CellState.HIDDEN:
      cell = cell.set('state', CellState.FLAGGED);
      break;
    case CellState.FLAGGED:
      cell = cell.set('state', CellState.HIDDEN);
      break;
  }

  return board.setLocation(x, y, cell);
}

function clearCell(board, x, y) {
  var {state} = board.getLocation(x, y);
  var flagCount = getNeighborFlagCount(board, x, y);
  var bombCount = getNeighborBombCount(board, x, y);

  if (state !== CellState.EXPOSED || bombCount !== flagCount) {
    return board;
  }

  return playNeighbors(board, x, y);
}

module.exports = {
  clearCell,
  generateBoard,
  getNeighborBombCount,
  isGameOver,
  markCell,
  playMove,
};

