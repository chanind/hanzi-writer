// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ta'.
const ta = require('hanzi-writer-data/他.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseCharD... Remove this comment to see the full error message
const parseCharData = require('../parseCharData');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('parseCharData', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('creates a Character object from character json', () => {
    const res = parseCharData('他', ta);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(res.strokes).toHaveLength(5);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(res.strokes[0].isInRadical).toBe(true);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(res.strokes[1].isInRadical).toBe(true);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(res.strokes[2].isInRadical).toBe(false);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(res.strokes[3].isInRadical).toBe(false);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(res.strokes[4].isInRadical).toBe(false);
  });
});
