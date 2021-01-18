import { Point } from '../typings/types';

export default class UserStroke {
  id: number;
  points: Point[];
  externalPoints: Point[];

  constructor(id: number, startingPoint: Point, startingExternalPoint: Point) {
    this.id = id;
    this.points = [startingPoint];
    this.externalPoints = [startingExternalPoint];
  }

  appendPoint(point: Point, externalPoint: Point) {
    this.points.push(point);
    this.externalPoints.push(externalPoint);
  }
}
