import { Point } from '../../typings/types';

export const drawPath = (ctx: CanvasRenderingContext2D, points: Point[]) => {
  ctx.beginPath();
  const start = points[0];
  const remainingPoints = points.slice(1);
  ctx.moveTo(start.x, start.y);
  for (const point of remainingPoints) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
};

/**
 * Break a path string into a series of canvas path commands
 *
 * Note: only works with the subset of SVG paths used by MakeMeAHanzi data
 * @param pathString
 */
export const pathStringToCanvas = (pathString: string) => {
  const pathParts = pathString.split(/(^|\s+)(?=[A-Z])/).filter((part) => part !== ' ');
  const commands = [(ctx: CanvasRenderingContext2D) => ctx.beginPath()];
  for (const part of pathParts) {
    const [cmd, ...rawParams] = part.split(/\s+/);
    const params = rawParams.map((param) => parseFloat(param)) as any[];
    if (cmd === 'M') {
      commands.push((ctx) => ctx.moveTo(...(params as [number, number])));
    } else if (cmd === 'L') {
      commands.push((ctx) => ctx.lineTo(...(params as [number, number])));
    } else if (cmd === 'C') {
      commands.push((ctx) =>
        ctx.bezierCurveTo(...(params as Parameters<typeof ctx.bezierCurveTo>)),
      );
    } else if (cmd === 'Q') {
      commands.push((ctx) =>
        ctx.quadraticCurveTo(...(params as Parameters<typeof ctx.quadraticCurveTo>)),
      );
    } else if (cmd === 'Z') {
      // commands.push((ctx) => ctx.closePath());
    }
  }
  return (ctx: CanvasRenderingContext2D) => commands.forEach((cmd) => cmd(ctx));
};
