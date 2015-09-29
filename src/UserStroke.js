import Path from './Path';

class UserStroke extends Path {
  constructor(startingPoint, options = {}) {
    super();
    this.options = options;
    this.points = [startingPoint];
  }

  appendPoint(point) {
    this.points.push(point);
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
      .after(() => this.path.remove());
  }
}

export default UserStroke;
