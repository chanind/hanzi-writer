import { subtract, distance, length } from '../geometry';
import { Point } from '../typings/types';

export default class Stroke {
  path: string;
  points: Point[];
  strokeNum: number;
  isInRadical: boolean;

  constructor(path: string, points: Point[], strokeNum: number, isInRadical = false) {
    this.path = path;
    this.points = points;
    this.strokeNum = strokeNum;
    this.isInRadical = isInRadical;
  }

  getStartingPoint() {
    return this.points[0];
  }

  getEndingPoint() {
    return this.points[this.points.length - 1];
  }

  getLength(): number {
    return length(this.points);
  }

  getVectors() {
    let lastPoint = this.points[0];
    const pointsSansFirst = this.points.slice(1);
    return pointsSansFirst.map((point) => {
      const vector = subtract(point, lastPoint);
      lastPoint = point;
      return vector;
    });
  }

  getDistance(point: Point) {
    const distances = this.points.map((strokePoint) => distance(strokePoint, point));
    return Math.min(...distances);
  }

  getAverageDistance(points: Point[]) {
    const totalDist = points.reduce((acc, point) => acc + this.getDistance(point), 0);
    return totalDist / points.length;
  }
}
