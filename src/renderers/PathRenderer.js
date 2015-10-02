import Renderer from './Renderer';

class PathRenderer extends Renderer {

  getPoints() {} // overwrite in children

  getPathString() {
    const points = this.getPoints();
    const start = points[0];
    const remainingPoints = points.slice(1);
    let pathString = `M ${start.getX()} ${start.getY()}`;
    for (const point of remainingPoints) {
      pathString += ` L ${point.getX()} ${point.getY()}`;
    }
    return pathString;
  }

  drawPath() {
    this.path = this.canvas.path(this.getPathString());
    return this.path;
  }

  draw() {
    return this.drawPath();
  }
}

export default PathRenderer;
