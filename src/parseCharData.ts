// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Stroke'.
const Stroke = require('./models/Stroke');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Character'... Remove this comment to see the full error message
const Character = require('./models/Character');

const generateStrokes = function(charJson: any) {
  const isInRadical = (strokeNum: any) => charJson.radStrokes && charJson.radStrokes.indexOf(strokeNum) >= 0;

  return charJson.strokes.map((path: any, index: any) => {
    const points = charJson.medians[index].map((pointData: any) => {
      const [x, y] = pointData;
      return {x, y};
    });
    return new Stroke(path, points, index, isInRadical(index));
  });
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseCharD... Remove this comment to see the full error message
const parseCharData = function(symbol: any, charJson: any) {
  const strokes = generateStrokes(charJson);
  return new Character(symbol, strokes);
};

module.exports = parseCharData;
