import Point from './Point';

class Character {
  constructor(symbol, strokes) {
    this._symbol = symbol;
    this._strokes = strokes;
  }

  getSymbol() {
    return this._symbol;
  }

  getStrokes() {
    return this._strokes;
  }

  getStroke(strokeNum) {
    return this._strokes[strokeNum];
  }

  getNumStrokes() {
    return this._strokes.length;
  }

  getBounds() {
    return Point.getBounds([new Point(0, 900), new Point(1024, -124)]);
  }
}

export default Character;
