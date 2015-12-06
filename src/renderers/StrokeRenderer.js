import Renderer from './Renderer';
import StrokePartRenderer from './StrokePartRenderer';
import {Promise} from 'es6-promise';

// this is a stroke composed of several stroke parts
class StrokeRenderer extends Renderer {
  constructor(stroke, options = {}) {
    super();
    this.stroke = stroke;
    this.strokePartRenderers = this.stroke.getStrokeParts().map((strokePart) => {
      return this.registerChild(new StrokePartRenderer(strokePart, stroke, options));
    });
    this.options = options;
  }

  show(animation) {
    const promises = this.strokePartRenderers.map(strokePartRenderer => strokePartRenderer.show(animation));
    return Promise.all(promises);
  }

  showImmediate() {
    this.strokePartRenderers.map(renderer => renderer.showImmediate());
  }

  hide(animation) {
    const promises = this.strokePartRenderers.map(strokePartRenderer => strokePartRenderer.hide(animation));
    return Promise.all(promises);
  }

  hideImmediate() {
    this.strokePartRenderers.map(renderer => renderer.hideImmediate());
  }

  draw() {
    for (const strokePartRenderer of this.strokePartRenderers) {
      strokePartRenderer.draw(this.canvas);
    }
    return this;
  }

  animate(animation) {
    if (!animation.isActive()) return null;
    let renderChain = Promise.resolve();
    this.strokePartRenderers.forEach((strokePartRenderer) => {
      renderChain = renderChain.then(() => strokePartRenderer.animate(animation));
    });
    return renderChain;
  }

  highlight(animation) {
    return this.animate(animation).then(() => this.hide(animation));
  }

  setCanvas(canvas) {
    super.setCanvas(canvas);
    for (const strokePartRenderer of this.strokePartRenderers) {
      strokePartRenderer.setCanvas(canvas);
    }
  }
}

export default StrokeRenderer;
