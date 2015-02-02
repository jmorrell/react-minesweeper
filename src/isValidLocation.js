
function isValidLocation(board, x, y) {
  return (
    x >= 0 && x < board.height &&
    y >= 0 && y < board.width
  );
}

module.exports = isValidLocation;
