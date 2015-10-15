class Animation {

  constructor(parent = null) {
    this._svgAnimations = [];
    this._isActive = true;
    if (parent) parent.registerChild(this);
  }

  cancel() {
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

}

export default Animation;
