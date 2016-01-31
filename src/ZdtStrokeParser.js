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
    let strokeNum = 0;
    for (const zdtPathString of zdtPathStrings) {
      const { points, isComplete, strokeType } = this._extractStrokeData(zdtPathString);
      const strokePart = new StrokePart(strokeType, points);
      strokeParts.push(strokePart);
      if (isComplete) {
        strokes.push(new Stroke(strokeParts, strokeNum));
        strokeNum += 1;
        strokeParts = [];
      }
    }
    // for some single-stroke chars such as '乙' it appears the ZDT data lacks 'P' at the end of the stroke
    if (strokeParts.length > 0) {
      strokes.push(new Stroke(strokeParts, strokeNum));
    }
    return strokes;
  }

  _extractStrokeData(zdtPathString) {
    const [metadataString, rawPathString] = zdtPathString.split(':');
    const pathString = rawPathString.replace(/;?\s*$/, '');
    const points = pathString.split(';').map((pointString) => {
      return this._parsePoint(pointString);
    });
    const isComplete = metadataString[2] === 'P';
    const strokeType = parseInt(metadataString[1], 10);
    return { points, isComplete, strokeType };
  }

  _parsePoint(pointString) {
    const [x, y] = pointString.split(',');
    return new Point(x, y);
  }
}

export default ZdtStrokeParser;
