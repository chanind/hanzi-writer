// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'drawPath'.
const { drawPath } = require('./canvasUtils');

module.exports = function(ctx: any, props: any) {
  if (props.opacity < 0.05) return;
  const {r, g, b, a} = props.strokeColor;

  ctx.save();
  ctx.globalAlpha = props.opacity;
  ctx.lineWidth = props.strokeWidth;
  ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  drawPath(ctx, props.points);
  ctx.restore();
};
