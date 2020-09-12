// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extendStar... Remove this comment to see the full error message
const { extendStart } = require('../../geometry');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'drawPath'.
const { drawPath, pathStringToCanvas } = require('./canvasUtils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'StrokeRend... Remove this comment to see the full error message
const StrokeRendererBase = require('../StrokeRendererBase');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'STROKE_WID... Remove this comment to see the full error message
const STROKE_WIDTH = 200;

// this is a stroke composed of several stroke parts
// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function StrokeRenderer(stroke: any, usePath2D = true) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._stroke = stroke;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._pathLength = stroke.getLength() + (STROKE_WIDTH / 2);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'Path2D' does not exist on type 'Global'.
  if (usePath2D && global.Path2D) {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    this._path2D = new global.Path2D(this._stroke.path);
  } else {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    this._pathCmd = pathStringToCanvas(this._stroke.path);
  }
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._extendedMaskPoints = extendStart(this._stroke.points, STROKE_WIDTH / 2);
}
// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
StrokeRenderer.prototype = Object.create(StrokeRendererBase.prototype);

StrokeRenderer.prototype.render = function(ctx: any, props: any) {
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
