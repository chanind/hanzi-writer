import Renderer from './Renderer';
import StrokePartRenderer from './StrokePartRenderer';
import {emptyFunc} from '../utils';

// this is a stroke composed of several stroke parts
class StrokeRenderer extends Renderer {
  constructor(stroke, options = {}) {
    super();
    this.stroke = stroke;
    this.strokePartRenderers = this.stroke.getStrokeParts().map((strokePart) => {
      return new StrokePartRenderer(strokePart, options);
    });
    this.options = options;
    for (const strokePartRenderer of this.strokePartRenderers) {
      strokePartRenderer.setAnimationSpeedupRatio(this.strokePartRenderers.length);
    }
  }

  show(animationOptions = {}) {
    for (const strokePartRenderer of this.strokePartRenderers) {
      strokePartRenderer.show(animationOptions);
    }
  }

  hide(animationOptions = {}) {
    for (const strokePartRenderer of this.strokePartRenderers) {
      strokePartRenderer.hide(animationOptions);
    }
  }

  draw() {
    for (const strokePartRenderer of this.strokePartRenderers) {
      strokePartRenderer.draw(this.canvas);
    }
  }

  animate(onComplete = emptyFunc) {
    this.animateStroke(onComplete, 0);
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    for (const strokePartRenderer of this.strokePartRenderers) {
      strokePartRenderer.setCanvas(canvas);
    }
  }

  highlight() {
    for (const strokePartRenderer of this.strokePartRenderers) {
      strokePartRenderer.highlight();
    }
  }

  animateStroke(onComplete, strokePartNum) {
    const strokePartRenderer = this.strokePartRenderers[strokePartNum];
    strokePartRenderer.animate(() => {
      if (strokePartNum < this.strokePartRenderers.length - 1) {
        this.animateStroke(onComplete, strokePartNum + 1);
      } else {
        onComplete();
      }
    });
  }
}

export default StrokeRenderer;
