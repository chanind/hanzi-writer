import { Point } from "./typings/types";

// All makemeahanzi characters have the same bounding box
const CHARACTER_BOUNDS = [
  { x: 0, y: -124 },
  { x: 1024, y: 900 },
];

export type PositionerOptions = {
  /** Default: 20 */
  padding: number | null;
  /** Default: 0 */
  width: number | null;
  /** Default: 0 */
  height: number | null;
};

export default class Positioner {
  padding: number;
  width: number;
  height: number;
  xOffset: number;
  yOffset: number;
  scale: number;

  constructor(options: Partial<PositionerOptions> = {}) {
    this.padding = options.padding || 0;
    this.width = options.width || 0;
    this.height = options.height || 0;

    const bounds = CHARACTER_BOUNDS;
    const preScaledWidth = bounds[1].x - bounds[0].x;
    const preScaledHeight = bounds[1].y - bounds[0].y;
    const effectiveWidth = this.width - 2 * this.padding;
    const effectiveHeight = this.height - 2 * this.padding;
    const scaleX = effectiveWidth / preScaledWidth;
    const scaleY = effectiveHeight / preScaledHeight;

    this.scale = Math.min(scaleX, scaleY);

    const xCenteringBuffer =
      this.padding + (effectiveWidth - this.scale * preScaledWidth) / 2;
    const yCenteringBuffer =
      this.padding + (effectiveHeight - this.scale * preScaledHeight) / 2;

    this.xOffset = -1 * bounds[0].x * this.scale + xCenteringBuffer;
    this.yOffset = -1 * bounds[0].y * this.scale + yCenteringBuffer;
  }

  convertExternalPoint(point: Point) {
    const x = (point.x - this.xOffset) / this.scale;
    const y = (this.height - this.yOffset - point.y) / this.scale;
    return { x, y };
  }
}
