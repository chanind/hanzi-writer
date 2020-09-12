// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ren'.
const ren = require('hanzi-writer-data/人.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'HanziWrite... Remove this comment to see the full error message
const HanziWriterRenderer = require('../HanziWriterRenderer');
const RenderTarget = require('../RenderTarget');
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
  it('renders the character and user strokes into the target', () => {
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

    const props = {
      options: {
        strokeWidth: 2,
        drawingWidth: 4,
        drawingColor: {r: 255, g: 255, b: 0, a: 0.1},
        strokeColor: {r: 255, g: 100, b: 10, a: 0.9},
        radicalColor: {r: 0, g: 100, b: 10, a: 1},
        outlineColor: {r: 255, g: 150, b: 100, a: 0.7},
        highlightColor: {r: 0, g: 0, b: 255, a: 1},
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

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const renderer = new HanziWriterRenderer(char, positioner);
    renderer.mount(target);
    renderer.render(props);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(target.node.getContext('2d').__getEvents()).toMatchSnapshot();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('handles empty user strokes', () => {
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

    const props = {
      options: {
        strokeWidth: 2,
        drawingWidth: 4,
        drawingColor: {r: 255, g: 255, b: 0, a: 0.1},
        strokeColor: {r: 255, g: 100, b: 10, a: 0.9},
        radicalColor: {r: 0, g: 100, b: 10, a: 1},
        outlineColor: {r: 255, g: 150, b: 100, a: 0.7},
        highlightColor: {r: 0, g: 0, b: 255, a: 1},
      },
      character: {
        outline: charProps,
        main: charProps,
        highlight: charProps,
      },
      userStrokes: {
        17: undefined,
      },
    };

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const renderer = new HanziWriterRenderer(char, positioner);
    renderer.mount(target);
    renderer.render(props);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(target.node.getContext('2d').__getEvents()).toMatchSnapshot();
  });

});
