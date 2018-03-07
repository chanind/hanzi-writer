jest.mock('../Quiz');

const ren = require('hanzi-writer-data/人.json');
const yi = require('hanzi-writer-data/一.json');
const HanziWriter = require('../HanziWriter');
const { timeout } = require('../utils');
const { resolvePromises } = require('../testUtils');
const Quiz = require('../Quiz');


describe('HanziWriter', () => {
  beforeEach(() => {
    Quiz.mockClear();
  });

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
    it('animates and returns promise that resolves when animation is finished', async () => {
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

  describe('loopCharacterAnimation', () => {
    it('animates and then repeats until something else stops it', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = new HanziWriter('target', '人', {
        showCharacter: true,
        charDataLoader: () => ren,
      });
      await writer._withDataPromise;

      writer.loopCharacterAnimation();

      await resolvePromises();

      // loop 5 times
      for (let i = 0; i < 5; i++) {
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

        clock.tick(1000);
        await resolvePromises();

        expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(1);

        clock.tick(3000);
        await resolvePromises();
      }

      // now, stop the animation by running something different
      writer.showCharacter();
      await resolvePromises();
      clock.tick(1000);
      await resolvePromises();

      expect(writer._renderState.state.character.main.opacity).toBe(1);
      expect(writer._renderState.state.character.main.strokes[0].opacity).toBe(1);
      expect(writer._renderState.state.character.main.strokes[0].displayPortion).toBe(1);
      expect(writer._renderState.state.character.main.strokes[1].opacity).toBe(1);
      expect(writer._renderState.state.character.main.strokes[1].displayPortion).toBe(1);
    });
  });

  [
    { methodLabel: 'Character', stateLabel: 'main' },
    { methodLabel: 'Outline', stateLabel: 'outline' },
  ].forEach(({ methodLabel, stateLabel }) => {
    describe(`hide${methodLabel}`, () => {
      it('animates and returns promise that resolves when finished', async () => {
        document.body.innerHTML = '<div id="target"></div>';
        const writer = new HanziWriter('target', '人', {
          showCharacter: true,
          charDataLoader: () => ren,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        const onComplete = jest.fn();

        writer[`hide${methodLabel}`]({ onComplete }).then(result => {
          isResolved = true;
          resolvedVal = result;
        });

        await resolvePromises();

        expect(writer._renderState.state.character[stateLabel].opacity).toBe(1);
        expect(isResolved).toBe(false);

        clock.tick(1000);
        await resolvePromises();

        expect(writer._renderState.state.character[stateLabel].opacity).toBe(0);

        expect(isResolved).toBe(true);
        expect(resolvedVal).toEqual({ canceled: false });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });

      it('returns instantly if char is already hidden', async () => {
        document.body.innerHTML = '<div id="target"></div>';
        const writer = new HanziWriter('target', '人', {
          showCharacter: false,
          showOutline: false,
          charDataLoader: () => ren,
        });
        await writer._withDataPromise;

        let isResolved = false;
        let resolvedVal;
        const onComplete = jest.fn();

        writer[`hide${methodLabel}`]({ onComplete }).then(result => {
          isResolved = true;
          resolvedVal = result;
        });

        expect(isResolved).toBe(false);

        await resolvePromises();

        expect(writer._renderState.state.character[stateLabel].opacity).toBe(0);
        expect(isResolved).toBe(true);
        expect(resolvedVal).toEqual({ canceled: false });
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith({ canceled: false });
      });
    });

    describe(`show${methodLabel}`, () => {
      it('animates and returns promise that resolves when finished', async () => {
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

  describe('quiz', () => {
    it('sets up and starts the quiz', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = new HanziWriter('target', '人');
      const onComplete = jest.fn();
      writer.quiz({ onComplete });
      expect(Quiz).not.toHaveBeenCalled();
      await writer._withDataPromise;
      await resolvePromises();
      expect(Quiz).toHaveBeenCalledTimes(1);
      expect(Quiz).toHaveBeenCalledWith(writer._character, writer._renderState, writer._positioner);
      expect(writer._quiz.startQuiz).toHaveBeenCalledTimes(1);
      expect(writer._quiz.startQuiz).toHaveBeenCalledWith(Object.assign({}, writer._options, { onComplete }));
    });
  });

  describe('cancelQuiz', () => {
    it('cancels the existing quiz', async () => {
      document.body.innerHTML = '<div id="target"></div>';
      const writer = new HanziWriter('target', '人');
      await writer._withDataPromise;
      writer.quiz();
      await resolvePromises();
      const quiz = writer._quiz;
      writer.cancelQuiz();
      expect(quiz.cancel).toHaveBeenCalledTimes(1);
      expect(writer._quiz).toBe(null);
    });
  });

  describe('mouse and touch events', () => {
    let writer;
    beforeEach(async () => {
      document.body.innerHTML = '<div id="target"></div>';
      writer = new HanziWriter('target', '人');
      await writer._withDataPromise;
      writer.quiz();
      await resolvePromises();
    });

    it('starts a user stroke on mousedown', () => {
      const evt = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 170,
        clientY: 127,
      });
      const svg = document.querySelector('#target svg');
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 });
      const canceled = !svg.dispatchEvent(evt);
      expect(canceled).toBe(true);
      expect(writer._quiz.startUserStroke).toHaveBeenCalledTimes(1);
      expect(writer._quiz.startUserStroke).toHaveBeenCalledWith({x: 120, y: 67});
    });

    it('starts a user stroke on touchstart', () => {
      const evt = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [{
          clientX: 170,
          clientY: 127,
        }],
      });
      const svg = document.querySelector('#target svg');
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 });
      const canceled = !svg.dispatchEvent(evt);
      expect(canceled).toBe(true);
      expect(writer._quiz.startUserStroke).toHaveBeenCalledTimes(1);
      expect(writer._quiz.startUserStroke).toHaveBeenCalledWith({x: 120, y: 67});
    });

    it('continues a user stroke on mousemove', () => {
      const evt = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: 170,
        clientY: 127,
      });
      const svg = document.querySelector('#target svg');
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 });
      const canceled = !svg.dispatchEvent(evt);
      expect(canceled).toBe(true);
      expect(writer._quiz.continueUserStroke).toHaveBeenCalledTimes(1);
      expect(writer._quiz.continueUserStroke).toHaveBeenCalledWith({x: 120, y: 67});
    });

    it('continues a user stroke on touchmove', () => {
      const evt = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [{
          clientX: 170,
          clientY: 127,
        }],
      });
      const svg = document.querySelector('#target svg');
      svg.getBoundingClientRect = () => ({ left: 50, top: 60 });
      const canceled = !svg.dispatchEvent(evt);
      expect(canceled).toBe(true);
      expect(writer._quiz.continueUserStroke).toHaveBeenCalledTimes(1);
      expect(writer._quiz.continueUserStroke).toHaveBeenCalledWith({x: 120, y: 67});
    });

    it('ends a user stroke on mouseup', () => {
      const evt = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
      const svg = document.querySelector('#target svg');
      svg.dispatchEvent(evt);
      expect(writer._quiz.endUserStroke).toHaveBeenCalledTimes(1);
    });

    it('ends a user stroke on touchend', () => {
      const evt = new TouchEvent('touchend', { bubbles: true, cancelable: true });
      const svg = document.querySelector('#target svg');
      svg.dispatchEvent(evt);
      expect(writer._quiz.endUserStroke).toHaveBeenCalledTimes(1);
    });
  });
});
