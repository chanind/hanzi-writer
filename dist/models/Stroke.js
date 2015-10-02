import Point from './Point';

class Stroke {
  constructor(strokeParts) {
    this._strokeParts = strokeParts;
  }

  getStrokeParts() {
    return this._strokeParts;
  }

  getBounds() {
    return Point.getOverallBounds(this.getStrokeParts());
  }

  getDistance(point) {
    const distances = this.strokeParts.map((strokePart) => {
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
