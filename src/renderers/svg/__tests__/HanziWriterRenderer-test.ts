// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ren'.
const ren = require('hanzi-writer-data/人.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'HanziWrite... Remove this comment to see the full error message
const HanziWriterRenderer = require('../HanziWriterRenderer');
const RenderTarget = require('../RenderTarget');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'copyAndMer... Remove this comment to see the full error message
const { copyAndMergeDeep } = require('../../../utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Positioner... Remove this comment to see the full error message
const Positioner = require('../../../Positioner');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseCharD... Remove this comment to see the full error message
const parseCharData = require('../../../parseCharData');


// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'char'.
const char = parseCharData('人', ren);
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'positioner... Remove this comment to see the full error message
const positioner = new Positioner({
  width: 100,
  height: 100,
  padding: 10,
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('HanziWriterRenderer', () => {

  let target: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    target = RenderTarget.init('target');
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('adds and removes user stroke renderers as needed', () => {
    const charProps = {
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

    const props1 = {
      options: {
        strokeWidth: 2,
        drawingWidth: 4,
        drawingColor: {r: 255, g: 255, b: 0, a: 0.1},
      },
      character: {
        outline: charProps,
        main: charProps,
        highlight: charProps,
      },
      userStrokes: {
        17: {
          points: [{x: 0, y: 0}, {x: 1, y: 3}],
          opacity: 0.9,
        },
      },
    };

    const props2 = copyAndMergeDeep(props1, { userStrokes: null });

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const renderer = new HanziWriterRenderer(char, positioner);
    renderer.mount(target);
    renderer.render(props1);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Object.keys(renderer._userStrokeRenderers)).toEqual(['17']);
    const userStrokes = document.querySelectorAll('svg > g > path');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(userStrokes.length).toBe(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(userStrokes[0].getAttribute('opacity')).toBe('0.9');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(userStrokes[0].getAttribute('stroke-width')).toBe('4');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(userStrokes[0].getAttribute('stroke')).toBe('rgba(255,255,0,0.1)');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(userStrokes[0].getAttribute('d')).toBe('M 0 0 L 1 3');

    renderer.render(props2);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Object.keys(renderer._userStrokeRenderers)).toEqual([]);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(document.querySelectorAll('svg > g > path').length).toBe(0);
  });

});
