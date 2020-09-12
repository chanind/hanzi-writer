// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'StrokeRend... Remove this comment to see the full error message
function StrokeRendererBase() {}

StrokeRendererBase.prototype._getStrokeDashoffset = function(displayPortion: any) {
  return this._pathLength * 0.999 * (1 - displayPortion);
};

StrokeRendererBase.prototype._getColor = function({
  strokeColor,
  radicalColor
}: any) {
  return radicalColor && this._stroke.isInRadical ? radicalColor : strokeColor;
};

module.exports = StrokeRendererBase;
