const Point = require('./Point');

function UserStroke(startingPoint) {
  this.points = [startingPoint];
}

UserStroke.prototype.getBounds = function() {
  return Point.getBounds(this.points);
};

UserStroke.prototype.appendPoint = function(point) {
  this.points.push(point);
};

module.exports = UserStroke;
