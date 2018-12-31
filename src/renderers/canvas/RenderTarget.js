
function RenderTarget(domNode) {
  this.node = domNode;
}

RenderTarget.prototype.getLocalPoint = function(globalPoint) {
  const box = this.node.getBoundingClientRect();
  const x = globalPoint.x - box.left;
  const y = globalPoint.y - box.top;
  return {x, y};
};

RenderTarget.init = (elmOrId, width = '100%', height = '100%') => {
  let elm = elmOrId;
  if (typeof elmOrId === 'string') {
    elm = global.document.getElementById(elmOrId);
  }

  const div = global.document.createElement('div');
  div.style.width = width;
  div.style.height = height;
  div.style.position = 'relative';
  elm.appendChild(div);
  return new RenderTarget(div);
};

module.exports = RenderTarget;
