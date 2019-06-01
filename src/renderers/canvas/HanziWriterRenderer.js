const CharacterRenderer = require('./CharacterRenderer');
const UserStrokeRenderer = require('./UserStrokeRenderer');
const {assign} = require('../../utils');

function HanziWriterRenderer(character, positioner) {
  this._character = character;
  this._positioner = positioner;
  this._mainCharRenderer = new CharacterRenderer(character);
  this._outlineCharRenderer = new CharacterRenderer(character);
  this._highlightCharRenderer = new CharacterRenderer(character);
  this._userStrokeRenderers = {};

  this._width = this._positioner.getWidth();
  this._height = this._positioner.getHeight();
  this._transX = this._positioner.getXOffset();
  this._transY = this._positioner.getHeight() - this._positioner.getYOffset();
  this._scale = this._positioner.getScale();
}

HanziWriterRenderer.prototype.mount = function(target) {
  this._target = target;
};

HanziWriterRenderer.prototype._animationFrame = function(func) {
  const ctx = this._target.node.getContext('2d');
  ctx.clearRect(0, 0, this._width, this._height);

  ctx.save();
  // ctx.globalCompositeOperation = 'destination-over';
  ctx.translate(this._transX, this._transY);
  ctx.scale(this._scale, -1 * this._scale);
  func(ctx);
  ctx.restore();
};

HanziWriterRenderer.prototype.render = function(props) {
  this._animationFrame(ctx => {
    this._outlineCharRenderer.render(ctx, {
      opacity: props.character.outline.opacity,
      strokes: props.character.outline.strokes,
      strokeColor: props.options.outlineColor,
    });
    this._mainCharRenderer.render(ctx, {
      opacity: props.character.main.opacity,
      strokes: props.character.main.strokes,
      strokeColor: props.options.strokeColor,
      radicalColor: props.options.radicalColor,
    });
    this._highlightCharRenderer.render(ctx, {
      opacity: props.character.highlight.opacity,
      strokes: props.character.highlight.strokes,
      strokeColor: props.options.highlightColor,
    });

    const userStrokes = props.userStrokes || {};
    Object.keys(userStrokes).forEach(userStrokeId => {
      const userStrokeProps = assign({
        strokeWidth: props.options.drawingWidth,
        strokeColor: props.options.drawingColor,
      }, userStrokes[userStrokeId]);
      const strokeRenderer = new UserStrokeRenderer();
      strokeRenderer.render(ctx, userStrokeProps);
    });
  });
};

HanziWriterRenderer.prototype.destroy = function() {};

module.exports = HanziWriterRenderer;
