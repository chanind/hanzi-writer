import * as utils from '../utils';

describe('utils', () => {
  describe('assign', () => {
    it('should make a copy of the object passed in', () => {
      const original = { a: { b: 7 }, c: 8 };
      const copy = utils.assign({}, original);
      expect(copy).toEqual(original);
      expect(copy).not.toBe(original);
    });

    it('should allow overwriting parts of the original object', () => {
      const original = { a: { b: 7 }, c: 8 };
      const copy = utils.assign({}, original, { c: 9, d: 15 }, { d: 17 });
      expect(copy).not.toEqual(original);
      expect(copy.c).toBe(9);
      expect(copy.d).toBe(17);
    });
  });

  describe('assign polyfill', () => {
    it('should make a copy of the object passed in', () => {
      const original = { a: { b: 7 }, c: 8 };
      const copy = utils._assign({}, original);
      expect(copy).toEqual(original);
      expect(copy).not.toBe(original);
    });

    it('should allow overwriting parts of the original object', () => {
      const original = { a: { b: 7 }, c: 8 };
      const copy = utils._assign({}, original, { c: 9, d: 15 }, { d: 17 });
      expect(copy).not.toEqual(original);
      expect(copy.c).toBe(9);
      expect(copy.d).toBe(17);
    });
  });

  describe('copyAndMergeDeep', () => {
    it('should nested merge properties of both objects', () => {
      const base = {
        a: {
          b: 1,
          c: 2,
        },
      };
      const override = {
        a: {
          c: 7,
          d: 14,
        },
        q: 9,
      };
      expect(utils.copyAndMergeDeep(base, override)).toEqual({
        a: {
          b: 1,
          c: 7,
          d: 14,
        },
        q: 9,
      });
    });
  });

  describe('colorStringToVals', () => {
    it('parses hex strings into rgba numbers', () => {
      expect(utils.colorStringToVals('#DDCA1B')).toEqual({ r: 221, g: 202, b: 27, a: 1 });
    });
    it('works with shortened hex numbers too', () => {
      expect(utils.colorStringToVals('#DC0')).toEqual({ r: 221, g: 204, b: 0, a: 1 });
    });
    it('works with rgb format', () => {
      expect(utils.colorStringToVals('rgb(10,99,193)')).toEqual({
        r: 10,
        g: 99,
        b: 193,
        a: 1,
      });
      expect(utils.colorStringToVals('rgb(10 ,  99 ,  193)')).toEqual({
        r: 10,
        g: 99,
        b: 193,
        a: 1,
      });
    });
    it('works with rgba format', () => {
      expect(utils.colorStringToVals('rgba(10,99,193, 0.3)')).toEqual({
        r: 10,
        g: 99,
        b: 193,
        a: 0.3,
      });
      expect(utils.colorStringToVals('rgba(10 ,  99 ,  193, 0.1)')).toEqual({
        r: 10,
        g: 99,
        b: 193,
        a: 0.1,
      });
    });
    it('ignores capitalization and leading / trailing spaces', () => {
      expect(utils.colorStringToVals('#dc0  ')).toEqual({ r: 221, g: 204, b: 0, a: 1 });
      expect(utils.colorStringToVals(' #dDCa1b')).toEqual({
        r: 221,
        g: 202,
        b: 27,
        a: 1,
      });
      expect(utils.colorStringToVals('  RgBa(10 ,  99 ,  193, 0.1) ')).toEqual({
        r: 10,
        g: 99,
        b: 193,
        a: 0.1,
      });
      expect(utils.colorStringToVals('RGB(10,99,193)')).toEqual({
        r: 10,
        g: 99,
        b: 193,
        a: 1,
      });
    });
    it('errors on invalid colors', () => {
      expect(() => utils.colorStringToVals('#DC00')).toThrow();
      expect(() => utils.colorStringToVals('#DCQ')).toThrow();
      expect(() => utils.colorStringToVals('RBB(10,10,10)')).toThrow();
    });
  });

  describe('inflate', () => {
    it('inflates the scope into a full object and attaches the obj', () => {
      expect(utils.inflate('bob.jim.joe', { x: 8 })).toEqual({
        bob: {
          jim: {
            joe: {
              x: 8,
            },
          },
        },
      });
    });
  });
});
