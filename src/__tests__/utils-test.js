jest.dontMock('../utils');

const utils = require('../utils');

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