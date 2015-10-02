import Renderer from './Renderer';
import Point from '../models/Point';
import {emptyFunc} from '../utils';

class CharacterPositionerRenderer extends Renderer {

  constructor(characterRenderer, options = {}) {
    super();
    this.characterRenderer = characterRenderer;
    this.options = options;
  }

  convertExternalPoints(points) {
    return points.map((point) => this.convertExternalPoint(point));
  }

  convertExternalPoint(point) {
    const x = (point.getX() - this.xOffset) / this.scale;
    const y = (point.getY() - this.yOffset) / this.scale;
    return new Point(x, y);
  }

  getNestedCanvas() {
    this.calculateScaleAndOffset();
    return this.canvas
      .group()
      .move(this.xOffset, this.yOffset)
      .transform({scaleX: this.scale, scaleY: this.scale});
  }

  calculateScaleAndOffset() {
    const bounds = this.characterRenderer.getBounds();
    const preScaledWidth = bounds[1].getX() - bounds[0].getX();
    const preScaledHeight = bounds[1].getY() - bounds[0].getY();
    const effectiveWidth = this.options.width - 2 * this.options.padding;
    const effectiveHeight = this.options.height - 2 * this.options.padding;
    const scaleX = effectiveWidth / preScaledWidth;
    const scaleY = effectiveHeight / preScaledHeight;

    this.scale = Math.min(scaleX, scaleY);

    const xCenteringBuffer = this.options.padding + (effectiveWidth - this.scale * preScaledWidth) / 2;
    const yCenteringBuffer = this.options.padding + (effectiveHeight - this.scale * preScaledHeight) / 2;
    this.xOffset = -1 * bounds[0].getX() * this.scale + xCenteringBuffer;
    this.yOffset = -1 * bounds[0].getY() * this.scale + yCenteringBuffer;
  }

  draw() {
    this.characterRenderer.draw();
  }

  animate(svg, onComplete = emptyFunc) {
    this.characterRenderer.animate(onComplete);
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    this.characterRenderer.setCanvas(this.getNestedCanvas());
  }
}

export default CharacterPositionerRenderer;
