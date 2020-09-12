const {counter} = require('../../utils');
const svg = require('./svgUtils');
const {
  extendStart,
  getPathString,
} = require('../../geometry');
const StrokeRendererBase = require('../StrokeRendererBase');

const STROKE_WIDTH = 200;

// this is a stroke composed of several stroke parts
function StrokeRenderer(stroke) {
  this._oldProps = {};
  this._stroke = stroke;
  this._pathLength = stroke.getLength() + (STROKE_WIDTH / 2);
}
StrokeRenderer.prototype = Object.create(StrokeRendererBase.prototype);

StrokeRenderer.prototype.mount = function(target) {
  this._animationPath = svg.createElm('path');
  this._clip = svg.createElm('clipPath');
  this._strokePath = svg.createElm('path');
  const maskId = `mask-${counter()}`;
  svg.attr(this._clip, 'id', maskId);

  svg.attr(this._strokePath, 'd', this._stroke.path);
  this._animationPath.style.opacity = 0;
  svg.attr(this._animationPath, 'clip-path', svg.urlIdRef(maskId));

  const extendedMaskPoints = extendStart(this._stroke.points, STROKE_WIDTH / 2);
  svg.attr(this._animationPath, 'd', getPathString(extendedMaskPoints));
  svg.attrs(this._animationPath, {
    stroke: '#FFFFFF',
    'stroke-width': STROKE_WIDTH,
    fill: 'none',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'miter',
    'stroke-dasharray': `${this._pathLength},${this._pathLength}`,
  });

  this._clip.appendChild(this._strokePath);
  target.defs.appendChild(this._clip);
  target.svg.appendChild(this._animationPath);
  return this;
};

StrokeRenderer.prototype.render = function(props) {
  if (props === this._oldProps) return;
  if (props.displayPortion !== this._oldProps.displayPortion) {
    this._animationPath.style.strokeDashoffset = this._getStrokeDashoffset(props.displayPortion);
  }

  const color = this._getColor(props);
  if (color !== this._getColor(this._oldProps)) {
    const {r, g, b, a} = color;
    svg.attrs(this._animationPath, { stroke: `rgba(${r},${g},${b},${a})` });
  }

  if (props.opacity !== this._oldProps.opacity) {
    this._animationPath.style.opacity = props.opacity;
  }
  this._oldProps = props;
};

module.exports = StrokeRenderer;
