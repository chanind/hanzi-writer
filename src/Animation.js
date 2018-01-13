const {callIfExists} = require('./utils');

class Animation {

  constructor(options = {}) {
    this._svgAnimations = [];
    this._isActive = true;
    this._callback = options.onComplete;
  }

  cancel() {
    if (!this.isActive()) return;
    this._isActive = false;
    this._svgAnimations.forEach(anim => anim.finish());
  }

  registerSvgAnimation(svgAnimation) {
    if (this._svgAnimations.indexOf(svgAnimation) === -1) {
      this._svgAnimations.push(svgAnimation);
    }
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

module.exports = Animation;
