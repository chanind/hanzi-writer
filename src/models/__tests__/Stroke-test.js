const Stroke = require('../Stroke');

import Point from '../Point';
import StrokePart from '../StrokePart';

describe('Stroke', () => {
  it('should use the minimum distance to a stroke part when calculating distance', () => {
    const points = [
      new Point(1, 1),
      new Point(1, 4),
      new Point(5, 4),
      new Point(5, 1),
    ];
    const strokeParts = [
      new StrokePart(StrokePart.BACK_SLASH_STROKE, points),
      new StrokePart(StrokePart.HORIZONTAL_STROKE, points),
    ];

    expect(new Stroke(strokeParts, 0).getDistance(new Point(6,6))).toBe(1);
  });

  it('should sum the lengths of its parts', () => {
    const points = [
      new Point(1, 1),
      new Point(1, 4),
      new Point(5, 4),
      new Point(5, 1),
    ];
    const strokeParts = [
      new StrokePart(StrokePart.BACK_SLASH_STROKE, points), // length 5
      new StrokePart(StrokePart.HORIZONTAL_STROKE, points), // length 4
    ];

    expect(new Stroke(strokeParts, 0).getLength()).toBe(9);
  })
});