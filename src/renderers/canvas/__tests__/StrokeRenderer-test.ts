// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'yi'.
const yi = require('hanzi-writer-data/一.json');
const StrokeRenderer = require('../StrokeRenderer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseCharD... Remove this comment to see the full error message
const parseCharData = require('../../../parseCharData');


// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'char'.
const char = parseCharData('一', yi);

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('StrokeRenderer', () => {

  let ctx: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    ctx = document.createElement('canvas').getContext('2d');
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('renders a path and clipPath', () => {
    const props = {
      strokeColor: {r: 12, g: 101, b: 20, a: 0.3},
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.7,
      displayPortion: 0.4,
    };
    const renderer = new StrokeRenderer(char.strokes[0]);
    renderer.render(ctx, props);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(ctx.__getEvents()).toMatchSnapshot();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('works without using Path2D if needed', () => {
    const props = {
      strokeColor: {r: 12, g: 101, b: 20, a: 1},
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.7,
      displayPortion: 0.4,
    };
    const renderer = new StrokeRenderer(char.strokes[0], false);
    renderer.render(ctx, props);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(ctx.__getEvents()).toMatchSnapshot();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('skips rendering if opacity is close to 0', () => {
    const props = {
      strokeColor: {r: 12, g: 101, b: 20, a: 0.3},
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.01,
      displayPortion: 0.4,
    };
    const renderer = new StrokeRenderer(char.strokes[0]);
    renderer.render(ctx, props);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(ctx.__getEvents()).toEqual([]);
  });

});
