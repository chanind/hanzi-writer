// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'subtract'.
const { subtract, distance, length } = require('../geometry');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Stroke'.
function Stroke(path: any, points: any, strokeNum: any, isInRadical = false) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.path = path;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.points = points;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.strokeNum = strokeNum;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.isInRadical = isInRadical;
}

Stroke.prototype.getStartingPoint = function() {
  return this.points[0];
};

Stroke.prototype.getEndingPoint = function() {
  return this.points[this.points.length - 1];
};

Stroke.prototype.getLength = function() {
  // @ts-expect-error ts-migrate(2349) FIXME: Type 'Number' has no call signatures.
  return length(this.points);
};

Stroke.prototype.getVectors = function() {
  let lastPoint = this.points[0];
  const pointsSansFirst = this.points.slice(1);
  return pointsSansFirst.map((point: any) => {
    const vector = subtract(point, lastPoint);
    lastPoint = point;
    return vector;
  });
};

Stroke.prototype.getDistance = function(point: any) {
  const distances = this.points.map((strokePoint: any) => distance(strokePoint, point));
  return Math.min.apply(Math, distances);
};

Stroke.prototype.getAverageDistance = function(points: any) {
  const totalDist = points.reduce((acc: any, point: any) => acc + this.getDistance(point), 0);
  return totalDist / points.length;
};

module.exports = Stroke;
