const CharacterRenderer = require('./CharacterRenderer');
const UserStrokeRenderer = require('./UserStrokeRenderer');
const {assign} = require('../../utils');
const svg = require('../../svg');

function HanziWriterRenderer(character, positioner) {
  this._character = character;
  this._positioner = positioner;
  this._mainCharRenderer = new CharacterRenderer(character);
  this._outlineCharRenderer = new CharacterRenderer(character);
  this._highlightCharRenderer = new CharacterRenderer(character);
  this._userStrokeRenderers = {};
}

HanziWriterRenderer.prototype.mount = function(renderTarget) {
  const positionedGroup = renderTarget.group.createSubGroup();
  svg.attr(positionedGroup.node, 'transform', `
    translate(${this._positioner.getXOffset()}, ${this._positioner.getHeight() - this._positioner.getYOffset()})
    scale(${this._positioner.getScale()}, ${-1 * this._positioner.getScale()})
  `);
  this._outlineCharRenderer.mount(positionedGroup);
  this._mainCharRenderer.mount(positionedGroup);
  this._highlightCharRenderer.mount(positionedGroup);
  this._positionedGroup = positionedGroup;
};

HanziWriterRenderer.prototype.render = function(props) {
  this._outlineCharRenderer.render({
    opacity: props.character.outline.opacity,
    strokes: props.character.outline.strokes,
    strokeColor: props.options.outlineColor,
  });
  this._mainCharRenderer.render({
    opacity: props.character.main.opacity,
    strokes: props.character.main.strokes,
    strokeColor: props.options.strokeColor,
    radicalColor: props.options.radicalColor,
  });
  this._highlightCharRenderer.render({
    opacity: props.character.highlight.opacity,
    strokes: props.character.highlight.strokes,
    strokeColor: props.options.highlightColor,
  });

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
      strokeRenderer.mount(this._positionedGroup, userStrokeProps);
      this._userStrokeRenderers[userStrokeId] = strokeRenderer;
    }
    strokeRenderer.render(userStrokeProps);
  });
};

HanziWriterRenderer.prototype.destroy = function() {
  svg.removeElm(this._positionedGroup.node);
  this._positionedGroup.defs.innerHTML = '';
};

module.exports = HanziWriterRenderer;
