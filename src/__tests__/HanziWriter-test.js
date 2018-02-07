const ren = require('hanzi-writer-data/人.json');
const HanziWriter = require('../HanziWriter');

describe('HanziWriter', () => {
  // Hack because JSDom doesn't support SVG well
  window.SVGElement.prototype.getTotalLength = () => 10;

  describe('constructor', () => {
    it("loads data and builds an instance in a dom element", () => {
      document.body.innerHTML = '<div id="target"></div>';

      const writer = new HanziWriter('target', '人', {
        charDataLoader: () => ren,
      });

      // TODO: add more assertions
      expect(document.querySelectorAll('svg').length).toBe(1);
    });

    it("calls onLoadCharDataError if provided on loading failure", async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const onLoadCharDataError = jest.fn();
      const writer = new HanziWriter('target', '人', {
        onLoadCharDataError,
        charDataLoader: () => Promise.reject('reasons'),
      });

      await writer._withDataPromise;

      expect(onLoadCharDataError.mock.calls.length).toBe(1);
      expect(onLoadCharDataError.mock.calls[0][0]).toBe('reasons');
    });

    it("tries reloading when calling an animatable method after loading failure", async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const onLoadCharDataError = jest.fn();
      const writer = new HanziWriter('target', '人', {
        onLoadCharDataError,
        charDataLoader: (char, onComplete, onErr) => {
          onErr('reasons');
        },
      });

      await writer._withDataPromise;
      await writer.showCharacter();

      expect(onLoadCharDataError.mock.calls.length).toBe(2);
      expect(onLoadCharDataError.mock.calls[0][0]).toBe('reasons');
      expect(onLoadCharDataError.mock.calls[1][0]).toBe('reasons');
    });

    it("throws an error on loading fauire if onLoadCharDataError is not provided", async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const writer = new HanziWriter('target', '人', {
        charDataLoader: (char, onComplete, onErr) => {
          onErr(new Error('reasons'));
        },
      });

      await expect(writer._withDataPromise).rejects.toThrow(new Error('reasons'));
    });
  });
});
