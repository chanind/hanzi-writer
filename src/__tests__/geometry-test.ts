import * as geometry from '../geometry';

describe('geometry', () => {
  describe('_extendPointOnLine', () => {
    it('returns a point distance away from the end point', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 8, y: 6 };
      expect(geometry._extendPointOnLine(p1, p2, 5)).toEqual({ x: 12, y: 9 });
    });

    it('works with negative distances', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 8, y: 6 };
      expect(geometry._extendPointOnLine(p1, p2, -5)).toEqual({ x: 4, y: 3 });
    });

    it('works when p2 is before p1 in the line', () => {
      const p1 = { x: 12, y: 9 };
      const p2 = { x: 8, y: 6 };
      expect(geometry._extendPointOnLine(p1, p2, 10)).toEqual({ x: 0, y: 0 });
    });

    it('works with vertical lines', () => {
      const p1 = { x: 2, y: 4 };
      const p2 = { x: 2, y: 6 };
      expect(geometry._extendPointOnLine(p1, p2, 7)).toEqual({ x: 2, y: 13 });
    });

    it('works with vertical lines where p2 is above p1', () => {
      const p1 = { x: 2, y: 6 };
      const p2 = { x: 2, y: 4 };
      expect(geometry._extendPointOnLine(p1, p2, 7)).toEqual({ x: 2, y: -3 });
    });
  });

  describe('frechetDist', () => {
    it('is 0 if the curves are the same', () => {
      const curve1 = [
        { x: 0, y: 0 },
        { x: 4, y: 4 },
      ];
      const curve2 = [
        { x: 0, y: 0 },
        { x: 4, y: 4 },
      ];

      expect(geometry.frechetDist(curve1, curve2)).toBe(0);
      expect(geometry.frechetDist(curve2, curve1)).toBe(0);
    });

    it('less than then max length of any segment if curves are identical', () => {
      const { subdivideCurve, frechetDist } = geometry;
      const curve1 = [
        { x: 0, y: 0 },
        { x: 2, y: 2 },
        { x: 4, y: 4 },
      ];
      const curve2 = [
        { x: 0, y: 0 },
        { x: 4, y: 4 },
      ];

      expect(
        frechetDist(subdivideCurve(curve1, 0.5), subdivideCurve(curve2, 0.5)),
      ).toBeLessThan(0.5);
      expect(
        frechetDist(subdivideCurve(curve1, 0.1), subdivideCurve(curve2, 0.1)),
      ).toBeLessThan(0.1);
      expect(
        frechetDist(subdivideCurve(curve1, 0.01), subdivideCurve(curve2, 0.01)),
      ).toBeLessThan(0.01);
    });

    it('will be the dist of the starting points if those are the only difference', () => {
      const curve1 = [
        { x: 1, y: 0 },
        { x: 4, y: 4 },
      ];
      const curve2 = [
        { x: 0, y: 0 },
        { x: 4, y: 4 },
      ];

      expect(geometry.frechetDist(curve1, curve2)).toBe(1);
      expect(geometry.frechetDist(curve2, curve1)).toBe(1);
    });
  });

  describe('subdivideCurve', () => {
    it('leave the curve the same if segment lengths are less than maxLen apart', () => {
      const curve = [
        { x: 0, y: 0 },
        { x: 4, y: 4 },
      ];
      expect(geometry.subdivideCurve(curve, 10)).toEqual([
        { x: 0, y: 0 },
        { x: 4, y: 4 },
      ]);
    });

    it('breaks up segments so that each segment is less than maxLen length', () => {
      const curve = [
        { x: 0, y: 0 },
        { x: 4, y: 4 },
        { x: 0, y: 8 },
      ];
      expect(geometry.subdivideCurve(curve, Math.sqrt(2))).toEqual([
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 },
        { x: 3, y: 5 },
        { x: 2, y: 6 },
        { x: 1, y: 7 },
        { x: 0, y: 8 },
      ]);
    });
  });

  describe('outlineCurve', () => {
    it('divides a curve into equally spaced segments', () => {
      const curve1 = [
        { x: 0, y: 0 },
        { x: 4, y: 6 },
      ];
      expect(geometry.outlineCurve(curve1, 3)).toEqual([
        { x: 0, y: 0 },
        { x: 2, y: 3 },
        { x: 4, y: 6 },
      ]);

      const curve2 = [
        { x: 0, y: 0 },
        { x: 9, y: 12 },
        { x: 0, y: 24 },
      ];
      expect(geometry.outlineCurve(curve2, 4)).toEqual([
        { x: 0, y: 0 },
        { x: 6, y: 8 },
        { x: 6, y: 16 },
        { x: 0, y: 24 },
      ]);
    });
  });

  describe('_filterParallelPoints', () => {
    it('removes internal points that are on the line connecting the points on either side', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 5, y: 0 },
        { x: 6, y: 0 },
        { x: 7, y: 1 },
        { x: 8, y: 2 },
        { x: 9, y: 3 },
        { x: 10, y: 3 },
        { x: 11, y: 3 },
      ];
      expect(geometry._filterParallelPoints(points)).toEqual([
        { x: 0, y: 0 },
        { x: 6, y: 0 },
        { x: 9, y: 3 },
        { x: 11, y: 3 },
      ]);
    });

    it('returns the original points if there are no parallel points', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 6, y: 0 },
        { x: 9, y: 3 },
        { x: 11, y: 3 },
      ];
      expect(geometry._filterParallelPoints(points)).toEqual(points);
    });
  });

  describe('getPathString', () => {
    it('returns d path based on the points passed in', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 5, y: 0 },
        { x: 5, y: 2 },
      ];
      expect(geometry.getPathString(points)).toEqual('M 0 0 L 5 0 L 5 2');
    });

    it('closes the path if close = true', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 5, y: 0 },
        { x: 5, y: 2 },
      ];
      expect(geometry.getPathString(points, true)).toEqual('M 0 0 L 5 0 L 5 2Z');
    });

    it('rounds points to 1 decimal point', () => {
      const points = [
        { x: 0.11113, y: 0.991212 },
        { x: 5.4565, y: 0.923 },
        { x: 5.4456, y: 2 },
      ];
      expect(geometry.getPathString(points, true)).toEqual('M 0.1 1 L 5.5 0.9 L 5.4 2Z');
    });
  });
});
