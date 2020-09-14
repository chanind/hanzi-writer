import { subtract, distance, length } from "../geometry";
import { Point } from "../typings/types";

export default class Stroke {
  path: any;
  points: Point[];
  strokeNum: number;
  isInRadical: boolean;

  constructor(path: any, points: Point[], strokeNum: number, isInRadical = false) {
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
    return pointsSansFirst.map((point: any) => {
      const vector = subtract(point, lastPoint);
      lastPoint = point;
      return vector;
    });
  }

  getDistance(point: any) {
    const distances = this.points.map((strokePoint: any) => distance(strokePoint, point));
    return Math.min.apply(Math, distances);
  }

  getAverageDistance(points: any) {
    const totalDist = points.reduce(
      (acc: any, point: any) => acc + this.getDistance(point),
      0,
    );
    return totalDist / points.length;
  }
}
