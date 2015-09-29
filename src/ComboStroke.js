import Drawable from './Drawable.coffee';
import {emptyFunc} from './utils';

// this is a stroke composed of several stroke parts
class ComboStroke extends Drawable {
  constructor(strokes, options = {}) {
    super();
    this.strokes = strokes;
    this.options = options;
    for (const stroke of this.strokes) {
      stroke.setAnimationSpeedupRatio(this.strokes.length);
    }
  }

  show(animationOptions = {}) {
    for (const stroke of this.strokes) {
      stroke.show(animationOptions);
    }
  }

  hide(animationOptions = {}) {
    for (const stroke of this.strokes) {
      stroke.hide(animationOptions);
    }
  }

  draw() {
    for (const stroke of this.strokes) {
      stroke.draw(this.canvas);
    }
  }

  animate(onComplete = emptyFunc) {
    this.animateStroke(onComplete, 0);
  }

  getDistance(point) {
    const distances = this.strokes.map((stroke) => {
      return stroke.getDistance(point);
    });
    return Math.min.apply(Math, distances);
  }

  getAverageDistance(points) {
    let totalDist = 0;
    for (const point of points) {
      totalDist += this.getDistance(point);
    }
    return totalDist / points.length;
  }

  getBounds() {
    const strokeBoundingPoints = this.getAllStrokeBounds();
    const [maxY, , minY] = this.getExtremes(this.getAllYs(strokeBoundingPoints));
    const [maxX, , minX] = this.getExtremes(this.getAllXs(strokeBoundingPoints));
    return [{x: minX, y: minY}, {x: maxX, y: maxY}];
  }

  getAllStrokeBounds() {
    const bounds = [];
    for (const stroke of this.strokes) {
      const strokeBounds = stroke.getBounds();
      bounds.push(strokeBounds[0]);
      bounds.push(strokeBounds[1]);
    }
    return bounds;
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    for (const stroke of this.strokes) {
      stroke.setCanvas(canvas);
    }
  }

  highlight() {
    for (const stroke of this.strokes) {
      stroke.highlight();
    }
  }

  animateStroke(onComplete, strokeNum) {
    const stroke = this.strokes[strokeNum];
    stroke.animate(() => {
      if (strokeNum < this.strokes.length - 1) {
        this.animateStroke(onComplete, strokeNum + 1);
      } else {
        onComplete();
      }
    });
  }
}

export default ComboStroke;
