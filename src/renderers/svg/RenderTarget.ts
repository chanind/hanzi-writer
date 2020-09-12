// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createElm'... Remove this comment to see the full error message
const { createElm, attrs } = require('./svgUtils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RenderTarg... Remove this comment to see the full error message
const RenderTargetBase = require('../RenderTargetBase');

function RenderTarget(svg: any, defs: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.svg = svg;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.defs = defs;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.node = svg;

  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  if (this.node.createSVGPoint) {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    this._pt = this.node.createSVGPoint();
  }
}
RenderTarget.prototype = Object.create(RenderTargetBase.prototype);

RenderTarget.prototype.createSubRenderTarget = function() {
  const group = createElm('g');
  this.svg.appendChild(group);
  // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  return new RenderTarget(group, this.defs);
};

RenderTarget.prototype._getMousePoint = function(evt: any) {
  if (this._pt) {
    this._pt.x = evt.clientX;
    this._pt.y = evt.clientY;
    const localPt = this._pt.matrixTransform(this.node.getScreenCTM().inverse());
    return {x: localPt.x, y: localPt.y};
  }
  return RenderTargetBase.prototype._getMousePoint.call(this, evt);
};

RenderTarget.prototype._getTouchPoint = function(evt: any) {
  if (this._pt) {
    this._pt.x = evt.touches[0].clientX;
    this._pt.y = evt.touches[0].clientY;
    const localPt = this._pt.matrixTransform(this.node.getScreenCTM().inverse());
    return {x: localPt.x, y: localPt.y};
  }
  return RenderTargetBase.prototype._getTouchPoint.call(this, evt);
};

RenderTarget.init = (elmOrId: any, width = '100%', height = '100%') => {
  let svg;
  let elm = elmOrId;
  if (typeof elmOrId === 'string') {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'document' does not exist on type 'Global... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  return new RenderTarget(svg, defs);
};

module.exports = RenderTarget;
