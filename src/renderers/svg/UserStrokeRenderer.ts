// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'svg'.
const svg = require('./svgUtils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getPathStr... Remove this comment to see the full error message
const { getPathString } = require('../../geometry');


// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserStroke... Remove this comment to see the full error message
function UserStrokeRenderer() {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._oldProps = {};
}

UserStrokeRenderer.prototype.mount = function(target: any) {
  this._path = svg.createElm('path');
  target.svg.appendChild(this._path);
};

UserStrokeRenderer.prototype.render = function(props: any) {
  if (props === this._oldProps) return;
  if (props.strokeColor !== this._oldProps.strokeColor || props.strokeWidth !== this._oldProps.strokeWidth) {
    const {r, g, b, a} = props.strokeColor;
    svg.attrs(this._path, {
      fill: 'none',
      stroke: `rgba(${r},${g},${b},${a})`,
      'stroke-width': props.strokeWidth,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    });
  }
  if (props.opacity !== this._oldProps.opacity) {
    svg.attr(this._path, 'opacity', props.opacity);
  }
  if (props.points !== this._oldProps.points) {
    svg.attr(this._path, 'd', getPathString(props.points));
  }
  this._oldProps = props;
};

UserStrokeRenderer.prototype.destroy = function() {
  svg.removeElm(this._path);
};

module.exports = UserStrokeRenderer;
