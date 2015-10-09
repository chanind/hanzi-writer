const utils = require('../utils');

describe('utils', () => {
  describe('inArray', () => {
    it('should return true if an element is in the array', () => {
      expect(utils.inArray(3, [1,4,3,5])).toBe(true);
    });

    it('should return false if an element is not in the array', () => {
      expect(utils.inArray(7, [1,4,3,5])).toBe(false);
    });

    it('should use === for comparison', () => {
      expect(utils.inArray(0, [1,false,null,5])).toBe(false);
      expect(utils.inArray(null, [1,false,null,5])).toBe(true);
    });
  });

  describe('copyAndExtend', () => {
    it('should make a copy of the object passed in', () => {
      const original = {a: {b: 7}, c: 8};
      const copy = utils.copyAndExtend(original);
      expect(copy).toEqual(original);
      expect(copy).not.toBe(original);
    });

    it('should allow overwriting parts of the original object', () => {
      const original = {a: {b: 7}, c: 8};
      const copy = utils.copyAndExtend(original, {c: 9, d: 15});
      expect(copy).not.toEqual(original);
      expect(copy.c).toBe(9);
      expect(copy.d).toBe(15);
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