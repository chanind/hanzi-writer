const Renderer = require('./Renderer');
const { getPathString, counter } = require('../utils');
const svg = require('../svg');

// this is a stroke composed of several stroke parts
class StrokeRenderer extends Renderer {
  constructor(stroke, options = {}) {
    super();
    this.stroke = stroke;
    this.options = options;
  }

  draw() {
    this.path = svg.createElm('path');
    this.mask = svg.createElm('mask');
    this.maskPath = svg.createElm('path');
    const maskId = `mask-${counter()}`;
    svg.attr(this.mask, 'id', maskId);

    svg.attr(this.path, 'd', this.stroke.getPath());
    svg.attrs(this.path, this.getStrokeAttrs());
    this.path.style.opacity = 0;
    svg.attr(this.path, 'mask', `url(#${maskId})`);

    this.mask.appendChild(this.maskPath);
    svg.attr(this.maskPath, 'd', getPathString(this.stroke.getPoints()));
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
  }

  show(animation) {
    this.maskPath.style['stroke-dashoffset'] = 0;
    const tween = new svg.StyleTween(this.path, 'opacity', 1, {
      duration: this.options.strokeAnimationDuration,
    });
    animation.registerSvgAnimation(tween);
    return tween.start();
  }

  hide(animation) {
    const tween = new svg.StyleTween(this.path, 'opacity', 0, {
      duration: this.options.strokeAnimationDuration,
    });
    animation.registerSvgAnimation(tween);
    return tween.start();
  }

  animate(animation) {
    if (!animation.isActive()) return null;
    this.maskPath.style['stroke-dashoffset'] = this.maskPath.getTotalLength();
    this.showImmediate();
    const tween = new svg.StyleTween(this.maskPath, 'stroke-dashoffset', 0, {
      duration: this.options.strokeAnimationDuration,
    });
    animation.registerSvgAnimation(tween);
    return tween.start();
  }

  hideImmediate() { this.path.style.opacity = 0; }
  showImmediate() { this.path.style.opacity = 1; }

  highlight(animation) {
    return this.animate(animation).then(() => this.hide(animation));
  }

  getStrokeAttrs() {
    return {
      fill: this.options.strokeColor,
      stroke: this.options.strokeColor,
      'stroke-width': this.options.strokeWidth,
    };
  }

  destroy() {
    super.destroy();
    if (this.path) this.path.remove();
    if (this.maskPath) this.maskPath.remove();
    if (this.mask) this.mask.remove();
  }
}

module.exports = StrokeRenderer;
