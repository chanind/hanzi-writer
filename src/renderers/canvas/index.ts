const HanziWriterRenderer = require('./HanziWriterRenderer');
const RenderTarget = require('./RenderTarget');

module.exports = {
  HanziWriterRenderer,
  createRenderTarget: RenderTarget.init,
};
