const Renderer = require('./Renderer');
const svg = require('../svg');
const {inherits} = require('../utils');

function PositionerRenderer(positioner, options = {}) {
  PositionerRenderer.super_.call(this);
  this.positioner = positioner;
  this.positionedCanvas = null;
}

inherits(PositionerRenderer, Renderer);

PositionerRenderer.prototype.setCanvas = function(canvas) {
  PositionerRenderer.super_.prototype.setCanvas.call(this, canvas);
  this.positionedCanvas = canvas.createSubCanvas();
  const group = this.positionedCanvas.svg;
  svg.attr(group, 'transform', `
    translate(${this.positioner.getXOffset()}, ${this.positioner.getHeight() - this.positioner.getYOffset()})
    scale(${this.positioner.getScale()}, ${-1 * this.positioner.getScale()})
  `);
  return this;
};

PositionerRenderer.prototype.destroy = function() {
  PositionerRenderer.super_.prototype.destroy.call(this);
  this.positionedCanvas.remove();
};

module.exports = PositionerRenderer;
