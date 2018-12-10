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

function Group(node, defs) {
  this.node = node;
  this.defs = defs;
}

Group.prototype.createSubGroup = function() {
  const group = createElm('g');
  this.node.appendChild(group);
  return new Group(group, this.defs);
};

module.exports = { createElm, attrs, attr, Group, getPathString, removeElm };
