import { Point } from './typings/types';

// All makemeahanzi characters have the same bounding box
const BOUNDING_BOX = 1024;

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

    this.scale = Math.min(effectiveWidth / BOUNDING_BOX, effectiveHeight / BOUNDING_BOX);

    this.xOffset = padding + (effectiveWidth - this.scale * BOUNDING_BOX) / 2;
    this.yOffset = padding + (effectiveHeight - this.scale * BOUNDING_BOX) / 2;
  }

  convertExternalPoint(point: Point) {
    const x = (point.x - this.xOffset) / this.scale;
    const y = (point.y - this.yOffset) / this.scale;
    return { x, y };
  }
}
