const StrokeRenderer = require('./StrokeRenderer');


function CharacterRenderer(character) {
  this._oldProps = {};
  this._strokeRenderers = character.strokes.map((stroke) => new StrokeRenderer(stroke));
}

CharacterRenderer.prototype.mount = function(target) {
  const subTarget = target.createSubRenderTarget();
  this._group = subTarget.svg;
  this._strokeRenderers.forEach((strokeRenderer, i) => {
    strokeRenderer.mount(subTarget);
  });
};

CharacterRenderer.prototype.render = function(props) {
  if (props === this._oldProps) return;
  if (props.opacity !== this._oldProps.opacity) {
    this._group.style.opacity = props.opacity;
    if (props.opacity === 0) {
      this._group.style.display = 'none';
    } else if (this._oldProps.opacity === 0) {
      this._group.style.display = 'initial';
    }
  }
  const colorsChanged = (
    !this._oldProps ||
    props.strokeColor !== this._oldProps.strokeColor ||
    props.radicalColor !== this._oldProps.radicalColor
  );
  if (colorsChanged || props.strokes !== this._oldProps.strokes) {
    for (let i = 0; i < this._strokeRenderers.length; i++) {
      if (!colorsChanged && this._oldProps.strokes && props.strokes[i] === this._oldProps.strokes[i]) continue;
      this._strokeRenderers[i].render({
        strokeColor: props.strokeColor,
        radicalColor: props.radicalColor,
        opacity: props.strokes[i].opacity,
        displayPortion: props.strokes[i].displayPortion,
      });
    }
  }
  this._oldProps = props;
};


module.exports = CharacterRenderer;
