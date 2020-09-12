// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ren'.
const ren = require('hanzi-writer-data/人.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CharacterR... Remove this comment to see the full error message
const CharacterRenderer = require('../CharacterRenderer');
const RenderTarget = require('../RenderTarget');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'copyAndMer... Remove this comment to see the full error message
const { copyAndMergeDeep } = require('../../../utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseCharD... Remove this comment to see the full error message
const parseCharData = require('../../../parseCharData');


// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'char'.
const char = parseCharData('人', ren);

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('CharacterRenderer', () => {

  let target: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    target = RenderTarget.init('target');
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('renders a g element and puts strokes inside', () => {
    const props = {
      strokeColor: {r: 120, g: 17, b: 101, a: 0.3},
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

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const charRenderer = new CharacterRenderer(char);
    charRenderer.mount(target);
    charRenderer.render(props);

    const subCanvas = target.svg.childNodes[1];
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subCanvas.nodeName).toBe('g');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subCanvas.style.opacity).toBe('0.7');
    // 2 strokes of 人
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subCanvas.childNodes.length).toBe(2);
    subCanvas.childNodes.forEach((node: any) => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(node.nodeName).toBe('path');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(node.getAttribute('stroke')).toBe('rgba(120,17,101,0.3)');
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates opacity and updates passed-through props', () => {
    const props1 = {
      strokeColor: {r: 120, g: 17, b: 101, a: 0.3},
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
      strokeColor: {r: 255, g: 255, b: 0, a: 0.1},
      opacity: 0.9,
    });

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const charRenderer = new CharacterRenderer(char);
    charRenderer.mount(target);
    charRenderer.render(props1);
    charRenderer.render(props2);


    const subCanvas = target.svg.childNodes[1];
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subCanvas.nodeName).toBe('g');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subCanvas.style.opacity).toBe('0.9');
    // 2 strokes of 人
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subCanvas.childNodes.length).toBe(2);
    subCanvas.childNodes.forEach((node: any) => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(node.nodeName).toBe('path');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(node.getAttribute('stroke')).toBe('rgba(255,255,0,0.1)');
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('sets display: none if opacity is 0', () => {
    const props1 = {
      strokeColor: {r: 101, g: 101, b: 101, a: 1},
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0,
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
      strokeColor: {r: 255, g: 255, b: 0, a: 0.1},
      opacity: 0.9,
    });

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const charRenderer = new CharacterRenderer(char);
    charRenderer.mount(target);
    charRenderer.render(props1);
    const subCanvas = target.svg.childNodes[1];

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subCanvas.style.opacity).toBe('0');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subCanvas.style.display).toBe('none');

    charRenderer.render(props2);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subCanvas.style.opacity).toBe('0.9');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(subCanvas.style.display).toBe('');
  });

});
