import Animation from './Animation';

class Animator {
  construct() {
    this._lastAnimation = null;
  }

  animate(func, options = {}) {
    const animation = this._setupAnimation(options);
    func(animation).then(() => animation.finish());
  }

  _setupAnimation(options) {
    if (this._lastAnimation) this._lastAnimation.cancel();
    this._lastAnimation = new Animation(options);
    return this._lastAnimation;
  }
}

export default Animator;
