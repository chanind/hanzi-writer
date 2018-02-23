const Point = require('./Point');

function Character(symbol, strokes) {
  this.symbol = symbol;
  this.strokes = strokes;
}

Character.prototype.getBounds = function() {
  return [new Point(0, -124), new Point(1024, 900)];
};

module.exports = Character;
