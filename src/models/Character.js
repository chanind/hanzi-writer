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

  getNumStrokes() {
    return this._strokes.length;
  }

  getBounds() {
    return Point.getOverallBounds(this.getStrokes());
  }
}

export default Character;
