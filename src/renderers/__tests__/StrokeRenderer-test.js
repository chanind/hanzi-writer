const yi = require('hanzi-writer-data/一.json');
const StrokeRenderer = require('../StrokeRenderer');
const svg = require('../../svg');
const parseCharData = require('../../parseCharData');


const char = parseCharData('一', yi);

describe('StrokeRenderer', () => {

  let canvas;

  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    canvas = svg.Canvas.init('target');
  });

  it('renders a path and clipPath', () => {
    const props = {
      strokeColor: {r: 12, g: 101, b: 20, a: 0.3},
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
    expect(canvas.svg.childNodes[1].getAttribute('stroke')).toBe('rgba(12,101,20,0.3)');
    expect(canvas.svg.childNodes[1].getAttribute('clip-path')).toBe(`url(https://test.com/url#${maskId})`);

    expect(maskPath).toMatchSnapshot();
  });

});
