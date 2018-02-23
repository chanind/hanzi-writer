const subtract = (p1, p2) => ({x: p1.x - p2.x, y: p1.y - p2.y});
const magnitude = (point) => Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
const distance = (point1, point2) => magnitude(subtract(point1, point2));
const equals = (point1, point2) => point1.x === point2.x && point1.y === point2.y;

const cosineSimilarity = (point1, point2) => {
  const rawDotProduct = point1.x * point2.x + point1.y * point2.y;
  return rawDotProduct / magnitude(point1) / magnitude(point2);
};


// return a new point, p3, which is on the same line as p1 and p2, but distance away
// from p2. p1, p2, p3 will always lie on the line in that order
const extendPointOnLine = (p1, p2, dist) => {
  const vect = subtract(p2, p1);
  const norm = dist / magnitude(vect);
  return {x: p2.x + norm * vect.x, y: p2.y + norm * vect.y};
};


// remove intermediate points that are on the same line as the points to either side
const filterParallelPoints = (points) => {
  if (points.length < 3) return points;
  const filteredPoints = [points[0], points[1]];
  points.slice(2).forEach((point, i) => {
    const numFilteredPoints = filteredPoints.length;
    const curVect = subtract(point, filteredPoints[numFilteredPoints - 1]);
    const prevVect = subtract(filteredPoints[numFilteredPoints - 1], filteredPoints[numFilteredPoints - 2]);
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
  equals,
  distance,
  subtract,
  cosineSimilarity,
  extendPointOnLine,
  filterParallelPoints,
};
