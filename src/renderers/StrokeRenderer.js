const Renderer = require('./Renderer');
const {counter, inherits } = require('../utils');
const svg = require('../svg');
const {
  extendPointOnLine,
  filterParallelPoints,
} = require('../geometry');

const STROKE_WIDTH = 200;

// take points on a path and move their start point backwards by distance
const extendStart = (points, distance) => {
  if (points.length < 2) return points;
  const p1 = points[1];
  const p2 = points[0];
  const newStart = extendPointOnLine(p1, p2, distance);
  const extendedPoints = points.slice(1);
  extendedPoints.unshift(newStart);
  return extendedPoints;
};

// this is a stroke composed of several stroke parts
function StrokeRenderer(stroke) {
  StrokeRenderer.super_.call(this);
  this._oldProps = {};
  this._stroke = stroke;
  this._pathLength = stroke.getLength() + (STROKE_WIDTH / 2);
}
inherits(StrokeRenderer, Renderer);

StrokeRenderer.prototype.mount = function(canvas) {
  this._path = svg.createElm('path');
  this._mask = svg.createElm('clipPath');
  this._maskPath = svg.createElm('path');
  const maskId = `mask-${counter()}`;
  svg.attr(this._mask, 'id', maskId);

  svg.attr(this._maskPath, 'd', this._stroke.path);
  this._path.style.opacity = 0;
  svg.attr(this._path, 'clip-path', `url(#${maskId})`);

  this.extendedMaskPoints = extendStart(filterParallelPoints(this._stroke.points), STROKE_WIDTH / 2);
  svg.attr(this._path, 'd', svg.getPathString(this.extendedMaskPoints));
  svg.attrs(this._path, {
    stroke: '#FFFFFF',
    'stroke-width': STROKE_WIDTH,
    fill: 'none',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'miter',
    'stroke-dasharray': `${this._pathLength},${this._pathLength}`,
  });

  this._mask.appendChild(this._maskPath);
  canvas.defs.appendChild(this._mask);
  canvas.svg.appendChild(this._path);
  return this;
};

StrokeRenderer.prototype.render = function(props) {
  if (props === this._oldProps) return;
  if (props.displayPortion !== this._oldProps.displayPortion) {
    this._path.style.strokeDashoffset = this._getStrokeDashoffset(props.displayPortion);
  }

  const color = this._getColor(props);
  if (color !== this._getColor(this._oldProps)) {
    svg.attrs(this._path, { stroke: color });
  }

  if (props.opacity !== this._oldProps.opacity) {
    this._path.style.opacity = props.opacity;
  }
  this._oldProps = props;
};

StrokeRenderer.prototype._getStrokeDashoffset = function(displayPortion) {
  return this._pathLength * 0.999 * (1 - displayPortion);
};

StrokeRenderer.prototype._getColor = function({ strokeColor, radicalColor }) {
  return radicalColor && this._stroke.isInRadical ? radicalColor : strokeColor;
};

StrokeRenderer.prototype.destroy = function() {
  StrokeRenderer.super_.prototype.destroy.call(this);
  svg.removeElm(this._maskPath);
  svg.removeElm(this._path);
  svg.removeElm(this._mask);
};

module.exports = StrokeRenderer;
