const Renderer = require('./Renderer');
const svg = require('../svg');

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
    this.positonedCanvas = canvas.createSubCanvas();
    const group = this.positonedCanvas.svg;
    svg.attr(group, 'transform', `
      translate(${this.positioner.getXOffset()}, ${this.positioner.getHeight() - this.positioner.getYOffset()})
      scale(${this.positioner.getScale()}, ${-1 * this.positioner.getScale()})
    `);
    return this;
  }

  destroy() {
    super.destroy();
    this.positonedCanvas.remove();
  }
}

module.exports = PositionerRenderer;
