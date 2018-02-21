const ren = require('hanzi-writer-data/人.json');
const HanziWriterRenderer = require('../HanziWriterRenderer');
const svg = require('../../svg');
const { copyAndMergeDeep } = require('../../utils');
const Point = require('../../models/Point');
const Positioner = require('../../Positioner');
const CharDataParser = require('../../CharDataParser');


const char = new CharDataParser().generateCharacter('人', ren);
const positioner = new Positioner(char, {
  width: 100,
  height: 100,
  padding: 10,
});

describe('HanziWriterRenderer', () => {

  let canvas;

  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    canvas = svg.Canvas.init('target');
  });

  it('adds and removes user stroke renderers as needed', () => {
    const charProps = {
      opacity: 0.7,
      strokeColor: '#123',
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
        drawingColor: '#456',
      },
      character: {
        outline: charProps,
        main: charProps,
        highlight: charProps,
      },
      userStrokes: {
        17: {
          points: [new Point(0, 0), new Point(1, 3)],
          opacity: 0.9,
        },
      },
    };

    const props2 = copyAndMergeDeep(props1, { userStrokes: null });

    const renderer = new HanziWriterRenderer(char, positioner);
    renderer.mount(canvas);
    renderer.render(props1);

    expect(Object.keys(renderer._userStrokeRenderers)).toEqual(['17']);
    const userStrokes = document.querySelectorAll('svg > g > path');
    expect(userStrokes.length).toBe(1);
    expect(userStrokes[0].getAttribute('opacity')).toBe('0.9');
    expect(userStrokes[0].getAttribute('stroke-width')).toBe('4');
    expect(userStrokes[0].getAttribute('stroke')).toBe('#456');
    expect(userStrokes[0].getAttribute('d')).toBe('M 0 0 L 1 3');

    renderer.render(props2);
    expect(Object.keys(renderer._userStrokeRenderers)).toEqual([]);
    expect(document.querySelectorAll('svg > g > path').length).toBe(0);
  });

});
