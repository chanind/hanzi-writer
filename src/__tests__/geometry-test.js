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

  describe('getPerpendicularPointsAtDist', () => {
    it('returns points at distance from target perpendicular to the line between target and ref', () => {
      const target = new Point(1, 1);
      const ref = new Point(0, 0);
      expect(geometry.getPerpendicularPointsAtDist(target, ref, 2 * Math.sqrt(2))).toEqual([
        new Point(3, -1),
        new Point(-1, 3),
      ]);
    });
  });

  describe('getLinesIntersectPoint', () => {
    it('returns the point where lines defined by 2 points each intersect', () => {
      const line1point1 = new Point(0, 0);
      const line1point2 = new Point(1, 1);
      const line2point1 = new Point(4, 1);
      const line2point2 = new Point(5, 0);
      const intersection = geometry.getLinesIntersectPoint(
        line1point1,
        line1point2,
        line2point1,
        line2point2,
      );
      expect(intersection).toEqual(new Point(2.5, 2.5));
    });

    it('returns the same result even if the order of points and lines are flipped', () => {
      const line2point2 = new Point(0, 0);
      const line2point1 = new Point(1, 1);
      const line1point2 = new Point(4, 1);
      const line1point1 = new Point(5, 0);
      const intersection = geometry.getLinesIntersectPoint(
        line1point1,
        line1point2,
        line2point1,
        line2point2,
      );
      expect(intersection).toEqual(new Point(2.5, 2.5));
    });

    it('works with vertical and horizontal lines', () => {
      const line1point1 = new Point(0, 4);
      const line1point2 = new Point(1, 4);
      const line2point1 = new Point(3, 0);
      const line2point2 = new Point(3, -1);
      const intersection = geometry.getLinesIntersectPoint(
        line1point1,
        line1point2,
        line2point1,
        line2point2,
      );
      expect(intersection).toEqual(new Point(3, 4));
    });
  });

  describe('linesToPolygon', () => {
    it("returns the outline of the polygon that's the stroked path of the points passed in", () => {
      const points = [
        new Point(0, 0),
        new Point(5, 0),
        new Point(5, 2),
      ];
      expect(geometry.linesToPolygon(points, 2)).toEqual([
        new Point(0, 1),
        new Point(4, 1),
        new Point(4, 2),
        new Point(6, 2),
        new Point(6, -1),
        new Point(0, -1),
      ]);
    });
  });

  describe('getLineSegmentsPortion', () => {
    it('retuns a new series of points that is portion of the passed in segment', () => {
      // total length 10
      const points = [
        new Point(0, 0),
        new Point(5, 0),
        new Point(9, 3),
      ];
      expect(geometry.getLineSegmentsPortion(points, 0)).toEqual([
        new Point(0, 0)
      ]);
      expect(geometry.getLineSegmentsPortion(points, 0.2)).toEqual([
        new Point(0, 0),
        new Point(2, 0),
      ]);
      expect(geometry.getLineSegmentsPortion(points, 0.75)).toEqual([
        new Point(0, 0),
        new Point(5, 0),
        new Point(7, 1.5),
      ]);
      expect(geometry.getLineSegmentsPortion(points, 1)).toEqual(points);
    });
  });
});
