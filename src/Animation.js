const {callIfExists} = require('./utils');
const velocity = require('velocity-animate');

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
      velocity(svgAnimation, 'stop', true);
    }
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
