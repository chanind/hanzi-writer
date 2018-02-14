const Renderer = require('./Renderer');
const StrokeRenderer = require('./StrokeRenderer');
const { inherits } = require('../utils');
const svg = require('../svg');


const exractStrokeProps = (strokeNum, props) => {
  if (!props.strokes) return props;
  return {
    usePolygonMasks: props.usePolygonMasks,
    strokeColor: props.strokeColor,
    radicalColor: props.radicalColor,
    strokeWidth: props.strokeWidth,
    opacity: props.strokes[strokeNum].opacity,
    displayPortion: props.strokes[strokeNum].displayPortion,
  };
};


function CharacterRenderer(character) {
  CharacterRenderer.super_.call(this);
  this._oldProps = {};
  this.character = character;
  this.strokeRenderers = this.character.strokes.map((stroke) => {
    return this.registerChild(new StrokeRenderer(stroke));
  });
}

inherits(CharacterRenderer, Renderer);

CharacterRenderer.prototype.mount = function(canvas, props) {
  const subCanvas = canvas.createSubCanvas();
  this._group = subCanvas.svg;
  this.strokeRenderers.forEach((strokeRenderer, i) => {
    strokeRenderer.mount(subCanvas, exractStrokeProps(i, props));
  });
};

CharacterRenderer.prototype.render = function(props) {
  if (props.opacity !== this._oldProps.opacity) {
    this._group.style.opacity = props.opacity;
  }
  for (let i = 0; i < this.strokeRenderers.length; i++) {
    this.strokeRenderers[i].render(exractStrokeProps(i, props));
  }
  this._oldProps = props;
};


CharacterRenderer.prototype.destroy = function() {
  CharacterRenderer.super_.prototype.destroy.call(this);
  svg.removeElm(this._group);
};


module.exports = CharacterRenderer;
