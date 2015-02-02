
var CellState = require('./CellState');

var getNeighbors = require('./getNeighbors');

function generateBoard(height, width, numBombs) {
  // generate data
  var data = [];
  for (var i = 0; i < height; i++) {
    data.push([]);
    for (var j = 0; j < width; j++) {
      data[i].push({
        state: CellState.HIDDEN,
        hasBomb: false,
        neighborBombCount: 0,
      });
    }
  }

  // seed the bombs
  for (var i = 0; i < numBombs; i++) {
    var x = Math.floor(Math.random() * height);
    var y = Math.floor(Math.random() * width);

    if (!data[x][y].hasBomb) {
      data[x][y].hasBomb = true;

      getNeighbors(data, x, y).forEach(function(cell) {
        cell.neighborBombCount += 1;
      });
    } else {
      i -= 1;
    }
  }

  return {
    data,
    height,
    width,
    isGameOver: false,
    pressedCell: null,
  };
}

module.exports = generateBoard;

