import { ColorObject, Point } from '../../typings/types';
import { drawPath } from './canvasUtils';

export type EnhancedDrawingOptions = {
  enhancedDrawing: boolean;
  minDrawingWidthRatio: number;
  maxDrawingWidthRatio: number;
  drawingSpeedSensitivity: number;
};

export default function renderUserStroke(
  ctx: CanvasRenderingContext2D,
  props: {
    opacity: number;
    strokeWidth: number;
    strokeColor: ColorObject;
    points: Point[];
    enhancedOptions?: EnhancedDrawingOptions;
  },
) {
  if (props.opacity < 0.05) {
    return;
  }

  const { opacity, strokeWidth, strokeColor, points, enhancedOptions } = props;
  const { r, g, b, a } = strokeColor;

  if (!enhancedOptions || !enhancedOptions.enhancedDrawing || points.length < 2) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawPath(ctx, points);
    ctx.restore();
    return;
  }

  const { minDrawingWidthRatio, maxDrawingWidthRatio, drawingSpeedSensitivity } = enhancedOptions;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = `rgba(${r},${g},${b},${a})`;

  const widths = calculateVariableWidths(
    points,
    strokeWidth,
    minDrawingWidthRatio,
    maxDrawingWidthRatio,
    drawingSpeedSensitivity,
  );

  const outlinePoints = generateStrokeOutline(points, widths);

  if (outlinePoints.length >= 3) {
    ctx.beginPath();
    ctx.moveTo(outlinePoints[0].x, outlinePoints[0].y);
    for (let i = 1; i < outlinePoints.length; i++) {
      ctx.lineTo(outlinePoints[i].x, outlinePoints[i].y);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function calculateVariableWidths(
  points: Point[],
  baseWidth: number,
  minRatio: number,
  maxRatio: number,
  speedSensitivity: number,
): number[] {
  if (points.length < 2) return [baseWidth];

  const distances: number[] = [];
  let totalDistance = 0;

  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    distances.push(dist);
    totalDistance += dist;
  }

  const avgDistance = totalDistance / distances.length;

  const widths: number[] = [];
  const minWidth = baseWidth * minRatio;
  const maxWidth = baseWidth * maxRatio;

  for (let i = 0; i < points.length; i++) {
    let speedFactor = 1;

    if (i < distances.length) {
      const dist = distances[i];
      const speedRatio = dist / (avgDistance || 1);
      speedFactor = 1 - (speedRatio - 1) * speedSensitivity;
      speedFactor = Math.max(0.3, Math.min(1.7, speedFactor));
    }

    const totalLength = points.length;
    let taperFactor = 1;

    if (totalLength > 5) {
      const startTaperLength = Math.min(5, Math.floor(totalLength * 0.2));
      const endTaperLength = Math.min(5, Math.floor(totalLength * 0.2));

      if (i < startTaperLength) {
        taperFactor = (i + 1) / startTaperLength;
      } else if (i >= totalLength - endTaperLength) {
        taperFactor = (totalLength - i) / endTaperLength;
      }

      taperFactor = Math.max(0.4, taperFactor);
    }

    const width = baseWidth * speedFactor * taperFactor;
    widths.push(Math.max(minWidth, Math.min(maxWidth, width)));
  }

  return widths;
}

function generateStrokeOutline(points: Point[], widths: number[]): Point[] {
  if (points.length < 2 || widths.length < 2) return [];

  const leftPoints: Point[] = [];
  const rightPoints: Point[] = [];

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const halfWidth = widths[i] / 2;

    let dirX: number, dirY: number;

    if (i === 0) {
      dirX = points[1].x - p.x;
      dirY = points[1].y - p.y;
    } else if (i === points.length - 1) {
      dirX = p.x - points[i - 1].x;
      dirY = p.y - points[i - 1].y;
    } else {
      const prevDirX = p.x - points[i - 1].x;
      const prevDirY = p.y - points[i - 1].y;
      const nextDirX = points[i + 1].x - p.x;
      const nextDirY = points[i + 1].y - p.y;

      const prevLen = Math.sqrt(prevDirX * prevDirX + prevDirY * prevDirY);
      const nextLen = Math.sqrt(nextDirX * nextDirX + nextDirY * nextDirY);

      if (prevLen > 0 && nextLen > 0) {
        dirX = (prevDirX / prevLen + nextDirX / nextLen) / 2;
        dirY = (prevDirY / prevLen + nextDirY / nextLen) / 2;
      } else {
        dirX = prevDirX || nextDirX;
        dirY = prevDirY || nextDirY;
      }
    }

    const len = Math.sqrt(dirX * dirX + dirY * dirY);
    if (len > 0) {
      dirX /= len;
      dirY /= len;
    }

    const perpX = -dirY;
    const perpY = dirX;

    leftPoints.push({
      x: p.x + perpX * halfWidth,
      y: p.y + perpY * halfWidth,
    });
    rightPoints.push({
      x: p.x - perpX * halfWidth,
      y: p.y - perpY * halfWidth,
    });
  }

  const result: Point[] = [];

  for (let i = 0; i < leftPoints.length; i++) {
    result.push(leftPoints[i]);
  }

  for (let i = rightPoints.length - 1; i >= 0; i--) {
    result.push(rightPoints[i]);
  }

  return result;
}
