const { drawPath } = require('./canvasUtils');

module.exports = function(ctx, props) {
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
