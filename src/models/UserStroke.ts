function UserStroke(id, startingPoint, startingExternalPoint) {
  this.id = id;
  this.points = [startingPoint];
  this.externalPoints = [startingExternalPoint];
}

UserStroke.prototype.appendPoint = function(point, externalPoint) {
  this.points.push(point);
  this.externalPoints.push(externalPoint);
};

module.exports = UserStroke;
