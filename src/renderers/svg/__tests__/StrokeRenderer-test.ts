// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'yi'.
const yi = require('hanzi-writer-data/一.json');
const StrokeRenderer = require('../StrokeRenderer');
const RenderTarget = require('../RenderTarget');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseCharD... Remove this comment to see the full error message
const parseCharData = require('../../../parseCharData');


// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'char'.
const char = parseCharData('一', yi);

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('StrokeRenderer', () => {

  let target: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    target = RenderTarget.init('target');
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('renders a path and clipPath', () => {
    const props = {
      strokeColor: {r: 12, g: 101, b: 20, a: 0.3},
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.7,
      displayPortion: 0.4,
    };

    const renderer = new StrokeRenderer(char.strokes[0]);
    renderer.mount(target, props);
    renderer.render(props);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(target.defs.childNodes.length).toBe(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(target.defs.childNodes[0].nodeName).toBe('clipPath');
    const maskPath = target.defs.childNodes[0].childNodes[0];
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(maskPath.nodeName).toBe('path');
    const maskId = target.defs.childNodes[0].getAttribute('id');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(target.svg.childNodes.length).toBe(2); // defs and path
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(target.svg.childNodes[1].nodeName).toBe('path');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(target.svg.childNodes[1].getAttribute('stroke')).toBe('rgba(12,101,20,0.3)');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(target.svg.childNodes[1].getAttribute('clip-path')).toBe(`url(https://test.com/url#${maskId})`);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(maskPath).toMatchSnapshot();
  });

});
