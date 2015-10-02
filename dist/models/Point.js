import { arrayMin, arrayMax } from '../utils';

class Point {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  getX() {
    return this._x;
  }

  getY() {
    return this._y;
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

export default Point;
