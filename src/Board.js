var {Record, List} = require('immutable');

function getNeighborIndices(x, y) {
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
    [x - 1, y - 1],
    [x - 1, y + 1],
    [x + 1, y - 1],
    [x + 1, y + 1],
  ];
}

class Board extends Record({
  height: 0,
  width: 0,
  data: List(),
}) {
  constructor(height = 0, width = 0) {
    var data = List().setSize(height * width);
    super({height, width, data});
  }

  getLocation(x, y) {
    if (this.isValidLocation(x, y)) {
      var location = x * this.width + y;
      return this.data.get(location);
    }
  }

  setLocation(x, y, cell) {
    if (this.isValidLocation(x, y)) {
      var location = x * this.width + y;
      var newData = this.data.set(location, cell);
      return this.set('data', newData);
    }
    return this;
  }

  isValidLocation(x, y) {
    return (
      x >= 0 && x < this.height &&
      y >= 0 && y < this.width
    );
  }

  getNeighbors(x, y) {
    return getNeighborIndices(x, y)
      .map(([i, j]) => this.getLocation(i, j))
      .filter(x => x);
  }
}

module.exports = Board;
