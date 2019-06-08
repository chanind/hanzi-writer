const { extendStart } = require('../../geometry');
const { drawPath, pathStringToCanvas } = require('./canvasUtils');
const StrokeRendererBase = require('../StrokeRendererBase');

const STROKE_WIDTH = 200;

// this is a stroke composed of several stroke parts
function StrokeRenderer(stroke, usePath2D = true) {
  this._stroke = stroke;
  this._pathLength = stroke.getLength() + (STROKE_WIDTH / 2);
  if (usePath2D && global.Path2D) {
    this._path2D = new global.Path2D(this._stroke.path);
  } else {
    this._pathCmd = pathStringToCanvas(this._stroke.path);
  }
  this._extendedMaskPoints = extendStart(this._stroke.points, STROKE_WIDTH / 2);
}
StrokeRenderer.prototype = Object.create(StrokeRendererBase.prototype);

StrokeRenderer.prototype.render = function(ctx, props) {
  if (props.opacity < 0.05) return;

  ctx.save();
  if (this._path2D) {
    ctx.clip(this._path2D);
  } else {
    this._pathCmd(ctx);
    // wechat bugs out if the clip path isn't stroked or filled
    ctx.globalAlpha = 0;
    ctx.stroke();
    ctx.clip();
  }

  const { r, g, b, a } = this._getColor(props);
  const color = a === 1 ? `rgb(${r},${g},${b})` : `rgb(${r},${g},${b},${a})`;
  const dashOffset = this._getStrokeDashoffset(props.displayPortion);
  ctx.globalAlpha = props.opacity;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = STROKE_WIDTH;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // wechat sets dashOffset as a second param here. Should be harmless for browsers to add here too
  ctx.setLineDash([this._pathLength, this._pathLength], dashOffset);
  ctx.lineDashOffset = dashOffset;
  drawPath(ctx, this._extendedMaskPoints);

  ctx.restore();
};

module.exports = StrokeRenderer;
