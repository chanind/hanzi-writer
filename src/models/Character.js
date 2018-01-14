const Point = require('./Point');

function Character(symbol, strokes) {
  this.symbol = symbol;
  this.strokes = strokes;
}

Character.prototype.getStroke = function(strokeNum) {
  return this.strokes[strokeNum];
};

Character.prototype.getNumStrokes = function() {
  return this.strokes.length;
};

Character.prototype.getBounds = function() {
  return Point.getBounds([new Point(0, 900), new Point(1024, -124)]);
};

module.exports = Character;
