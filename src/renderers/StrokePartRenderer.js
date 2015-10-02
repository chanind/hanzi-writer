import PathRenderer from './PathRenderer';
import {emptyFunc} from '../utils';

class StrokePartRenderer extends PathRenderer {

  constructor(points, strokeType, options = {}) {
    super();
    this.options = options;
    this.points = points;
    this.strokeType = strokeType;
    this.animationSpeedupRatio = 1;
  }

  getPathString() {
    return super.getPathString() + ' z';
  }

  setAnimationSpeedupRatio(animationSpeedupRatio) {
    this.animationSpeedupRatio = animationSpeedupRatio;
  }

  // http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
  getDistance(point) {
    const start = this.getStrokeAnimationStartingPoint();
    const end = this.getStrokeAnimationEndingPoint();
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = this.getStrokeAnimationDistance();
    return Math.abs(dy * point.x - dx * point.y - start.x * end.y + start.y * end.x) / length;
  }

  getAverageDistance(points) {
    let totalDist = 0;
    for (const point of points) {
      totalDist += this.getDistance(point);
    }
    return totalDist / points.length;
  }

  getLength() {
    const start = this.getStrokeAnimationStartingPoint();
    const end = this.getStrokeAnimationEndingPoint();
    return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
  }

  getStrokeAnimationStartingPoint() {
    return this.getStrokeAnimationExtremePoint(this.strokeType, false);
  }

  getStrokeAnimationEndingPoint() {
    return this.getStrokeAnimationExtremePoint(this.strokeType, true);
  }

  // where to start or end drawing the stroke based on the stroke type
  getStrokeAnimationExtremePoint(strokeType, isReverse) {
    let adjStrokeType = strokeType;
    let adjIsReverse = isReverse;
    const extremeYs = this.getExtremes(this.getAllYs(this.points));
    const extremeXs = this.getExtremes(this.getAllXs(this.points));

    // handle reversed strokes
    if (strokeType > StrokePartRenderer.FORWARD_SLASH_STROKE) {
      adjStrokeType = strokeType - StrokePartRenderer.FORWARD_SLASH_STROKE;
      adjIsReverse = !isReverse;
    }

    const minIndex = adjIsReverse ? 0 : 2;
    const maxIndex = adjIsReverse ? 2 : 0;
    const midIndex = 1;

    if (adjStrokeType === StrokePartRenderer.HORIZONTAL_STROKE) return {x: extremeXs[minIndex], y: extremeYs[midIndex]};
    if (adjStrokeType === StrokePartRenderer.BACK_SLASH_STROKE) return {x: extremeXs[minIndex], y: extremeYs[minIndex]};
    if (adjStrokeType === StrokePartRenderer.VERTICAL_STROKE) return {x: extremeXs[midIndex], y: extremeYs[minIndex]};
    if (adjStrokeType === StrokePartRenderer.FORWARD_SLASH_STROKE) return {x: extremeXs[maxIndex], y: extremeYs[minIndex]};
  }

  getStrokeAnimationDistance() {
    const start = this.getStrokeAnimationStartingPoint();
    const end = this.getStrokeAnimationEndingPoint();
    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  }

  markAnimationPoints() {
    const start = this.getStrokeAnimationStartingPoint();
    const end = this.getStrokeAnimationEndingPoint();
    this.canvas.circle(10).attr({fill: '#9F9'}).move(start.x, start.y);
    this.canvas.circle(10).attr({fill: '#9F9'}).move(end.x, end.y);
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
    const start = this.getStrokeAnimationStartingPoint();
    const mask = this.canvas.circle(0).center(start.x, start.y);
    if (!this.path) this.drawPath();
    this.path
      .attr({opacity: 1})
      .attr(this.options.strokeAttrs)
      .clipWith(mask);

    mask.animate(this.options.strokeAnimationDuration / this.animationSpeedupRatio)
      .radius(this.getStrokeAnimationDistance())
      .after(onComplete);
  }
}

StrokePartRenderer.HORIZONTAL_STROKE = 1;
StrokePartRenderer.BACK_SLASH_STROKE = 2;
StrokePartRenderer.VERTICAL_STROKE = 3;
StrokePartRenderer.FORWARD_SLASH_STROKE = 4;
StrokePartRenderer.REVERSE_HORIZONTAL_STROKE = 5;
StrokePartRenderer.REVERSE_BACK_SLASH_STROKE = 6;
StrokePartRenderer.REVERSE_VERTICAL_STROKE = 7;
StrokePartRenderer.REVERSE_FORWARD_SLASH_STROKE = 8;

module.exports = StrokePartRenderer;
