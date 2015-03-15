var React = require('react');
var {Record, Set} = require('immutable');
var SegmentDisplay = require('react-segment-display');

var Cell = require('./src/Cell');
var CellState = require('./src/CellState');

var Location = Record({
  x: 0,
  y: 0,
});

var {
  clearCell,
  generateBoard,
  getNeighborBombCount,
  isGameOver,
  markCell,
  playMove,
} = require('./src/Game');

var HEIGHT = 10;
var WIDTH = 20;
var NUM_BOMBS = 25;
var CELL_SIZE = 20;

window.board = generateBoard(HEIGHT, WIDTH, NUM_BOMBS);
var pressed = Set();

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

var Actions = {
  PRESS_CELL: function(x, y, cell) {
    if (!isGameOver(board)) {
      switch(cell.state) {
        case CellState.HIDDEN:
          pressed = pressed.add(new Location({x, y}));
          break;
        case CellState.EXPOSED:
          getNeighborIndices(x, y).forEach(([i, j]) => {
            pressed = pressed.add(new Location({x: i, y: j}));
          });
          break;
      }
      render();
    }
  },
  UNPRESS_CELL: function(x, y, cell) {
    if (!isGameOver(board)) {
      pressed = pressed.clear();
      render();
    }
  },
  MARK_CELL: function(x, y, cell) {
    if (!isGameOver(board)) {
      board = markCell(board, x, y);
      render();
    }
  },
  CLICK_CELL: function(x, y, cell) {
    if (!isGameOver(board)) {
      board = playMove(board, x, y);
      render();
    }
  },
  CLEAR_CELL: function(x, y, cell) {
    if (!isGameOver(board)) {
      board = clearCell(board, x, y);
      render();
    }
  },
  RESTART_GAME: function() {
    board = generateBoard(HEIGHT, WIDTH, NUM_BOMBS);
    render();
  },
};

var Board = React.createClass({
  render() {
    return (
      <div style={Styles.Board}>
        {this._renderCells()}
      </div>
    );
  },

  _renderCells() {
    var gameOver = isGameOver(board);

    return this.props.board.data.map(cell => {
      var {x, y} = cell;
      var top = x * CELL_SIZE;
      var left = y * CELL_SIZE;
      var location = new Location({x, y});

      return (
        <div style={{top, left, position: 'absolute'}}>
          <Cell
            key={`${x}-${y}`}
            cell={cell}
            bombCount={getNeighborBombCount(this.props.board, x, y)}
            isPressed={pressed.contains(location)}
            isGameOver={gameOver}
            onSelect={() => { Actions.CLICK_CELL(x, y, cell); }}
            onPress={() => { Actions.PRESS_CELL(x, y, cell); }}
            onUnpress={() => { Actions.UNPRESS_CELL(x, y, cell); }}
            onMark={() => { Actions.MARK_CELL(x, y, cell); }}
            onExpose={() => { Actions.CLEAR_CELL(x, y, cell); }}
          />
        </div>
      )
    });
  },
});

var Styles = {
  Board: {
    borderStyle: 'solid',
    borderWidth: 5,
    position: 'relative',
    width: CELL_SIZE * WIDTH,
    height: CELL_SIZE * HEIGHT,
    webkitTouchCallout: 'none',
    webkitUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  SegmentDisplay: {
    backgroundColor: 'black',
    borderRadius: 2,
    padding: 2,
  },
};

function flaggedCount(board) {
  return board.data.reduce((count, cell) => {
    return count + isFlagged(cell);
  }, 0)
}

function isFlagged(x) {
  return x.state === CellState.FLAGGED
}

function render() {
  React.render(
    <div>
      <div style={Styles.DisplayContainer}>
      <SegmentDisplay
         value={NUM_BOMBS - flaggedCount(board)}
         bevelWidth={0}
         widht={20}
         height={40}
         opacity={0.4}
         style={Styles.SegmentDisplay}
         pad={3}
       />
      </div>
      <Board board={board} />
    </div>,
    document.body
  );
}

render();

