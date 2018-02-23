const geometry = require('../geometry');

describe('geometry', () => {
  describe('extendPointOnLine', () => {
    it('returns a point distance away from the start point', () => {
      const p1 = {x: 0, y: 0};
      const p2 = {x: 8, y: 6};
      expect(geometry.extendPointOnLine(p1, p2, 5)).toEqual({x: 12, y: 9});
    });

    it('works when p2 is before p1 in the line', () => {
      const p1 = {x: 12, y: 9};
      const p2 = {x: 8, y: 6};
      expect(geometry.extendPointOnLine(p1, p2, 10)).toEqual({x: 0, y: 0});
    });

    it('works with vertical lines', () => {
      const p1 = {x: 2, y: 4};
      const p2 = {x: 2, y: 6};
      expect(geometry.extendPointOnLine(p1, p2, 7)).toEqual({x: 2, y: 13});
    });

    it('works with vertical lines where p2 is above p1', () => {
      const p1 = {x: 2, y: 6};
      const p2 = {x: 2, y: 4};
      expect(geometry.extendPointOnLine(p1, p2, 7)).toEqual({x: 2, y: -3});
    });
  });

  describe('filterParallelPoints', () => {
    it('removes internal points that are on the line connecting the points on either side', () => {
      const points = [
        {x: 0, y: 0},
        {x: 5, y: 0},
        {x: 6, y: 0},
        {x: 7, y: 1},
        {x: 8, y: 2},
        {x: 9, y: 3},
        {x: 10, y: 3},
        {x: 11, y: 3},
      ];
      expect(geometry.filterParallelPoints(points)).toEqual([
        {x: 0, y: 0},
        {x: 6, y: 0},
        {x: 9, y: 3},
        {x: 11, y: 3},
      ]);
    });

    it('returns the original points if there are no parallel points', () => {
      const points = [
        {x: 0, y: 0},
        {x: 6, y: 0},
        {x: 9, y: 3},
        {x: 11, y: 3},
      ];
      expect(geometry.filterParallelPoints(points)).toEqual(points);
    });
  });
});
