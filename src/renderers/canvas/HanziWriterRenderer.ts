// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CharacterR... Remove this comment to see the full error message
const CharacterRenderer = require('./CharacterRenderer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'renderUser... Remove this comment to see the full error message
const renderUserStroke = require('./renderUserStroke');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assign'.
const {assign} = require('../../utils');

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function HanziWriterRenderer(character: any, positioner: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._character = character;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._positioner = positioner;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._mainCharRenderer = new CharacterRenderer(character);
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._outlineCharRenderer = new CharacterRenderer(character);
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._highlightCharRenderer = new CharacterRenderer(character);
}

HanziWriterRenderer.prototype.mount = function(target: any) {
  this._target = target;
};

HanziWriterRenderer.prototype._animationFrame = function(func: any) {
  const ctx = this._target.getContext();
  ctx.clearRect(0, 0, this._positioner.width, this._positioner.height);

  ctx.save();
  ctx.translate(this._positioner.xOffset, this._positioner.height - this._positioner.yOffset);
  ctx.transform(1, 0, 0, -1, 0, 0);
  ctx.scale(this._positioner.scale, this._positioner.scale);
  func(ctx);
  ctx.restore();
  if (ctx.draw) ctx.draw();
};

HanziWriterRenderer.prototype.render = function(props: any) {
  this._animationFrame((ctx: any) => {
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
