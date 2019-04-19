const { round } = require('./geometry');


function createElm(elmType) {
  return global.document.createElementNS('http://www.w3.org/2000/svg', elmType);
}

function attr(elm, name, value) {
  elm.setAttributeNS(null, name, value);
}

function attrs(elm, attrsMap) {
  Object.keys(attrsMap).forEach(attrName => attr(elm, attrName, attrsMap[attrName]));
}

// inspired by https://talk.observablehq.com/t/hanzi-writer-renders-incorrectly-inside-an-observable-notebook-on-a-mobile-browser/1898
function urlIdRef(id) {
  let prefix = '';
  if (global.location && global.location.href) {
    prefix = global.location.href;
  }
  return `url(${prefix}#${id})`;
}

function getPathString(points, close = false) {
  const start = round(points[0]);
  const remainingPoints = points.slice(1);
  let pathString = `M ${start.x} ${start.y}`;
  remainingPoints.forEach(point => {
    const roundedPoint = round(point);
    pathString += ` L ${roundedPoint.x} ${roundedPoint.y}`;
  });
  if (close) pathString += 'Z';
  return pathString;
}

function removeElm(elm) {
  if (elm) elm.parentNode.removeChild(elm);
}

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

Canvas.init = (elmOrId, width = '100%', height = '100%') => {
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
  attrs(svg, {width, height});
  const defs = createElm('defs');
  svg.appendChild(defs);
  return new Canvas(svg, defs);
};

module.exports = { createElm, attrs, attr, Canvas, getPathString, removeElm, urlIdRef };
