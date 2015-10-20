import Renderer from './Renderer';

class PositionerRenderer extends Renderer {

  constructor(positioner, options = {}) {
    super();
    this.positioner = positioner;
    this.positonedCanvas = null;
  }

  getPositionedCanvas() {
    return this.positonedCanvas;
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    this.positonedCanvas = this.canvas
      .group()
      .move(this.positioner.getXOffset(), this.positioner.getYOffset())
      .transform({scaleX: this.positioner.getScale(), scaleY: this.positioner.getScale()});
    return this;
  }

  destroy() {
    super.destroy();
    this.positonedCanvas.remove();
  }
}

export default PositionerRenderer;
