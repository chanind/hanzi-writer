// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ren'.
const ren = require('hanzi-writer-data/人.json');
const Mutation = require('../Mutation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RenderStat... Remove this comment to see the full error message
const RenderState = require('../RenderState');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseCharD... Remove this comment to see the full error message
const parseCharData = require('../parseCharData');


// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'char'.
const char = parseCharData('人', ren);
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'opts'.
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


// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('RenderState', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('sets up state based on options and character', () => {
    const renderState = new RenderState(char, opts);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.state).toEqual({
      options: {
        drawingFadeDuration: 300,
        drawingWidth: 4,
        drawingColor: {r: 51, g: 51, b: 51, a: 1},
        strokeColor: {r: 85, g: 85, b: 85, a: 1},
        radicalColor: {r: 17, g: 34, b: 51, a: 1},
        highlightColor: {r: 170, g: 170, b: 255, a: 1},
        outlineColor: {r: 221, g: 221, b: 221, a: 1},
      },
      character: {
        main: {
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('run', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns a promise which resolves when all mutations are complete', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const updateState = jest.fn();
      const renderState = new RenderState(char, opts, updateState);

      let isResolved = false;
      let resolvedVal;

      renderState.run([
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new Mutation('character.main.opacity', 0.3),
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new Mutation('character.main.opacity', 0.9, { duration: 50 }),
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new Mutation.Delay(100),
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new Mutation('character.main.opacity', 0, { duration: 50 }),
      ]).then((result: any) => {
        isResolved = true;
        resolvedVal = result;
      });

      // allow instant mutation to finish
      await Promise.resolve();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(updateState).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.opacity).toBe(0.3);

      // allow opacity: 1 mutation to finish
      // need to allow an await since the next mutation will start on the next clock cycle
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(80);
      await Promise.resolve();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.opacity).toBe(0.9);

      // allow pause to finish
      // need to allow an await since the next mutation will start on the next clock cycle
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(101);
      await Promise.resolve();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.opacity).toBe(0.9);

      // allow last mutation to finish
      // need to allow an await since the next mutation will start on the next clock cycle
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(80);
      await Promise.resolve();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.opacity).toBe(0);
      // allow another tick for the state to realized all mutations are done
      await Promise.resolve();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolvedVal).toEqual({ canceled: false });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('resolves its promise with canceled: true if mutations are canceled before completion', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const updateState = jest.fn();
      const renderState = new RenderState(char, opts, updateState);

      let isResolved = false;
      let resolvedVal;

      renderState.run([
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new Mutation('character.main.opacity', 0.3),
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new Mutation('character.main.opacity', 0.9, { duration: 50 }),
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new Mutation.Delay(100),
        // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new Mutation('character.main.opacity', 0, { duration: 50 }),
      ]).then((result: any) => {
        isResolved = true;
        resolvedVal = result;
      });

      // allow instant mutation to finish
      await Promise.resolve();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(updateState).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.opacity).toBe(0.3);

      renderState.cancelMutations(['character']);

      await Promise.resolve();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.opacity).toBe(0.3);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(isResolved).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(resolvedVal).toEqual({ canceled: true });
    });
  });
});
