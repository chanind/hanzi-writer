function RenderTarget(canvas) {
  this.node = canvas;
}

RenderTarget.init = (elmOrId, width = '100%', height = '100%') => {
  let canvas;
  let elm = elmOrId;
  if (typeof elmOrId === 'string') {
    elm = global.document.getElementById(elmOrId);
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
