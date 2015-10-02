import PathRenderer from './PathRenderer';
import {emptyFunc} from '../utils';

class StrokePartRenderer extends PathRenderer {

  constructor(strokePart, options = {}) {
    super();
    this.options = options;
    this.strokePart = strokePart;
    this.animationSpeedupRatio = 1;
  }

  getPathString() {
    return super.getPathString() + ' z';
  }

  getPoints() {
    return this.strokePart.getPoints();
  }

  setAnimationSpeedupRatio(animationSpeedupRatio) {
    this.animationSpeedupRatio = animationSpeedupRatio;
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

  show(animationOptions = {}) {
    this.path.animate(animationOptions.duration || 300)
      .opacity(1)
      .after(animationOptions.onComplete || emptyFunc);
  }

  hide(animationOptions = {}) {
    this.path.animate(animationOptions.duration || 300)
      .opacity(0)
      .after(animationOptions.onComplete || emptyFunc);
  }

  animate(onComplete = emptyFunc) {
    const start = this.strokePart.getStartingPoint();
    const mask = this.canvas.circle(0).center(start.getX(), start.getY());
    if (!this.path) this.drawPath();
    this.path
      .attr({opacity: 1})
      .attr(this.options.strokeAttrs)
      .clipWith(mask);

    mask.animate(this.options.strokeAnimationDuration / this.animationSpeedupRatio)
      .radius(this.strokePart.getLength())
      .after(onComplete);
  }

  getAllXs(points) {
    return points.map((point) => point.getX());
  }
  getAllYs(points) {
    return points.map((point) => point.getY());
  }
}

module.exports = StrokePartRenderer;
