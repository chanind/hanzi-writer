// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RenderTarg... Remove this comment to see the full error message
function RenderTargetBase() {}

RenderTargetBase.prototype.addPointerStartListener = function(callback: any) {
  this.node.addEventListener('mousedown', (evt: any) => {
    callback(this._eventify(evt, this._getMousePoint));
  });
  this.node.addEventListener('touchstart', (evt: any) => {
    callback(this._eventify(evt, this._getTouchPoint));
  });
};

RenderTargetBase.prototype.addPointerMoveListener = function(callback: any) {
  this.node.addEventListener('mousemove', (evt: any) => {
    callback(this._eventify(evt, this._getMousePoint));
  });
  this.node.addEventListener('touchmove', (evt: any) => {
    callback(this._eventify(evt, this._getTouchPoint));
  });
};

RenderTargetBase.prototype.addPointerEndListener = function(callback: any) {
  // TODO: find a way to not need global listeners
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'document' does not exist on type 'Global... Remove this comment to see the full error message
  global.document.addEventListener('mouseup', callback);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'document' does not exist on type 'Global... Remove this comment to see the full error message
  global.document.addEventListener('touchend', callback);
};


RenderTargetBase.prototype.getBoundingClientRect = function() {
  return this.node.getBoundingClientRect();
};

RenderTargetBase.prototype._eventify = function(evt: any, pointFunc: any) {
  return {
    getPoint: () => pointFunc.call(this, evt),
    preventDefault: () => evt.preventDefault(),
  };
};

RenderTargetBase.prototype._getMousePoint = function(evt: any) {
  const box = this.getBoundingClientRect();
  const x = evt.clientX - box.left;
  const y = evt.clientY - box.top;
  return {x, y};
};

RenderTargetBase.prototype._getTouchPoint = function(evt: any) {
  const box = this.getBoundingClientRect();
  const x = evt.touches[0].clientX - box.left;
  const y = evt.touches[0].clientY - box.top;
  return {x, y};
};


module.exports = RenderTargetBase;
