const {callIfExists} = require('./utils');

function Animation(options = {}) {
  this._svgAnimations = [];
  this._isActive = true;
  this._callback = options.onComplete;
}

Animation.prototype.cancel = function() {
  if (!this.isActive()) return;
  this._isActive = false;
  this._svgAnimations.forEach(anim => anim.finish());
};

Animation.prototype.registerSvgAnimation = function(svgAnimation) {
  if (this._svgAnimations.indexOf(svgAnimation) === -1) {
    this._svgAnimations.push(svgAnimation);
  }
};

Animation.prototype.isActive = function() {
  return this._isActive;
};

Animation.prototype.finish = function() {
  if (this.isActive()) {
    this._isActive = false;
    callIfExists(this._callback);
  }
};

module.exports = Animation;
