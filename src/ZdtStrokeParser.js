import Point from './models/Point';
import Stroke from './models/Stroke';
import StrokePart from './models/StrokePart';
import Character from './models/Character';

class ZdtStrokeParser {
  generateCharacter(symbol, zdtPathStrings) {
    const strokes = this.generateStrokes(zdtPathStrings);
    return new Character(symbol, strokes);
  }

  generateStrokes(zdtPathStrings) {
    const strokes = [];
    let strokeParts = [];
    for (const zdtPathString of zdtPathStrings) {
      const { points, isComplete, strokeType } = this.extractStrokeData(zdtPathString);
      const strokePart = new StrokePart(strokeType, points);
      strokeParts.push(strokePart);
      if (isComplete) {
        strokes.push(new Stroke(strokeParts));
        strokeParts = [];
      }
    }
    return strokes;
  }

  extractStrokeData(zdtPathString) {
    const [metadataString, rawPathString] = zdtPathString.split(':');
    const pathString = rawPathString.replace(/;?\s*$/, '');
    const points = pathString.split(';').map((pointString) => {
      return this.parsePoint(pointString);
    });
    const isComplete = metadataString[2] === 'P';
    const strokeType = parseInt(metadataString[1], 10);
    return { points, isComplete, strokeType };
  }

  parsePoint(pointString) {
    const [x, y] = pointString.split(',');
    return new Point(x, y);
  }
}

export default ZdtStrokeParser;
