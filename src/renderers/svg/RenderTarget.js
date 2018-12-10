import { Group, createElm, attrs } from '../../svg';

function RenderTarget(svgNode, defsNode, svgPoint = null) {
  this.node = svgNode;
  this.group = new Group(svgNode, defsNode);
  this._pt = svgPoint;
}

RenderTarget.prototype.getLocalPoint = function(globalPoint) {
  if (this._pt) {
    this._pt.x = globalPoint.x;
    this._pt.y = globalPoint.y;
    const localPt = this._pt.matrixTransform(this.node.getScreenCTM().inverse());
    return {x: localPt.x, y: localPt.y};
  }
  // fallback in case SVG matrix transforms aren't supported
  const box = this.node.getBoundingClientRect();
  const x = globalPoint.x - box.left;
  const y = globalPoint.y - box.top;
  return {x, y};
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

  let pt;
  if (svg.createSVGPoint) {
    pt = svg.createSVGPoint();
  }
  return new RenderTarget(svg, defs, pt);
};

module.exports = RenderTarget;
