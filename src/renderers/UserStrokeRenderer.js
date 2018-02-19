const svg = require('../svg');


function UserStrokeRenderer() {
  this._oldProps = {};
}

UserStrokeRenderer.prototype.mount = function(canvas) {
  this._path = svg.createElm('path');
  canvas.svg.appendChild(this._path);
};

UserStrokeRenderer.prototype.render = function(props) {
  if (props === this._oldProps) return;
  if (props.strokeColor !== this._oldProps.strokeColor || props.strokeWidth !== this._oldProps.strokeWidth) {
    svg.attrs(this._path, {
      fill: 'none',
      stroke: props.strokeColor,
      'stroke-width': props.strokeWidth,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    });
  }
  if (props.opacity !== this._oldProps.opacity) {
    svg.attr(this._path, 'opacity', props.opacity);
  }
  if (props.points !== this._oldProps.points) {
    svg.attr(this._path, 'd', svg.getPathString(props.points));
  }
  this._oldProps = props;
};

UserStrokeRenderer.prototype.destroy = function() {
  svg.removeElm(this._path);
};

module.exports = UserStrokeRenderer;
