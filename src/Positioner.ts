// All makemeahanzi characters have the same bounding box
const CHARACTER_BOUNDS = [{x: 0, y: -124}, {x: 1024, y: 900}];

function Positioner(options) {
  this._options = options;
  this.width = options.width;
  this.height = options.height;
  this._calculateScaleAndOffset();
}

Positioner.prototype.convertExternalPoint = function(point) {
  const x = (point.x - this.xOffset) / this.scale;
  const y = (this.height - this.yOffset - point.y) / this.scale;
  return {x, y};
};

Positioner.prototype._calculateScaleAndOffset = function() {
  const bounds = CHARACTER_BOUNDS;
  const preScaledWidth = bounds[1].x - bounds[0].x;
  const preScaledHeight = bounds[1].y - bounds[0].y;
  const effectiveWidth = this.width - 2 * this._options.padding;
  const effectiveHeight = this.height - 2 * this._options.padding;
  const scaleX = effectiveWidth / preScaledWidth;
  const scaleY = effectiveHeight / preScaledHeight;

  this.scale = Math.min(scaleX, scaleY);

  const xCenteringBuffer = this._options.padding + (effectiveWidth - this.scale * preScaledWidth) / 2;
  const yCenteringBuffer = this._options.padding + (effectiveHeight - this.scale * preScaledHeight) / 2;

  this.xOffset = -1 * bounds[0].x * this.scale + xCenteringBuffer;
  this.yOffset = -1 * bounds[0].y * this.scale + yCenteringBuffer;
};

module.exports = Positioner;
