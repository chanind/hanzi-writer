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
    const spedUpAnimationOptions = this.getSpedUpAnimationOptions(animationOptions);
    this.animateStrokePart(0, spedUpAnimationOptions);
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
      strokeAnimationDuration: animationOptions.strokeAnimationDuration / this.strokePartRenderers.length,
    });
  }

  animateStrokePart(strokePartNum, animationOptions) {
    const renderNextStrokePart = () => {
      if (strokePartNum < this.strokePartRenderers.length - 1) {
        this.animateStrokePart(strokePartNum + 1, animationOptions);
      } else {
        callIfExists(animationOptions.onComplete);
      }
    };
    const strokePartRenderer = this.strokePartRenderers[strokePartNum];
    const proxiedOptions = copyAndExtend(animationOptions, {
      onComplete: renderNextStrokePart,
    });
    strokePartRenderer.animate(proxiedOptions);
  }
}

export default StrokeRenderer;
