const StrokeRenderer = require('./StrokeRenderer');


// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function CharacterRenderer(character: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._strokeRenderers = character.strokes.map((stroke: any) => new StrokeRenderer(stroke));
}

CharacterRenderer.prototype.render = function(ctx: any, props: any) {
  if (props.opacity < 0.05) return;
  for (let i = 0; i < this._strokeRenderers.length; i++) {
    this._strokeRenderers[i].render(ctx, {
      strokeColor: props.strokeColor,
      radicalColor: props.radicalColor,
      opacity: props.strokes[i].opacity * props.opacity,
      displayPortion: props.strokes[i].displayPortion,
    });
  }
};

module.exports = CharacterRenderer;
