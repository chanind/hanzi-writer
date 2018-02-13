function UserStroke(startingPoint) {
  this.points = [startingPoint];
}

UserStroke.prototype.appendPoint = function(point) {
  this.points.push(point);
};

module.exports = UserStroke;
