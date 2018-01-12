function createElm(elmType) {
  return global.document.createElementNS('http://www.w3.org/2000/svg', elmType);
}

function attr(elm, name, value) {
  elm.setAttributeNS(null, name, value);
}

function attrs(elm, attrsMap) {
  for (const attrName of Object.keys(attrsMap)) {
    attr(elm, attrName, attrsMap[attrName]);
  }
}

class Canvas {
  constructor(svg, defs) {
    this.svg = svg;
    this.defs = defs;
  }

  createSubCanvas() {
    const group = createElm('g');
    this.svg.appendChild(group);
    return new Canvas(group, this.defs);
  }
}

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

module.exports = { createElm, attrs, attr, Canvas };
