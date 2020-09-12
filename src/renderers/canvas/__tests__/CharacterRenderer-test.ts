// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ren'.
const ren = require('hanzi-writer-data/人.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CharacterR... Remove this comment to see the full error message
const CharacterRenderer = require('../CharacterRenderer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseCharD... Remove this comment to see the full error message
const parseCharData = require('../../../parseCharData');


// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'char'.
const char = parseCharData('人', ren);

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('CharacterRenderer', () => {

  let ctx: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    ctx = document.createElement('canvas').getContext('2d');
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('renders the strokes of the character', () => {
    const props = {
      strokeColor: {r: 120, g: 17, b: 101, a: 0.3},
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.7,
      strokes: {
        0: {
          opacity: 1,
          displayPortion: 1,
        },
        1: {
          opacity: 1,
          displayPortion: 1,
        },
      },
    };

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const charRenderer = new CharacterRenderer(char);
    charRenderer.render(ctx, props);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(ctx.__getEvents()).toMatchSnapshot();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('skips rendering if opacity is close to 0', () => {
    const props = {
      strokeColor: {r: 101, g: 101, b: 101, a: 1},
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0,
      strokes: {
        0: {
          opacity: 1,
          displayPortion: 1,
        },
        1: {
          opacity: 1,
          displayPortion: 1,
        },
      },
    };

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const charRenderer = new CharacterRenderer(char);
    charRenderer.render(ctx, props);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(ctx.__getEvents()).toEqual([]);
  });

});
