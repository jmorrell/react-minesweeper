
var CellState = require('./CellState');
var getNeighbors = require('./getNeighbors');
var playMove = require('./playMove');

function countFlagged(board, i, j) {
  var flagged = 0;
  getNeighbors(board.data, i, j).forEach((cell) => {
    if (cell.state === CellState.FLAGGED) {
      flagged += 1;
    }
  });

  return flagged;
}

function exposeCell(board, i, j) {
  var cell = board.data[i][j];
  var flagged = countFlagged(board, i, j);

  if (cell.state !== CellState.EXPOSED ||
      cell.neighborBombCount !== flagged) {
    return;
  }

  getNeighbors(board.data, i, j).forEach((cell) => {
      playMove(board, i - 1, j);
      playMove(board, i - 1, j - 1);
      playMove(board, i - 1, j + 1);
      playMove(board, i + 1, j);
      playMove(board, i + 1, j + 1);
      playMove(board, i + 1, j - 1);
      playMove(board, i, j - 1);
      playMove(board, i, j + 1);
  });

}

module.exports = exposeCell;
