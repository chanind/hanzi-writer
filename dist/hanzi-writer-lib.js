module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function emptyFunc() {}

// Object.assign polyfill, because IE :/
function assign(target) {
  var overrideTarget = Object(target);

  for (var _len = arguments.length, overrides = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    overrides[_key - 1] = arguments[_key];
  }

  overrides.forEach(function (override) {
    if (override != null) {
      for (var key in override) {
        if (Object.prototype.hasOwnProperty.call(override, key)) {
          overrideTarget[key] = override[key];
        }
      }
    }
  });
  return overrideTarget;
}

// utils for classes without es6, sigh...
// from: https://github.com/nodejs/node-v0.x-archive/blob/546ae2ee/lib/util.js#L552-L575
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor; // eslint-disable-line no-param-reassign
  ctor.prototype = Object.create(superCtor.prototype, { // eslint-disable-line no-param-reassign
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

function arrayMax(numArray) {
  return Math.max.apply(null, numArray);
}

function arrayMin(numArray) {
  return Math.min.apply(null, numArray);
}

function getExtremes(numArray) {
  var max = arrayMax(numArray);
  var min = arrayMin(numArray);
  var mid = (max + min) / 2;
  return [max, mid, min];
}

function callIfExists(callback) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  if (callback) callback.apply(undefined, args);
}

var count = 0;
function counter() {
  count += 1;
  return count;
}

function average(arr) {
  var sum = arr.reduce(function (acc, val) {
    return val + acc;
  }, 0);
  return sum / arr.length;
}

function timeout() {
  var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  return new Promise(function (resolve, reject) {
    setTimeout(resolve, duration);
  });
}

module.exports = {
  inherits: inherits,
  assign: assign,
  arrayMax: arrayMax,
  arrayMin: arrayMin,
  average: average,
  callIfExists: callIfExists,
  counter: counter,
  emptyFunc: emptyFunc,
  getExtremes: getExtremes,
  timeout: timeout
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Point = __webpack_require__(2);

var _require = __webpack_require__(0),
    arrayMin = _require.arrayMin,
    arrayMax = _require.arrayMax;

// return a new point, p3, which is on the same line as p1 and p2, but distance away
// from p2. p1, p2, p3 will always lie on the line in that order


var extendPointOnLine = function extendPointOnLine(p1, p2, distance) {
  var vect = p2.subtract(p1);
  var norm = distance / vect.getMagnitude();
  return new Point(p2.x + norm * vect.x, p2.y + norm * vect.y);
};

var getBounds = function getBounds(points) {
  var xs = points.map(function (point) {
    return point.x;
  });
  var ys = points.map(function (point) {
    return point.y;
  });
  var maxX = arrayMax(xs);
  var maxY = arrayMax(ys);
  var minX = arrayMin(xs);
  var minY = arrayMin(ys);
  return [new Point(minX, minY), new Point(maxX, maxY)];
};

// boundable here refers to any object with a getBounds() method
var getOverallBounds = function getOverallBounds(boundables) {
  var bounds = [];
  boundables.forEach(function (boundable) {
    var _boundable$getBounds = boundable.getBounds(),
        _boundable$getBounds2 = _slicedToArray(_boundable$getBounds, 2),
        lowerBound = _boundable$getBounds2[0],
        upperBound = _boundable$getBounds2[1];

    bounds.push(lowerBound);
    bounds.push(upperBound);
  });
  return getBounds(bounds);
};

var getDistance = function getDistance(point1, point2) {
  var difference = point1.subtract(point2);
  return difference.getMagnitude();
};

var cosineSimilarity = function cosineSimilarity(point1, point2) {
  var rawDotProduct = point1.x * point2.x + point1.y * point2.y;
  return rawDotProduct / point1.getMagnitude() / point2.getMagnitude();
};

module.exports = {
  extendPointOnLine: extendPointOnLine,
  getBounds: getBounds,
  getOverallBounds: getOverallBounds,
  getDistance: getDistance,
  cosineSimilarity: cosineSimilarity
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Point(x, y) {
  this.x = parseFloat(x, 10);
  this.y = parseFloat(y, 10);
}

// return a new point subtracting point from this
Point.prototype.subtract = function (point) {
  return new Point(this.x - point.x, this.y - point.y);
};

// return a new point adding point from this
Point.prototype.add = function (point) {
  return new Point(this.x + point.x, this.y + point.y);
};

Point.prototype.getMagnitude = function () {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

Point.prototype.equals = function (point) {
  if (!point) return false;
  return point.x === this.x && point.y === this.y;
};

module.exports = Point;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Renderer() {
  this.isDestroyed = false; // check this in children in animations, etc
  this.childRenderers = [];
  this.parentRenderer = null;
}

// implement in children
Renderer.prototype.draw = function () {
  return this;
};

Renderer.prototype.registerChild = function (child) {
  this.childRenderers.push(child);
  child.setParent(this);
  return child;
};

Renderer.prototype.setParent = function (parent) {
  this.parentRenderer = parent;
  return this;
};

Renderer.prototype.setCanvas = function (canvas) {
  this.canvas = canvas;
  return this;
};

// extend this in children with extra behavior
Renderer.prototype.destroy = function () {
  this.isDestroyed = true;
  this.childRenderers.forEach(function (child) {
    return child.destroy();
  });
};

module.exports = Renderer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _require = __webpack_require__(0),
    inherits = _require.inherits;

var performanceNow = global.performance && function () {
  return global.performance.now();
} || function () {
  return Date.now();
};
var requestAnimFrame = global.requestAnimationFrame || function (callback) {
  return setTimeout(function () {
    return callback(performanceNow());
  }, 1000 / 60);
};
var cancelAnimFrame = global.cancelAnimationFrame || clearTimeout;

function createElm(elmType) {
  return global.document.createElementNS('http://www.w3.org/2000/svg', elmType);
}

function attr(elm, name, value) {
  elm.setAttributeNS(null, name, value);
}

function attrs(elm, attrsMap) {
  Object.keys(attrsMap).forEach(function (attrName) {
    return attr(elm, attrName, attrsMap[attrName]);
  });
}

function getPathString(points) {
  var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var start = points[0];
  var remainingPoints = points.slice(1);
  var pathString = 'M ' + start.x + ' ' + start.y;
  remainingPoints.forEach(function (point) {
    pathString += ' L ' + point.x + ' ' + point.y;
  });
  if (close) pathString += 'Z';
  return pathString;
}

// ------- STYLETWEEN CLASS ---------

// from https://github.com/maxwellito/vivus
var ease = function ease(x) {
  return -Math.cos(x * Math.PI) / 2 + 0.5;
};

function Tween(onTick) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  this._onTick = onTick;
  this._duration = options.duration || 300;
  this._isActive = false;
}

Tween.prototype.start = function () {
  var _this = this;

  this._isActive = true;
  this._startTime = performanceNow();
  this._progress = 0;
  this._nextTick();

  return new Promise(function (resolve, reject) {
    _this._resolve = resolve;
  });
};

Tween.prototype._nextTick = function () {
  var _this2 = this;

  this._frameHandle = requestAnimFrame(function (timing) {
    return _this2._tick(timing);
  });
};

Tween.prototype._tick = function (timing) {
  if (!this._isActive) return;
  var progress = Math.min(1, (timing - this._startTime) / this._duration);
  if (progress === this._progress) return this._nextTick();
  this._progress = progress;
  var easedProgress = ease(progress);
  this._onTick(easedProgress);
  if (progress === 1) {
    this._frameHandle = null;
    this.finish();
  } else {
    this._nextTick();
  }
};

Tween.prototype.finish = function () {
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

function StyleTween(elm, style, endValue) {
  var _this3 = this;

  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  StyleTween.super_.call(this, function (easedProgress) {
    var nextStyleValue = (_this3._endValue - _this3._startValue) * easedProgress + _this3._startValue;
    _this3._elm.style[_this3._style] = nextStyleValue;
  }, options);
  this._elm = elm;
  this._style = style;
  this._endValue = endValue;
}
inherits(StyleTween, Tween);

StyleTween.prototype.start = function () {
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

Canvas.prototype.createSubCanvas = function () {
  var group = createElm('g');
  this.svg.appendChild(group);
  return new Canvas(group, this.defs);
};

Canvas.init = function (elmOrId) {
  var svg = void 0;
  var elm = elmOrId;
  if (typeof elmOrId === 'string') {
    elm = global.document.getElementById(elmOrId);
  }
  var nodeType = elm.nodeName.toUpperCase();
  if (nodeType === 'SVG' || nodeType === 'G') {
    svg = elm;
  } else {
    svg = createElm('svg');
    elm.appendChild(svg);
  }
  attrs(svg, { width: '100%', height: '100%' });
  var defs = createElm('defs');
  svg.appendChild(defs);
  return new Canvas(svg, defs);
};

module.exports = { createElm: createElm, attrs: attrs, attr: attr, Canvas: Canvas, Tween: Tween, StyleTween: StyleTween, getPathString: getPathString };
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var CharacterRenderer = __webpack_require__(7);
var PositionerRenderer = __webpack_require__(9);
var Point = __webpack_require__(2);
var CharDataParser = __webpack_require__(10);
var Positioner = __webpack_require__(13);
var Quiz = __webpack_require__(14);
var svg = __webpack_require__(4);
var defaultCharDataLoader = __webpack_require__(18);
var Animator = __webpack_require__(19);

var _require = __webpack_require__(0),
    assign = _require.assign;

var defaultOptions = {
  charDataLoader: defaultCharDataLoader,
  showOutline: true,
  showCharacter: true,

  // positioning options

  width: null,
  height: null,
  padding: 20,

  // animation options

  strokeAnimationDuration: 400,
  strokeHighlightDuration: 200,
  delayBetweenStrokes: 1000,

  // colors

  strokeColor: '#555',
  highlightColor: '#AAF',
  outlineColor: '#DDD',
  drawingColor: '#333',

  // quiz options

  showHintAfterMisses: 3,
  highlightOnComplete: true,

  // undocumented obscure options

  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  outlineWidth: 2
};

function HanziWriter(element, character) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  this._animator = new Animator();
  this._canvas = svg.Canvas.init(element, options);
  this.setOptions(options);
  this.setCharacter(character);
  this._setupListeners();
  this._quiz = null;
}

HanziWriter.prototype.setOptions = function (options) {
  this._options = assign({}, defaultOptions, options);
  this._mainCharOptions = {
    strokeColor: this._options.strokeColor,
    strokeWidth: this._options.strokeWidth,
    strokeAnimationDuration: this._options.strokeAnimationDuration,
    delayBetweenStrokes: this._options.delayBetweenStrokes,
    usePolygonMasks: this._options.usePolygonMasks
  };
  this._outlineCharOptions = assign({}, this._mainCharOptions, {
    strokeColor: this._options.outlineColor,
    strokeWidth: this._options.outlineWidth,
    usePolygonMasks: this._options.usePolygonMasks
  });
  this._highlightCharOptions = assign({}, this._mainCharOptions, {
    strokeColor: this._options.highlightColor,
    strokeAnimationDuration: this._options.strokeHighlightDuration,
    usePolygonMasks: this._options.usePolygonMasks
  });
  this._userStrokeOptions = {
    strokeColor: this._options.drawingColor,
    strokeWidth: this._options.drawingWidth,
    fadeDuration: this._options.drawingFadeDuration
  };
};

// ------ public API ------ //

HanziWriter.prototype.showCharacter = function () {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this._animateWithData(function (animation) {
    return _this._characterRenderer.show(animation);
  }, options);
};
HanziWriter.prototype.hideCharacter = function () {
  var _this2 = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this._animateWithData(function (animation) {
    return _this2._characterRenderer.hide(animation);
  }, options);
};
HanziWriter.prototype.animateCharacter = function () {
  var _this3 = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this.cancelQuiz();
  this._animateWithData(function (animation) {
    return _this3._characterRenderer.animate(animation);
  }, options);
};

HanziWriter.prototype.showOutline = function () {
  var _this4 = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this._animateWithData(function (animation) {
    return _this4._outlineRenderer.show(animation);
  }, options);
};
HanziWriter.prototype.hideOutline = function () {
  var _this5 = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this._animateWithData(function (animation) {
    return _this5._outlineRenderer.hide(animation);
  }, options);
};

HanziWriter.prototype.quiz = function () {
  var _this6 = this;

  var quizOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this._withData(function () {
    _this6.cancelQuiz();
    _this6._quiz = new Quiz({
      canvas: _this6._subCanvas,
      animator: _this6._animator,
      character: _this6._character,
      characterRenderer: _this6._characterRenderer,
      highlightRenderer: _this6._highlightRenderer,
      quizOptions: assign({}, _this6._options, quizOptions),
      userStrokeOptions: _this6._userStrokeOptions
    });
  });
};

HanziWriter.prototype.cancelQuiz = function () {
  if (this._quiz) this._quiz.cancel();
  this._quiz = null;
};

HanziWriter.prototype.setCharacter = function (char) {
  var _this7 = this;

  this.cancelQuiz();
  if (this._positionerRenderer) this._positionerRenderer.destroy();
  if (this._characterRenderer) this._characterRenderer.destroy();
  if (this._outlineRenderer) this._outlineRenderer.destroy();
  if (this._highlightRenderer) this._highlightRenderer.destroy();
  this._withDataPromise = this._loadCharacterData(char).then(function (pathStrings) {
    var charDataParser = new CharDataParser();
    _this7._character = charDataParser.generateCharacter(char, pathStrings);
    _this7._positioner = new Positioner(_this7._character, _this7._options);

    _this7._positionerRenderer = new PositionerRenderer(_this7._positioner).setCanvas(_this7._canvas);
    _this7._subCanvas = _this7._positionerRenderer.positionedCanvas;

    _this7._outlineRenderer = new CharacterRenderer(_this7._character, _this7._outlineCharOptions).setCanvas(_this7._subCanvas).draw();
    _this7._characterRenderer = new CharacterRenderer(_this7._character, _this7._mainCharOptions).setCanvas(_this7._subCanvas).draw();
    _this7._highlightRenderer = new CharacterRenderer(_this7._character, _this7._highlightCharOptions).setCanvas(_this7._subCanvas).draw();

    if (_this7._options.showCharacter) _this7._characterRenderer.showImmediate();
    if (_this7._options.showOutline) _this7._outlineRenderer.showImmediate();
  });
};

// ------------- //

HanziWriter.prototype._loadCharacterData = function (char) {
  var _this8 = this;

  if (this.isLoadingCharData) this.cancelLoadingCharData();
  this.isLoadingCharData = true;
  return new Promise(function (resolve, reject) {
    _this8.cancelLoadingCharData = reject;
    var returnedData = _this8._options.charDataLoader(char, resolve);
    if (returnedData) resolve(returnedData);
  }).then(function (data) {
    _this8.isLoadingCharData = false;
    return data;
  });
};

HanziWriter.prototype._withData = function (func) {
  this._withDataPromise = this._withDataPromise.then(func);
  return this._withDataPromise;
};

HanziWriter.prototype._setupListeners = function () {
  var _this9 = this;

  this._canvas.svg.addEventListener('mousedown', function (evt) {
    if (_this9.isLoadingCharData || !_this9._quiz) return;
    evt.preventDefault();
    _this9._forwardToQuiz('startUserStroke', _this9._getMousePoint(evt));
  });
  this._canvas.svg.addEventListener('touchstart', function (evt) {
    if (_this9.isLoadingCharData || !_this9._quiz) return;
    evt.preventDefault();
    _this9._forwardToQuiz('startUserStroke', _this9._getTouchPoint(evt));
  });
  this._canvas.svg.addEventListener('mousemove', function (evt) {
    if (_this9.isLoadingCharData || !_this9._quiz) return;
    evt.preventDefault();
    _this9._forwardToQuiz('continueUserStroke', _this9._getMousePoint(evt));
  });
  this._canvas.svg.addEventListener('touchmove', function (evt) {
    if (_this9.isLoadingCharData || !_this9._quiz) return;
    evt.preventDefault();
    _this9._forwardToQuiz('continueUserStroke', _this9._getTouchPoint(evt));
  });

  // TODO: fix
  global.document.addEventListener('mouseup', function () {
    return _this9._forwardToQuiz('endUserStroke');
  });
  global.document.addEventListener('touchend', function () {
    return _this9._forwardToQuiz('endUserStroke');
  });
};

HanziWriter.prototype._forwardToQuiz = function (method) {
  var _quiz;

  if (!this._quiz) return;

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  (_quiz = this._quiz)[method].apply(_quiz, args);
};

HanziWriter.prototype._getMousePoint = function (evt) {
  var box = this._canvas.svg.getBoundingClientRect();
  return this._positioner.convertExternalPoint(new Point(evt.clientX - box.left, evt.clientY - box.top));
};

HanziWriter.prototype._getTouchPoint = function (evt) {
  var box = this._canvas.svg.getBoundingClientRect();
  var x = evt.touches[0].clientX - box.left;
  var y = evt.touches[0].clientY - box.top;
  return this._positioner.convertExternalPoint(new Point(x, y));
};

HanziWriter.prototype._animate = function (func) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return this._animator.animate(func, options);
};

HanziWriter.prototype._animateWithData = function (func) {
  var _this10 = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return this._withData(function () {
    return _this10._animate(func, options);
  });
};

// set up window.HanziWriter if we're in the browser
if (typeof global.window !== 'undefined') {
  // store whatever used to be called HanziWriter in case of a conflict
  var previousHanziWriter = global.window.HanziWriter;

  // add a jQuery-esque noConflict method to restore the previous global.window.HanziWriter if necessary
  HanziWriter.noConflict = function () {
    global.window.HanziWriter = previousHanziWriter;
    return HanziWriter;
  };

  global.window.HanziWriter = HanziWriter;
}

// set up module.exports if we're in node/webpack
if (true) {
  module.exports = HanziWriter;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Renderer = __webpack_require__(3);
var StrokeRenderer = __webpack_require__(8);

var _require = __webpack_require__(0),
    timeout = _require.timeout,
    inherits = _require.inherits;

function CharacterRenderer(character) {
  var _this = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  CharacterRenderer.super_.call(this);
  this.options = options;
  this.character = character;
  this.strokeRenderers = this.character.strokes.map(function (stroke) {
    return _this.registerChild(new StrokeRenderer(stroke, options));
  });
}

inherits(CharacterRenderer, Renderer);

CharacterRenderer.prototype.getBounds = function () {
  return this.character.getBounds();
};

CharacterRenderer.prototype.show = function (animation) {
  var promises = this.strokeRenderers.map(function (strokeRenderer) {
    return strokeRenderer.show(animation);
  });
  return Promise.all(promises);
};

CharacterRenderer.prototype.showImmediate = function () {
  this.strokeRenderers.map(function (renderer) {
    return renderer.showImmediate();
  });
};

CharacterRenderer.prototype.hide = function (animation) {
  var promises = this.strokeRenderers.map(function (strokeRenderer) {
    return strokeRenderer.hide(animation);
  });
  return Promise.all(promises);
};

CharacterRenderer.prototype.hideImmediate = function () {
  this.strokeRenderers.map(function (renderer) {
    return renderer.hideImmediate();
  });
};

CharacterRenderer.prototype.flash = function (animation) {
  var _this2 = this;

  return this.show(animation).then(function () {
    return _this2.hide(animation);
  });
};

CharacterRenderer.prototype.showStroke = function (strokeNum, animation) {
  return this.getStrokeRenderer(strokeNum).show(animation);
};

CharacterRenderer.prototype.draw = function () {
  this.strokeRenderers.forEach(function (renderer) {
    return renderer.draw();
  });
  return this;
};

CharacterRenderer.prototype.getStrokeRenderer = function (strokeNum) {
  return this.strokeRenderers[strokeNum];
};

CharacterRenderer.prototype.animate = function (animation) {
  var _this3 = this;

  if (!animation.isActive()) return null;
  var renderChain = this.hide(animation);
  this.strokeRenderers.forEach(function (strokeRenderer, index) {
    if (index > 0) renderChain = renderChain.then(function () {
      return timeout(_this3.options.delayBetweenStrokes);
    });
    renderChain = renderChain.then(function () {
      return strokeRenderer.animate(animation);
    });
  });
  return renderChain;
};

CharacterRenderer.prototype.setCanvas = function (canvas) {
  CharacterRenderer.super_.prototype.setCanvas.call(this, canvas);
  this.strokeRenderers.forEach(function (renderer) {
    return renderer.setCanvas(canvas);
  });
  return this;
};

module.exports = CharacterRenderer;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Renderer = __webpack_require__(3);

var _require = __webpack_require__(0),
    counter = _require.counter,
    inherits = _require.inherits;

var svg = __webpack_require__(4);

var _require2 = __webpack_require__(1),
    extendPointOnLine = _require2.extendPointOnLine;

// take points on a path and move their start point backwards by distance


var extendStart = function extendStart(points, distance) {
  if (points.length < 2) return points;
  var p1 = points[1];
  var p2 = points[0];
  var newStart = extendPointOnLine(p1, p2, distance);
  var extendedPoints = points.slice(1);
  extendedPoints.unshift(newStart);
  return extendedPoints;
};

// this is a stroke composed of several stroke parts
function StrokeRenderer(stroke) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  StrokeRenderer.super_.call(this);
  this.stroke = stroke;
  this.options = options;
}
inherits(StrokeRenderer, Renderer);

StrokeRenderer.prototype.draw = function () {
  this.path = svg.createElm('path');
  this.clip = svg.createElm('clipPath');
  this.strokeClip = svg.createElm('path');
  var clipId = 'hzw-clip-' + counter();
  svg.attr(this.clip, 'id', clipId);

  var extendedPathPoints = extendStart(this.stroke.points, 85);
  svg.attr(this.path, 'd', svg.getPathString(extendedPathPoints));
  this.path.style.opacity = 0;
  svg.attr(this.path, 'clip-path', 'url(#' + clipId + ')');

  svg.attr(this.strokeClip, 'd', this.stroke.path);
  var maskLength = this.strokeClip.getTotalLength();
  svg.attrs(this.path, {
    fill: 'none',
    stroke: this.options.strokeColor,
    'stroke-width': 150,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'miter',
    'stroke-dasharray': maskLength + ',' + maskLength
  });
  this.path.style['stroke-dashoffset'] = 0;

  this.clip.appendChild(this.strokeClip);
  this.canvas.defs.appendChild(this.clip);
  this.canvas.svg.appendChild(this.path);
  return this;
};

StrokeRenderer.prototype.show = function (animation) {
  this.path.style['stroke-dashoffset'] = 0;
  var tween = new svg.StyleTween(this.path, 'opacity', 1, {
    duration: this.options.strokeAnimationDuration
  });
  animation.registerSvgAnimation(tween);
  return tween.start();
};

StrokeRenderer.prototype.hide = function (animation) {
  var tween = new svg.StyleTween(this.path, 'opacity', 0, {
    duration: this.options.strokeAnimationDuration
  });
  animation.registerSvgAnimation(tween);
  return tween.start();
};

StrokeRenderer.prototype.animate = function (animation) {
  if (!animation.isActive()) return null;
  this.showImmediate();
  // safari has a bug where setting the dashoffset to exactly the length causes a brief flicker
  this.path.style['stroke-dashoffset'] = this.strokeClip.getTotalLength() * 0.999;
  var tween = new svg.StyleTween(this.path, 'stroke-dashoffset', 0, {
    duration: this.options.strokeAnimationDuration
  });
  animation.registerSvgAnimation(tween);
  return tween.start();
};

StrokeRenderer.prototype.hideImmediate = function () {
  this.path.style.opacity = 0;
};
StrokeRenderer.prototype.showImmediate = function () {
  this.path.style.opacity = 1;
};

StrokeRenderer.prototype.highlight = function (animation) {
  var _this = this;

  return this.animate(animation).then(function () {
    return _this.hide(animation);
  });
};

StrokeRenderer.prototype.destroy = function () {
  StrokeRenderer.super_.prototype.destroy.call(this);
  if (this.path) this.path.remove();
  if (this.strokeClip) this.strokeClip.remove();
  if (this.clip) this.clip.remove();
};

module.exports = StrokeRenderer;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Renderer = __webpack_require__(3);
var svg = __webpack_require__(4);

var _require = __webpack_require__(0),
    inherits = _require.inherits;

function PositionerRenderer(positioner) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  PositionerRenderer.super_.call(this);
  this.positioner = positioner;
  this.positionedCanvas = null;
}

inherits(PositionerRenderer, Renderer);

PositionerRenderer.prototype.setCanvas = function (canvas) {
  PositionerRenderer.super_.prototype.setCanvas.call(this, canvas);
  this.positionedCanvas = canvas.createSubCanvas();
  var group = this.positionedCanvas.svg;
  svg.attr(group, 'transform', '\n    translate(' + this.positioner.getXOffset() + ', ' + (this.positioner.getHeight() - this.positioner.getYOffset()) + ')\n    scale(' + this.positioner.getScale() + ', ' + -1 * this.positioner.getScale() + ')\n  ');
  return this;
};

PositionerRenderer.prototype.destroy = function () {
  PositionerRenderer.super_.prototype.destroy.call(this);
  this.positionedCanvas.remove();
};

module.exports = PositionerRenderer;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Point = __webpack_require__(2);
var Stroke = __webpack_require__(11);
var Character = __webpack_require__(12);

function CharDataParser() {}

CharDataParser.prototype.generateCharacter = function (symbol, charJson) {
  var strokes = this.generateStrokes(charJson);
  return new Character(symbol, strokes);
};

CharDataParser.prototype.generateStrokes = function (charJson) {
  return charJson.strokes.map(function (path, index) {
    var points = charJson.medians[index].map(function (pointData) {
      var _pointData = _slicedToArray(pointData, 2),
          x = _pointData[0],
          y = _pointData[1];

      return new Point(x, y);
    });
    return new Stroke(path, points, index);
  });
};

module.exports = CharDataParser;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    getDistance = _require.getDistance;

function Stroke(path, points, strokeNum) {
  this.path = path;
  this.points = points;
  this.strokeNum = strokeNum;
}

Stroke.prototype.getStrokeNum = function () {
  return this.strokeNum;
};

Stroke.prototype.getStartingPoint = function () {
  return this.points[0];
};

Stroke.prototype.getEndingPoint = function () {
  return this.points[this.points.length - 1];
};

Stroke.prototype.getLength = function () {
  var lastPoint = this.points[0];
  var pointsSansFirst = this.points.slice(1);
  return pointsSansFirst.reduce(function (acc, point) {
    var dist = getDistance(point, lastPoint);
    lastPoint = point;
    return acc + dist;
  }, 0);
};

Stroke.prototype.getVectors = function () {
  var lastPoint = this.points[0];
  var pointsSansFirst = this.points.slice(1);
  return pointsSansFirst.map(function (point) {
    var vector = point.subtract(lastPoint);
    lastPoint = point;
    return vector;
  });
};

Stroke.prototype.getDistance = function (point) {
  var distances = this.points.map(function (strokePoint) {
    return getDistance(strokePoint, point);
  });
  return Math.min.apply(Math, distances);
};

Stroke.prototype.getAverageDistance = function (points) {
  var _this = this;

  var totalDist = points.reduce(function (acc, point) {
    return acc + _this.getDistance(point);
  }, 0);
  return totalDist / points.length;
};

module.exports = Stroke;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Point = __webpack_require__(2);

var _require = __webpack_require__(1),
    getBounds = _require.getBounds;

function Character(symbol, strokes) {
  this.symbol = symbol;
  this.strokes = strokes;
}

Character.prototype.getStroke = function (strokeNum) {
  return this.strokes[strokeNum];
};

Character.prototype.getNumStrokes = function () {
  return this.strokes.length;
};

Character.prototype.getBounds = function () {
  return getBounds([new Point(0, 900), new Point(1024, -124)]);
};

module.exports = Character;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Point = __webpack_require__(2);

function Positioner(character, options) {
  this._character = character;
  this._options = options;
  this._calculateScaleAndOffset();
}

Positioner.prototype.convertExternalPoint = function (point) {
  var x = (point.x - this._xOffset) / this._scale;
  var y = (this.getHeight() - this._yOffset - point.y) / this._scale;
  return new Point(x, y);
};

Positioner.prototype.getXOffset = function () {
  return this._xOffset;
};
Positioner.prototype.getYOffset = function () {
  return this._yOffset;
};
Positioner.prototype.getScale = function () {
  return this._scale;
};
Positioner.prototype.getHeight = function () {
  return this._options.height;
};

Positioner.prototype._calculateScaleAndOffset = function () {
  var bounds = this._character.getBounds();
  var preScaledWidth = bounds[1].x - bounds[0].x;
  var preScaledHeight = bounds[1].y - bounds[0].y;
  var effectiveWidth = this._options.width - 2 * this._options.padding;
  var effectiveHeight = this._options.height - 2 * this._options.padding;
  var scaleX = effectiveWidth / preScaledWidth;
  var scaleY = effectiveHeight / preScaledHeight;

  this._scale = Math.min(scaleX, scaleY);

  var xCenteringBuffer = this._options.padding + (effectiveWidth - this._scale * preScaledWidth) / 2;
  var yCenteringBuffer = this._options.padding + (effectiveHeight - this._scale * preScaledHeight) / 2;
  this._xOffset = -1 * bounds[0].x * this._scale + xCenteringBuffer;
  this._yOffset = -1 * bounds[0].y * this._scale + yCenteringBuffer;
};

module.exports = Positioner;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var StrokeMatcher = __webpack_require__(15);
var UserStroke = __webpack_require__(16);
var UserStrokeRenderer = __webpack_require__(17);

var _require = __webpack_require__(0),
    callIfExists = _require.callIfExists;

// TODO: too many dependencies... do something about this


function Quiz(_ref) {
  var canvas = _ref.canvas,
      animator = _ref.animator,
      character = _ref.character,
      characterRenderer = _ref.characterRenderer,
      highlightRenderer = _ref.highlightRenderer,
      quizOptions = _ref.quizOptions,
      userStrokeOptions = _ref.userStrokeOptions;

  this._canvas = canvas;
  this._animator = animator;
  this._character = character;
  this._characterRenderer = characterRenderer;
  this._highlightRenderer = highlightRenderer;
  this._quizOptions = quizOptions;
  this._userStrokeOptions = userStrokeOptions;

  this._currentStrokeIndex = 0;
  this._numRecentMistakes = 0;
  this._totalMistakes = 0;
  this._drawnStrokes = [];
  this._isActive = true;
  this._strokeMatcher = new StrokeMatcher();

  this._setupCharacter();
}

Quiz.prototype.startUserStroke = function (point) {
  if (!this._isActive) return null;
  if (this._userStroke) return this.endUserStroke();
  this._userStroke = new UserStroke(point);
  this._userStrokeRenderer = new UserStrokeRenderer(this._userStroke, this._userStrokeOptions);
  this._userStrokeRenderer.setCanvas(this._canvas).draw();
};

Quiz.prototype.continueUserStroke = function (point) {
  if (!this._userStroke) return;
  this._userStroke.appendPoint(point);
  this._userStrokeRenderer.updatePath();
};

Quiz.prototype.endUserStroke = function () {
  var _this = this;

  if (!this._userStroke) return Promise.resolve();

  this._animator.animate(function (animation) {
    if (!_this._isActive) return Promise.resolve();
    var promises = [];
    var nextStroke = _this._getNextStroke();
    var isMatch = _this._strokeMatcher.strokeMatches(_this._userStroke, nextStroke);
    promises.push(_this._userStrokeRenderer.fadeAndRemove(animation));
    _this._userStroke = null;
    _this._userStrokeRenderer = null;

    if (isMatch) {
      _this._handleSuccess(nextStroke, animation);
    } else {
      _this._handleFailure();
      if (_this._numRecentMistakes >= _this._quizOptions.showHintAfterMisses) {
        promises.push(_this._highlightCorrectStroke(animation));
      }
    }
    return Promise.all(promises);
  });
};

Quiz.prototype.cancel = function () {
  this._isActive = false;
};

Quiz.prototype._handleSuccess = function (stroke, animation) {
  var _this2 = this;

  callIfExists(this._quizOptions.onCorrectStroke, {
    character: this._character.symbol,
    strokeNum: this._currentStrokeIndex,
    mistakesOnStroke: this._numRecentMistakes,
    totalMistakes: this._totalMistakes,
    strokesRemaining: this._character.getNumStrokes() - this._currentStrokeIndex - 1
  });
  this._currentStrokeIndex += 1;
  this._numRecentMistakes = 0;
  var promise = this._drawMatchingStroke(stroke, animation);
  if (this._currentStrokeIndex === this._character.getNumStrokes()) {
    this._isActive = false;
    callIfExists(this._quizOptions.onComplete, {
      character: this._character.symbol,
      totalMistakes: this._totalMistakes
    });
    if (this._quizOptions.highlightOnComplete) {
      promise = promise.then(function () {
        return _this2._highlightRenderer.flash(animation);
      });
    }
  }
  return promise;
};

Quiz.prototype._handleFailure = function () {
  this._numRecentMistakes += 1;
  this._totalMistakes += 1;
  callIfExists(this._quizOptions.onMistake, {
    character: this._character.symbol,
    strokeNum: this._currentStrokeIndex,
    mistakesOnStroke: this._numRecentMistakes,
    totalMistakes: this._totalMistakes,
    strokesRemaining: this._character.getNumStrokes() - this._currentStrokeIndex
  });
};

Quiz.prototype._highlightCorrectStroke = function (animation) {
  var strokeHintRenderer = this._highlightRenderer.getStrokeRenderer(this._currentStrokeIndex);
  return strokeHintRenderer.highlight(animation);
};

Quiz.prototype._drawMatchingStroke = function (stroke, animation) {
  this._drawnStrokes.push(stroke);
  return this._characterRenderer.showStroke(stroke.strokeNum, animation);
};

Quiz.prototype._getNextStroke = function () {
  return this._character.getStroke(this._currentStrokeIndex);
};

// hide the caracter
Quiz.prototype._setupCharacter = function () {
  var _this3 = this;

  this._animator.animate(function (animation) {
    return _this3._characterRenderer.hide(animation);
  });
};

module.exports = Quiz;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    getDistance = _require.getDistance,
    cosineSimilarity = _require.cosineSimilarity;

var _require2 = __webpack_require__(0),
    average = _require2.average;

var AVG_DIST_THRESHOLD = 300; // bigger = more lenient
var COSINE_SIMILARITY_THRESHOLD = 0; // -1 to 1, smaller = more lenient
var START_AND_END_DIST_THRESHOLD = 250; // bigger = more lenient

function StrokeMatcher() {}

StrokeMatcher.prototype.strokeMatches = function (userStroke, stroke) {
  var points = this._stripDuplicates(userStroke.points);
  if (points.length < 2) return null;

  var avgDist = stroke.getAverageDistance(points);
  var withinDistThresh = avgDist < AVG_DIST_THRESHOLD;
  var startAndEndMatch = this._startAndEndMatches(points, stroke);
  var directionMatches = this._directionMatches(points, stroke);
  return withinDistThresh && startAndEndMatch && directionMatches;
};

StrokeMatcher.prototype._startAndEndMatches = function (points, closestStroke) {
  var startingDist = getDistance(closestStroke.getStartingPoint(), points[0]);
  var endingDist = getDistance(closestStroke.getEndingPoint(), points[points.length - 1]);
  return startingDist < START_AND_END_DIST_THRESHOLD && endingDist < START_AND_END_DIST_THRESHOLD;
};

StrokeMatcher.prototype._directionMatches = function (points, stroke) {
  var edgeVectors = this._getEdgeVectors(points);
  var strokeVectors = stroke.getVectors();
  var similarities = edgeVectors.map(function (edgeVector) {
    var strokeSimilarities = strokeVectors.map(function (strokeVector) {
      return cosineSimilarity(strokeVector, edgeVector);
    });
    return Math.max.apply(Math, strokeSimilarities);
  });
  var avgSimilarity = average(similarities);
  return avgSimilarity > COSINE_SIMILARITY_THRESHOLD;
};

StrokeMatcher.prototype._stripDuplicates = function (points) {
  if (points.length < 2) return points;
  var dedupedPoints = [points[0]];
  points.slice(1).forEach(function (point) {
    if (!point.equals(dedupedPoints[dedupedPoints.length - 1])) {
      dedupedPoints.push(point);
    }
  });
  return dedupedPoints;
};

StrokeMatcher.prototype._getLength = function (points) {
  var length = 0;
  var lastPoint = points[0];
  points.forEach(function (point) {
    length += getDistance(point, lastPoint);
    lastPoint = point;
  });
  return length;
};

// returns a list of the direction of all segments in the line connecting the points
StrokeMatcher.prototype._getEdgeVectors = function (points) {
  var vectors = [];
  var lastPoint = points[0];
  points.slice(1).forEach(function (point) {
    vectors.push(point.subtract(lastPoint));
    lastPoint = point;
  });
  return vectors;
};

module.exports = StrokeMatcher;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    getBounds = _require.getBounds;

function UserStroke(startingPoint) {
  this.points = [startingPoint];
}

UserStroke.prototype.getBounds = function () {
  return getBounds(this.points);
};

UserStroke.prototype.appendPoint = function (point) {
  this.points.push(point);
};

module.exports = UserStroke;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Renderer = __webpack_require__(3);

var _require = __webpack_require__(0),
    inherits = _require.inherits;

var svg = __webpack_require__(4);

function UserStrokeRenderer(userStroke) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  UserStrokeRenderer.super_.call(this);
  this.options = options;
  this.userStroke = userStroke;
}

inherits(UserStrokeRenderer, Renderer);

UserStrokeRenderer.prototype.getPathString = function () {
  return svg.getPathString(this.userStroke.points);
};

UserStrokeRenderer.prototype.updatePath = function () {
  svg.attr(this.path, 'd', this.getPathString());
};

UserStrokeRenderer.prototype.draw = function () {
  UserStrokeRenderer.super_.prototype.draw.call(this);
  this.path = svg.createElm('path');
  svg.attrs(this.path, this.getStrokeAttrs());
  this.path.style.opacity = 1;
  this.updatePath();
  this.canvas.svg.appendChild(this.path);
  return this;
};

UserStrokeRenderer.prototype.fadeAndRemove = function (animation) {
  var _this = this;

  var tween = new svg.StyleTween(this.path, 'opacity', 0, {
    duration: this.options.fadeDuration
  });
  animation.registerSvgAnimation(tween);
  return tween.start().then(function () {
    return _this.destroy();
  });
};

UserStrokeRenderer.prototype.getStrokeAttrs = function () {
  return {
    fill: 'none',
    stroke: this.options.strokeColor,
    'stroke-width': this.options.strokeWidth
  };
};

UserStrokeRenderer.prototype.destroy = function () {
  UserStrokeRenderer.super_.prototype.destroy.call(this);
  if (this.path) this.path.remove();
};

module.exports = UserStrokeRenderer;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// corresponds to the integer in the gh-pages branch under the cdn folder
// make sure to check out a new version of the master branch in gh-pages when changing the data format
// otherwise this may break any existing hanzi-writer deploys in the wild
var DATA_VERSION = 2;
var getCharDataUrl = function getCharDataUrl(char) {
  return 'https://chanind.github.io/hanzi-writer/cdn/' + DATA_VERSION + '/data/' + char + '.json';
};

module.exports = function (char, onLoad) {
  // load char data from hanziwriter.org cdn (currently hosted on github pages)
  var xhr = new global.XMLHttpRequest();
  if (xhr.overrideMimeType) {
    // IE 9 and 10 don't seem to support this...
    xhr.overrideMimeType('application/json');
  }
  xhr.open('GET', getCharDataUrl(char), true);
  xhr.onreadystatechange = function () {
    // TODO: error handling
    if (xhr.readyState === 4 && xhr.status === 200) {
      onLoad(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Animation = __webpack_require__(20);

function Animator() {
  this._lastAnimation = null;
}

Animator.prototype.animate = function (func) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var animation = this._setupAnimation(options);
  func(animation).then(function () {
    return animation.finish();
  });
};

Animator.prototype._setupAnimation = function (options) {
  if (this._lastAnimation) this._lastAnimation.cancel();
  this._lastAnimation = new Animation(options);
  return this._lastAnimation;
};

module.exports = Animator;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    callIfExists = _require.callIfExists;

function Animation() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this._svgAnimations = [];
  this._isActive = true;
  this._callback = options.onComplete;
}

Animation.prototype.cancel = function () {
  if (!this.isActive()) return;
  this._isActive = false;
  this._svgAnimations.forEach(function (anim) {
    return anim.finish();
  });
};

Animation.prototype.registerSvgAnimation = function (svgAnimation) {
  if (this._svgAnimations.indexOf(svgAnimation) === -1) {
    this._svgAnimations.push(svgAnimation);
  }
};

Animation.prototype.isActive = function () {
  return this._isActive;
};

Animation.prototype.finish = function () {
  if (this.isActive()) {
    this._isActive = false;
    callIfExists(this._callback);
  }
};

module.exports = Animation;

/***/ })
/******/ ]);