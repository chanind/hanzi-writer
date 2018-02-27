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

    it('rounds points to 1 decimal point', () => {
      const points = [
        {x: 0.11113, y: 0.991212},
        {x: 5.4565, y: 0.923},
        {x: 5.4456, y: 2},
      ];
      expect(svg.getPathString(points, true)).toEqual('M 0.1 1 L 5.5 0.9 L 5.4 2Z');
    });
  });
});
