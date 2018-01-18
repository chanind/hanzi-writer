const Renderer = require('./Renderer');
const Point = require('../models/Point');
const { getPathString, counter, inherits } = require('../utils');
const svg = require('../svg');

// take points on a path and move their start point backwards by distance
const extendStart = (points, distance) => {
  if (points.length < 2) return points;
  const p1 = points[0];
  const p2 = points[1];
  let newStart;
  if (p1.x === p2.x) {
    const sign = p1.y > p2.y ? 1 : -1;
    newStart = new Point(p1.x, p1.y + (distance * sign));
  } else {
    const sign = p1.x > p2.x ? 1 : -1;
    const slope = (p1.y - p2.y) / (p1.x - p2.x);
    const intercept = p1.y - (slope * p1.x);
    const distX = Math.sqrt(Math.pow(distance, 2) / (Math.pow(slope, 2) + 1));
    const newX = p1.x + (sign * distX);
    const newY = slope * newX + intercept;
    newStart = new Point(newX, newY);
  }
  const extendedPoints = points.slice(1);
  extendedPoints.unshift(newStart);
  return extendedPoints;
};

// this is a stroke composed of several stroke parts
function StrokeRenderer(stroke, options = {}) {
  StrokeRenderer.super_.call(this);
  this.stroke = stroke;
  this.options = options;
}
inherits(StrokeRenderer, Renderer);

StrokeRenderer.prototype.draw = function() {
  this.path = svg.createElm('path');
  this.mask = svg.createElm('mask');
  this.maskPath = svg.createElm('path');
  const maskId = `mask-${counter()}`;
  svg.attr(this.mask, 'id', maskId);

  svg.attr(this.path, 'd', this.stroke.path);
  svg.attrs(this.path, this.getStrokeAttrs());
  this.path.style.opacity = 0;
  svg.attr(this.path, 'mask', `url(#${maskId})`);

  this.mask.appendChild(this.maskPath);
  const extendedMaskPath = extendStart(this.stroke.points, 85);
  svg.attr(this.maskPath, 'd', getPathString(extendedMaskPath));
  const maskLength = this.maskPath.getTotalLength();
  svg.attrs(this.maskPath, {
    stroke: '#FFFFFF',
    'stroke-width': 150,
    fill: 'none',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'miter',
    'stroke-dasharray': `${maskLength},${maskLength}`,
  });
  this.maskPath.style['stroke-dashoffset'] = 0;

  this.canvas.defs.appendChild(this.mask);
  this.canvas.svg.appendChild(this.path);
  return this;
};

StrokeRenderer.prototype.show = function(animation) {
  this.maskPath.style['stroke-dashoffset'] = 0;
  const tween = new svg.StyleTween(this.path, 'opacity', 1, {
    duration: this.options.strokeAnimationDuration,
  });
  animation.registerSvgAnimation(tween);
  return tween.start();
};

StrokeRenderer.prototype.hide = function(animation) {
  const tween = new svg.StyleTween(this.path, 'opacity', 0, {
    duration: this.options.strokeAnimationDuration,
  });
  animation.registerSvgAnimation(tween);
  return tween.start();
};

StrokeRenderer.prototype.animate = function(animation) {
  if (!animation.isActive()) return null;
  // safari has a bug where setting the dashoffset to exactly the length causes a brief flicker
  this.maskPath.style['stroke-dashoffset'] = this.maskPath.getTotalLength() * 0.999;
  this.showImmediate();
  const tween = new svg.StyleTween(this.maskPath, 'stroke-dashoffset', 0, {
    duration: this.options.strokeAnimationDuration,
  });
  animation.registerSvgAnimation(tween);
  return tween.start();
};

StrokeRenderer.prototype.hideImmediate = function() { this.path.style.opacity = 0; };
StrokeRenderer.prototype.showImmediate = function() { this.path.style.opacity = 1; };

StrokeRenderer.prototype.highlight = function(animation) {
  return this.animate(animation).then(() => this.hide(animation));
};

StrokeRenderer.prototype.getStrokeAttrs = function() {
  return {
    fill: this.options.strokeColor,
    stroke: this.options.strokeColor,
    'stroke-width': this.options.strokeWidth,
  };
};

StrokeRenderer.prototype.destroy = function() {
  StrokeRenderer.super_.prototype.destroy.call(this);
  if (this.path) this.path.remove();
  if (this.maskPath) this.maskPath.remove();
  if (this.mask) this.mask.remove();
};

module.exports = StrokeRenderer;
