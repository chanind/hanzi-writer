const RenderTarget = require('../RenderTarget');


// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('RenderTarget', () => {

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('can render a canvas into a div on the page', () => {
    document.body.innerHTML = '<div id="target"></canvas>';
    const target = RenderTarget.init('target', '200px', '120px');
    const canvas = document.querySelector('#target canvas');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(canvas.width).toBe(200);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(canvas.height).toBe(120);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(target.node).toBe(canvas);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('can use an existing canvas on the page', () => {
    document.body.innerHTML = '<canvas id="target"></canvas>';
    const target = RenderTarget.init('target', '200px', '120px');
    const canvas = document.querySelector('canvas#target');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(canvas.width).toBe(200);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(canvas.height).toBe(120);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(target.node).toBe(canvas);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("Errors if the element can't be found", () => {
    document.body.innerHTML = '<canvas id="target"></canvas>';
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(() => {
      RenderTarget.init('wrong-target', '200px', '120px');
    }).toThrow('HanziWriter target element not found: wrong-target');
  });
});
