import Point from './Point';

class UserStroke {
  constructor(startingPoint) {
    this._points = [startingPoint];
  }

  getPoints() {
    return this._points;
  }

  getBounds() {
    return Point.getBounds(this._points);
  }

  appendPoint(point) {
    this._points.push(point);
  }
}

export default UserStroke;
