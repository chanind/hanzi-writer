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
    return Point.getOverallBounds(this.getStrokeParts());
  }

  getLength() {
    return this.getStrokeParts().reduce((acc, part) => acc + part.getLength(), 0);
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
