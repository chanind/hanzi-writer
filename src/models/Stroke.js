import Point from './Point';

class Stroke {
  constructor(strokeParts, strokeNum) {
    this._strokeParts = strokeParts;
    this._strokeNum = strokeNum;
  }

  getStrokeParts() {
    return this._strokeParts;
  }

  getNumStrokeParts() {
    return this._strokeParts.length;
  }

  getStrokeNum() {
    return this._strokeNum;
  }

  getBounds() {
    return Point.getOverallBounds(this._strokeParts);
  }

  getLength() {
    return this._strokeParts.reduce((acc, part) => acc + part.getLength(), 0);
  }

  getVectors() {
    return this._strokeParts.map(strokePart => strokePart.getVector());
  }

  getStartingPoint() {
    return this._strokeParts[0].getStartingPoint();
  }

  getEndingPoint() {
    return this._strokeParts[this._strokeParts.length - 1].getEndingPoint();
  }

  getDistance(point) {
    const distances = this._strokeParts.map((strokePart) => {
      return strokePart.getDistance(point);
    });
    return Math.min.apply(Math, distances);
  }

  getAverageDistance(points) {
    let totalDist = 0;
    for (const point of points) {
      totalDist += this.getDistance(point);
    }
    return totalDist / points.length;
  }
}

export default Stroke;
