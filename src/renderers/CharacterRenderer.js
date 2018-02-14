const StrokeRenderer = require('./StrokeRenderer');
const dom = require('../dom');


function CharacterRenderer(character) {
  this._oldProps = {};
  this._character = character;
  this.strokeRenderers = this._character.strokes.map(stroke => new StrokeRenderer(stroke));
}

CharacterRenderer.prototype.mount = function(canvas) {
  this._canvas = canvas;
};

CharacterRenderer.prototype.render = function(ctx, props) {
  if (props.opacity !== this._oldProps.opacity) {
    this._canvas.style.opacity = props.opacity;
  }

  for (let i = 0; i < this.strokeRenderers.length; i++) {
    this.strokeRenderers[i].render(ctx, {
      usePolygonMasks: props.usePolygonMasks,
      strokeColor: props.strokeColor,
      radicalColor: props.radicalColor,
      strokeWidth: props.strokeWidth,
      opacity: props.strokes[i].opacity,
      displayPortion: props.strokes[i].displayPortion,
    });
  }

  this._oldProps = props;
};

CharacterRenderer.prototype.destroy = function() {
  dom.removeElm(this._canvas);
};


module.exports = CharacterRenderer;
