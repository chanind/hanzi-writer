function Renderer(canvas) {
  this._canvas = canvas;
  this._isDestroyed = false; // check this in children in animations, etc
  this._childRenderers = [];
}

// implement in children
Renderer.prototype.mount = function(canvas, props) {
  return this;
};

// implement in children
Renderer.prototype.render = function(props, oldProps = {}) {
  return this;
};

Renderer.prototype.registerChild = function(child) {
  this._childRenderers.push(child);
  return child;
};

// extend this in children with extra behavior
Renderer.prototype.destroy = function() {
  this._isDestroyed = true;
  this._childRenderers.forEach(child => child.destroy());
};

module.exports = Renderer;
