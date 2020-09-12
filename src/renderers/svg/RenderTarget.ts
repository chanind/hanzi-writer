const { createElm, attrs } = require('./svgUtils');
const RenderTargetBase = require('../RenderTargetBase');

function RenderTarget(svg, defs) {
  this.svg = svg;
  this.defs = defs;
  this.node = svg;

  if (this.node.createSVGPoint) {
    this._pt = this.node.createSVGPoint();
  }
}
RenderTarget.prototype = Object.create(RenderTargetBase.prototype);

RenderTarget.prototype.createSubRenderTarget = function() {
  const group = createElm('g');
  this.svg.appendChild(group);
  return new RenderTarget(group, this.defs);
};

RenderTarget.prototype._getMousePoint = function(evt) {
  if (this._pt) {
    this._pt.x = evt.clientX;
    this._pt.y = evt.clientY;
    const localPt = this._pt.matrixTransform(this.node.getScreenCTM().inverse());
    return {x: localPt.x, y: localPt.y};
  }
  return RenderTargetBase.prototype._getMousePoint.call(this, evt);
};

RenderTarget.prototype._getTouchPoint = function(evt) {
  if (this._pt) {
    this._pt.x = evt.touches[0].clientX;
    this._pt.y = evt.touches[0].clientY;
    const localPt = this._pt.matrixTransform(this.node.getScreenCTM().inverse());
    return {x: localPt.x, y: localPt.y};
  }
  return RenderTargetBase.prototype._getTouchPoint.call(this, evt);
};

RenderTarget.init = (elmOrId, width = '100%', height = '100%') => {
  let svg;
  let elm = elmOrId;
  if (typeof elmOrId === 'string') {
    elm = global.document.getElementById(elmOrId);
  }
  if (!elm) {
    throw new Error(`HanziWriter target element not found: ${elmOrId}`);
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
