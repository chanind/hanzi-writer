const utils = require('../utils');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('utils', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('assign', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should make a copy of the object passed in', () => {
      const original = {a: {b: 7}, c: 8};
      const copy = utils.assign({}, original);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(copy).toEqual(original);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(copy).not.toBe(original);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow overwriting parts of the original object', () => {
      const original = {a: {b: 7}, c: 8};
      const copy = utils.assign({}, original, {c: 9, d: 15}, {d: 17});
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(copy).not.toEqual(original);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(copy.c).toBe(9);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(copy.d).toBe(17);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('assign polyfill', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should make a copy of the object passed in', () => {
      const original = {a: {b: 7}, c: 8};
      const copy = utils._assign({}, original);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(copy).toEqual(original);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(copy).not.toBe(original);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should allow overwriting parts of the original object', () => {
      const original = {a: {b: 7}, c: 8};
      const copy = utils._assign({}, original, {c: 9, d: 15}, {d: 17});
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(copy).not.toEqual(original);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(copy.c).toBe(9);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(copy.d).toBe(17);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('copyAndMergeDeep', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('callIfExists', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should trigger the callback passed in', (callback: any) => {
      utils.callIfExists(callback);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should do nothing if no callback is passed', () => {
      utils.callIfExists(null);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('colorStringToVals', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('parses hex strings into rgba numbers', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.colorStringToVals('#DDCA1B')).toEqual({r: 221, g: 202, b: 27, a: 1});
    });
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with shortened hex numbers too', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.colorStringToVals('#DC0')).toEqual({r: 221, g: 204, b: 0, a: 1});
    });
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with rgb format', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.colorStringToVals('rgb(10,99,193)')).toEqual({r: 10, g: 99, b: 193, a: 1});
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.colorStringToVals('rgb(10 ,  99 ,  193)')).toEqual({r: 10, g: 99, b: 193, a: 1});
    });
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with rgba format', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.colorStringToVals('rgba(10,99,193, 0.3)')).toEqual({r: 10, g: 99, b: 193, a: 0.3});
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.colorStringToVals('rgba(10 ,  99 ,  193, 0.1)')).toEqual({r: 10, g: 99, b: 193, a: 0.1});
    });
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores capitalization and leading / trailing spaces', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.colorStringToVals('#dc0  ')).toEqual({r: 221, g: 204, b: 0, a: 1});
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.colorStringToVals(' #dDCa1b')).toEqual({r: 221, g: 202, b: 27, a: 1});
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.colorStringToVals('  RgBa(10 ,  99 ,  193, 0.1) ')).toEqual({r: 10, g: 99, b: 193, a: 0.1});
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.colorStringToVals('RGB(10,99,193)')).toEqual({r: 10, g: 99, b: 193, a: 1});
    });
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('errors on invalid colors', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => utils.colorStringToVals('#DC00')).toThrow();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => utils.colorStringToVals('#DCQ')).toThrow();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => utils.colorStringToVals('RBB(10,10,10)')).toThrow();
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('inflate', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('inflates the scope into a full object and attaches the obj', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(utils.inflate('bob.jim.joe', {x: 8})).toEqual({
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
