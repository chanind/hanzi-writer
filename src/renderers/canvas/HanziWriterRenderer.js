const CharacterRenderer = require('./CharacterRenderer');
const UserStrokeRenderer = require('./UserStrokeRenderer');
const {assign} = require('../../utils');


const extractCharProps = (props, charName) => {
  return assign({ strokeWidth: props.options.strokeWidth }, props.character[charName]);
};


function HanziWriterRenderer(character, positioner) {
  this._character = character;
  this._positioner = positioner;
  this._mainCharRenderer = new CharacterRenderer(character, positioner);
  this._outlineCharRenderer = new CharacterRenderer(character, positioner);
  this._highlightCharRenderer = new CharacterRenderer(character, positioner);
  this._userStrokeRenderers = {};

  this._width = this._positioner.getWidth();
  this._height = this._positioner.getHeight();
  this._transX = this._positioner.getXOffset();
  this._transY = this._positioner.getHeight() - this._positioner.getYOffset();
  this._scale = this._positioner.getScale();
}

HanziWriterRenderer.prototype.mount = function(target) {
  this._outlineCanvas = this._createPositionedCanvas(target);
  this._mainCanvas = this._createPositionedCanvas(target);
  this._highlightCanvas = this._createPositionedCanvas(target);
  this._userStrokesCanvas = this._createPositionedCanvas(target);

  this._outlineCharRenderer.mount(this._outlineCanvas);
  this._mainCharRenderer.mount(this._mainCanvas);
  this._highlightCharRenderer.mount(this._highlightCanvas);
};

HanziWriterRenderer.prototype._createPositionedCanvas = function(target) {
  const canvas = global.document.createElement('canvas');
  canvas.setAttribute('width', this._width);
  canvas.setAttribute('height', this._height);
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  target.appendChild(canvas);
  return canvas;
};

HanziWriterRenderer.prototype._animationFrame = function(canvas, func) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, this._width, this._height);

  ctx.save();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.translate(this._transX, this._transY);
  ctx.scale(this._scale, -1 * this._scale);
  func(ctx);
  ctx.restore();
};

HanziWriterRenderer.prototype.render = function(props) {
  this._animationFrame(this._outlineCanvas, ctx => {
    this._outlineCharRenderer.render(ctx, extractCharProps(props, 'outline'));
  });
  this._animationFrame(this._mainCanvas, ctx => {
    this._mainCharRenderer.render(ctx, extractCharProps(props, 'main'));
  });
  this._animationFrame(this._highlightCanvas, ctx => {
    this._highlightCharRenderer.render(ctx, extractCharProps(props, 'highlight'));
  });

  this._animationFrame(this._userStrokesCanvas, ctx => {
    const userStrokes = props.userStrokes || {};
    Object.keys(this._userStrokeRenderers).forEach(userStrokeId => {
      if (!userStrokes[userStrokeId]) {
        delete this._userStrokeRenderers[userStrokeId];
      }
    });

    Object.keys(userStrokes).forEach(userStrokeId => {
      if (!userStrokes[userStrokeId]) return;
      const userStrokeProps = assign({
        strokeWidth: props.options.drawingWidth,
        strokeColor: props.options.drawingColor,
      }, userStrokes[userStrokeId]);
      let strokeRenderer = this._userStrokeRenderers[userStrokeId];
      if (!strokeRenderer) {
        strokeRenderer = new UserStrokeRenderer();
        this._userStrokeRenderers[userStrokeId] = strokeRenderer;
      }
      strokeRenderer.render(ctx, userStrokeProps);
    });
  });
};

HanziWriterRenderer.prototype.destroy = function() {
  this._outlineCharRenderer.destroy();
  this._mainCharRenderer.destroy();
  this._highlightCharRenderer.destroy();
};

module.exports = HanziWriterRenderer;
