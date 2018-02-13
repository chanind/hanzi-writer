function UserStroke(id, startingPoint) {
  this.id = id;
  this.points = [startingPoint];
}

UserStroke.prototype.appendPoint = function(point) {
  this.points.push(point);
};

module.exports = UserStroke;
