const Renderer = require('./Renderer');
const {counter, inherits } = require('../utils');
const svg = require('../svg');
const { extendPointOnLine } = require('../geometry');

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
function StrokeRenderer(stroke, options = {}) {
  StrokeRenderer.super_.call(this);
  this.stroke = stroke;
  this.options = options;
}
inherits(StrokeRenderer, Renderer);

StrokeRenderer.prototype.draw = function() {
  this.path = svg.createElm('path');
  this.clip = svg.createElm('clipPath');
  this.strokeClip = svg.createElm('path');
  const clipId = `hzw-clip-${counter()}`;
  svg.attr(this.clip, 'id', clipId);

  const extendedPathPoints = extendStart(this.stroke.points, 85);
  svg.attr(this.path, 'd', svg.getPathString(extendedPathPoints));
  this.path.style.opacity = 0;
  svg.attr(this.path, 'clip-path', `url(#${clipId})`);

  svg.attr(this.strokeClip, 'd', this.stroke.path);
  const maskLength = this.strokeClip.getTotalLength();
  svg.attrs(this.path, {
    fill: 'none',
    stroke: this.options.strokeColor,
    'stroke-width': 150,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'miter',
    'stroke-dasharray': `${maskLength},${maskLength}`,
  });
  this.path.style['stroke-dashoffset'] = 0;

  this.clip.appendChild(this.strokeClip);
  this.canvas.defs.appendChild(this.clip);
  this.canvas.svg.appendChild(this.path);
  return this;
};

StrokeRenderer.prototype.show = function(animation) {
  this.path.style['stroke-dashoffset'] = 0;
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
  this.showImmediate();
  // safari has a bug where setting the dashoffset to exactly the length causes a brief flicker
  this.path.style['stroke-dashoffset'] = this.strokeClip.getTotalLength() * 0.999;
  const tween = new svg.StyleTween(this.path, 'stroke-dashoffset', 0, {
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

StrokeRenderer.prototype.destroy = function() {
  StrokeRenderer.super_.prototype.destroy.call(this);
  if (this.path) this.path.remove();
  if (this.strokeClip) this.strokeClip.remove();
  if (this.clip) this.clip.remove();
};

module.exports = StrokeRenderer;
