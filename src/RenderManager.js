const SvgRenderTarget = require('./renderers/svg/RenderTarget');
const CanvasRenderTarget = require('./renderers/canvas/RenderTarget');
const SvgHanziWriterRenderer = require('./renderers/svg/HanziWriterRenderer');
const CanvasHanziWriterRenderer = require('./renderers/canvas/HanziWriterRenderer');

function RenderManager(type) {
  this._type = type;
}

RenderManager.prototype.initRenderTarget = function(elmOrId) {
  const RenderTarget = this._type === 'canvas' ? CanvasRenderTarget : SvgRenderTarget;
  return RenderTarget.init(elmOrId);
};

RenderManager.prototype.initRenderer = function(renderTarget, positioner, character, renderState) {
  const HanziWriterRenderer = this._type === 'canvas' ? CanvasHanziWriterRenderer : SvgHanziWriterRenderer;
  return this._type === 'canvas' ? CanvasRenderTarget.init(elmOrId) : SvgRenderTarget.init(elmOrId);
};

module.exports = RenderManager;
