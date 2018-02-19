const Renderer = require('./Renderer');
const StrokeRenderer = require('./StrokeRenderer');
const { inherits } = require('../utils');
const svg = require('../svg');


function CharacterRenderer(character) {
  CharacterRenderer.super_.call(this);
  this._oldProps = {};
  this.character = character;
  this.strokeRenderers = this.character.strokes.map((stroke) => {
    return this.registerChild(new StrokeRenderer(stroke));
  });
}

inherits(CharacterRenderer, Renderer);

CharacterRenderer.prototype.mount = function(canvas) {
  const subCanvas = canvas.createSubCanvas();
  this._group = subCanvas.svg;
  this.strokeRenderers.forEach((strokeRenderer, i) => {
    strokeRenderer.mount(subCanvas);
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
  for (let i = 0; i < this.strokeRenderers.length; i++) {
    this.strokeRenderers[i].render({
      strokeColor: props.strokeColor,
      radicalColor: props.radicalColor,
      opacity: props.strokes[i].opacity,
      displayPortion: props.strokes[i].displayPortion,
    });
  }
  this._oldProps = props;
};


CharacterRenderer.prototype.destroy = function() {
  CharacterRenderer.super_.prototype.destroy.call(this);
  svg.removeElm(this._group);
};


module.exports = CharacterRenderer;
