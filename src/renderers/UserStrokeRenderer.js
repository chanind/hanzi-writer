import Renderer from './Renderer';
import { getPathString } from '../utils';


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
    this.path.plot(this.getPathString());
  }

  draw() {
    super.draw();
    this.path = this.canvas.path(this.getPathString());
    this.path.attr(this.getStrokeAttrs());
    return this;
  }


  fadeAndRemove(animation) {
    return new Promise((resolve, reject) => {
      const svgAnimation = this.path.animate(this.options.fadeDuration)
        .attr({opacity: 0})
        .after(resolve);
      animation.registerSvgAnimation(svgAnimation);
    }).then(() => this.destroy());
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

export default UserStrokeRenderer;
