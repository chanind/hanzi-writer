const svg = require('../svg');
const Point = require('../models/Point');

describe('svg', () => {
  describe('linesToPolygonPathString', () => {
    it("returns d path of the polygon that's the stroked path of the points passed in", () => {
      const points = [
        new Point(0, 0),
        new Point(5, 0),
        new Point(5, 2),
      ];
      expect(svg.linesToPolygonPathString(points, 2)).toEqual(
        'M 0 1 ' +
        'L 4 1 ' +
        'L 4 2 ' +
        'Q 5,3 6,2 ' +
        'L 6 -1 ' +
        'L 0 -1Z'
      );
    });
  });
});
