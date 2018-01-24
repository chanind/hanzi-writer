const Point = require('./models/Point');
const { arrayMin, arrayMax } = require('./utils');

// return a new point, p3, which is on the same line as p1 and p2, but distance away
// from p2. p1, p2, p3 will always lie on the line in that order
const extendPointOnLine = (p1, p2, distance) => {
  const vect = p2.subtract(p1);
  const norm = distance / vect.getMagnitude();
  return new Point(p2.x + norm * vect.x, p2.y + norm * vect.y);
};

const getBounds = (points) => {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const maxX = arrayMax(xs);
  const maxY = arrayMax(ys);
  const minX = arrayMin(xs);
  const minY = arrayMin(ys);
  return [new Point(minX, minY), new Point(maxX, maxY)];
};

// boundable here refers to any object with a getBounds() method
const getOverallBounds = (boundables) => {
  const bounds = [];
  boundables.forEach(boundable => {
    const [lowerBound, upperBound] = boundable.getBounds();
    bounds.push(lowerBound);
    bounds.push(upperBound);
  });
  return getBounds(bounds);
};

const getDistance = (point1, point2) => {
  const difference = point1.subtract(point2);
  return difference.getMagnitude();
};

const cosineSimilarity = (point1, point2) => {
  const rawDotProduct = point1.x * point2.x + point1.y * point2.y;
  return rawDotProduct / point1.getMagnitude() / point2.getMagnitude();
};

module.exports = {
  extendPointOnLine,
  getBounds,
  getOverallBounds,
  getDistance,
  cosineSimilarity,
};
