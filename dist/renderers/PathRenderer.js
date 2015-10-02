import Renderer from './Renderer';

class PathRenderer extends Renderer {

  getPathString() {
    const start = this.points[0];
    const remainingPoints = this.points.slice(1);
    let pathString = `M ${start.x} ${start.y}`;
    for (const point of remainingPoints) {
      pathString += ` L ${point.x} ${point.y}`;
    }
    return pathString;
  }

  drawPath() {
    this.path = this.canvas.path(this.getPathString());
    return this.path;
  }

  getPoints() {
    return this.points;
  }

  getBounds() {
    const [maxY, , minY] = this.getExtremes(this.getAllYs(this.points));
    const [maxX, , minX] = this.getExtremes(this.getAllXs(this.points));
    return [{x: minX, y: minY}, {x: maxX, y: maxY}];
  }

  draw() {
    return this.drawPath();
  }
}

export default PathRenderer;
