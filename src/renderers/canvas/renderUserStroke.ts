import { ColorObject, Point } from '../../typings/types';
import { drawPath } from './canvasUtils';

export default function renderUserStroke(
  ctx: CanvasRenderingContext2D,
  props: {
    opacity: number;
    strokeWidth: number;
    strokeColor: ColorObject;
    points: Point[];
  },
) {
  if (props.opacity < 0.05) {
    return;
  }
  const { opacity, strokeWidth, strokeColor, points } = props;
  const { r, g, b, a } = strokeColor;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  drawPath(ctx, points);
  ctx.restore();
}
