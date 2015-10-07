import Renderer from './Renderer';
import StrokeRenderer from './StrokeRenderer';
import {emptyFunc} from '../utils';

class CharacterRenderer extends Renderer {

  constructor(character, options = {}) {
    super();
    this.options = options;
    this.character = character;
    this.strokeRenderers = this.character.getStrokes().map((stroke) => {
      return new StrokeRenderer(stroke, options);
    });
  }

  getBounds() {
    return this.character.getBounds();
  }

  show(animationOptions = {}) {
    for (const strokeRenderer of this.strokeRenderers) {
      strokeRenderer.show(animationOptions);
    }
  }

  hide(animationOptions = {}) {
    for (const strokeRenderer of this.strokeRenderers) {
      strokeRenderer.hide(animationOptions);
    }
  }

  showStroke(strokeNum, animationOptions = {}) {
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

  animate(onComplete = emptyFunc) {
    this.hide({onComplete: () => this.animateStroke(onComplete, 0)});
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    for (const strokeRenderer of this.strokeRenderers) {
      strokeRenderer.setCanvas(canvas);
    }
  }

  animateStroke(onComplete, strokeNum) {
    const strokeRenderer = this.strokeRenderers[strokeNum];
    strokeRenderer.animate(() => {
      if (strokeNum < this.strokeRenderers.length - 1) {
        const nextStroke = () => this.animateStroke(onComplete, strokeNum + 1);
        setTimeout(nextStroke, this.options.delayBetweenStrokes);
      } else {
        onComplete();
      }
    });
  }
}

export default CharacterRenderer;
