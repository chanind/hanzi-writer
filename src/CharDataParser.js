import Point from './models/Point';
import Stroke from './models/Stroke';
import Character from './models/Character';

class CharDataParser {
  generateCharacter(symbol, charJson) {
    const strokes = this.generateStrokes(charJson);
    return new Character(symbol, strokes);
  }

  generateStrokes(charJson) {
    return charJson.strokes.map((path, index) => {
      const points = charJson.medians[index].map((pointData) => {
        const [x, y] = pointData;
        return new Point(x, y);
      });
      return new Stroke(path, points, index);
    });
  }
}

export default CharDataParser;
