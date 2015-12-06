import PathRenderer from './PathRenderer';
import {Promise} from 'es6-promise';

class StrokePartRenderer extends PathRenderer {

  constructor(strokePart, stroke, options = {}) {
    super();
    this.options = options;
    this.strokePart = strokePart;
    this.stroke = stroke;
  }

  getPathString() {
    return super.getPathString() + ' z';
  }

  getPoints() {
    return this.strokePart.getPoints();
  }

  markAnimationPoints() {
    const start = this.strokePart.getStartingPoint();
    const end = this.strokePart.getEndingPoint();
    this.canvas.circle(10).attr({fill: '#9F9'}).move(start.getX(), start.getY());
    this.canvas.circle(10).attr({fill: '#9F9'}).move(end.getX(), end.getY());
  }

  draw() {
    super.draw();
    this.path.attr(this.getStrokeAttrs()).attr({opacity: 0});
    return this;
  }

  show(animation) {
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

  hideImmediate() { this.path.opacity(0); }
  showImmediate() { this.path.opacity(1); }

  animate(animation) {
    const start = this.strokePart.getStartingPoint();
    if (!this.path) this.drawPath();
    if (!this.mask) {
      this.mask = this.canvas.circle(0).center(start.getX(), start.getY());
      this.path.clipWith(this.mask);
    }

    this.mask.radius(0);
    this.path
      .attr({opacity: 1})
      .attr(this.getStrokeAttrs());

    return new Promise((resolve, reject) => {
      const svgAnimation = this.mask.animate(this.options.strokeAnimationDuration / this.stroke.getNumStrokeParts())
        .radius(this.strokePart.getLength())
        .after(resolve);

      animation.registerSvgAnimation(svgAnimation);
    });
  }

  destroy() {
    super.destroy();
    if (this.mask) this.mask.remove();
  }

  getStrokeAttrs() {
    return {
      fill: this.options.strokeColor,
      stroke: this.options.strokeColor,
      'stroke-width': this.options.strokeWidth,
    };
  }
}

module.exports = StrokePartRenderer;
