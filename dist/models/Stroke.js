import Point from './Point';

class Stroke {
  constructor(strokeParts, strokeNum) {
    this._strokeParts = strokeParts;
    this._strokeNum = strokeNum;
  }

  getStrokeParts() {
    return this._strokeParts;
  }

  getStrokeNum() {
    return this._strokeNum;
  }

  getBounds() {
    return Point.getOverallBounds(this.getStrokeParts());
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
