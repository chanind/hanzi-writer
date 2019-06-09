function RenderTargetBase() {}

RenderTargetBase.prototype.addPointerStartListener = function(callback) {
  this.node.addEventListener('mousedown', (evt) => {
    callback(this._eventify(evt, this._getMousePoint));
  });
  this.node.addEventListener('touchstart', (evt) => {
    callback(this._eventify(evt, this._getTouchPoint));
  });
};

RenderTargetBase.prototype.addPointerMoveListener = function(callback) {
  this.node.addEventListener('mousemove', (evt) => {
    callback(this._eventify(evt, this._getMousePoint));
  });
  this.node.addEventListener('touchmove', (evt) => {
    callback(this._eventify(evt, this._getTouchPoint));
  });
};

RenderTargetBase.prototype.addPointerEndListener = function(callback) {
  // TODO: find a way to not need global listeners
  global.document.addEventListener('mouseup', callback);
  global.document.addEventListener('touchend', callback);
};


RenderTargetBase.prototype.getBoundingClientRect = function() {
  return this.node.getBoundingClientRect();
};

RenderTargetBase.prototype._eventify = function(evt, pointFunc) {
  return {
    getPoint: () => pointFunc.call(this, evt),
    preventDefault: () => evt.preventDefault(),
  };
};

RenderTargetBase.prototype._getMousePoint = function(evt) {
  const box = this.getBoundingClientRect();
  const x = evt.clientX - box.left;
  const y = evt.clientY - box.top;
  return {x, y};
};

RenderTargetBase.prototype._getTouchPoint = function(evt) {
  const box = this.getBoundingClientRect();
  const x = evt.touches[0].clientX - box.left;
  const y = evt.touches[0].clientY - box.top;
  return {x, y};
};


module.exports = RenderTargetBase;
