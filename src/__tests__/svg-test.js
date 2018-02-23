const svg = require('../svg');

describe('svg', () => {
  describe('getPathString', () => {
    it('returns d path based on the points passed in', () => {
      const points = [
        {x: 0, y: 0},
        {x: 5, y: 0},
        {x: 5, y: 2},
      ];
      expect(svg.getPathString(points)).toEqual('M 0 0 L 5 0 L 5 2');
    });

    it('closes the path if close = true', () => {
      const points = [
        {x: 0, y: 0},
        {x: 5, y: 0},
        {x: 5, y: 2},
      ];
      expect(svg.getPathString(points, true)).toEqual('M 0 0 L 5 0 L 5 2Z');
    });
  });
});
