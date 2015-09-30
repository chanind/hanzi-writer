import Drawable from './Drawable';
import {emptyFunc} from './utils';

class Character extends Drawable {

  constructor(strokes, options = {}) {
    super();
    this.options = options;
    this.strokes = strokes;
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

  showStroke(strokeNum, animationOptions = {}) {
    this.getStroke(strokeNum).show(animationOptions);
  }

  getStroke(strokeNum) {
    return this.strokes[strokeNum];
  }

  getStrokes() {
    return this.strokes;
  }

  getNumStrokes() {
    return this.strokes.length;
  }

  draw() {
    for (const stroke of this.strokes) {
      stroke.draw();
    }
  }

  animate(onComplete = emptyFunc) {
    this.hide({onComplete: () => this.animateStroke(onComplete, 0)});
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    for (const stroke of this.strokes) {
      stroke.setCanvas(canvas);
    }
  }

  animateStroke(onComplete, strokeNum) {
    const stroke = this.strokes[strokeNum];
    stroke.animate(() => {
      if (strokeNum < this.strokes.length - 1) {
        const nextStroke = () => this.animateStroke(onComplete, strokeNum + 1);
        setTimeout(nextStroke, this.options.delayBetweenStrokes);
      } else {
        onComplete();
      }
    });
  }
}

export default Character;
