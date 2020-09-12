// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CharacterR... Remove this comment to see the full error message
const CharacterRenderer = require('./CharacterRenderer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserStroke... Remove this comment to see the full error message
const UserStrokeRenderer = require('./UserStrokeRenderer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assign'.
const {assign} = require('../../utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'svg'.
const svg = require('./svgUtils');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'HanziWrite... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._userStrokeRenderers = {};
}

HanziWriterRenderer.prototype.mount = function(target: any) {
  const positionedTarget = target.createSubRenderTarget();
  const group = positionedTarget.svg;
  svg.attr(group, 'transform', `
    translate(${this._positioner.xOffset}, ${this._positioner.height - this._positioner.yOffset})
    scale(${this._positioner.scale}, ${-1 * this._positioner.scale})
  `);
  this._outlineCharRenderer.mount(positionedTarget);
  this._mainCharRenderer.mount(positionedTarget);
  this._highlightCharRenderer.mount(positionedTarget);
  this._positionedTarget = positionedTarget;
};

HanziWriterRenderer.prototype.render = function(props: any) {
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
      strokeRenderer.mount(this._positionedTarget, userStrokeProps);
      this._userStrokeRenderers[userStrokeId] = strokeRenderer;
    }
    strokeRenderer.render(userStrokeProps);
  });
};

HanziWriterRenderer.prototype.destroy = function() {
  svg.removeElm(this._positionedTarget.svg);
  this._positionedTarget.defs.innerHTML = '';
};

module.exports = HanziWriterRenderer;
