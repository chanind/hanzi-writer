const Point = require('./models/Point');

const getDistX = (slope, distance) => Math.sqrt(Math.pow(distance, 2) / (Math.pow(slope, 2) + 1));

// return a new point, p3, which is on the same line as p1 and p2, but distance away
// from p2. p1, p2, p3 will always lie on the line in that order
const extendPointOnLine = (p1, p2, distance) => {
  const vect = p2.subtract(p1);
  const norm = distance / vect.getMagnitude();
  return  new Point(p2.x + norm * vect.x, p2.y + norm * vect.y);
};

// return 2 points distance from targetPoint on line perpendicular to the line between
// targetPoint and refPoint
const getPerpendicularPointsAtDist = (targetPoint, refPoint, distance) => {
  const vect = targetPoint.subtract(refPoint);
  const norm = distance / vect.getMagnitude();
  // simulate taking a cross-product with the vector (0, 0, 1) to get the new perpendicular vect
  const perpVect = new Point(norm * vect.y, -1 * norm * vect.x);
  return [
    targetPoint.add(perpVect),
    targetPoint.subtract(perpVect),
  ];
};

// get the intersection point of 2 lines defined by 2 points each
// from https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
const getLinesIntersectPoint = (l1p1, l1p2, l2p1, l2p2) => {
  const x1 = l1p1.x;
  const x2 = l1p2.x;
  const x3 = l2p1.x;
  const x4 = l2p2.x;
  const y1 = l1p1.y;
  const y2 = l1p2.y;
  const y3 = l2p1.y;
  const y4 = l2p2.y;
  const xNumerator = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  const yNumerator = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  return new Point(xNumerator / denominator, yNumerator / denominator);
}

module.exports = {
  extendPointOnLine,
  getPerpendicularPointsAtDist,
  getLinesIntersectPoint,
};
