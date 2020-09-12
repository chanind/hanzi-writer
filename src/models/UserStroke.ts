// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserStroke... Remove this comment to see the full error message
function UserStroke(id: any, startingPoint: any, startingExternalPoint: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.id = id;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.points = [startingPoint];
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.externalPoints = [startingExternalPoint];
}

UserStroke.prototype.appendPoint = function(point: any, externalPoint: any) {
  this.points.push(point);
  this.externalPoints.push(externalPoint);
};

module.exports = UserStroke;
