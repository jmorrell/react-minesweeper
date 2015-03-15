
var React = require('react');

function styles(...args) {
  return args
    .filter(x => x)
    .reduce((a, b) => {
      return { ...a, ...b };
    }, {});
}

var base = {height: 8, width: 17, color: 'red'};

var DigitMiddleBar = React.createClass({
  render() {
    return (
      <div style={this.props.style}>
        <div style={styles(Styles.DigitMiddleBarBefore)}/>
        <div style={styles(Styles.DigitMiddleBarCenter)}/>
        <div style={styles(Styles.DigitMiddleBarAfter)}/>
      </div>
    );
  }
});

var Digit = React.createClass({
  render() {
    var base = {height: 8, width: 17, color: 'red'};
    var trapezoidStyles = {
      top: generateTrapezoidStyles({orientation: 'top', ...base}),
      bottom: generateTrapezoidStyles({orientation: 'bottom', ...base}),
      left: generateTrapezoidStyles({orientation: 'left', ...base}),
      right: generateTrapezoidStyles({orientation: 'right', ...base}),
    };

    return (
      <div style={Styles.Digit}>
        <div style={styles(trapezoidStyles.top, {})}/>
        <div style={styles(trapezoidStyles.left, {top: 2})}/>
        <div style={styles(trapezoidStyles.right, {
          top: 2,
          left: base.width + base.height
        })}/>
        <div style={styles(trapezoidStyles.left, {
          top: base.width * 2 + 2,
        })}/>
        <div style={styles(trapezoidStyles.right, {
          top: base.width * 2 + 2,
          left: base.width + base.height
        })}/>
        <DigitMiddleBar style={{
          position: 'absolute',
          top: 32,
          left: 1
        }} />
        <div style={styles(trapezoidStyles.bottom, {
          top: base.width * 4 - 5,
        })}/>
      </div>
    );
  }
});

function generateTrapezoidStyles({
  orientation,
  width,
  height,
  color,
}) {
  var isVertical = orientation === 'left' || orientation === 'right';
  var [first, second, third] = {
    bottom: ['Bottom', 'Left', 'Right'],
    top: ['Top', 'Left', 'Right'],
    right: ['Right', 'Top', 'Bottom'],
    left: ['Left', 'Top', 'Bottom'],
  }[orientation];

  return {
    position: 'absolute',
    height: isVertical ? width : 0,
    width: isVertical ? 0 : width,
    [`border${first}Width`]: height,
    [`border${first}Style`]: 'solid',
    [`border${first}Color`]: color,
    [`border${second}Width`]: height,
    [`border${second}Style`]: 'solid',
    [`border${second}Color`]: 'transparent',
    [`border${third}Width`]: height,
    [`border${third}Style`]: 'solid',
    [`border${third}Color`]: 'transparent',
  };
}

function generateMiddleHexagonStyles({
  width,
  height,
  color,
}) {
  return {
    position: 'absolute',
    height,
    width,
    backgroundColor: color,
  };
}

var Styles = {
  Digit: {
    position: 'relative',
  },
  DigitMiddleBarBefore: {
    float: 'left',
    borderRightWidth: 8,
    borderRightStyle: 'solid',
    borderRightColor: base.color,
    borderTopWidth: base.height / 2,
    borderTopStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomWidth: base.height / 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
  },
  DigitMiddleBarCenter: {
    float: 'left',
    width: base.width - 2,
    height: base.height,
    backgroundColor: base.color,
  },
  DigitMiddleBarAfter: {
    float: 'left',
    borderLeftWidth: 8,
    borderLeftStyle: 'solid',
    borderLeftColor: base.color,
    borderTopWidth: base.height / 2,
    borderTopStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomWidth: base.height / 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
  },
};

module.exports = Digit;
