const drawPath = (ctx, points) => {
  ctx.beginPath();
  const start = points[0];
  const remainingPoints = points.slice(1);
  ctx.moveTo(start.x, start.y);
  remainingPoints.forEach(point => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
};

module.exports = { drawPath };
