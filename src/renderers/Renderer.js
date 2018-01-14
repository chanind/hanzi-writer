function Renderer() {
  this.isDestroyed = false; // check this in children in animations, etc
  this.childRenderers = [];
  this.parentRenderer = null;
}

// implement in children
Renderer.prototype.draw = function() {
  return this;
};

Renderer.prototype.registerChild = function(child) {
  this.childRenderers.push(child);
  child.setParent(this);
  return child;
};

Renderer.prototype.setParent = function(parent) {
  this.parentRenderer = parent;
  return this;
};

Renderer.prototype.setCanvas = function(canvas) {
  this.canvas = canvas;
  return this;
};

// extend this in children with extra behavior
Renderer.prototype.destroy = function() {
  this.isDestroyed = true;
  this.childRenderers.forEach(child => child.destroy());
};

module.exports = Renderer;
