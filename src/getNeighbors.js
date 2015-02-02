var getOrthogonalNeighbors = require('./getOrthogonalNeighbors');

function getNeighbors(board, x, y) {
  var neighbors = getOrthogonalNeighbors(board, x, y);

  neighbors.push(
    board[x - 1] && board[x][y - 1] ? board[x - 1][y - 1] : null,
    board[x - 1] && board[x][y + 1] ? board[x - 1][y + 1] : null,
    board[x + 1] && board[x][y - 1] ? board[x + 1][y - 1] : null,
    board[x + 1] && board[x][y + 1] ? board[x + 1][y + 1] : null
  );

  return neighbors.filter(function(x) { return !!x; });
}

module.exports = getNeighbors;
