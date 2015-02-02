
var CellState = require('./CellState');

function markCell(board, i, j) {
  var cell = board.data[i][j];

  switch (cell.state) {
    case CellState.HIDDEN:
      cell.state = CellState.FLAGGED;
      break;
    case CellState.FLAGGED:
      cell.state = CellState.HIDDEN;
      break;
  }
}

module.exports = markCell;

