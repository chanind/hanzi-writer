const ren = require('hanzi-writer-data/人.json');
const CharacterRenderer = require('../CharacterRenderer');
const svg = require('../../svg');
const { copyAndMergeDeep } = require('../../utils');
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
      strokeColor: '#123',
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

    const charRenderer = new CharacterRenderer(char);
    charRenderer.mount(canvas, props);
    charRenderer.render(props);

    const subCanvas = canvas.svg.childNodes[1];
    expect(subCanvas.nodeName).toBe('g');
    expect(subCanvas.style.opacity).toBe('0.7');
    // 2 strokes of 人
    expect(subCanvas.childNodes.length).toBe(2);
    subCanvas.childNodes.forEach(node => {
      expect(node.nodeName).toBe('path');
      expect(node.getAttribute('fill')).toBe('#123');
    });
  });

  it('updates opacity and updates passed-through props', () => {
    const props1 = {
      usePolygonMasks: false,
      strokeColor: '#123',
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

    const props2 = copyAndMergeDeep(props1, {
      strokeColor: '#456',
      opacity: 0.9,
    });

    const charRenderer = new CharacterRenderer(char);
    charRenderer.mount(canvas, props1);
    charRenderer.render(props1);
    charRenderer.render(props2);


    const subCanvas = canvas.svg.childNodes[1];
    expect(subCanvas.nodeName).toBe('g');
    expect(subCanvas.style.opacity).toBe('0.9');
    // 2 strokes of 人
    expect(subCanvas.childNodes.length).toBe(2);
    subCanvas.childNodes.forEach(node => {
      expect(node.nodeName).toBe('path');
      expect(node.getAttribute('fill')).toBe('#456');
    });
  });

});
