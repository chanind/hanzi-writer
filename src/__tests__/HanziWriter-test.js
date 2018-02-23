const ren = require('hanzi-writer-data/人.json');
const yi = require('hanzi-writer-data/一.json');
const HanziWriter = require('../HanziWriter');
const { timeout } = require('../utils');
const { resolvePromises } = require('../testUtils');

describe('HanziWriter', () => {
  describe('constructor', () => {
    it('loads data and builds an instance in a dom element', async () => {
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
      // the characters are repeated 3 times - one for outline, character, and highlight
      expect(svg.childNodes[1].childNodes.length).toBe(3);
      svg.childNodes[1].childNodes.forEach(charNode => {
        expect(charNode.nodeName).toBe('g');
        // 2 strokes per character
        expect(charNode.childNodes.length).toBe(2);
      });
    });
  });

  describe('data loading', () => {
    it('calls onLoadCharDataError if provided on loading failure', async () => {
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

    it('throws when calling an animatable method after loading failure', async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const onLoadCharDataError = jest.fn();
      const writer = new HanziWriter('target', '人', {
        onLoadCharDataError,
        charDataLoader: (char, onComplete, onErr) => {
          onErr('reasons');
        },
      });

      await writer._withDataPromise;
      expect(() => writer.showCharacter()).toThrow();

      expect(onLoadCharDataError).toHaveBeenCalledTimes(1);
      expect(onLoadCharDataError).toHaveBeenCalledWith('reasons');
    });

    it('throws an error on loading fauire if onLoadCharDataError is not provided', async () => {
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
        charDataLoader: (char) => timeout(1).then(() => (char === '人' ? ren : yi)),
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

  describe('animateCharacter', () => {
    it('returns animates and returns promise that resolves when animation is finished', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = new HanziWriter('target', '人', {
        showCharacter: true,
        charDataLoader: () => ren,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      const onComplete = jest.fn();

      writer.animateCharacter({ onComplete }).then(result => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      expect(writer._renderState.state.character.main.opacity).toBe(1);
      [0, 1].forEach(strokeNum => {
        expect(writer._renderState.state.character.main.strokes[strokeNum].opacity).toBe(1);
      });

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState.state.character.main.opacity).toBe(1);
      expect(writer._renderState.state.character.main.strokes[0].opacity).toBe(1);
      expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(0);

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(1);

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(0);
      expect(isResolved).toBe(false);
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(1);
      expect(isResolved).toBe(true);
      expect(resolvedVal).toEqual({ canceled: false });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  describe('hideCharacter', () => {
    it('returns animates and returns promise that resolves when finished', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = new HanziWriter('target', '人', {
        showCharacter: true,
        charDataLoader: () => ren,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      const onComplete = jest.fn();

      writer.hideCharacter({ onComplete }).then(result => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      expect(writer._renderState.state.character.main.opacity).toBe(1);
      expect(isResolved).toBe(false);

      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState.state.character.main.opacity).toBe(0);

      expect(isResolved).toBe(true);
      expect(resolvedVal).toEqual({ canceled: false });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });

    it('returns instantly if char is already hidden', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = new HanziWriter('target', '人', {
        showCharacter: false,
        charDataLoader: () => ren,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      const onComplete = jest.fn();

      writer.hideCharacter({ onComplete }).then(result => {
        isResolved = true;
        resolvedVal = result;
      });

      expect(isResolved).toBe(false);

      await resolvePromises();

      expect(writer._renderState.state.character.main.opacity).toBe(0);
      expect(isResolved).toBe(true);
      expect(resolvedVal).toEqual({ canceled: false });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  [
    { methodLabel: 'Character', stateLabel: 'main' },
    { methodLabel: 'Outline', stateLabel: 'outline' },
  ].forEach(({ methodLabel, stateLabel }) => {
    describe(`show${methodLabel}`, () => {
      it('returns animates and returns promise that resolves when finished', async () => {
        document.body.innerHTML = '<div id="target"></div>';
        const writer = new HanziWriter('target', '人', {
          [`show${methodLabel}`]: false,
          charDataLoader: () => ren,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        const onComplete = jest.fn();

        writer[`show${methodLabel}`]({ onComplete }).then(result => {
          isResolved = true;
          resolvedVal = result;
        });

        await resolvePromises();

        expect(writer._renderState.state.character[stateLabel].opacity).toBe(0);
        expect(isResolved).toBe(false);

        clock.tick(1000);
        await resolvePromises();

        expect(writer._renderState.state.character[stateLabel].opacity).toBe(1);

        expect(isResolved).toBe(true);
        expect(resolvedVal).toEqual({ canceled: false });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });

      it('returns instantly if already shown', async () => {
        document.body.innerHTML = '<div id="target"></div>';
        const writer = new HanziWriter('target', '人', {
          [`show${methodLabel}`]: true,
          charDataLoader: () => ren,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        const onComplete = jest.fn();

        writer[`show${methodLabel}`]({ onComplete }).then(result => {
          isResolved = true;
          resolvedVal = result;
        });

        expect(isResolved).toBe(false);

        await resolvePromises();

        expect(writer._renderState.state.character[stateLabel].opacity).toBe(1);
        expect(isResolved).toBe(true);
        expect(resolvedVal).toEqual({ canceled: false });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });
    });
  });
});
