const Renderer = require('./Renderer');
const { inherits } = require('../utils');
const svg = require('../svg');


function UserStrokeRenderer() {
  UserStrokeRenderer.super_.call(this);
  this._oldProps = {};
}
inherits(UserStrokeRenderer, Renderer);

UserStrokeRenderer.prototype.mount = function(canvas, props) {
  this._path = svg.createElm('path');
  canvas.svg.appendChild(this._path);
};

UserStrokeRenderer.prototype.render = function(props) {
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
  UserStrokeRenderer.super_.prototype.destroy.call(this);
  this._path.parentNode.removeChild(this._path);
};

module.exports = UserStrokeRenderer;
