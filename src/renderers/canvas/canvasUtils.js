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

// break a path string into a series of canvas path commands
// only works with the subset of SVG paths used by MakeMeAHanzi data
const pathStringToCanvas = (pathString) => {
  const pathParts = pathString.split(/(^|\s+)(?=[A-Z])/).filter(part => part !== ' ');
  const commands = [(ctx) => ctx.beginPath()];
  pathParts.forEach(part => {
    const [cmd, ...rawParams] = part.split(/\s+/);
    const params = rawParams.map(param => parseFloat(param));
    if (cmd === 'M') {
      commands.push((ctx) => ctx.moveTo.apply(ctx, params));
    } else if (cmd === 'L') {
      commands.push((ctx) => ctx.lineTo.apply(ctx, params));
    } else if (cmd === 'C') {
      commands.push((ctx) => ctx.bezierCurveTo.apply(ctx, params));
    } else if (cmd === 'Q') {
      commands.push((ctx) => ctx.quadraticCurveTo.apply(ctx, params));
    } else if (cmd === 'Z') {
      // commands.push((ctx) => ctx.closePath());
    }
  });
  return (ctx) => commands.forEach(cmd => cmd(ctx));
};

module.exports = { drawPath, pathStringToCanvas };
