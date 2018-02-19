const ren = require('hanzi-writer-data/人.json');
const Mutation = require('../Mutation');
const RenderState = require('../RenderState');
const CharDataParser = require('../CharDataParser');


const char = new CharDataParser().generateCharacter('人', ren);
const opts = {
  strokeColor: '#555',
  radicalColor: '#123',
  highlightColor: '#AAF',
  outlineColor: '#DDD',
  drawingColor: '#333',
  drawingFadeDuration: 300,
  drawingWidth: 4,
  outlineWidth: 2,
  showCharacter: true,
  showOutline: false,
};


describe('RenderState', () => {
  it('sets up state based on options and character', () => {
    const renderState = new RenderState(char, opts);

    expect(renderState.state).toEqual({
      options: {
        drawingFadeDuration: 300,
        drawingWidth: 4,
        drawingColor: '#333',
      },
      character: {
        main: {
          strokeColor: '#555',
          radicalColor: '#123',
          opacity: 1,
          strokes: {
            0: {
              displayPortion: 1,
              opacity: 1,
            },
            1: {
              displayPortion: 1,
              opacity: 1,
            },
          },
        },
        outline: {
          strokeColor: '#DDD',
          opacity: 0,
          strokes: {
            0: {
              displayPortion: 1,
              opacity: 1,
            },
            1: {
              displayPortion: 1,
              opacity: 1,
            },
          },
        },
        highlight: {
          strokeColor: '#AAF',
          opacity: 1,
          strokes: {
            0: {
              displayPortion: 1,
              opacity: 0,
            },
            1: {
              displayPortion: 1,
              opacity: 0,
            },
          },
        },
      },
      userStrokes: null,
    });
  });

  describe('run', () => {
    it('returns a promise which resolves when all mutations are complete', async () => {
      const updateState = jest.fn();
      const renderState = new RenderState(char, opts, updateState);

      let isResolved = false;
      let resolvedVal;

      renderState.run([
        new Mutation('character.main.opacity', 0.3),
        new Mutation('character.main.opacity', 0.9, { duration: 50 }),
        new Mutation.Pause(100),
        new Mutation('character.main.opacity', 0, { duration: 50 }),
      ]).then(result => {
        isResolved = true;
        resolvedVal = result;
      });

      // allow instant mutation to finish
      await Promise.resolve();
      expect(updateState).toHaveBeenCalledTimes(1);
      expect(isResolved).toBe(false);
      expect(renderState.state.character.main.opacity).toBe(0.3);

      // allow opacity: 1 mutation to finish
      // need to allow an await since the next mutation will start on the next clock cycle
      clock.tick(80);
      await Promise.resolve();
      expect(isResolved).toBe(false);
      expect(renderState.state.character.main.opacity).toBe(0.9);

      // allow pause to finish
      // need to allow an await since the next mutation will start on the next clock cycle
      clock.tick(101);
      await Promise.resolve();
      expect(isResolved).toBe(false);
      expect(renderState.state.character.main.opacity).toBe(0.9);

      // allow last mutation to finish
      // need to allow an await since the next mutation will start on the next clock cycle
      clock.tick(80);
      await Promise.resolve();
      expect(renderState.state.character.main.opacity).toBe(0);
      // allow another tick for the state to realized all mutations are done
      await Promise.resolve();
      expect(isResolved).toBe(true);
      expect(resolvedVal).toBe(true);
    });

    it('resolves its promise with false if mutations are canceled before completion', async () => {
      const updateState = jest.fn();
      const renderState = new RenderState(char, opts, updateState);

      let isResolved = false;
      let resolvedVal;

      renderState.run([
        new Mutation('character.main.opacity', 0.3),
        new Mutation('character.main.opacity', 0.9, { duration: 50 }),
        new Mutation.Pause(100),
        new Mutation('character.main.opacity', 0, { duration: 50 }),
      ]).then(result => {
        isResolved = true;
        resolvedVal = result;
      });

      // allow instant mutation to finish
      await Promise.resolve();
      expect(updateState).toHaveBeenCalledTimes(1);
      expect(isResolved).toBe(false);
      expect(renderState.state.character.main.opacity).toBe(0.3);

      renderState.cancelMutations(['character']);

      await Promise.resolve();
      expect(renderState.state.character.main.opacity).toBe(0.3);
      expect(isResolved).toBe(true);
      expect(resolvedVal).toBe(false);
    });
  });
});
