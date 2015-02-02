function getOrthogonalNeighbors(board, x, y) {
  return [
    board[x - 1] ? board[x - 1][y] : null,
    board[x + 1] ? board[x + 1][y] : null,
    board[x][y - 1] ? board[x][y - 1] : null,
    board[x][y + 1] ? board[x][y + 1] : null,
  ].filter(function(x) { return !!x; });
}

module.exports = getOrthogonalNeighbors;
