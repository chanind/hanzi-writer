const { extendStart } = require('../../geometry');
const { drawPath } = require('./canvasUtils');

const STROKE_WIDTH = 200;

// this is a stroke composed of several stroke parts
function StrokeRenderer(stroke) {
  this._stroke = stroke;
  this._pathLength = stroke.getLength() + (STROKE_WIDTH / 2);
  this._path2D = new global.Path2D(this._stroke.path);
  this._extendedMaskPoints = extendStart(this._stroke.points, STROKE_WIDTH / 2);
}

StrokeRenderer.prototype.render = function(ctx, props) {
  if (props.opacity < 0.05) return;

  ctx.save();
  ctx.clip(this._path2D);

  const { r, g, b, a } = this._getColor(props);
  const color = `rgba(${r},${g},${b},${a})`;
  ctx.globalAlpha = props.opacity;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = STROKE_WIDTH;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash([this._pathLength, this._pathLength]);
  ctx.lineDashOffset = this._getStrokeDashoffset(props.displayPortion);
  drawPath(ctx, this._extendedMaskPoints);

  ctx.restore();
};

StrokeRenderer.prototype._getStrokeDashoffset = function(displayPortion) {
  return this._pathLength * 0.999 * (1 - displayPortion);
};

StrokeRenderer.prototype._getColor = function({ strokeColor, radicalColor }) {
  return radicalColor && this._stroke.isInRadical ? radicalColor : strokeColor;
};

module.exports = StrokeRenderer;
