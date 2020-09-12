// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('../Quiz');

const oldGlobal = {test: 'object'};
// @ts-expect-error ts-migrate(2339) FIXME: Property 'HanziWriter' does not exist on type 'Glo... Remove this comment to see the full error message
global.HanziWriter = oldGlobal;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ren'.
const ren = require('hanzi-writer-data/人.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'yi'.
const yi = require('hanzi-writer-data/一.json');
const HanziWriter = require('../HanziWriter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'timeout'.
const { timeout } = require('../utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'resolvePro... Remove this comment to see the full error message
const { resolvePromises } = require('../testUtils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Quiz'.
const Quiz = require('../Quiz');


const charDataLoader = () => ren;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('HanziWriter', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    Quiz.mockClear();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('can optionally run init() if element and options are passed in', async () => {
      document.body.innerHTML = '<div id="target"></div>';

      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', { charDataLoader });
      await writer.setCharacter('人');

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(document.querySelectorAll('#target svg').length).toBe(1);
      const svg = document.querySelector('#target svg');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes.length).toBe(2);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes[0].nodeName).toBe('defs');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes[1].nodeName).toBe('g');
      // the characters are repeated 3 times - one for outline, character, and highlight
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes[1].childNodes.length).toBe(3);
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.childNodes[1].childNodes.forEach(charNode => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(charNode.nodeName).toBe('g');
        // 2 strokes per character
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(charNode.childNodes.length).toBe(2);
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('[deprecated] loads data and builds an instance in a dom element', async () => {
      document.body.innerHTML = '<div id="target"></div>';

      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', { charDataLoader });

      await writer._withDataPromise;

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(document.querySelectorAll('#target svg').length).toBe(1);
      const svg = document.querySelector('#target svg');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes.length).toBe(2);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes[0].nodeName).toBe('defs');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes[1].nodeName).toBe('g');
      // the characters are repeated 3 times - one for outline, character, and highlight
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes[1].childNodes.length).toBe(3);
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.childNodes[1].childNodes.forEach(charNode => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(charNode.nodeName).toBe('g');
        // 2 strokes per character
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(charNode.childNodes.length).toBe(2);
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('HanziWriter.create', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('loads data and builds an instance in a dom element', async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const writer = HanziWriter.create('target', '人', { charDataLoader });

      await writer._withDataPromise;

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(document.querySelectorAll('#target svg').length).toBe(1);
      const svg = document.querySelector('#target svg');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes.length).toBe(2);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes[0].nodeName).toBe('defs');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes[1].nodeName).toBe('g');
      // the characters are repeated 3 times - one for outline, character, and highlight
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(svg.childNodes[1].childNodes.length).toBe(3);
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.childNodes[1].childNodes.forEach(charNode => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(charNode.nodeName).toBe('g');
        // 2 strokes per character
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(charNode.childNodes.length).toBe(2);
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("Errors if the target element can't be found", () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => {
        HanziWriter.create('wrong-target', '人', { charDataLoader });
      }).toThrow('HanziWriter target element not found: wrong-target');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('can optionally use a canvas for rendering instead of SVG', async () => {
      document.body.innerHTML = '<div id="target"></div>';

      const writer = HanziWriter.create('target', '人', { charDataLoader, renderer: 'canvas' });

      await writer._withDataPromise;

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(document.querySelectorAll('#target canvas').length).toBe(1);
      const canvas = document.querySelector('#target canvas');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(canvas.getContext('2d')).toMatchSnapshot();
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('data loading', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('calls onLoadCharDataError if provided on loading failure', async () => {
      document.body.innerHTML = '<div id="target"></div>';

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onLoadCharDataError = jest.fn();
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', {
        onLoadCharDataError,
        charDataLoader: () => Promise.reject('reasons'),
      });

      await writer._withDataPromise;

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onLoadCharDataError.mock.calls.length).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onLoadCharDataError.mock.calls[0][0]).toBe('reasons');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws when calling an animatable method after loading failure', async () => {
      document.body.innerHTML = '<div id="target"></div>';

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onLoadCharDataError = jest.fn();
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', {
        onLoadCharDataError,
        charDataLoader: (char: any, onComplete: any, onErr: any) => {
          onErr('reasons');
        },
      });

      await writer._withDataPromise;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(() => writer.showCharacter()).toThrow();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onLoadCharDataError).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onLoadCharDataError).toHaveBeenCalledWith('reasons');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error on loading fauire if onLoadCharDataError is not provided', async () => {
      document.body.innerHTML = '<div id="target"></div>';

      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', {
        charDataLoader: (char: any, onComplete: any, onErr: any) => {
          onErr(new Error('reasons'));
        },
      });

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(writer._withDataPromise).rejects.toThrow(new Error('reasons'));
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('setCharacter', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('deletes the current character while loading', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', {
        charDataLoader: (char: any) => timeout(1).then(() => (char === '人' ? ren : yi)),
      });
      await writer._withDataPromise;

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(document.querySelector('#target svg g')).not.toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(document.querySelector('#target svg defs *')).not.toBe(null);
      writer.setCharacter('一');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(document.querySelector('#target svg g')).toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(document.querySelector('#target svg defs *')).toBe(null);

      await writer._withDataPromise;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(document.querySelector('#target svg g').childNodes.length).toBe(3);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(document.querySelector('#target svg defs *')).not.toBe(null);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('maintains the visibility of the character from the last character rendered', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', {
        charDataLoader: (char: any) => timeout(1).then(() => (char === '人' ? ren : yi)),
      });
      await writer._withDataPromise;

      writer.hideOutline();
      writer.setCharacter('一');
      await writer._withDataPromise;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.outline.opacity).toBe(0);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('maintains the visibility of the outline from the last character rendered', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', {
        charDataLoader: (char: any) => timeout(1).then(() => (char === '人' ? ren : yi)),
      });
      await writer._withDataPromise;

      writer.hideCharacter();
      writer.setCharacter('一');
      await writer._withDataPromise;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.opacity).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.outline.opacity).toBe(1);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('maintains colors from the last character rendered', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', {
        charDataLoader: (char: any) => timeout(1).then(() => (char === '人' ? ren : yi)),
      });
      await writer._withDataPromise;

      writer.updateColor('strokeColor', 'rgba(30, 30, 30, 0.8)');
      writer.updateColor('outlineColor', 'rgba(10, 20, 30, 0.1)');
      writer.setCharacter('一');
      await writer._withDataPromise;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.options.strokeColor).toEqual({
        r: 30,
        g: 30,
        b: 30,
        a: 0.8,
      });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.options.outlineColor).toEqual({
        r: 10,
        g: 20,
        b: 30,
        a: 0.1,
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('animateCharacter', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('animates and returns promise that resolves when animation is finished', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', { showCharacter: true, charDataLoader });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();

      writer.animateCharacter({ onComplete }).then((result: any) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.opacity).toBe(1);
      [0, 1].forEach(strokeNum => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character.main.strokes[strokeNum].opacity).toBe(1);
      });

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(0);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(1);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).not.toHaveBeenCalled();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolvedVal).toEqual({ canceled: false });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('animateStroke', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('animates and returns promise that resolves when animation is finished', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', { showCharacter: true, charDataLoader });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();

      writer.animateStroke(1, { onComplete }).then((result: any) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].opacity).toBe(1);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).not.toHaveBeenCalled();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolvedVal).toEqual({ canceled: false });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps other stroke opacities where they were originally', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', { showCharacter: true, charDataLoader });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();

      writer.hideCharacter({ duration: 0 });
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.opacity).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].opacity).toBe(1);

      writer.animateStroke(1, { onComplete }).then((result: any) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].opacity).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].opacity).toBe(1);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).not.toHaveBeenCalled();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolvedVal).toEqual({ canceled: false });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('pauseAnimation and resumeAnimation', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('pauses and resumes the currently running animations', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', { showCharacter: true, charDataLoader });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(50);
      await resolvePromises();

      writer.animateStroke(1, { onComplete }).then((result: any) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(0);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(50);
      await resolvePromises();

      const pausedDisplayPortion = writer._renderState.state.character.main.strokes[1].displayPortion;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(pausedDisplayPortion).toBeGreaterThan(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(pausedDisplayPortion).toBeLessThan(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);

      writer.pauseAnimation();
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(2000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(pausedDisplayPortion);

      writer.resumeAnimation();
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(50);
      await resolvePromises();

      const newDisplayPortion = writer._renderState.state.character.main.strokes[1].displayPortion;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(newDisplayPortion).not.toBe(pausedDisplayPortion);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(newDisplayPortion).toBeGreaterThan(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(newDisplayPortion).toBeLessThan(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(2000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolvedVal).toEqual({ canceled: false });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('highlightStroke', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('highlights a single stroke', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', { showCharacter: true, charDataLoader });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();

      writer.highlightStroke(1, { onComplete }).then((result: any) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.highlight.opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.highlight.strokes[0].opacity).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.highlight.strokes[1].opacity).toBe(0);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.highlight.strokes[1].displayPortion).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).not.toHaveBeenCalled();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.highlight.strokes[1].displayPortion).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.highlight.strokes[1].opacity).toBe(1);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.highlight.strokes[1].displayPortion).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.highlight.strokes[1].opacity).toBe(0);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolvedVal).toEqual({ canceled: false });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('loopCharacterAnimation', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('animates and then repeats until something else stops it', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', { showCharacter: true, charDataLoader });
      await writer._withDataPromise;

      writer.loopCharacterAnimation();

      await resolvePromises();

      // loop 5 times
      for (let i = 0; i < 5; i++) {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character.main.opacity).toBe(1);
        [0, 1].forEach(strokeNum => {
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
          expect(writer._renderState.state.character.main.strokes[strokeNum].opacity).toBe(1);
        });

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
        clock.tick(1000);
        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character.main.opacity).toBe(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character.main.strokes[0].opacity).toBe(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(0);

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
        clock.tick(1000);
        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(1);

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
        clock.tick(1000);
        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(0);

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
        clock.tick(1000);
        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(1);

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
        clock.tick(3000);
        await resolvePromises();
      }

      // now, stop the animation by running something different
      writer.showCharacter();
      await resolvePromises();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(1);
    });
  });

  [
    { methodLabel: 'Character', stateLabel: 'main' },
    { methodLabel: 'Outline', stateLabel: 'outline' },
  ].forEach(({ methodLabel, stateLabel }) => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe(`hide${methodLabel}`, () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('animates and returns promise that resolves when finished', async () => {
        document.body.innerHTML = '<div id="target"></div>';
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        const writer = new HanziWriter('target', '人', { showCharacter: true, charDataLoader });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        const onComplete = jest.fn();

        writer[`hide${methodLabel}`]({ onComplete }).then((result: any) => {
          isResolved = true;
          resolvedVal = result;
        });

        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character[stateLabel].opacity).toBe(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(false);

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
        clock.tick(1000);
        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character[stateLabel].opacity).toBe(0);

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(true);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(resolvedVal).toEqual({ canceled: false });
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledTimes(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns instantly if char is already hidden', async () => {
        document.body.innerHTML = '<div id="target"></div>';
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        const writer = new HanziWriter('target', '人', {
          showCharacter: false,
          showOutline: false,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        const onComplete = jest.fn();

        writer[`hide${methodLabel}`]({ onComplete }).then((result: any) => {
          isResolved = true;
          resolvedVal = result;
        });

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(false);

        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character[stateLabel].opacity).toBe(0);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(true);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(resolvedVal).toEqual({ canceled: false });
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledTimes(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('resolves immediately if duration: 0 is passed', async () => {
        document.body.innerHTML = '<div id="target"></div>';
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        const writer = new HanziWriter('target', '人', {
          showCharacter: true,
          showOutline: true,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        const onComplete = jest.fn();

        writer[`hide${methodLabel}`]({ onComplete, duration: 0 }).then((result: any) => {
          isResolved = true;
          resolvedVal = result;
        });

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(false);

        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character[stateLabel].opacity).toBe(0);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(true);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(resolvedVal).toEqual({ canceled: false });
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledTimes(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe(`show${methodLabel}`, () => {
      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('animates and returns promise that resolves when finished', async () => {
        document.body.innerHTML = '<div id="target"></div>';
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        const writer = new HanziWriter('target', '人', {
          [`show${methodLabel}`]: false,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        const onComplete = jest.fn();

        writer[`show${methodLabel}`]({ onComplete }).then((result: any) => {
          isResolved = true;
          resolvedVal = result;
        });

        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character[stateLabel].opacity).toBe(0);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(false);

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
        clock.tick(1000);
        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character[stateLabel].opacity).toBe(1);

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(true);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(resolvedVal).toEqual({ canceled: false });
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledTimes(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns instantly if already shown', async () => {
        document.body.innerHTML = '<div id="target"></div>';
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        const writer = new HanziWriter('target', '人', {
          [`show${methodLabel}`]: true,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        const onComplete = jest.fn();

        writer[`show${methodLabel}`]({ onComplete }).then((result: any) => {
          isResolved = true;
          resolvedVal = result;
        });

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(false);

        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character[stateLabel].opacity).toBe(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(true);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(resolvedVal).toEqual({ canceled: false });
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledTimes(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });

      // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('resolves immediately if duration: 0 is passed', async () => {
        document.body.innerHTML = '<div id="target"></div>';
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        const writer = new HanziWriter('target', '人', {
          [`show${methodLabel}`]: false,
          charDataLoader,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
        const onComplete = jest.fn();

        writer[`show${methodLabel}`]({ onComplete, duration: 0 }).then((result: any) => {
          isResolved = true;
          resolvedVal = result;
        });

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(false);

        await resolvePromises();

        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(writer._renderState.state.character[stateLabel].opacity).toBe(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(isResolved).toBe(true);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(resolvedVal).toEqual({ canceled: false });
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledTimes(1);
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('updateColor', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('animates and returns promise that resolves when finished', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', {
        strokeColor: '#123',
        charDataLoader,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();

      writer.updateColor('strokeColor', 'rgba(30, 30, 30, 0.8)', { onComplete }).then((result: any) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.options.strokeColor).toEqual({r: 17, g: 34, b: 51, a: 1});
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.options.strokeColor).toEqual({r: 30, g: 30, b: 30, a: 0.8});

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolvedVal).toEqual({ canceled: false });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses strokeColor for the tween if radicalColor is set to null', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', {
        strokeColor: 'rgba(30, 30, 30, 0.8)',
        radicalColor: '#EEE',
        charDataLoader,
      });
      await writer._withDataPromise;

      let isResolved = false;
      let resolvedVal;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();

      writer.updateColor('radicalColor', null, { onComplete, duration: 1000 }).then((result: any) => {
        isResolved = true;
        resolvedVal = result;
      });

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.options.radicalColor).toEqual({r: 238, g: 238, b: 238, a: 1});
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(999);
      await resolvePromises();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.options.radicalColor.r).toBeCloseTo(30, 0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.options.radicalColor.g).toBeCloseTo(30, 0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.options.radicalColor.b).toBeCloseTo(30, 0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.options.radicalColor.a).toBeCloseTo(1, 0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(30);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._renderState.state.options.radicalColor).toBeNull();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolvedVal).toEqual({ canceled: false });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledWith({ canceled: false });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('quiz', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('sets up and starts the quiz', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', { charDataLoader });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();
      writer.quiz({ onComplete });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Quiz).not.toHaveBeenCalled();
      await writer._withDataPromise;
      await resolvePromises();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Quiz).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(Quiz).toHaveBeenCalledWith(writer._character, writer._renderState, writer._positioner);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.startQuiz).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.startQuiz).toHaveBeenCalledWith(Object.assign({}, writer._options, { onComplete }));
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('cancelQuiz', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('cancels the existing quiz', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', { charDataLoader });
      await writer._withDataPromise;
      writer.quiz();
      await resolvePromises();
      const quiz = writer._quiz;
      writer.cancelQuiz();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz.cancel).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz).toBe(null);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('mouse and touch events', () => {
    let writer: any;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(async () => {
      document.body.innerHTML = '<div id="target"></div>';
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      writer = new HanziWriter('target', '人', { charDataLoader });
      await writer._withDataPromise;
      writer.quiz();
      await resolvePromises();
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('starts a user stroke on mousedown', () => {
      const evt = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 170,
        clientY: 127,
      });
      const svg = document.querySelector('#target svg');
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 });
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      const canceled = !svg.dispatchEvent(evt);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(canceled).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.startUserStroke).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.startUserStroke).toHaveBeenCalledWith({x: 120, y: 67});
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('starts a user stroke on touchstart', () => {
      const evt = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        // @ts-expect-error ts-migrate(2740) FIXME: Type '{ clientX: number; clientY: number; }' is mi... Remove this comment to see the full error message
        touches: [{
          clientX: 170,
          clientY: 127,
        }],
      });
      const svg = document.querySelector('#target svg');
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 });
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      const canceled = !svg.dispatchEvent(evt);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(canceled).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.startUserStroke).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.startUserStroke).toHaveBeenCalledWith({x: 120, y: 67});
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('continues a user stroke on mousemove', () => {
      const evt = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: 170,
        clientY: 127,
      });
      const svg = document.querySelector('#target svg');
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 });
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      const canceled = !svg.dispatchEvent(evt);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(canceled).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.continueUserStroke).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.continueUserStroke).toHaveBeenCalledWith({x: 120, y: 67});
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('continues a user stroke on touchmove', () => {
      const evt = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        // @ts-expect-error ts-migrate(2740) FIXME: Type '{ clientX: number; clientY: number; }' is mi... Remove this comment to see the full error message
        touches: [{
          clientX: 170,
          clientY: 127,
        }],
      });
      const svg = document.querySelector('#target svg');
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 });
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      const canceled = !svg.dispatchEvent(evt);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(canceled).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.continueUserStroke).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.continueUserStroke).toHaveBeenCalledWith({x: 120, y: 67});
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ends a user stroke on mouseup', () => {
      const evt = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
      const svg = document.querySelector('#target svg');
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.dispatchEvent(evt);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.endUserStroke).toHaveBeenCalledTimes(1);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ends a user stroke on touchend', () => {
      const evt = new TouchEvent('touchend', { bubbles: true, cancelable: true });
      const svg = document.querySelector('#target svg');
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      svg.dispatchEvent(evt);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._quiz.endUserStroke).toHaveBeenCalledTimes(1);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('loadCharacterData', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('calls onLoadCharDataError if provided on loading failure', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onLoadCharDataError = jest.fn();
      const loadingPromise = HanziWriter.loadCharacterData('人', {
        onLoadCharDataError,
        charDataLoader: () => Promise.reject('reasons'),
      });

      await loadingPromise;

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onLoadCharDataError.mock.calls.length).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onLoadCharDataError.mock.calls[0][0]).toBe('reasons');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error on loading fauire if onLoadCharDataError is not provided', async () => {
      const loadingPromise = HanziWriter.loadCharacterData('人', {
        charDataLoader: (char: any, onComplete: any, onErr: any) => {
          onErr(new Error('reasons'));
        },
      });

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(loadingPromise).rejects.toThrow(new Error('reasons'));
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the character data in a promise on success', async () => {
      const loadingPromise = HanziWriter.loadCharacterData('人', {
        charDataLoader: (char: any, onComplete: any, onErr: any) => ren,
      });

      const result = await loadingPromise;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(result).toBe(ren);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the character data in onLoadCharDataSuccess if provided', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onLoadCharDataSuccess = jest.fn();
      const loadingPromise = HanziWriter.loadCharacterData('人', {
        onLoadCharDataSuccess,
        charDataLoader: (char: any, onComplete: any, onErr: any) => ren,
      });

      await loadingPromise;

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onLoadCharDataSuccess.mock.calls.length).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onLoadCharDataSuccess.mock.calls[0][0]).toBe(ren);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('getScalingTransform', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns an object with info that can be used for scaling a makemeahanzi character in SVG', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(HanziWriter.getScalingTransform(100, 120, 10)).toEqual({
        scale: 0.078125,
        transform: 'translate(10, 90.3125) scale(0.078125, -0.078125)',
        x: 10,
        y: 29.6875,
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses 0 as the default padding', () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(HanziWriter.getScalingTransform(100, 100)).toEqual({
        scale: 0.09765625,
        transform: 'translate(0, 87.890625) scale(0.09765625, -0.09765625)',
        x: 0,
        y: 12.109375,
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('option defaults', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('works with legacy strokeAnimationDuration and strokeHighlightDuration if present', () => {
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', {
        strokeAnimationDuration: 1000,
        strokeHighlightDuration: 250,
      });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._options.strokeAnimationSpeed).toBe(0.5);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._options.strokeHighlightSpeed).toBe(2);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('sets highlightCompleteColor to highlightColor if not explicitly set', () => {
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人', { highlightColor: '#ABC' });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._options.highlightCompleteColor).toBe('#ABC');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('sets highlightCompleteColor to the default highilghtColor if none is passed', () => {
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      const writer = new HanziWriter('target', '人');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(writer._options.highlightCompleteColor).toBe('#AAF');
    });
  });
});
