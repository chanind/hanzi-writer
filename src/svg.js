const requestAnimFrame = global.requestAnimationFrame || (callback => setTimeout(callback, 1000 / 60));
const cancelAnimFrame = global.cancelAnimationFrame || clearTimeout;

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

// from https://github.com/maxwellito/vivus
const ease = x => -Math.cos(x * Math.PI) / 2 + 0.5;

class StyleTween {
  constructor(elm, style, endValue, options = {}) {
    this._elm = elm;
    this._style = style;
    this._endValue = endValue;
    this._duration = options.duration || 300;
    this._isActive = false;
  }

  start() {
    this._isActive = true;
    this._startTime = Date.now();
    this._startValue = parseFloat(this._elm.style[this._style], 10);
    if (this._startValue === this._endValue) {
      return Promise.resolve();
    }
    this._progress = 0;
    this._nextTick();

    return new Promise((resolve, reject) => {
      this._resolve = resolve;
    });
  }

  _nextTick() {
    this._frameHandle = requestAnimFrame(() => this._tick());
  }

  _tick() {
    if (!this._isActive) return;
    const progress = Math.min(1, (Date.now() - this._startTime) / this._duration);
    if (progress === this._progress) return this._nextTick();
    this._progress = progress;
    const easedProgress = ease(progress);
    const nextStyleValue = (this._endValue - this._startValue) * easedProgress + this._startValue;
    this._elm.style[this._style] = nextStyleValue;
    if (progress === 1) {
      this._frameHandle = null;
      this.finish();
    } else {
      this._nextTick();
    }
  }

  finish() {
    if (!this._isActive) return;
    this._isActive = false;
    if (this._frameHandle) {
      cancelAnimFrame(this._frameHandle);
    }
    if (this._resolve) {
      this._resolve();
      this._resolve = null;
    }
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

module.exports = { createElm, attrs, attr, Canvas, StyleTween };
