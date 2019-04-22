const Stroke = require('./models/Stroke');
const Character = require('./models/Character');

const generateStrokes = function(charJson) {
  const isInRadical = strokeNum => charJson.radStrokes && charJson.radStrokes.indexOf(strokeNum) >= 0;

  return charJson.strokes.map((path, index) => {
    const points = charJson.medians[index].map((pointData) => {
      const [x, y] = pointData;
      return {x, y};
    });
    return new Stroke(path, points, index, isInRadical(index));
  });
};

const parseCharData = function(symbol, charJson) {
  const strokes = generateStrokes(charJson);
  return new Character(symbol, strokes);
};

module.exports = parseCharData;
