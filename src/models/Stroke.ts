const { subtract, distance, length } = require('../geometry');

function Stroke(path, points, strokeNum, isInRadical = false) {
  this.path = path;
  this.points = points;
  this.strokeNum = strokeNum;
  this.isInRadical = isInRadical;
}

Stroke.prototype.getStartingPoint = function() {
  return this.points[0];
};

Stroke.prototype.getEndingPoint = function() {
  return this.points[this.points.length - 1];
};

Stroke.prototype.getLength = function() {
  return length(this.points);
};

Stroke.prototype.getVectors = function() {
  let lastPoint = this.points[0];
  const pointsSansFirst = this.points.slice(1);
  return pointsSansFirst.map((point) => {
    const vector = subtract(point, lastPoint);
    lastPoint = point;
    return vector;
  });
};

Stroke.prototype.getDistance = function(point) {
  const distances = this.points.map(strokePoint => distance(strokePoint, point));
  return Math.min.apply(Math, distances);
};

Stroke.prototype.getAverageDistance = function(points) {
  const totalDist = points.reduce((acc, point) => acc + this.getDistance(point), 0);
  return totalDist / points.length;
};

module.exports = Stroke;
