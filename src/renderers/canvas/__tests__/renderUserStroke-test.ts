// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'renderUser... Remove this comment to see the full error message
const renderUserStroke = require('../renderUserStroke');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('renderUserStroke', () => {

  let ctx: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    ctx = document.createElement('canvas').getContext('2d');
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('renders a user stroke path', () => {
    const props = {
      strokeColor: {r: 12, g: 101, b: 20, a: 0.3},
      strokeWidth: 2,
      opacity: 0.7,
      points: [{ x: 0, y: 0}, { x: 17, y: 3 }, { x: 9, y: 18 }],
    };
    renderUserStroke(ctx, props);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(ctx.__getEvents()).toMatchSnapshot();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('skips rendering if opacity is close to 0', () => {
    const props = {
      strokeColor: {r: 12, g: 101, b: 20, a: 0.3},
      strokeWidth: 2,
      opacity: 0.01,
      points: [{ x: 0, y: 0}, { x: 17, y: 3 }, { x: 9, y: 18 }],
    };
    renderUserStroke(ctx, props);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(ctx.__getEvents()).toEqual([]);
  });

});
