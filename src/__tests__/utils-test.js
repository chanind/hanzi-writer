const utils = require('../utils');

describe('utils', () => {
  describe('callIfExists', () => {
    it('should trigger the callback passed in', (callback) => {
      utils.callIfExists(callback);
    });

    it('should do nothing if no callback is passed', () => {
      utils.callIfExists(null);
    })
  });
});