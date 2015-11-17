import Point from '../Point';
import StrokePart from '../StrokePart';

describe('Point', () => {
  describe('getBounds', () => {
    it('should return the upper left and bottom right points of a bounding box', () => {
      const points = [
        new Point(2,321),
        new Point(7, 100),
        new Point(5,154),
      ];
      const bounds = Point.getBounds(points);
      const expectedBounds = [
        new Point(2, 100),
        new Point(7, 321),
      ];
      expect(bounds).toEqual(expectedBounds);
    });
  });

  describe('getOverallBounds', () => {
    it('should return a bounding box around all the boundables', () => {
      const strokePart1 = new StrokePart(1, [
        new Point(2,321),
        new Point(7, 100),
      ]);
      const strokePart2 = new StrokePart(1, [
        new Point(1,200),
        new Point(3, 500),
      ]);

      const bounds = Point.getOverallBounds([strokePart1, strokePart2]);
      const expectedBounds = [
        new Point(1, 100),
        new Point(7, 500),
      ];
      expect(bounds).toEqual(expectedBounds);
    }) 
  });
});