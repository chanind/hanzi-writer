const {
  extendPointOnLine,
  getLineSegmentsPortion,
  filterParallelPoints,
  linesToPolygon,
} = require('../../geometry');
const { drawPath } = require('../../dom');

const STROKE_WIDTH = 200;

// take points on a path and move their start point backwards by distance
const extendStart = (points, distance) => {
  if (points.length < 2) return points;
  const p1 = points[1];
  const p2 = points[0];
  const newStart = extendPointOnLine(p1, p2, distance);
  const extendedPoints = points.slice(1);
  extendedPoints.unshift(newStart);
  return extendedPoints;
};

// take points on a path and move their end point backwards by distance
const extendEnd = (points, distance) => {
  if (points.length < 2) return points;
  const p1 = points[points.length - 2];
  const p2 = points[points.length - 1];
  const newEnd = extendPointOnLine(p1, p2, distance);
  const extendedPoints = points.slice(0, points.length - 1);
  extendedPoints.push(newEnd);
  return extendedPoints;
};

// this is a stroke composed of several stroke parts
function StrokeRenderer(stroke) {
  this._oldProps = {};
  this._stroke = stroke;
  this._maskPathLength = stroke.getLength() + (STROKE_WIDTH / 2);
  const extendedStartPoints = extendStart(filterParallelPoints(this._stroke.points), STROKE_WIDTH / 2);
  this._extendedMaskPoints = extendEnd(extendedStartPoints, STROKE_WIDTH / 2);

  this.path2D = new global.Path2D(this._stroke.path);
}

StrokeRenderer.prototype.render = function(ctx, props) {
  ctx.save();

  const strokePointsPortion = getLineSegmentsPortion(this._extendedMaskPoints, props.displayPortion);
  const clipPathPoints = linesToPolygon(strokePointsPortion, STROKE_WIDTH);

  drawPath(ctx, clipPathPoints);
  ctx.clip();

  const color = this._getColor(props);
  ctx.globalAlpha = props.opacity;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = props.strokeWidth;
  ctx.fill(this.path2D);
  ctx.stroke(this.path2D);

  ctx.restore();
};

StrokeRenderer.prototype._getStrokeDashoffset = function(displayPortion) {
  return this._maskPathLength * 0.999 * (1 - displayPortion);
};

StrokeRenderer.prototype._getColor = function({ strokeColor, radicalColor }) {
  return radicalColor && this._stroke.isInRadical ? radicalColor : strokeColor;
};

module.exports = StrokeRenderer;
