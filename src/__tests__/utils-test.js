const utils = require('../utils');

describe('utils', () => {
  describe('assign', () => {
    it('should make a copy of the object passed in', () => {
      const original = {a: {b: 7}, c: 8};
      const copy = utils.assign({}, original);
      expect(copy).toEqual(original);
      expect(copy).not.toBe(original);
    });

    it('should allow overwriting parts of the original object', () => {
      const original = {a: {b: 7}, c: 8};
      const copy = utils.assign({}, original, {c: 9, d: 15}, {d: 17});
      expect(copy).not.toEqual(original);
      expect(copy.c).toBe(9);
      expect(copy.d).toBe(17);
    });
  });

  describe('callIfExists', () => {
    it('should trigger the callback passed in', (callback) => {
      utils.callIfExists(callback);
    });

    it('should do nothing if no callback is passed', () => {
      utils.callIfExists(null);
    })
  });
});