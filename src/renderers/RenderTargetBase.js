function RenderTargetBase() {}

RenderTargetBase.prototype.addEventListener = function(name, callback) {
  this.node.addEventListener(name, callback);
};

RenderTargetBase.prototype.addGlobalListener = function(name, callback) {
  global.document.addEventListener(name, callback);
};

module.exports = RenderTargetBase;
