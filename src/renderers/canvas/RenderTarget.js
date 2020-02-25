const RenderTargetBase = require('../RenderTargetBase');

function RenderTarget(canvas) {
  this.node = canvas;
}
RenderTarget.prototype = Object.create(RenderTargetBase.prototype);

RenderTarget.prototype.getContext = function() {
  return this.node.getContext('2d');
};

RenderTarget.init = (elmOrId, width = '100%', height = '100%') => {
  let canvas;
  let elm = elmOrId;
  if (typeof elmOrId === 'string') {
    elm = global.document.getElementById(elmOrId);
  }
  if (!elm) {
    throw new Error(`HanziWriter target element not found: ${elmOrId}`);
  }
  const nodeType = elm.nodeName.toUpperCase();
  if (nodeType === 'CANVAS') {
    canvas = elm;
  } else {
    canvas = global.document.createElement('canvas');
    elm.appendChild(canvas);
  }
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  return new RenderTarget(canvas);
};

module.exports = RenderTarget;
