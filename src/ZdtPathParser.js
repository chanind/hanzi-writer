import Stroke from './Stroke';
import ComboStroke from './ComboStroke';

class ZdtPathParser {
  generateStrokes(zdtPathStrings, options = {}) {
    const strokes = [];
    let comboStrokeBuffer = [];
    for (const zdtPathString of zdtPathStrings) {
      const strokeData = this.extractStrokeData(zdtPathString);
      const stroke = new Stroke(strokeData.points, strokeData.strokeType, options);
      if (strokeData.isComplete && comboStrokeBuffer.length === 0) {
        strokes.push(stroke);
      } else if (strokeData.isComplete) {
        comboStrokeBuffer.push(stroke);
        strokes.push(new ComboStroke(comboStrokeBuffer, options));
        comboStrokeBuffer = [];
      } else {
        comboStrokeBuffer.push(stroke);
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
    const pointArr = pointString.split(',');
    return {x: pointArr[0], y: pointArr[1]};
  }
}

export default ZdtPathParser;
