const { arrayMin, arrayMax } = require('../utils');

function Point(x, y) {
  this.x = parseFloat(x, 10);
  this.y = parseFloat(y, 10);
}

// return a new point subtracting point from this
Point.prototype.subtract = function(point) {
  return new Point(this.x - point.x, this.y - point.y);
};

// return a new point adding point from this
Point.prototype.add = function(point) {
  return new Point(this.x + point.x, this.y + point.y);
};

Point.prototype.getMagnitude = function() {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

Point.prototype.equals = function(point) {
  if (!point) return false;
  return point.x === this.x && point.y === this.y;
};

Point.getBounds = (points) => {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const maxX = arrayMax(xs);
  const maxY = arrayMax(ys);
  const minX = arrayMin(xs);
  const minY = arrayMin(ys);
  return [new Point(minX, minY), new Point(maxX, maxY)];
};

// boundable here refers to any object with a getBounds() method
Point.getOverallBounds = (boundables) => {
  const bounds = [];
  boundables.forEach(boundable => {
    const [lowerBound, upperBound] = boundable.getBounds();
    bounds.push(lowerBound);
    bounds.push(upperBound);
  });
  return Point.getBounds(bounds);
};

Point.getDistance = (point1, point2) => {
  const difference = point1.subtract(point2);
  return difference.getMagnitude();
};

Point.cosineSimilarity = (point1, point2) => {
  const rawDotProduct = point1.x * point2.x + point1.y * point2.y;
  return rawDotProduct / point1.getMagnitude() / point2.getMagnitude();
};

module.exports = Point;
