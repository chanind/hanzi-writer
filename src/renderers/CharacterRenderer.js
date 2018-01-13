const Renderer = require('./Renderer');
const StrokeRenderer = require('./StrokeRenderer');
const {timeout} = require('../utils');


class CharacterRenderer extends Renderer {

  constructor(character, options = {}) {
    super();
    this.options = options;
    this.character = character;
    this.strokeRenderers = this.character.getStrokes().map((stroke) => {
      return this.registerChild(new StrokeRenderer(stroke, options));
    });
  }

  getBounds() {
    return this.character.getBounds();
  }

  show(animation) {
    const promises = this.strokeRenderers.map(strokeRenderer => strokeRenderer.show(animation));
    return Promise.all(promises);
  }

  showImmediate() {
    this.strokeRenderers.map(renderer => renderer.showImmediate());
  }

  hide(animation) {
    const promises = this.strokeRenderers.map(strokeRenderer => strokeRenderer.hide(animation));
    return Promise.all(promises);
  }

  hideImmediate() {
    this.strokeRenderers.map(renderer => renderer.hideImmediate());
  }

  flash(animation) {
    return this.show(animation).then(() => this.hide(animation));
  }

  showStroke(strokeNum, animation) {
    return this.getStrokeRenderer(strokeNum).show(animation);
  }

  draw() {
    this.strokeRenderers.forEach(renderer => renderer.draw());
    return this;
  }

  getStrokeRenderer(strokeNum) {
    return this.strokeRenderers[strokeNum];
  }

  animate(animation) {
    if (!animation.isActive()) return null;
    let renderChain = this.hide(animation);
    this.strokeRenderers.forEach((strokeRenderer, index) => {
      if (index > 0) renderChain = renderChain.then(() => timeout(this.options.delayBetweenStrokes));
      renderChain = renderChain.then(() => strokeRenderer.animate(animation));
    });
    return renderChain;
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    this.strokeRenderers.forEach(renderer => renderer.setCanvas(canvas));
    return this;
  }
}

module.exports = CharacterRenderer;
