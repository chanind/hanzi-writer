const {counter} = require('../../utils');
const svg = require('./svg');
const {
  extendPointOnLine,
  filterParallelPoints,
} = require('../../geometry');

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
  this._oldProps = {};
  this._stroke = stroke;
  this._pathLength = stroke.getLength() + (STROKE_WIDTH / 2);
}

StrokeRenderer.prototype.mount = function(canvas) {
  this._animationPath = svg.createElm('path');
  this._clip = svg.createElm('clipPath');
  this._strokePath = svg.createElm('path');
  const maskId = `mask-${counter()}`;
  svg.attr(this._clip, 'id', maskId);

  svg.attr(this._strokePath, 'd', this._stroke.path);
  this._animationPath.style.opacity = 0;
  svg.attr(this._animationPath, 'clip-path', svg.urlIdRef(maskId));

  const extendedMaskPoints = extendStart(filterParallelPoints(this._stroke.points), STROKE_WIDTH / 2);
  svg.attr(this._animationPath, 'd', svg.getPathString(extendedMaskPoints));
  svg.attrs(this._animationPath, {
    stroke: '#FFFFFF',
    'stroke-width': STROKE_WIDTH,
    fill: 'none',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'miter',
    'stroke-dasharray': `${this._pathLength},${this._pathLength}`,
  });

  this._clip.appendChild(this._strokePath);
  canvas.defs.appendChild(this._clip);
  canvas.svg.appendChild(this._animationPath);
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

StrokeRenderer.prototype._getStrokeDashoffset = function(displayPortion) {
  return this._pathLength * 0.999 * (1 - displayPortion);
};

StrokeRenderer.prototype._getColor = function({ strokeColor, radicalColor }) {
  return radicalColor && this._stroke.isInRadical ? radicalColor : strokeColor;
};

module.exports = StrokeRenderer;
