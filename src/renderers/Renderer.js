import {emptyFunc} from '../utils';

class Renderer {

  draw() {} // implement in children

  animate(onComplete = emptyFunc) {} // implement in children

  setCanvas(canvas) {
    this.canvas = canvas;
  }
}

export default Renderer;
