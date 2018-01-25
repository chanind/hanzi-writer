const Animation = require('./Animation');

function Animator() {
  this._lastAnimation = null;
}

Animator.prototype.animate = function(func, options = {}) {
  const animation = this._setupAnimation(options);
  return func(animation).then(() => animation.finish());
};

Animator.prototype._setupAnimation = function(options) {
  if (this._lastAnimation) this._lastAnimation.cancel();
  this._lastAnimation = new Animation(options);
  return this._lastAnimation;
};

module.exports = Animator;
