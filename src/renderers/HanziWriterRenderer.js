const Renderer = require('./Renderer');
const CharacterRenderer = require('./CharacterRenderer');
const UserStrokeRenderer = require('./UserStrokeRenderer');
const {inherits, assign} = require('../utils');
const svg = require('../svg');


const extractCharProps = (props, charName) => {
  if (!props.character) return props;
  return assign({
    usePolygonMasks: props.options.usePolygonMasks,
  }, props.character[charName]);

};


function HanziWriterRenderer(character, positioner) {
  HanziWriterRenderer.super_.call(this);
  this._character = character;
  this._positioner = positioner;
  this._mainCharRenderer = this.registerChild(new CharacterRenderer(character));
  this._outlineCharRenderer = this.registerChild(new CharacterRenderer(character));
  this._highlightCharRenderer = this.registerChild(new CharacterRenderer(character));
  this._userStrokeRenderers = {};
}

inherits(HanziWriterRenderer, Renderer);

HanziWriterRenderer.prototype.mount = function(canvas, props) {
  const positionedCanvas = canvas.createSubCanvas();
  const group = positionedCanvas.svg;
  svg.attr(group, 'transform', `
    translate(${this._positioner.getXOffset()}, ${this._positioner.getHeight() - this._positioner.getYOffset()})
    scale(${this._positioner.getScale()}, ${-1 * this._positioner.getScale()})
  `);
  this._outlineCharRenderer.mount(positionedCanvas, extractCharProps(props, 'outline'));
  this._mainCharRenderer.mount(positionedCanvas, extractCharProps(props, 'main'));
  this._highlightCharRenderer.mount(positionedCanvas, extractCharProps(props, 'highlight'));
  this._positionedCanvas = positionedCanvas;
};

HanziWriterRenderer.prototype.render = function(props) {
  this._outlineCharRenderer.render(extractCharProps(props, 'outline'));
  this._mainCharRenderer.render(extractCharProps(props, 'main'));
  this._highlightCharRenderer.render(extractCharProps(props, 'highlight'));

  const userStrokes = props.userStrokes || {};
  Object.keys(this._userStrokeRenderers).forEach(userStrokeId => {
    if (!userStrokes[userStrokeId]) {
      this._userStrokeRenderers[userStrokeId].destroy();
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
      strokeRenderer.mount(this._positionedCanvas, userStrokeProps);
      this._userStrokeRenderers[userStrokeId] = strokeRenderer;
    }
    strokeRenderer.render(userStrokeProps);
  });
};

HanziWriterRenderer.prototype.destroy = function() {
  HanziWriterRenderer.super_.prototype.destroy.call(this);
  svg.removeElm(this._positionedCanvas.svg);
};

module.exports = HanziWriterRenderer;
