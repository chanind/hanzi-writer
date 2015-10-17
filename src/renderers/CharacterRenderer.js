import Renderer from './Renderer';
import StrokeRenderer from './StrokeRenderer';
import {timeout} from '../utils';

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

  show(animation) {
    const promises = this.strokeRenderers.map(strokeRenderer => strokeRenderer.show(animation));
    return Promise.all(promises);
  }

  hide(animation) {
    const promises = this.strokeRenderers.map(strokeRenderer => strokeRenderer.hide(animation));
    return Promise.all(promises);
  }

  showStroke(strokeNum, animation) {
    return this.getStrokeRenderer(strokeNum).show(animation);
  }

  draw() {
    for (const strokeRenderer of this.strokeRenderers) {
      strokeRenderer.draw();
    }
  }

  getStrokeRenderer(strokeNum) {
    return this.strokeRenderers[strokeNum];
  }

  animate(animation) {
    if (!animation.isActive()) return null;
    let renderChain = this.hide(animation);
    this.strokeRenderers.forEach((strokeRenderer, index) => {
      if (index > 0) renderChain = renderChain.then(() => timeout(this.options.delayBetweenStrokes));
      renderChain = renderChain.then(() => strokeRenderer.animate(animation));
    });
    return renderChain;
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    for (const strokeRenderer of this.strokeRenderers) {
      strokeRenderer.setCanvas(canvas);
    }
  }
}

export default CharacterRenderer;
