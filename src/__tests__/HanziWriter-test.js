const ren = require('hanzi-writer-data/人.json');
const yi = require('hanzi-writer-data/一.json');
const HanziWriter = require('../HanziWriter');
const { timeout } = require('../utils');

describe('HanziWriter', () => {
  // Hack because JSDom doesn't support SVG well
  window.SVGElement.prototype.getTotalLength = () => 10;

  describe('constructor', () => {
    it("loads data and builds an instance in a dom element", async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const writer = new HanziWriter('target', '人', {
        charDataLoader: () => ren,
      });

      await writer._withDataPromise;

      expect(document.querySelectorAll('#target svg').length).toBe(1);
      const svg = document.querySelector('#target svg');
      expect(svg.childNodes.length).toBe(2);
      expect(svg.childNodes[0].nodeName).toBe('defs');
      expect(svg.childNodes[1].nodeName).toBe('g');
      // the strokes are repeated 3 times - one for outline, character, and highlight
      expect(svg.childNodes[1].childNodes.length).toBe(6);
    });
  });

  describe('data loading', () => {
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

  describe('setCharacter', () => {
    it('deletes the current character while loading', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = new HanziWriter('target', '人', {
        charDataLoader: (char) => timeout(1).then(() => char == '人' ? ren : yi)
      });
      await writer._withDataPromise;
 
      expect(document.querySelector('#target svg g')).not.toBe(null);
      expect(document.querySelector('#target svg defs *')).not.toBe(null);
      writer.setCharacter('一');
      expect(document.querySelector('#target svg g')).toBe(null);
      expect(document.querySelector('#target svg defs *')).toBe(null);

      await writer._withDataPromise;
      expect(document.querySelector('#target svg g').childNodes.length).toBe(3);
      expect(document.querySelector('#target svg defs *')).not.toBe(null);
    });
  });
});
