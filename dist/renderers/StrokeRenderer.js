import Renderer from './Renderer';
import StrokePartRenderer from './StrokePartRenderer';
import {copyAndExtend, callIfExists} from '../utils';

// this is a stroke composed of several stroke parts
class StrokeRenderer extends Renderer {
  constructor(stroke, options = {}) {
    super();
    this.stroke = stroke;
    this.strokePartRenderers = this.stroke.getStrokeParts().map((strokePart) => {
      return this.registerChild(new StrokePartRenderer(strokePart, options));
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

  animate(animationOptions = {}) {
    this.animateStrokePart(0, animationOptions);
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

  getSpedUpAnimationOptions(animationOptions) {
    return copyAndExtend(animationOptions, {
      strokeAnimationDuration: animationOptions.strokeAnimationDuration / this.stroke.getStrokeParts().length,
    });
  }

  animateStrokePart(strokePartNum, animationOptions = {}) {
    const spedUpAnimationOptions = this.getSpedUpAnimationOptions(animationOptions);
    const strokePartRenderer = this.strokePartRenderers[strokePartNum];
    strokePartRenderer.animate(() => {
      if (strokePartNum < this.strokePartRenderers.length - 1) {
        this.animateStroke(strokePartNum + 1, spedUpAnimationOptions);
      } else {
        callIfExists(spedUpAnimationOptions.onComplete);
      }
    });
  }
}

export default StrokeRenderer;
