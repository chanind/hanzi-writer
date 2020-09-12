// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Positioner... Remove this comment to see the full error message
const Positioner = require('../Positioner');


// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Positioner', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calculates scale and offset to transform characters to fix in the box on screen', () => {
    const positioner = new Positioner({ width: 400, height: 400, padding: 20 });

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(positioner.xOffset).toBe(20);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(positioner.yOffset).toBe(63.59375);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(positioner.scale).toBe(0.3515625);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(positioner.height).toBe(400);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('converts points from the external reference frame to the character reference frame', () => {
    const positioner = new Positioner({ width: 400, height: 400, padding: 20 });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(positioner.convertExternalPoint({x: 30, y: 50})).toEqual({x: 28.444444444444443, y: 814.6666666666666});
  });
});
