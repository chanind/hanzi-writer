function StrokeRendererBase() {}

StrokeRendererBase.prototype._getStrokeDashoffset = function(displayPortion) {
  return this._pathLength * 0.999 * (1 - displayPortion);
};

StrokeRendererBase.prototype._getColor = function({ strokeColor, radicalColor }) {
  return radicalColor && this._stroke.isInRadical ? radicalColor : strokeColor;
};

module.exports = StrokeRendererBase;
