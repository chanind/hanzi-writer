import StrokeRenderer from './renderers/StrokeRenderer';
import StrokePartRenderer from './renderers/StrokePartRenderer';

class ZdtPathParser {
  generateStrokes(zdtPathStrings, options = {}) {
    const strokes = [];
    let strokeParts = [];
    for (const zdtPathString of zdtPathStrings) {
      const strokeData = this.extractStrokeData(zdtPathString);
      const strokePart = new StrokePartRenderer(strokeData.points, strokeData.strokeType, options);
      strokeParts.push(strokePart);
      if (strokeData.isComplete) {
        strokes.push(new StrokeRenderer(strokeParts, options));
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
    const pointArr = pointString.split(',');
    return {x: pointArr[0], y: pointArr[1]};
  }
}

export default ZdtPathParser;
