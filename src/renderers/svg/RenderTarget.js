const { createElm, attrs } = require('./svgUtils');
const RenderTargetBase = require('../RenderTargetBase');

function RenderTarget(svg, defs) {
  this.svg = svg;
  this.defs = defs;
  this.node = svg;
}
RenderTarget.prototype = Object.create(RenderTargetBase.prototype);

RenderTarget.prototype.createSubRenderTarget = function() {
  const group = createElm('g');
  this.svg.appendChild(group);
  return new RenderTarget(group, this.defs);
};

RenderTarget.init = (elmOrId, width = '100%', height = '100%') => {
  let svg;
  let elm = elmOrId;
  if (typeof elmOrId === 'string') {
    elm = global.document.getElementById(elmOrId);
  }
  const nodeType = elm.nodeName.toUpperCase();
  if (nodeType === 'SVG' || nodeType === 'G') {
    svg = elm;
  } else {
    svg = createElm('svg');
    elm.appendChild(svg);
  }
  attrs(svg, {width, height});
  const defs = createElm('defs');
  svg.appendChild(defs);
  return new RenderTarget(svg, defs);
};

module.exports = RenderTarget;
