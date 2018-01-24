const geometry = require('../geometry');
const Point = require('../models/Point');

describe('geometry', () => {
  describe('extendPointOnLine', () => {
    it('returns a point distance away from the start point', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(8, 6);
      expect(geometry.extendPointOnLine(p1, p2, 5)).toEqual(new Point(12, 9));
    });

    it('works when p2 is before p1 in the line', () => {
      const p1 = new Point(12, 9);
      const p2 = new Point(8, 6);
      expect(geometry.extendPointOnLine(p1, p2, 10)).toEqual(new Point(0, 0));
    });

    it('works with vertical lines', () => {
      const p1 = new Point(2, 4);
      const p2 = new Point(2, 6);
      expect(geometry.extendPointOnLine(p1, p2, 7)).toEqual(new Point(2, 13));
    });

    it('works with vertical lines where p2 is above p1', () => {
      const p1 = new Point(2, 6);
      const p2 = new Point(2, 4);
      expect(geometry.extendPointOnLine(p1, p2, 7)).toEqual(new Point(2, -3));
    });
  });
});
