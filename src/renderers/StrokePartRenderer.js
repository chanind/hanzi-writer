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
        fill: this.options.strokeHighlightColor,
        stroke: this.options.strokeHighlightColor,
        opacity: 1,
      })
      .after(() => {
        this.path.animate(this.options.strokeHighlightDuration)
          .attr({opacity: 0})
          .after(() => this.path.attr(this.options.strokeAttrs));
      });
  }

  draw() {
    return super.draw().attr(this.options.strokeAttrs).attr({opacity: 0});
  }

  show(animationOptions) {
    this.path.animate(animationOptions.strokeAnimationDuration)
      .opacity(1)
      .after(animationOptions.triggerOnComplete());
  }

  hide(animationOptions) {
    this.path.animate(animationOptions.strokeAnimationDuration)
      .opacity(0)
      .after(animationOptions.triggerOnComplete());
  }

  animate(animationOptions) {
    const start = this.strokePart.getStartingPoint();
    const mask = this.canvas.circle(0).center(start.getX(), start.getY());
    if (!this.path) this.drawPath();
    this.path
      .attr({opacity: 1})
      .attr(this.options.strokeAttrs)
      .clipWith(mask);

    mask.animate(this.options.strokeAnimationDuration)
      .radius(this.strokePart.getLength())
      .after(animationOptions.onComplete);
  }
}

module.exports = StrokePartRenderer;
