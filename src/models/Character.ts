// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Character'... Remove this comment to see the full error message
function Character(symbol: any, strokes: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.symbol = symbol;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.strokes = strokes;
}

module.exports = Character;
