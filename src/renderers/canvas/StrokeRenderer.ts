import { extendStart } from '../../geometry';
import { drawPath, pathStringToCanvas } from './canvasUtils';
import StrokeRendererBase from '../StrokeRendererBase';
import Stroke from '../../models/Stroke';
import { ColorObject, Point } from '../../typings/types';

/** this is a stroke composed of several stroke parts */
export default class StrokeRenderer extends StrokeRendererBase {
  _extendedMaskPoints: Point[];

  // Conditionally set on constructor
  _path2D: Path2D | undefined;
  _pathCmd: ((ctx: CanvasRenderingContext2D) => void) | undefined;

  constructor(stroke: Stroke, usePath2D = true) {
    super(stroke);

    if (usePath2D && Path2D) {
      this._path2D = new Path2D(this.stroke.path);
    } else {
      this._pathCmd = pathStringToCanvas(this.stroke.path);
    }
    this._extendedMaskPoints = extendStart(
      this.stroke.points,
      StrokeRendererBase.STROKE_WIDTH / 2,
    );
  }

  render(
    ctx: CanvasRenderingContext2D,
    props: {
      opacity: number;
      strokeColor: ColorObject;
      radicalColor?: ColorObject | null;
      displayPortion: number;
    },
  ) {
    if (props.opacity < 0.05) {
      return;
    }
    ctx.save();

    if (this._path2D) {
      ctx.clip(this._path2D);
    } else {
      this._pathCmd?.(ctx);
      // wechat bugs out if the clip path isn't stroked or filled
      ctx.globalAlpha = 0;
      ctx.stroke();
      ctx.clip();
    }

    const { r, g, b, a } = this._getColor(props);
    const color = a === 1 ? `rgb(${r},${g},${b})` : `rgb(${r},${g},${b},${a})`;
    const dashOffset = this._getStrokeDashoffset(props.displayPortion);
    ctx.globalAlpha = props.opacity;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = StrokeRendererBase.STROKE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // wechat sets dashOffset as a second param here. Should be harmless for browsers to add here too
    // @ts-ignore
    ctx.setLineDash([this._pathLength, this._pathLength], dashOffset);
    ctx.lineDashOffset = dashOffset;
    drawPath(ctx, this._extendedMaskPoints);

    ctx.restore();
  }
}
