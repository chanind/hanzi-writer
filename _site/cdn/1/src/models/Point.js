import { arrayMin, arrayMax } from '../utils';

class Point {
  constructor(x, y) {
    this._x = parseInt(x, 10);
    this._y = parseInt(y, 10);
  }

  getX() {
    return this._x;
  }

  getY() {
    return this._y;
  }

  // return a new point subtracting point from this
  subtract(point) {
    return new Point(this.getX() - point.getX(), this.getY() - point.getY());
  }

  getMagnitude() {
    return Math.sqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2));
  }

  equals(point) {
    if (!point) return false;
    return point.getX() === this.getX() && point.getY() === this.getY();
  }
}

Point.getBounds = (points) => {
  const xs = points.map((point) => point.getX());
  const ys = points.map((point) => point.getY());
  const maxX = arrayMax(xs);
  const maxY = arrayMax(ys);
  const minX = arrayMin(xs);
  const minY = arrayMin(ys);
  return [new Point(minX, minY), new Point(maxX, maxY)];
};

// boundable here refers to any object with a getBounds() method
Point.getOverallBounds = (boundables) => {
  const bounds = [];
  for (const boundable of boundables) {
    const [lowerBound, upperBound] = boundable.getBounds();
    bounds.push(lowerBound);
    bounds.push(upperBound);
  }
  return Point.getBounds(bounds);
};

Point.getDistance = (point1, point2) => {
  const difference = point1.subtract(point2);
  return difference.getMagnitude();
};

Point.cosineSimilarity = (point1, point2) => {
  const rawDotProduct = point1.getX() * point2.getX() + point1.getY() * point2.getY();
  return rawDotProduct / point1.getMagnitude() / point2.getMagnitude();
};

export default Point;
