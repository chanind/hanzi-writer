function Character(symbol, strokes) {
  this.symbol = symbol;
  this.strokes = strokes;
}

Character.prototype.getBounds = function() {
  return [{x: 0, y: -124}, {x: 1024, y: 900}];
};

module.exports = Character;
