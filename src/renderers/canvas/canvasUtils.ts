import { getPathCommandParams, getPathCommands } from '../../utils';
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
  const commands = [(ctx: CanvasRenderingContext2D) => ctx.beginPath()];
  for (const command of getPathCommands(pathString)) {
    const { cmd, values } = getPathCommandParams(command);
    if (cmd === 'M') {
      commands.push((ctx) => ctx.moveTo(...(values as [number, number])));
    } else if (cmd === 'L') {
      commands.push((ctx) => ctx.lineTo(...(values as [number, number])));
    } else if (cmd === 'C') {
      commands.push((ctx) =>
        ctx.bezierCurveTo(...(values as Parameters<typeof ctx.bezierCurveTo>)),
      );
    } else if (cmd === 'Q') {
      commands.push((ctx) =>
        ctx.quadraticCurveTo(...(values as Parameters<typeof ctx.quadraticCurveTo>)),
      );
    } else if (cmd === 'Z') {
      // commands.push((ctx) => ctx.closePath());
    }
  }
  return (ctx: CanvasRenderingContext2D) => commands.forEach((cmd) => cmd(ctx));
};
