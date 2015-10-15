import PathRenderer from './PathRenderer';

class StrokePartRenderer extends PathRenderer {

  constructor(strokePart, options = {}) {
    super();
    this.options = options;
    this.strokePart = strokePart;
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

  highlight() {
    this.path.animate(this.options.strokeHighlightDuration)
      .attr({
        fill: this.options.highlightColor,
        stroke: this.options.highlightColor,
        opacity: 1,
      })
      .after(() => {
        this.path.animate(this.options.strokeHighlightDuration)
          .attr({opacity: 0})
          .after(() => this.path.attr(this.getStrokeAttrs(this.options)));
      });
  }

  draw() {
    return super.draw().attr(this.getStrokeAttrs(this.options)).attr({opacity: 0});
  }

  show(animationOptions, animation) {
    const svgAnimation = this.path.animate(animationOptions.strokeAnimationDuration)
      .opacity(1)
      .after(animationOptions.onComplete);
    animation.registerSvgAnimation(svgAnimation);
  }

  hide(animationOptions, animation) {
    const svgAnimation = this.path.animate(animationOptions.strokeAnimationDuration)
      .opacity(0)
      .after(animationOptions.onComplete);
    animation.registerSvgAnimation(svgAnimation);
  }

  animate(animationOptions, animation) {
    const start = this.strokePart.getStartingPoint();
    if (!this.path) this.drawPath();
    if (!this.mask) {
      this.mask = this.canvas.circle(0).center(start.getX(), start.getY());
      this.path.clipWith(this.mask);
    }

    this.mask.radius(0);
    this.path
      .attr({opacity: 1})
      .attr(this.getStrokeAttrs(animationOptions));

    const svgAnimation = this.mask.animate(animationOptions.strokeAnimationDuration)
      .radius(this.strokePart.getLength())
      .after(animationOptions.onComplete);

    animation.registerSvgAnimation(svgAnimation);
  }

  destroy() {
    super.destroy();
    if (this.mask) this.mask.remove();
  }

  getStrokeAttrs(options) {
    return {
      fill: options.strokeColor,
      stroke: options.strokeColor,
      'stroke-width': options.strokeWidth,
    };
  }
}

module.exports = StrokePartRenderer;
