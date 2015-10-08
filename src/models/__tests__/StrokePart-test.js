const StrokePart = require('../StrokePart');

import Point from '../Point';

describe('StrokePart', () => {
  it('should get starting points based on the stroke type', () => {
    const points = [
      new Point(1, 1),
      new Point(1, 5),
      new Point(5, 5),
      new Point(5, 1),
    ];
    expect(new StrokePart(StrokePart.HORIZONTAL_STROKE, points).getStartingPoint()).toEqual(new Point(1,3));
    expect(new StrokePart(StrokePart.BACK_SLASH_STROKE, points).getStartingPoint()).toEqual(new Point(1,1));
    expect(new StrokePart(StrokePart.VERTICAL_STROKE, points).getStartingPoint()).toEqual(new Point(3,1));
    expect(new StrokePart(StrokePart.FORWARD_SLASH_STROKE, points).getStartingPoint()).toEqual(new Point(5,1));
    expect(new StrokePart(StrokePart.REVERSE_HORIZONTAL_STROKE, points).getStartingPoint()).toEqual(new Point(5,3));
    expect(new StrokePart(StrokePart.REVERSE_BACK_SLASH_STROKE, points).getStartingPoint()).toEqual(new Point(5,5));
    expect(new StrokePart(StrokePart.REVERSE_VERTICAL_STROKE, points).getStartingPoint()).toEqual(new Point(3,5));
    expect(new StrokePart(StrokePart.REVERSE_FORWARD_SLASH_STROKE, points).getStartingPoint()).toEqual(new Point(1,5));
  });

  it('should get ending points based on the stroke type', () => {
    const points = [
      new Point(1, 1),
      new Point(1, 5),
      new Point(5, 5),
      new Point(5, 1),
    ];
    expect(new StrokePart(StrokePart.HORIZONTAL_STROKE, points).getEndingPoint()).toEqual(new Point(5,3));
    expect(new StrokePart(StrokePart.BACK_SLASH_STROKE, points).getEndingPoint()).toEqual(new Point(5,5));
    expect(new StrokePart(StrokePart.VERTICAL_STROKE, points).getEndingPoint()).toEqual(new Point(3,5));
    expect(new StrokePart(StrokePart.FORWARD_SLASH_STROKE, points).getEndingPoint()).toEqual(new Point(1,5));
    expect(new StrokePart(StrokePart.REVERSE_HORIZONTAL_STROKE, points).getEndingPoint()).toEqual(new Point(1,3));
    expect(new StrokePart(StrokePart.REVERSE_BACK_SLASH_STROKE, points).getEndingPoint()).toEqual(new Point(1,1));
    expect(new StrokePart(StrokePart.REVERSE_VERTICAL_STROKE, points).getEndingPoint()).toEqual(new Point(3,1));
    expect(new StrokePart(StrokePart.REVERSE_FORWARD_SLASH_STROKE, points).getEndingPoint()).toEqual(new Point(5,1));
  });

  it('should calculate length of the stroke based on start and end points', () => {
    const points = [
      new Point(1, 1),
      new Point(1, 4),
      new Point(5, 4),
      new Point(5, 1),
    ];
    expect(new StrokePart(StrokePart.HORIZONTAL_STROKE, points).getLength()).toBe(4);
    expect(new StrokePart(StrokePart.BACK_SLASH_STROKE, points).getLength()).toBe(5);
    expect(new StrokePart(StrokePart.VERTICAL_STROKE, points).getLength()).toBe(3);
    expect(new StrokePart(StrokePart.FORWARD_SLASH_STROKE, points).getLength()).toBe(5);
    expect(new StrokePart(StrokePart.REVERSE_HORIZONTAL_STROKE, points).getLength()).toBe(4);
    expect(new StrokePart(StrokePart.REVERSE_BACK_SLASH_STROKE, points).getLength()).toBe(5);
    expect(new StrokePart(StrokePart.REVERSE_VERTICAL_STROKE, points).getLength()).toBe(3);
    expect(new StrokePart(StrokePart.REVERSE_FORWARD_SLASH_STROKE, points).getLength()).toBe(5);
  });

  it('should calculate distance based on a line between start and end points', () => {
    const points = [
      new Point(1, 1),
      new Point(1, 4),
      new Point(5, 4),
      new Point(5, 1),
    ];
    const refPoint = new Point(6,6);
    expect(new StrokePart(StrokePart.HORIZONTAL_STROKE, points).getDistance(refPoint)).toBe(4);
    expect(new StrokePart(StrokePart.BACK_SLASH_STROKE, points).getDistance(refPoint)).toBe(1);
    expect(new StrokePart(StrokePart.VERTICAL_STROKE, points).getDistance(refPoint)).toBe(3);
    expect(new StrokePart(StrokePart.FORWARD_SLASH_STROKE, points).getDistance(refPoint)).toBe(4.6);
    expect(new StrokePart(StrokePart.REVERSE_HORIZONTAL_STROKE, points).getDistance(refPoint)).toBe(4);
    expect(new StrokePart(StrokePart.REVERSE_BACK_SLASH_STROKE, points).getDistance(refPoint)).toBe(1);
    expect(new StrokePart(StrokePart.REVERSE_VERTICAL_STROKE, points).getDistance(refPoint)).toBe(3);
    expect(new StrokePart(StrokePart.REVERSE_FORWARD_SLASH_STROKE, points).getDistance(refPoint)).toBe(4.6);
  });
});