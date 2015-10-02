import Renderer from './Renderer';
import {emptyFunc} from '../utils';

// this is a stroke composed of several stroke parts
class StrokeRenderer extends Renderer {
  constructor(strokeParts, options = {}) {
    super();
    this.strokeParts = strokeParts;
    this.options = options;
    for (const strokePart of this.strokeParts) {
      strokePart.setAnimationSpeedupRatio(this.strokeParts.length);
    }
  }

  show(animationOptions = {}) {
    for (const strokePart of this.strokeParts) {
      strokePart.show(animationOptions);
    }
  }

  hide(animationOptions = {}) {
    for (const strokePart of this.strokeParts) {
      strokePart.hide(animationOptions);
    }
  }

  draw() {
    for (const strokePart of this.strokeParts) {
      strokePart.draw(this.canvas);
    }
  }

  animate(onComplete = emptyFunc) {
    this.animateStroke(onComplete, 0);
  }

  getDistance(point) {
    const distances = this.strokeParts.map((strokePart) => {
      return strokePart.getDistance(point);
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
    const strokePartBoundingPoints = this.getAllStrokeBounds();
    const [maxY, , minY] = this.getExtremes(this.getAllYs(strokePartBoundingPoints));
    const [maxX, , minX] = this.getExtremes(this.getAllXs(strokePartBoundingPoints));
    return [{x: minX, y: minY}, {x: maxX, y: maxY}];
  }

  getAllStrokeBounds() {
    const bounds = [];
    for (const strokePart of this.strokeParts) {
      const strokePartBounds = strokePart.getBounds();
      bounds.push(strokePartBounds[0]);
      bounds.push(strokePartBounds[1]);
    }
    return bounds;
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    for (const strokePart of this.strokeParts) {
      strokePart.setCanvas(canvas);
    }
  }

  highlight() {
    for (const strokePart of this.strokeParts) {
      strokePart.highlight();
    }
  }

  animateStroke(onComplete, strokePartNum) {
    const strokePart = this.strokeParts[strokePartNum];
    strokePart.animate(() => {
      if (strokePartNum < this.strokeParts.length - 1) {
        this.animateStroke(onComplete, strokePartNum + 1);
      } else {
        onComplete();
      }
    });
  }
}

export default StrokeRenderer;
