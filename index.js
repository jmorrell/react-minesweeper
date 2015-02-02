
var extend = require('extend-object');
var React = require('react');

var Cell = require('./src/Cell');
var CellState = require('./src/CellState');

var generateBoard = require('./src/generateBoard');
var getNeighbors = require('./src/getNeighbors');
var playMove = require('./src/playMove');
var markCell = require('./src/markCell');
var exposeCell = require('./src/exposeCell');

var HEIGHT = 10;
var WIDTH = 10;
var NUM_BOMBS = 10;
var CELL_SIZE = 20;

var board = generateBoard(HEIGHT, WIDTH, NUM_BOMBS);

function styles() {
  var args = [].slice.call(arguments);
  args = args.filter(function(x) { return !!x; });
  args.push({});
  return extend.apply(null, args);
}

var Actions = {
  PRESS_CELL: function({i, j}) {
    if (board.isGameOver) {
      return;
    }
    board.pressedCell = [i, j];
    render();
  },
  UNPRESS_CELL: function() {
    if (board.isGameOver) {
      return;
    }
    board.pressedCell = null;
    render();
  },
  MARK_CELL: function({i, j}) {
    if (board.isGameOver) {
      return;
    }
    markCell(board, i, j);
  },
  CLICK_CELL: function({i, j}) {
    if (board.isGameOver) {
      return;
    }
    playMove(board, i, j);
    render();
  },
  EXPOSE_CELL: function({i, j}) {
    if (board.isGameOver) {
      return;
    }
    exposeCell(board, i, j);
    render();
  },
  RESTART_GAME: function() {
    board = generateBoard(HEIGHT, WIDTH, NUM_BOMBS);
    render();
  },
};

var Board = React.createClass({
  render: function() {
    var cells = [];

    this.props.board.data.forEach((row, i) => {
      row.forEach((cell, j) => {
        var isPressed = !!(
          this.props.board.pressedCell &&
          this.props.board.pressedCell[0] === i &&
          this.props.board.pressedCell[1] === j
        );

        cells.push(
          <Cell
            key={`${i}-${j}`}
            i={i}
            j={j}
            cell={cell}
            isPressed={isPressed}
            isGameOver={this.props.board.isGameOver}
            onSelect={() => { Actions.CLICK_CELL({i, j}); }}
            onPress={() => { Actions.PRESS_CELL({i, j}); }}
            onUnpress={() => { Actions.UNPRESS_CELL({i, j}); }}
            onMark={() => { Actions.MARK_CELL({i, j}); }}
            onExpose={() => { Actions.EXPOSE_CELL({i, j}); }}
          />
        );
      });
    });

    return (
      <div style={styles(Styles.Board)}>
        {cells}
      </div>
    );
  }
});


var Styles = {
  CellBase: {
    boxSizing: 'border-box',
    height: CELL_SIZE,
    width: CELL_SIZE,
    display: 'inline-block',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  CellEmpty: {
    backgroundColor: 'white',
  },
  CellHidden: {
    backgroundColor: 'gray',
  },
  CellExposed: {
    backgroundColor: 'blue',
  },
  CountContainer: {
    boxSizing: 'border-box',
    height: CELL_SIZE,
    width: CELL_SIZE,
    padding: 7,
    color: 'white',
  },
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
};

function render() {
  React.render(
    <div>
      <Board board={board} />
    </div>,
    document.body
  );
}

render();

