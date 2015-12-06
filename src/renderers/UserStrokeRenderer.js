import PathRenderer from './PathRenderer';


class UserStrokeRenderer extends PathRenderer {
  constructor(userStroke, options = {}) {
    super();
    this.options = options;
    this.userStroke = userStroke;
  }

  getPoints() {
    return this.userStroke.getPoints();
  }

  updatePath() {
    this.path.plot(this.getPathString());
  }

  draw() {
    super.draw();
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
}

export default UserStrokeRenderer;
