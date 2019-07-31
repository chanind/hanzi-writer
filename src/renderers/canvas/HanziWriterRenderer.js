const CharacterRenderer = require('./CharacterRenderer');
const renderUserStroke = require('./renderUserStroke');
const {assign} = require('../../utils');

function HanziWriterRenderer(character, positioner) {
  this._character = character;
  this._positioner = positioner;
  this._mainCharRenderer = new CharacterRenderer(character);
  this._outlineCharRenderer = new CharacterRenderer(character);
  this._highlightCharRenderer = new CharacterRenderer(character);
}

HanziWriterRenderer.prototype.mount = function(target) {
  this._target = target;
};

HanziWriterRenderer.prototype._animationFrame = function(func) {
  const ctx = this._target.getContext();
  ctx.clearRect(0, 0, this._positioner.width, this._positioner.height);

  ctx.save();
  ctx.translate(this._positioner.xOffset, this._positioner.height - this._positioner.yOffset);
  ctx.transform(1, 0, 0, -1, 0, 0);
  ctx.scale(this._positioner.scale,  this._positioner.scale);
  func(ctx);
  ctx.restore();
  if (ctx.draw) ctx.draw();
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
      if (userStrokes[userStrokeId]) {
        const userStrokeProps = assign({
          strokeWidth: props.options.drawingWidth,
          strokeColor: props.options.drawingColor,
        }, userStrokes[userStrokeId]);
        renderUserStroke(ctx, userStrokeProps);
      }
    });
  });
};

HanziWriterRenderer.prototype.destroy = function() {};

module.exports = HanziWriterRenderer;
