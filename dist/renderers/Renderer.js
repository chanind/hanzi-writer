import {emptyFunc} from '../utils';

class Renderer {

  draw() {} // implement in children

  animate(onComplete = emptyFunc) {} // implement in children

  getBounds() {} // implement in children

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  // ---- convenience methods for children ----

  getExtremes(numArray) {
    const max = Math.max.apply(null, numArray);
    const min = Math.min.apply(null, numArray);
    const mid = (max + min) / 2;
    return [max, mid, min];
  }

  getAllXs(points) {
    return points.map((point) => point.x);
  }
  getAllYs(points) {
    return points.map((point) => point.y);
  }
}

export default Renderer;
