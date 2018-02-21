const Point = require('./models/Point');

// return a new point, p3, which is on the same line as p1 and p2, but distance away
// from p2. p1, p2, p3 will always lie on the line in that order
const extendPointOnLine = (p1, p2, distance) => {
  const vect = p2.subtract(p1);
  const norm = distance / vect.getMagnitude();
  return new Point(p2.x + norm * vect.x, p2.y + norm * vect.y);
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
};
