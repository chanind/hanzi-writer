const Renderer = require('./Renderer');
const {counter, inherits } = require('../utils');
const svg = require('../svg');
const { extendPointOnLine, linesToPolygon, getLineSegmentsPortion } = require('../geometry');

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

// take points on a path and move their end point backwards by distance
const extendEnd = (points, distance) => {
  if (points.length < 2) return points;
  const p1 = points[points.length - 2];
  const p2 = points[points.length - 1];
  const newEnd = extendPointOnLine(p1, p2, distance);
  const extendedPoints = points.slice(0, points.length - 1);
  extendedPoints.push(newEnd);
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
  const maskType = this.options.usePolygonMasks ? 'clipPath' : 'mask';
  this.mask = svg.createElm(maskType);
  this.maskPath = svg.createElm('path');
  const maskId = `mask-${counter()}`;
  svg.attr(this.mask, 'id', maskId);

  svg.attr(this.path, 'd', this.stroke.path);
  svg.attrs(this.path, this.getStrokeAttrs());
  this.path.style.opacity = 0;
  const maskAttr = this.options.usePolygonMasks ? 'clip-path' : 'mask';
  svg.attr(this.path, maskAttr, `url(#${maskId})`);

  this.extendedMaskPoints = extendStart(this.stroke.points, 85);
  this.mask.appendChild(this.maskPath);
  if (this.options.usePolygonMasks) {
    this.extendedMaskPoints = extendEnd(this.extendedMaskPoints, 85);
    this._setPolyMaskPortion(1);
  } else {
    svg.attr(this.maskPath, 'd', svg.getPathString(this.extendedMaskPoints));
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
  }

  this.canvas.defs.appendChild(this.mask);
  this.canvas.svg.appendChild(this.path);
  return this;
};

StrokeRenderer.prototype._setPolyMaskPortion = function(portion) {
  const strokePointsPortion = getLineSegmentsPortion(this.extendedMaskPoints, portion);
  const polygonPoints = linesToPolygon(strokePointsPortion, 150);
  svg.attr(this.maskPath, 'd', svg.getPathString(polygonPoints, true));
};

StrokeRenderer.prototype.show = function(animation) {
  if (this.options.usePolygonMasks) {
    this._setPolyMaskPortion(1);
  } else {
    this.maskPath.style['stroke-dashoffset'] = 0;
  }
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
  let tween;
  if (this.options.usePolygonMasks) {
    this._setPolyMaskPortion(0);
    tween = new svg.Tween((portion => this._setPolyMaskPortion(portion)), {
      duration: this.options.strokeAnimationDuration,
    });
  } else {
    // safari has a bug where setting the dashoffset to exactly the length causes a brief flicker
    this.maskPath.style['stroke-dashoffset'] = this.maskPath.getTotalLength() * 0.999;
    tween = new svg.StyleTween(this.maskPath, 'stroke-dashoffset', 0, {
      duration: this.options.strokeAnimationDuration,
    });
  }
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
