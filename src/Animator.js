const Animation = require('./Animation');

function Animator() {
  this._lastAnimation = null;
}

Animator.prototype.animate = function(func, options = {}) {
  const animation = this._setupAnimation(options);
  return func(animation).then(() => animation.finish());
};

Animator.prototype._setupAnimation = function(options) {
  this.cancel();
  this._lastAnimation = new Animation(options);
  return this._lastAnimation;
};

Animator.prototype.cancel = function() {
  if (this._lastAnimation) this._lastAnimation.cancel();
};

module.exports = Animator;
