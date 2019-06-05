function RenderTarget(canvasId) {
  this.canvasId = canvasId;

  // eslint-disable-next-line no-undef
  const ctx = wx.createCanvasContext(this.canvasId);
  // need to polyfill missing setters from the wechat context...
  [
    'globalAlpha',
    'strokeStyle',
    'fillStyle',
    'lineWidth',
    'lineCap',
    'lineJoin',
  ].forEach(setter => {
    const setterMethod = `set${setter[0].toUpperCase()}${setter.slice(1)}`;
    Object.defineProperty(ctx, setter, { set: ctx[setterMethod].bind(ctx) });
  });
  this.ctx = ctx;
}


RenderTarget.prototype.addEventListener = function() {
  // this.node.addEventListener(name, callback);
};

RenderTarget.prototype.getContext = function() {
  return this.ctx;
};

RenderTarget.init = (elmId) => {
  return new RenderTarget(elmId);
};

module.exports = RenderTarget;
