const ren = require('hanzi-writer-data/人.json');
const HanziWriterRenderer = require('../HanziWriterRenderer');
const RenderTarget = require('../RenderTarget');
const { copyAndMergeDeep } = require('../../../utils');
const Positioner = require('../../../Positioner');
const parseCharData = require('../../../parseCharData');


const char = parseCharData('人', ren);
const positioner = new Positioner({
  width: 100,
  height: 100,
  padding: 10,
});

describe('HanziWriterRenderer', () => {

  let target;

  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    target = RenderTarget.init('target');
  });

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

    const renderer = new HanziWriterRenderer(char, positioner);
    renderer.mount(target);
    renderer.render(props1);

    expect(Object.keys(renderer._userStrokeRenderers)).toEqual(['17']);
    const userStrokes = document.querySelectorAll('svg > g > path');
    expect(userStrokes.length).toBe(1);
    expect(userStrokes[0].getAttribute('opacity')).toBe('0.9');
    expect(userStrokes[0].getAttribute('stroke-width')).toBe('4');
    expect(userStrokes[0].getAttribute('stroke')).toBe('rgba(255,255,0,0.1)');
    expect(userStrokes[0].getAttribute('d')).toBe('M 0 0 L 1 3');

    renderer.render(props2);
    expect(Object.keys(renderer._userStrokeRenderers)).toEqual([]);
    expect(document.querySelectorAll('svg > g > path').length).toBe(0);
  });

});
