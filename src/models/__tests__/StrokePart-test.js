const StrokePart = require('../StrokePart');

import Point from '../Point';

describe('StrokePart', () => {
  it('should properly get starting points for each stroke type', () => {
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
    expect(new StrokePart(StrokePart.REVERSE_VERTICAL_STROKE, points).getStartingPoint()).toEqual(new Point(3, 5));
    expect(new StrokePart(StrokePart.REVERSE_FORWARD_SLASH_STROKE, points).getStartingPoint()).toEqual(new Point(1,5));
  });
  it('should properly get ending points for each stroke type', () => {
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
    expect(new StrokePart(StrokePart.REVERSE_VERTICAL_STROKE, points).getEndingPoint()).toEqual(new Point(3, 1));
    expect(new StrokePart(StrokePart.REVERSE_FORWARD_SLASH_STROKE, points).getEndingPoint()).toEqual(new Point(5,1));
  });
});