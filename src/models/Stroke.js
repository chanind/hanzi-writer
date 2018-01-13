const Point = require('./Point');

class Stroke {
  constructor(path, points, strokeNum) {
    this._path = path;
    this._points = points;
    this._strokeNum = strokeNum;
  }

  getStrokeNum() {
    return this._strokeNum;
  }

  getPath() {
    return this._path;
  }

  getPoints() {
    return this._points;
  }

  getStartingPoint() {
    return this._points[0];
  }

  getEndingPoint() {
    return this._points[this._points.length - 1];
  }

  getLength() {
    let lastPoint = this._points[0];
    const pointsSansFirst = this._points.slice(1);
    return pointsSansFirst.reduce((acc, point) => {
      const dist = Point.getDistance(point, lastPoint);
      lastPoint = point;
      return acc + dist;
    }, 0);
  }

  getVectors() {
    let lastPoint = this._points[0];
    const pointsSansFirst = this._points.slice(1);
    return pointsSansFirst.map((point) => {
      const vector = point.subtract(lastPoint);
      lastPoint = point;
      return vector;
    });
  }

  getDistance(point) {
    const distances = this._points.map(strokePoint => Point.getDistance(strokePoint, point));
    return Math.min.apply(Math, distances);
  }

  getAverageDistance(points) {
    const totalDist = points.reduce((acc, point) => acc + this.getDistance(point), 0);
    return totalDist / points.length;
  }
}

module.exports = Stroke;
