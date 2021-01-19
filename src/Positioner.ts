import { Point } from './typings/types';

// All makemeahanzi characters have the same bounding box
const CHARACTER_BOUNDS = [
  { x: 0, y: -124 },
  { x: 1024, y: 900 },
];
const [from, to] = CHARACTER_BOUNDS;
const preScaledWidth = to.x - from.x;
const preScaledHeight = to.y - from.y;

export type PositionerOptions = {
  /** Default: 0 */
  width: number;
  /** Default: 0 */
  height: number;
  /** Default: 20 */
  padding: number;
};

export default class Positioner {
  padding: number;
  width: number;
  height: number;
  xOffset: number;
  yOffset: number;
  scale: number;

  constructor(options: PositionerOptions) {
    const { padding, width, height } = options;
    this.padding = padding;
    this.width = width;
    this.height = height;

    const effectiveWidth = width - 2 * padding;
    const effectiveHeight = height - 2 * padding;
    const scaleX = effectiveWidth / preScaledWidth;
    const scaleY = effectiveHeight / preScaledHeight;

    this.scale = Math.min(scaleX, scaleY);

    const xCenteringBuffer = padding + (effectiveWidth - this.scale * preScaledWidth) / 2;
    const yCenteringBuffer =
      padding + (effectiveHeight - this.scale * preScaledHeight) / 2;

    this.xOffset = -1 * from.x * this.scale + xCenteringBuffer;
    this.yOffset = -1 * from.y * this.scale + yCenteringBuffer;
  }

  convertExternalPoint(point: Point) {
    const x = (point.x - this.xOffset) / this.scale;
    const y = (this.height - this.yOffset - point.y) / this.scale;
    return { x, y };
  }
}
