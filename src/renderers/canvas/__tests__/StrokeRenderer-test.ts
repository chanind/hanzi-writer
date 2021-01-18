import yi from 'hanzi-writer-data/一.json';
import StrokeRenderer from '../StrokeRenderer';
import parseCharData from '../../../parseCharData';

const char = parseCharData('一', yi);

describe('StrokeRenderer', () => {
  let ctx;

  beforeEach(() => {
    ctx = document.createElement('canvas').getContext('2d');
  });

  it('renders a path and clipPath', () => {
    const props = {
      strokeColor: { r: 12, g: 101, b: 20, a: 0.3 },
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.7,
      displayPortion: 0.4,
    };
    const renderer = new StrokeRenderer(char.strokes[0]);
    renderer.render(ctx, props);

    expect(ctx.__getEvents()).toMatchSnapshot();
  });

  it('works without using Path2D if needed', () => {
    const props = {
      strokeColor: { r: 12, g: 101, b: 20, a: 1 },
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.7,
      displayPortion: 0.4,
    };
    const renderer = new StrokeRenderer(char.strokes[0], false);
    renderer.render(ctx, props);

    expect(ctx.__getEvents()).toMatchSnapshot();
  });

  it('skips rendering if opacity is close to 0', () => {
    const props = {
      strokeColor: { r: 12, g: 101, b: 20, a: 0.3 },
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.01,
      displayPortion: 0.4,
    };
    const renderer = new StrokeRenderer(char.strokes[0]);
    renderer.render(ctx, props);
    expect(ctx.__getEvents()).toEqual([]);
  });
});
