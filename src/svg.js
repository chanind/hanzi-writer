const { inherits } = require('./utils');
const { getPerpendicularPointsAtDist, getLinesIntersectPoint, extendPointOnLine } = require('./geometry');

const performanceNow = (global.performance && (() => global.performance.now())) || (() => Date.now());
const requestAnimFrame = global.requestAnimationFrame || (callback => setTimeout(() => callback(performanceNow()), 1000 / 60));
const cancelAnimFrame = global.cancelAnimationFrame || clearTimeout;

function createElm(elmType) {
  return global.document.createElementNS('http://www.w3.org/2000/svg', elmType);
}

function attr(elm, name, value) {
  elm.setAttributeNS(null, name, value);
}

function attrs(elm, attrsMap) {
  Object.keys(attrsMap).forEach(attrName => attr(elm, attrName, attrsMap[attrName]));
}

function getPathString(points) {
  const start = points[0];
  const remainingPoints = points.slice(1);
  let pathString = `M ${start.x} ${start.y}`;
  remainingPoints.forEach(point => {
    pathString += ` L ${point.x} ${point.y}`;
  });
  return pathString;
}

// given the points of a polyline, return the points outlining a polygon that's that polyline stroked with thickness
const linesToPolygonPathString = (points, thickness) => {
  if (points.length < 2) return '';
  const dist = thickness / 2;
  const topSegments = [];
  const bottomSegments = [];
  for (let i = 1; i < points.length; i += 1) {
    const startPoints = getPerpendicularPointsAtDist(points[i - 1], points[i], dist);
    const endPoints = getPerpendicularPointsAtDist(points[i], points[i - 1], dist);
    topSegments.push({ start: startPoints[0], end: endPoints[1] });
    bottomSegments.push({ start: startPoints[1], end: endPoints[0] });
  }
  const topPoints = [topSegments[0].start];
  const bottomPoints = [bottomSegments[0].start];
  for (let i = 1; i < topSegments.length; i += 1) {
    const topIntersect = getLinesIntersectPoint(
      topSegments[i - 1].start,
      topSegments[i - 1].end,
      topSegments[i].start,
      topSegments[i].end,
    );
    const bottomIntersect = getLinesIntersectPoint(
      bottomSegments[i - 1].start,
      bottomSegments[i - 1].end,
      bottomSegments[i].start,
      bottomSegments[i].end,
    );
    topPoints.push(topIntersect);
    bottomPoints.push(bottomIntersect);
  }
  topPoints.push(topSegments[topSegments.length - 1].end);
  bottomPoints.push(bottomSegments[bottomSegments.length - 1].end);
  bottomPoints.reverse();
  const tipControlPoint = extendPointOnLine(points[points.length - 2], points[points.length - 1], dist);

  const startPoint = topPoints.shift();
  let pathString = `M ${startPoint.x} ${startPoint.y}`;
  topPoints.forEach(point => {
    pathString += ` L ${point.x} ${point.y}`;
  });
  const bottomStartPoint = bottomPoints.shift();
  pathString += ` Q ${tipControlPoint.x},${tipControlPoint.y} ${bottomStartPoint.x},${bottomStartPoint.y}`;
  bottomPoints.forEach(point => {
    pathString += ` L ${point.x} ${point.y}`;
  });
  pathString += 'Z';

  return pathString;
};


// ------- STYLETWEEN CLASS ---------

// from https://github.com/maxwellito/vivus
const ease = x => -Math.cos(x * Math.PI) / 2 + 0.5;

function Tween(onTick, options = {}) {
  this._onTick = onTick;
  this._duration = options.duration || 300;
  this._isActive = false;
}

Tween.prototype.start = function() {
  this._isActive = true;
  this._startTime = performanceNow();
  this._progress = 0;
  this._nextTick();

  return new Promise((resolve, reject) => {
    this._resolve = resolve;
  });
};

Tween.prototype._nextTick = function() {
  this._frameHandle = requestAnimFrame((timing) => this._tick(timing));
};

Tween.prototype._tick = function(timing) {
  if (!this._isActive) return;
  const progress = Math.min(1, (timing - this._startTime) / this._duration);
  if (progress === this._progress) return this._nextTick();
  this._progress = progress;
  const easedProgress = ease(progress);
  this._onTick(easedProgress);
  if (progress === 1) {
    this._frameHandle = null;
    this.finish();
  } else {
    this._nextTick();
  }
};

Tween.prototype.finish = function() {
  if (!this._isActive) return;
  this._isActive = false;
  if (this._frameHandle) {
    cancelAnimFrame(this._frameHandle);
  }
  if (this._resolve) {
    this._resolve();
    this._resolve = null;
  }
};

function StyleTween(elm, style, endValue, options = {}) {
  StyleTween.super_.call(
    this,
    (easedProgress => {
      const nextStyleValue = (this._endValue - this._startValue) * easedProgress + this._startValue;
      this._elm.style[this._style] = nextStyleValue;
    }),
    options,
  );
  this._elm = elm;
  this._style = style;
  this._endValue = endValue;
}
inherits(StyleTween, Tween);

StyleTween.prototype.start = function() {
  this._startValue = parseFloat(this._elm.style[this._style], 10);
  if (this._startValue === this._endValue) {
    return Promise.resolve();
  }
  return StyleTween.super_.prototype.start.call(this);
};

// -------- CANVAS CLASS --------

function Canvas(svg, defs) {
  this.svg = svg;
  this.defs = defs;
}

Canvas.prototype.createSubCanvas = function() {
  const group = createElm('g');
  this.svg.appendChild(group);
  return new Canvas(group, this.defs);
};

Canvas.init = elmOrId => {
  let svg;
  let elm = elmOrId;
  if (typeof elmOrId === 'string') {
    elm = global.document.getElementById(elmOrId);
  }
  const nodeType = elm.nodeName.toUpperCase();
  if (nodeType === 'SVG' || nodeType === 'G') {
    svg = elm;
  } else {
    svg = createElm('svg');
    elm.appendChild(svg);
  }
  attrs(svg, {width: '100%', height: '100%'});
  const defs = createElm('defs');
  svg.appendChild(defs);
  return new Canvas(svg, defs);
};

module.exports = { createElm, attrs, attr, Canvas, Tween, StyleTween, getPathString, linesToPolygonPathString };
