const { getBounds } = require('../geometry');

function UserStroke(startingPoint) {
  this.points = [startingPoint];
}

UserStroke.prototype.getBounds = function() {
  return getBounds(this.points);
};

UserStroke.prototype.appendPoint = function(point) {
  this.points.push(point);
};

module.exports = UserStroke;
