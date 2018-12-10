const { drawPath } = require('../../dom');


function UserStrokeRenderer() {}

UserStrokeRenderer.prototype.render = function(ctx, props) {
  const {
    points,
    opacity,
    strokeColor,
    strokeWidth,
  } = props;

  ctx.save();

  ctx.globalAlpha = opacity;
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeColor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  drawPath(ctx, points);
  ctx.stroke();

  ctx.restore();
};

module.exports = UserStrokeRenderer;
