import {callIfExists} from './utils';

class Animation {

  constructor(options = {}) {
    this._svgAnimations = [];
    this._isActive = true;
    this._callback = options.onComplete;
  }

  cancel() {
    if (!this.isActive()) return;

    this._isActive = false;
    for (const svgAnimation of this._svgAnimations) {
      svgAnimation.stop(true);
    }
  }

  registerSvgAnimation(svgAnimation) {
    this._svgAnimations.push(svgAnimation);
  }

  isActive() {
    return this._isActive;
  }

  finish() {
    if (this.isActive()) {
      this._isActive = false;
      callIfExists(this._callback);
    }
  }

}

export default Animation;
