const StrokeRenderer = require('./StrokeRenderer');


function CharacterRenderer(character) {
  this._strokeRenderers = character.strokes.map((stroke) => new StrokeRenderer(stroke));
}

CharacterRenderer.prototype.render = function(ctx, props) {
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
