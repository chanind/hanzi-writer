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

  animate(onComplete = () => {}) {
    onComplete();
  }

  draw() {
    return super.draw().attr(this.options.userStrokeAttrs);
  }

  fadeAndRemove() {
    this.path.animate(this.options.userStrokeFadeDuration)
      .attr({opacity: 0})
      .after(() => this.destroy());
  }
}

export default UserStrokeRenderer;
