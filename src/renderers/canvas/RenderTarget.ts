// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RenderTarg... Remove this comment to see the full error message
const RenderTargetBase = require('../RenderTargetBase');

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function RenderTarget(canvas: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.node = canvas;
}
// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
RenderTarget.prototype = Object.create(RenderTargetBase.prototype);

// @ts-expect-error ts-migrate(2454) FIXME: Variable 'RenderTarget' is used before being assig... Remove this comment to see the full error message
RenderTarget.prototype.getContext = function() {
  return this.node.getContext('2d');
};

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
RenderTarget.init = (elmOrId: any, width = '100%', height = '100%') => {
  let canvas;
  let elm = elmOrId;
  if (typeof elmOrId === 'string') {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'document' does not exist on type 'Global... Remove this comment to see the full error message
    elm = global.document.getElementById(elmOrId);
  }
  if (!elm) {
    throw new Error(`HanziWriter target element not found: ${elmOrId}`);
  }
  const nodeType = elm.nodeName.toUpperCase();
  if (nodeType === 'CANVAS') {
    canvas = elm;
  } else {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'document' does not exist on type 'Global... Remove this comment to see the full error message
    canvas = global.document.createElement('canvas');
    elm.appendChild(canvas);
  }
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  return new RenderTarget(canvas);
};

// @ts-expect-error ts-migrate(2454) FIXME: Variable 'RenderTarget' is used before being assig... Remove this comment to see the full error message
module.exports = RenderTarget;
