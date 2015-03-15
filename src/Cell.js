var extend = require('extend-object');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');
var {PropTypes} = React;

var CellState = require('./CellState');

var CELL_SIZE = 20;

// http://en.wikipedia.org/wiki/Minesweeper_%28video_game%29#Trivia
var NEIGHBOR_BOMB_COUNT_COLOR_MAP = [
  'black',
  'blue',
  'green',
  'red',
  'purple',
  'maroon',
  'cyan',
  'black',
  'grey',
];

function styles() {
  var args = [].slice.call(arguments);
  args = args.filter(function(x) { return !!x; });
  args.unshift({});
  return extend.apply(null, args);
}

var EmptyCell = React.createClass({
  shouldComponentUpdate() {
    return false;
  },

  render() {
    return (
      <div style={styles(Styles.CellBase, Styles.EmptyCell)}/>
    );
  }
});

var CoveredCell = React.createClass({
  shouldComponentUpdate() {
    return false;
  },

  render() {
    if (this.props.isPressed) {
      return <EmptyCell/>;
    }

    var style = styles(
      Styles.CellBase,
      Styles.CoveredCell
    );

    return <div style={style}/>;
  }
});

var FlaggedCell = React.createClass({
  shouldComponentUpdate() {
    return false;
  },

  render() {
    var style = styles(
      Styles.CellBase,
      Styles.CoveredCell,
      Styles.ImageCell
    );

    return (
      <div style={style}>
        <img style={Styles.flag} src="img/flag.png" />
      </div>
    );
  }
});

var BombCell = React.createClass({
  shouldComponentUpdate() {
    return false;
  },

  render() {
    var style = styles(
      Styles.CellBase,
      Styles.EmptyCell,
      Styles.ImageCell
    );

    return (
      <div style={style}>
        <img style={Styles.flag} src="img/bomb.png" />
      </div>
    );
  }
});

var ExplodedCell = React.createClass({
  shouldComponentUpdate() {
    return false;
  },

  render() {
    var style = styles(
      Styles.CellBase,
      Styles.EmptyCell,
      Styles.ImageCell,
      Styles.ExplodedCell
    );

    return (
      <div style={style}>
        <img style={Styles.flag} src="img/bomb.png" />
      </div>
    );
  },
});

var ExposedCell = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    cell: PropTypes.object.isRequired
  },

  render() {
    var style = styles(
      Styles.CellBase,
      Styles.EmptyCell
    );

    if (!this.props.bombCount) {
      return <EmptyCell/>;
    }

    var color = NEIGHBOR_BOMB_COUNT_COLOR_MAP[this.props.bombCount]

    return (
      <div style={style} onClick={this.props.onExpose}>
        <span style={styles(Styles.Count, {color})}>
          {this.props.bombCount}
        </span>
      </div>
    );
  },
});

var Cell = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    cell: PropTypes.object.isRequired,
    bombCount: PropTypes.number.isRequired,
    isPressed: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onPress: PropTypes.func.isRequired,
    onUnpress: PropTypes.func.isRequired,
    onMark: PropTypes.func.isRequired,
    onExpose: PropTypes.func.isRequired,
  },

  render() {
    var cell = null;

    switch(this.props.cell.state) {
      case CellState.HIDDEN:
        if (this.props.isGameOver) {
          cell = this.props.cell.hasBomb ?
            <BombCell {...this.props} /> :
            <CoveredCell {...this.props} />;
        } else {
          cell = <CoveredCell {...this.props} />;
        }
        break;
      case CellState.EXPOSED:
        cell = <ExposedCell {...this.props} />;
        break;
      case CellState.EXPLODED:
        cell = <ExplodedCell {...this.props} />;
        break;
      case CellState.FLAGGED:
        cell = <FlaggedCell {...this.props} />;
        break;
      case CellState.QUESTION:
        cell = <QuestionCell {...this.props} />;
        break;
    }

    return (
      <div
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
        onContextMenu={this._onContextMenu}>
        {cell}
      </div>
    );
  },

  _onMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent.which === 3 || e.ctrlKey) {
      return;
    }

    this.props.onPress();
  },

  _onMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onUnpress();

    if (e.nativeEvent.which === 3 || e.ctrlKey) {
      this.props.onMark();
    } else {
      this.props.onSelect();
    }
  },

  _onMouseLeave(e) {
    this.props.onUnpress();
  },

  _onMouseEnter(e) {
    if (e.nativeEvent.which === 1) {
      this.props.onPress();
    }
  },

  _onContextMenu(e) {
    e.preventDefault();
  }
});

var Styles = {
  CellBase: {
    boxSizing: 'border-box',
    height: CELL_SIZE,
    width: CELL_SIZE,
    WebkitUserSelect: 'none',
    userSelect: 'none',
  },
  CoveredCell: {
    backgroundColor: 'rgb(192, 192, 192)',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRightColor: 'rgb(128, 128, 128)',
    borderLeftColor: 'rgb(255, 255, 255)',
    borderTopColor: 'rgb(255, 255, 255)',
    borderBottomColor: 'rgb(128, 128, 128)',
    borderCollapse: 'collapse',
  },
  EmptyCell: {
    backgroundColor: 'rgb(192, 192, 192)',
    borderStyle: 'solid',
    borderColor: 'rgb(128, 128, 128)',
    borderWidth: 1,
    borderCollapse: 'collapse',
  },
  Count: {
    height: CELL_SIZE,
    width: CELL_SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: 'red',
    border: 'none',
  },
  ImageCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ExplodedCell: {
    backgroundColor: 'red',
  },
};

module.exports = Cell;
