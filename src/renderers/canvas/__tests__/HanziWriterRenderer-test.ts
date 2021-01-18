import ren from 'hanzi-writer-data/人.json';
import HanziWriterRenderer from '../HanziWriterRenderer';
import RenderTarget from '../RenderTarget';
import Positioner from '../../../Positioner';
import parseCharData from '../../../parseCharData';
import { RenderStateObject } from '../../../RenderState';

const char = parseCharData('人', ren);
const positioner = new Positioner({
  width: 100,
  height: 100,
  padding: 10,
});

describe('HanziWriterRenderer', () => {
  let target: RenderTarget;

  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    target = RenderTarget.init('target');
  });

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

    const props: RenderStateObject = {
      options: {
        drawingWidth: 4,
        drawingFadeDuration: 400,
        drawingColor: { r: 255, g: 255, b: 0, a: 0.1 },
        strokeColor: { r: 255, g: 100, b: 10, a: 0.9 },
        radicalColor: { r: 0, g: 100, b: 10, a: 1 },
        outlineColor: { r: 255, g: 150, b: 100, a: 0.7 },
        highlightColor: { r: 0, g: 0, b: 255, a: 1 },
      },
      character: {
        outline: charProps,
        main: charProps,
        highlight: charProps,
      },
      userStrokes: {
        17: {
          points: [
            { x: 0, y: 0 },
            { x: 1, y: 3 },
          ],
          opacity: 0.9,
        },
      },
    };

    const renderer = new HanziWriterRenderer(char, positioner);
    renderer.mount(target);
    renderer.render(props);

    expect((target.node.getContext('2d') as any).__getEvents()).toMatchSnapshot();
  });

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

    const props: RenderStateObject = {
      options: {
        drawingWidth: 4,
        drawingFadeDuration: 400,
        drawingColor: { r: 255, g: 255, b: 0, a: 0.1 },
        strokeColor: { r: 255, g: 100, b: 10, a: 0.9 },
        radicalColor: { r: 0, g: 100, b: 10, a: 1 },
        outlineColor: { r: 255, g: 150, b: 100, a: 0.7 },
        highlightColor: { r: 0, g: 0, b: 255, a: 1 },
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

    const renderer = new HanziWriterRenderer(char, positioner);
    renderer.mount(target);
    renderer.render(props);

    expect((target.node.getContext('2d') as any).__getEvents()).toMatchSnapshot();
  });
});
