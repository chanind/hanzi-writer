// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'HanziWrite... Remove this comment to see the full error message
const HanziWriterRenderer = require('./HanziWriterRenderer');
const RenderTarget = require('./RenderTarget');

module.exports = {
  HanziWriterRenderer,
  createRenderTarget: RenderTarget.init,
};
