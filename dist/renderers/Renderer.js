class Renderer {

  constructor() {
    this.isDestroyed = false; // check this in children in animations, etc
    this.childRenderers = [];
    this.parentRenderer = null;
  }

  draw() {} // implement in children

  registerChild(child) {
    this.childRenderers.push(child);
    child.setParent(this);
    return child;
  }

  setParent(parent) {
    this.parentRenderer = parent;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  // extend this in children with extra behavior
  destroy() {
    this.isDestroyed = true;
    for (const child of this.childRenderers) {
      child.destroy();
    }
  }
}

export default Renderer;
