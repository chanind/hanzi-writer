import Renderer from './Renderer';
import { getPathString } from '../utils';

// this is a stroke composed of several stroke parts
class StrokeRenderer extends Renderer {
  constructor(stroke, options = {}) {
    super();
    this.stroke = stroke;
    this.options = options;
  }

  draw() {
    this.path = this.canvas.path(this.stroke.getPath());
    this.path.attr(this.getStrokeAttrs()).attr({opacity: 0});
    this.mask = this.canvas.path(getPathString(this.stroke.getPoints()));
    this.mask.attr({
      stroke: '#FFFFFF',
      'stroke-width': 150,
      fill: 'none',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'miter',
      'stroke-dasharray': `${this.mask.length()},${this.mask.length()}`,
      'stroke-dashoffset': 0,
    });
    this.path.maskWith(this.mask);
    return this;
  }

  show(animation) {
    this.mask.attr({'stroke-dashoffset': 0});
    return new Promise((resolve, reject) => {
      const svgAnimation = this.path.animate(this.options.strokeAnimationDuration)
        .opacity(1)
        .after(resolve);
      animation.registerSvgAnimation(svgAnimation);
    });
  }

  hide(animation) {
    return new Promise((resolve, reject) => {
      const svgAnimation = this.path.animate(this.options.strokeAnimationDuration)
        .opacity(0)
        .after(resolve);
      animation.registerSvgAnimation(svgAnimation);
    });
  }

  animate(animation) {
    if (!animation.isActive()) return null;
    this.mask.attr({'stroke-dashoffset': this.mask.length()});
    this.showImmediate();
    return new Promise((resolve, reject) => {
      const svgAnimation = this.mask.animate(this.options.strokeAnimationDuration)
        .attr({'stroke-dashoffset': 0})
        .after(resolve);

      animation.registerSvgAnimation(svgAnimation);
    });
  }

  hideImmediate() { this.path.opacity(0); }
  showImmediate() { this.path.opacity(1); }

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
    if (this.mask) this.mask.remove();
  }
}

export default StrokeRenderer;
