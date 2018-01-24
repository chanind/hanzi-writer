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

module.exports = Point;
