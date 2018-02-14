const ren = require('hanzi-writer-data/人.json');
const CharacterRenderer = require('../CharacterRenderer');
const svg = require('../../svg');
const CharDataParser = require('../../CharDataParser');


const char = new CharDataParser().generateCharacter('人', ren);

describe('CharacterRenderer', () => {

  let canvas;

  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    canvas = svg.Canvas.init('target');
  });

  it('renders a g element and puts strokes inside', () => {
    const props = {
      usePolygonMasks: false,
      strokeColor: '#fff',
      radicalColor: '#ddd',
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

    const charRenderer = new CharacterRenderer(char);
    charRenderer.mount(canvas, props);
    charRenderer.render(props);

    expect(canvas.svg.childNodes[1].nodeName).toBe('g');
    expect(canvas.svg.childNodes[1].style.opacity).toBe('0.7');
  });

});
