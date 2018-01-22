const svg = require('../svg');
const Point = require('../models/Point');

describe('svg', () => {
  describe('getPathString', () => {
    it("returns d path based on the points passed in", () => {
      const points = [
        new Point(0, 0),
        new Point(5, 0),
        new Point(5, 2),
      ];
      expect(svg.getPathString(points)).toEqual('M 0 0 L 5 0 L 5 2');
    });

    it('closes the path if close = true', () => {
      const points = [
        new Point(0, 0),
        new Point(5, 0),
        new Point(5, 2),
      ];
      expect(svg.getPathString(points, true)).toEqual('M 0 0 L 5 0 L 5 2Z');
    })
  });
});
