const Point = require('./models/Point');
const Stroke = require('./models/Stroke');
const Character = require('./models/Character');

function CharDataParser() {}

CharDataParser.prototype.generateCharacter = function(symbol, charJson) {
  const strokes = this.generateStrokes(charJson);
  return new Character(symbol, strokes);
};

CharDataParser.prototype.generateStrokes = function(charJson) {
  const isInRadical = strokeNum => charJson.radStrokes && charJson.radStrokes.indexOf(strokeNum) >= 0;

  return charJson.strokes.map((path, index) => {
    const points = charJson.medians[index].map((pointData) => {
      const [x, y] = pointData;
      return new Point(x, y);
    });
    return new Stroke(path, points, index, isInRadical(index));
  });
};

module.exports = CharDataParser;
