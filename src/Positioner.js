const Point = require('./models/Point');

class Positioner {
  constructor(character, options) {
    this._character = character;
    this._options = options;
    this._calculateScaleAndOffset();
  }

  convertExternalPoint(point) {
    const x = (point.x - this._xOffset) / this._scale;
    const y = (this.getHeight() - this._yOffset - point.y) / this._scale;
    return new Point(x, y);
  }

  getXOffset() { return this._xOffset; }
  getYOffset() { return this._yOffset; }
  getScale() { return this._scale; }
  getHeight() { return this._options.height; }

  _calculateScaleAndOffset() {
    const bounds = this._character.getBounds();
    const preScaledWidth = bounds[1].x - bounds[0].x;
    const preScaledHeight = bounds[1].y - bounds[0].y;
    const effectiveWidth = this._options.width - 2 * this._options.padding;
    const effectiveHeight = this._options.height - 2 * this._options.padding;
    const scaleX = effectiveWidth / preScaledWidth;
    const scaleY = effectiveHeight / preScaledHeight;

    this._scale = Math.min(scaleX, scaleY);

    const xCenteringBuffer = this._options.padding + (effectiveWidth - this._scale * preScaledWidth) / 2;
    const yCenteringBuffer = this._options.padding + (effectiveHeight - this._scale * preScaledHeight) / 2;
    this._xOffset = -1 * bounds[0].x * this._scale + xCenteringBuffer;
    this._yOffset = -1 * bounds[0].y * this._scale + yCenteringBuffer;
  }
}

module.exports = Positioner;
