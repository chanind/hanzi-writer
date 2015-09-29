import Drawable from './Drawable';

class CharacterPositioner extends Drawable {

  constructor(character, options = {}) {
    super();
    this.character = character;
    this.options = options;
  }

  getBounds() {
    return this.character.getBounds();
  }

  convertExternalPoints(points) {
    for (const point of points) {
      this.convertExternalPoint(point);
    }
  }

  convertExternalPoint(point) {
    return {
      x: (point.x - this.xOffset) / this.scale,
      y: (point.y - this.yOffset) / this.scale,
    };
  }

  getNestedCanvas() {
    this.calculateScaleAndOffset();
    return this.canvas
      .group()
      .move(this.xOffset, this.yOffset)
      .transform({scaleX: this.scale, scaleY: this.scale});
  }

  calculateScaleAndOffset() {
    const bounds = this.getBounds();
    const preScaledWidth = bounds[1].x - bounds[0].x;
    const preScaledHeight = bounds[1].y - bounds[0].y;
    const effectiveWidth = this.options.width - 2 * this.options.padding;
    const effectiveHeight = this.options.height - 2 * this.options.padding;
    const scaleX = effectiveWidth / preScaledWidth;
    const scaleY = effectiveHeight / preScaledHeight;

    this.scale = Math.min(scaleX, scaleY);

    const xCenteringBuffer = this.options.padding + (effectiveWidth - this.scale * preScaledWidth) / 2;
    const yCenteringBuffer = this.options.padding + (effectiveHeight - this.scale * preScaledHeight) / 2;
    this.xOffset = -1 * bounds[0].x * this.scale + xCenteringBuffer;
    this.yOffset = -1 * bounds[0].y * this.scale + yCenteringBuffer;
  }

  draw() {
    this.character.draw();
  }

  animate(svg, onComplete = () => {}) {
    this.character.animate(onComplete);
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    this.character.setCanvas(this.getNestedCanvas());
  }
}

export default CharacterPositioner;
