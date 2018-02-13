function Renderer() {
  this._childRenderers = [];
}

// implement in children
Renderer.prototype.mount = function(canvas, props) {
  return this;
};

// implement in children
Renderer.prototype.render = function(props) {
  return this;
};

Renderer.prototype.registerChild = function(child) {
  this._childRenderers.push(child);
  return child;
};

// extend this in children with extra behavior
Renderer.prototype.destroy = function() {
  this._childRenderers.forEach(child => child.destroy());
};

module.exports = Renderer;
