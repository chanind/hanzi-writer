const Renderer = require('./Renderer');
const { inherits } = require('../utils');
const svg = require('../svg');


function UserStrokeRenderer(userStroke, options = {}) {
  UserStrokeRenderer.super_.call(this);
  this.options = options;
  this.userStroke = userStroke;
}

inherits(UserStrokeRenderer, Renderer);

UserStrokeRenderer.prototype.getPathString = function() {
  return svg.getPathString(this.userStroke.points);
};

UserStrokeRenderer.prototype.updatePath = function() {
  svg.attr(this.path, 'd', this.getPathString());
};

UserStrokeRenderer.prototype.draw = function() {
  UserStrokeRenderer.super_.prototype.draw.call(this);
  this.path = svg.createElm('path');
  svg.attrs(this.path, this.getStrokeAttrs());
  this.path.style.opacity = 1;
  this.updatePath();
  this.canvas.svg.appendChild(this.path);
  return this;
};

UserStrokeRenderer.prototype.fadeAndRemove = function(animation) {
  const tween = new svg.StyleTween(this.path, 'opacity', 0, {
    duration: this.options.fadeDuration,
  });
  animation.registerSvgAnimation(tween);
  return tween.start().then(() => this.destroy());
};

UserStrokeRenderer.prototype.getStrokeAttrs = function() {
  return {
    fill: 'none',
    stroke: this.options.strokeColor,
    'stroke-width': this.options.strokeWidth,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  };
};

module.exports = UserStrokeRenderer;
