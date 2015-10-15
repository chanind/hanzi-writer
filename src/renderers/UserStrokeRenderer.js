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
    return super.draw().attr(this.getStrokeAttrs(this.options));
  }

  fadeAndRemove(animationOptions, animation) {
    const svgAnimation = this.path.animate(this.options.fadeDuration)
      .attr({opacity: 0})
      .after(() => this.destroy());
    animation.registerSvgAnimation(svgAnimation);
  }

  getStrokeAttrs(options) {
    return {
      fill: 'none',
      stroke: options.strokeColor,
      'stroke-width': options.strokeWidth,
    };
  }
}

export default UserStrokeRenderer;
