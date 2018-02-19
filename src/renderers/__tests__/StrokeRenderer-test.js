const yi = require('hanzi-writer-data/一.json');
const StrokeRenderer = require('../StrokeRenderer');
const svg = require('../../svg');
const CharDataParser = require('../../CharDataParser');


const char = new CharDataParser().generateCharacter('一', yi);

describe('StrokeRenderer', () => {

  let canvas;

  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    canvas = svg.Canvas.init('target');
  });

  it('renders a path and clipPath', () => {
    const props = {
      strokeColor: '#123',
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.7,
      displayPortion: 0.4,
    };

    const renderer = new StrokeRenderer(char.strokes[0]);
    renderer.mount(canvas, props);
    renderer.render(props);

    expect(canvas.defs.childNodes.length).toBe(1);
    expect(canvas.defs.childNodes[0].nodeName).toBe('clipPath');
    const maskPath = canvas.defs.childNodes[0].childNodes[0];
    expect(maskPath.nodeName).toBe('path');
    const maskId = canvas.defs.childNodes[0].getAttribute('id');
    expect(canvas.svg.childNodes.length).toBe(2); // defs and path
    expect(canvas.svg.childNodes[1].nodeName).toBe('path');
    expect(canvas.svg.childNodes[1].getAttribute('stroke')).toBe('#123');
    expect(canvas.svg.childNodes[1].getAttribute('clip-path')).toBe(`url(#${maskId})`);

    expect(maskPath).toMatchSnapshot();
  });

});
