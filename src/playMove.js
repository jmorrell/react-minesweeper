
var isValidLocation = require('./isValidLocation');
var getOrthogonalNeighbors = require('./getOrthogonalNeighbors');

var CellState = require('./CellState');

function playMove(board, x, y) {
  if (!isValidLocation(board, x, y)) {
    return;
  }

  if (board.isGameOver) {
    return;
  }

  var cell = board.data[x][y];
  if (cell.state === CellState.EXPOSED ||
      cell.state === CellState.FLAGGED) {
    return;
  }

  if (!cell.hasBomb) {
    cell.state = CellState.EXPOSED;

    if (cell.neighborBombCount === 0) {
      playMove(board, x - 1, y);
      playMove(board, x - 1, y - 1);
      playMove(board, x - 1, y + 1);
      playMove(board, x + 1, y);
      playMove(board, x + 1, y + 1);
      playMove(board, x + 1, y - 1);
      playMove(board, x, y - 1);
      playMove(board, x, y + 1);
    }
  } else {
    cell.state = CellState.EXPLODED;
    board.isGameOver = true;
  }
}

module.exports = playMove;
