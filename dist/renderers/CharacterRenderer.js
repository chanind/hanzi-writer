import Renderer from './Renderer';
import StrokeRenderer from './StrokeRenderer';
import {copyAndExtend, callIfExists} from '../utils';

class CharacterRenderer extends Renderer {

  constructor(character, options = {}) {
    super();
    this.options = options;
    this.character = character;
    this.strokeRenderers = this.character.getStrokes().map((stroke) => {
      return this.registerChild(new StrokeRenderer(stroke, options));
    });
  }

  getBounds() {
    return this.character.getBounds();
  }

  show(animationOptions) {
    for (const strokeRenderer of this.strokeRenderers) {
      strokeRenderer.show(animationOptions);
    }
  }

  hide(animationOptions) {
    for (const strokeRenderer of this.strokeRenderers) {
      strokeRenderer.hide(animationOptions);
    }
  }

  showStroke(strokeNum, animationOptions) {
    this.getStrokeRenderer(strokeNum).show(animationOptions);
  }

  draw() {
    for (const strokeRenderer of this.strokeRenderers) {
      strokeRenderer.draw();
    }
  }

  getStrokeRenderer(strokeNum) {
    return this.strokeRenderers[strokeNum];
  }

  animate(animationOptions) {
    const proxiedOptions = copyAndExtend(animationOptions, {
      onComplete: () => this.animateStroke(0, animationOptions),
    });
    this.hide(proxiedOptions);
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    for (const strokeRenderer of this.strokeRenderers) {
      strokeRenderer.setCanvas(canvas);
    }
  }

  animateStroke(strokeNum, animationOptions) {
    const renderNextStroke = () => {
      if (strokeNum < this.strokeRenderers.length - 1) {
        const nextStroke = () => this.animateStroke(strokeNum + 1, animationOptions);
        setTimeout(nextStroke, this.options.delayBetweenStrokes);
      } else {
        callIfExists(animationOptions.onComplete);
      }
    };
    const strokeRenderer = this.strokeRenderers[strokeNum];
    const proxiedOptions = copyAndExtend(animationOptions, {
      onComplete: renderNextStroke,
    });
    strokeRenderer.animate(proxiedOptions);
  }
}

export default CharacterRenderer;
