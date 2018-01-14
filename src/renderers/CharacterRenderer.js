const Renderer = require('./Renderer');
const StrokeRenderer = require('./StrokeRenderer');
const {timeout, inherits} = require('../utils');


function CharacterRenderer(character, options = {}) {
  CharacterRenderer.super_.call(this);
  this.options = options;
  this.character = character;
  this.strokeRenderers = this.character.strokes.map((stroke) => {
    return this.registerChild(new StrokeRenderer(stroke, options));
  });
}

inherits(CharacterRenderer, Renderer);

CharacterRenderer.prototype.getBounds = function() {
  return this.character.getBounds();
};

CharacterRenderer.prototype.show = function(animation) {
  const promises = this.strokeRenderers.map(strokeRenderer => strokeRenderer.show(animation));
  return Promise.all(promises);
};

CharacterRenderer.prototype.showImmediate = function() {
  this.strokeRenderers.map(renderer => renderer.showImmediate());
};

CharacterRenderer.prototype.hide = function(animation) {
  const promises = this.strokeRenderers.map(strokeRenderer => strokeRenderer.hide(animation));
  return Promise.all(promises);
};

CharacterRenderer.prototype.hideImmediate = function() {
  this.strokeRenderers.map(renderer => renderer.hideImmediate());
};

CharacterRenderer.prototype.flash = function(animation) {
  return this.show(animation).then(() => this.hide(animation));
};

CharacterRenderer.prototype.showStroke = function(strokeNum, animation) {
  return this.getStrokeRenderer(strokeNum).show(animation);
};

CharacterRenderer.prototype.draw = function() {
  this.strokeRenderers.forEach(renderer => renderer.draw());
  return this;
};

CharacterRenderer.prototype.getStrokeRenderer = function(strokeNum) {
  return this.strokeRenderers[strokeNum];
};

CharacterRenderer.prototype.animate = function(animation) {
  if (!animation.isActive()) return null;
  let renderChain = this.hide(animation);
  this.strokeRenderers.forEach((strokeRenderer, index) => {
    if (index > 0) renderChain = renderChain.then(() => timeout(this.options.delayBetweenStrokes));
    renderChain = renderChain.then(() => strokeRenderer.animate(animation));
  });
  return renderChain;
};

CharacterRenderer.prototype.setCanvas = function(canvas) {
  CharacterRenderer.super_.prototype.setCanvas.call(this, canvas);
  this.strokeRenderers.forEach(renderer => renderer.setCanvas(canvas));
  return this;
};

module.exports = CharacterRenderer;
