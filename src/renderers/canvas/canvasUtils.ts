// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'drawPath'.
const drawPath = (ctx: any, points: any) => {
  ctx.beginPath();
  const start = points[0];
  const remainingPoints = points.slice(1);
  ctx.moveTo(start.x, start.y);
  remainingPoints.forEach((point: any) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
};

// break a path string into a series of canvas path commands
// only works with the subset of SVG paths used by MakeMeAHanzi data
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'pathString... Remove this comment to see the full error message
const pathStringToCanvas = (pathString: any) => {
  const pathParts = pathString.split(/(^|\s+)(?=[A-Z])/).filter((part: any) => part !== ' ');
  const commands = [(ctx: any) => ctx.beginPath()];
  pathParts.forEach((part: any) => {
    const [cmd, ...rawParams] = part.split(/\s+/);
    const params = rawParams.map((param: any) => parseFloat(param));
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
  return (ctx: any) => commands.forEach(cmd => cmd(ctx));
};

module.exports = { drawPath, pathStringToCanvas };
