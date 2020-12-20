import Stroke from '../models/Stroke';
import { ColorObject } from '../typings/types';

export default class StrokeRendererBase {
  _pathLength: number;
  stroke: Stroke;
  static STROKE_WIDTH = 200;

  constructor(stroke: Stroke) {
    this.stroke = stroke;
    this._pathLength = stroke.getLength() + StrokeRendererBase.STROKE_WIDTH / 2;
  }

  _getStrokeDashoffset(displayPortion: number) {
    return this._pathLength * 0.999 * (1 - displayPortion);
  }

  _getColor({
    strokeColor,
    radicalColor,
  }: {
    strokeColor: ColorObject;
    radicalColor?: ColorObject | null;
  }) {
    return radicalColor && this.stroke.isInRadical ? radicalColor : strokeColor;
  }
}
