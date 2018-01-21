const Point = require('./models/Point');

// return a new point, p3, which is on the same line as p1 and p2, but distance away
// from p2. p1, p2, p3 will always lie on the line in that order
const extendPointOnLine = (p1, p2, distance) => {
  const vect = p2.subtract(p1);
  const norm = distance / vect.getMagnitude();
  return new Point(p2.x + norm * vect.x, p2.y + norm * vect.y);
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
};

const getLineSegmentsPortion = (points, portion) => {
  if (points.length < 2 || portion >= 1) return points;
  if (portion === 0) return [points[0]];
  let totalDist = 0;
  for (let i = 1; i < points.length; i += 1) {
    totalDist += Point.getDistance(points[i], points[i - 1]);
  }
  const portionedPoints = [points[0]];
  const portionedDist = totalDist * portion;
  let cumuativeDist = 0;
  for (let i = 1; i < points.length; i += 1) {
    const lastPoint = points[i - 1];
    const segmentLength = Point.getDistance(points[i], lastPoint);
    if (cumuativeDist + segmentLength >= portionedDist) {
      const vect = points[i].subtract(lastPoint);
      const norm = (portionedDist - cumuativeDist) / segmentLength;
      portionedPoints.push(new Point(lastPoint.x + norm * vect.x, lastPoint.y + norm * vect.y));
      return portionedPoints;
    }
    cumuativeDist += segmentLength;
    portionedPoints.push(points[i]);
  }
  return portionedPoints;
};

// remove intermediate points that are on the same line as the points to either side
const filterParallelPoints = (points) => {
  if (points.length < 3) return points;
  const filteredPoints = [points[0], points[1]];
  points.slice(2).forEach((point, i) => {
    const numFilteredPoints = filteredPoints.length;
    const curVect = point.subtract(filteredPoints[numFilteredPoints - 1]);
    const prevVect = filteredPoints[numFilteredPoints - 1].subtract(filteredPoints[numFilteredPoints - 2]);
    // this is the z coord of the cross-product. If this is 0 then they're parallel
    const isParallel = ((curVect.y * prevVect.x - curVect.x * prevVect.y) === 0);
    if (isParallel) {
      filteredPoints.pop();
    }
    filteredPoints.push(point);
  });
  return filteredPoints;
};


module.exports = {
  extendPointOnLine,
  filterParallelPoints,
  getLineSegmentsPortion,
  getLinesIntersectPoint,
  getPerpendicularPointsAtDist,
};
