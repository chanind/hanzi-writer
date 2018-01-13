const Renderer = require('./Renderer');
const { getPathString } = require('../utils');
const svg = require('../svg');


class UserStrokeRenderer extends Renderer {
  constructor(userStroke, options = {}) {
    super();
    this.options = options;
    this.userStroke = userStroke;
  }

  getPathString() {
    return getPathString(this.userStroke.getPoints());
  }

  updatePath() {
    svg.attr(this.path, 'd', this.getPathString());
  }

  draw() {
    super.draw();
    this.path = svg.createElm('path');
    svg.attrs(this.path, this.getStrokeAttrs());
    this.updatePath();
    this.canvas.svg.appendChild(this.path);
    return this;
  }


  fadeAndRemove(animation) {
    const tween = new svg.StyleTween(this.path, 'opacity', 0, {
      duration: this.options.fadeDuration,
    });
    animation.registerSvgAnimation(tween);
    return tween.start().then(() => this.destroy());
  }

  getStrokeAttrs() {
    return {
      fill: 'none',
      stroke: this.options.strokeColor,
      'stroke-width': this.options.strokeWidth,
    };
  }

  destroy() {
    super.destroy();
    if (this.path) this.path.remove();
  }
}

module.exports = UserStrokeRenderer;
