/*!
 * Hanzi Writer v0.6.0
 * https://chanind.github.io/hanzi-writer
 */
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

function copyAndMergeDeep(base, override) {
  var output = assign({}, base);
  for (var key in override) {
    if (Object.prototype.hasOwnProperty.call(override, key)) {
      if (base[key] && override[key] && _typeof(base[key]) === 'object' && _typeof(override[key]) === 'object') {
        output[key] = copyAndMergeDeep(base[key], override[key]);
      } else {
        output[key] = override[key];
      }
    }
  }
  return output;
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

function isMSBrowser() {
  return global.navigator && global.navigator.userAgent && (global.navigator.userAgent.indexOf('Edge') >= 0 || global.navigator.userAgent.indexOf('MSIE') >= 0);
}

module.exports = {
  inherits: inherits,
  assign: assign,
  arrayMax: arrayMax,
  arrayMin: arrayMin,
  average: average,
  callIfExists: callIfExists,
  copyAndMergeDeep: copyAndMergeDeep,
  counter: counter,
  emptyFunc: emptyFunc,
  getExtremes: getExtremes,
  isMSBrowser: isMSBrowser,
  timeout: timeout
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _require = __webpack_require__(0),
    arrayMin = _require.arrayMin,
    arrayMax = _require.arrayMax;

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

Point.getBounds = function (points) {
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
Point.getOverallBounds = function (boundables) {
  var bounds = [];
  boundables.forEach(function (boundable) {
    var _boundable$getBounds = boundable.getBounds(),
        _boundable$getBounds2 = _slicedToArray(_boundable$getBounds, 2),
        lowerBound = _boundable$getBounds2[0],
        upperBound = _boundable$getBounds2[1];

    bounds.push(lowerBound);
    bounds.push(upperBound);
  });
  return Point.getBounds(bounds);
};

Point.getDistance = function (point1, point2) {
  var difference = point1.subtract(point2);
  return difference.getMagnitude();
};

Point.cosineSimilarity = function (point1, point2) {
  var rawDotProduct = point1.x * point2.x + point1.y * point2.y;
  return rawDotProduct / point1.getMagnitude() / point2.getMagnitude();
};

module.exports = Point;

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Renderer(canvas) {
  this._canvas = canvas;
  this._isDestroyed = false; // check this in children in animations, etc
  this._childRenderers = [];
}

// implement in children
Renderer.prototype.mount = function (canvas, props) {
  return this;
};

// implement in children
Renderer.prototype.render = function (props) {
  var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return this;
};

Renderer.prototype.registerChild = function (child) {
  this._childRenderers.push(child);
  return child;
};

// extend this in children with extra behavior
Renderer.prototype.destroy = function () {
  this._isDestroyed = true;
  this._childRenderers.forEach(function (child) {
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
  // ensureEndStyle is if the tween is canceled early, should elm style be set immediately to endValue?
  this._ensureEndStyle = options.ensureEndStyle;
}
inherits(StyleTween, Tween);

StyleTween.prototype.start = function () {
  this._startValue = parseFloat(this._elm.style[this._style], 10);
  if (this._startValue === this._endValue) {
    return Promise.resolve();
  }
  return StyleTween.super_.prototype.start.call(this);
};

StyleTween.prototype.finish = function () {
  if (this._isActive && this._ensureEndStyle) {
    this._elm.style[this._style] = this._endValue;
  }
  return StyleTween.super_.prototype.finish.call(this);
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

Canvas.prototype.remove = function () {
  this.svg.parentNode.removeChild(this.svg);
};

module.exports = { createElm: createElm, attrs: attrs, attr: attr, Canvas: Canvas, Tween: Tween, StyleTween: StyleTween, getPathString: getPathString };
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var HanziWriterRenderer = __webpack_require__(6);
var StateManager = __webpack_require__(10);
var Point = __webpack_require__(1);
var CharDataParser = __webpack_require__(11);
var Positioner = __webpack_require__(14);
var Quiz = __webpack_require__(15);
var svg = __webpack_require__(4);
var defaultCharDataLoader = __webpack_require__(19);
var Animator = __webpack_require__(20);
var LoadingManager = __webpack_require__(22);

var _require = __webpack_require__(0),
    assign = _require.assign,
    isMSBrowser = _require.isMSBrowser,
    timeout = _require.timeout;

var defaultOptions = {
  charDataLoader: defaultCharDataLoader,
  onLoadCharDataError: null,
  onLoadCharDataSuccess: null,
  showOutline: true,
  showCharacter: true,

  // positioning options

  width: null,
  height: null,
  padding: 20,

  // animation options

  strokeAnimationSpeed: 1,
  strokeFadeDuration: 400,
  strokeHighlightDuration: 200,
  strokeHighlightSpeed: 2,
  delayBetweenStrokes: 1000,
  delayBetweenLoops: 2000,

  // colors

  strokeColor: '#555',
  radicalColor: null,
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
  outlineWidth: 2,
  // MS browsers are terrible and can't handle masks using paths with stroke
  usePolygonMasks: isMSBrowser()
};

function HanziWriter(element, character) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  this._animator = new Animator();
  this._canvas = svg.Canvas.init(element);
  this._options = this._assignOptions(options);
  this._loadingManager = new LoadingManager(this._options);
  this.setCharacter(character);
  this._setupListeners();
  this._quiz = null;
}

// ------ public API ------ //

HanziWriter.prototype.showCharacter = function () {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return this._animateWithData(function (animation) {
    return _this._characterRenderer.show(animation);
  }, options);
};
HanziWriter.prototype.hideCharacter = function () {
  var _this2 = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return this._animateWithData(function (animation) {
    return _this2._characterRenderer.hide(animation);
  }, options);
};
HanziWriter.prototype.animateCharacter = function () {
  var _this3 = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this.cancelQuiz();
  return this._animateWithData(function (animation) {
    return _this3._characterRenderer.animate(animation);
  }, options);
};
HanziWriter.prototype.loopCharacterAnimation = function () {
  var _this4 = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var animateForever = function animateForever(animation) {
    if (!animation.isActive()) return null;
    var cascadedOpts = assign({}, _this4._options, options);
    var delayBetweenLoops = cascadedOpts.delayBetweenLoops;
    var animatePromise = _this4._characterRenderer.animate(animation);
    if (!animatePromise) return null;
    return animatePromise.then(function () {
      return timeout(delayBetweenLoops);
    }).then(function () {
      return animateForever(animation);
    });
  };

  this.cancelQuiz();
  return this._animateWithData(animateForever, options);
};

HanziWriter.prototype.showOutline = function () {
  var _this5 = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return this._animateWithData(function (animation) {
    return _this5._outlineRenderer.show(animation);
  }, options);
};
HanziWriter.prototype.hideOutline = function () {
  var _this6 = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return this._animateWithData(function (animation) {
    return _this6._outlineRenderer.hide(animation);
  }, options);
};

HanziWriter.prototype.quiz = function () {
  var _this7 = this;

  var quizOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this._withData(function () {
    _this7.cancelQuiz();
    _this7._quiz = new Quiz({
      canvas: _this7._subCanvas,
      animator: _this7._animator,
      character: _this7._character,
      characterRenderer: _this7._characterRenderer,
      highlightRenderer: _this7._highlightRenderer,
      quizOptions: assign({}, _this7._options, quizOptions),
      userStrokeOptions: _this7._userStrokeOptions
    });
  });
};

HanziWriter.prototype.cancelQuiz = function () {
  if (this._quiz) this._quiz.cancel();
  this._quiz = null;
};

HanziWriter.prototype.setCharacter = function (char) {
  var _this8 = this;

  this.cancelQuiz();
  this._char = char;
  this._animator.cancel();
  if (this._hanziWriterRenderer) this._hanziWriterRenderer.destroy();
  this._hanziWriterRenderer = null;
  this._withDataPromise = this._loadingManager.loadCharData(char).then(function (pathStrings) {
    if (_this8._loadingManager.loadingFailed) return;

    var charDataParser = new CharDataParser();
    _this8._character = charDataParser.generateCharacter(char, pathStrings);
    _this8._positioner = new Positioner(_this8._character, _this8._options);
    _this8._hanziWriterRenderer = new HanziWriterRenderer(_this8._character, _this8._positioner);
    _this8._stateManager = new StateManager(_this8._character, _this8._options);
    _this8._hanziWriterRenderer.mount(_this8._canvas, _this8._stateManager.state);
    _this8._hanziWriterRenderer.render(_this8._stateManager.state);
  });
  return this._withDataPromise;
};

// ------------- //

HanziWriter.prototype._assignOptions = function (options) {
  var mergedOptions = assign({}, defaultOptions, options);

  // backfill strokeAnimationSpeed if deprecated strokeAnimationDuration is provided instead
  if (options.strokeAnimationDuration && !options.strokeAnimationSpeed) {
    mergedOptions.strokeAnimationSpeed = 500 / mergedOptions.strokeAnimationDuration;
  }
  if (options.strokeHighlightDuration && !options.strokeHighlightSpeed) {
    mergedOptions.strokeHighlightSpeed = 500 / mergedOptions.strokeHighlightDuration;
  }

  return this._fillWidthAndHeight(mergedOptions);
};

// returns a new options object with width and height filled in if missing
HanziWriter.prototype._fillWidthAndHeight = function (options) {
  var filledOpts = assign({}, options);
  if (filledOpts.width && !filledOpts.height) {
    filledOpts.height = filledOpts.width;
  } else if (filledOpts.height && !filledOpts.width) {
    filledOpts.width = filledOpts.height;
  } else if (!filledOpts.width && !filledOpts.height) {
    var _canvas$svg$getBoundi = this._canvas.svg.getBoundingClientRect(),
        width = _canvas$svg$getBoundi.width,
        height = _canvas$svg$getBoundi.height;

    var minDim = Math.min(width, height);
    filledOpts.width = minDim;
    filledOpts.height = minDim;
  }
  return filledOpts;
};

HanziWriter.prototype._withData = function (func) {
  var _this9 = this;

  // if this._loadingManager.loadingFailed, then loading failed before this method was called
  // Try reloading again and see if it helps
  if (this._loadingManager.loadingFailed) {
    this.setCharacter(this._char);
    return Promise.resolve().then(function () {
      // check loadingFailed again just in case setCharacter fails synchronously
      if (!_this9._loadingManager.loadingFailed) {
        return _this9._withData(func);
      }
    });
  }
  return this._withDataPromise.then(function () {
    if (!_this9._loadingManager.loadingFailed) {
      return func();
    }
  });
};

HanziWriter.prototype._setupListeners = function () {
  var _this10 = this;

  this._canvas.svg.addEventListener('mousedown', function (evt) {
    if (_this10.isLoadingCharData || !_this10._quiz) return;
    evt.preventDefault();
    _this10._forwardToQuiz('startUserStroke', _this10._getMousePoint(evt));
  });
  this._canvas.svg.addEventListener('touchstart', function (evt) {
    if (_this10.isLoadingCharData || !_this10._quiz) return;
    evt.preventDefault();
    _this10._forwardToQuiz('startUserStroke', _this10._getTouchPoint(evt));
  });
  this._canvas.svg.addEventListener('mousemove', function (evt) {
    if (_this10.isLoadingCharData || !_this10._quiz) return;
    evt.preventDefault();
    _this10._forwardToQuiz('continueUserStroke', _this10._getMousePoint(evt));
  });
  this._canvas.svg.addEventListener('touchmove', function (evt) {
    if (_this10.isLoadingCharData || !_this10._quiz) return;
    evt.preventDefault();
    _this10._forwardToQuiz('continueUserStroke', _this10._getTouchPoint(evt));
  });

  // TODO: fix
  global.document.addEventListener('mouseup', function () {
    return _this10._forwardToQuiz('endUserStroke');
  });
  global.document.addEventListener('touchend', function () {
    return _this10._forwardToQuiz('endUserStroke');
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
  var _this11 = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return this._withData(function () {
    return _this11._animate(func, options);
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Renderer = __webpack_require__(3);
var CharacterRenderer = __webpack_require__(7);

var _require = __webpack_require__(0),
    inherits = _require.inherits,
    assign = _require.assign;

var svg = __webpack_require__(4);

var extractCharProps = function extractCharProps(props, charName) {
  if (!props.character) return props;
  return assign({
    usePolygonMasks: props.options.usePolygonMasks
  }, props.character[charName]);
};

function HanziWriterRenderer(character, positioner) {
  HanziWriterRenderer.super_.call(this);
  this._character = character;
  this._positioner = positioner;
  this._mainCharRenderer = this.registerChild(new CharacterRenderer(character));
  this._outlineCharRenderer = this.registerChild(new CharacterRenderer(character));
  this._highlightCharRenderer = this.registerChild(new CharacterRenderer(character));
}

inherits(HanziWriterRenderer, Renderer);

HanziWriterRenderer.prototype.mount = function (canvas, props) {
  var positionedCanvas = canvas.createSubCanvas();
  var group = positionedCanvas.svg;
  svg.attr(group, 'transform', '\n    translate(' + this._positioner.getXOffset() + ', ' + (this._positioner.getHeight() - this._positioner.getYOffset()) + ')\n    scale(' + this._positioner.getScale() + ', ' + -1 * this._positioner.getScale() + ')\n  ');
  this._outlineCharRenderer.mount(positionedCanvas, extractCharProps(props, 'outline'));
  this._mainCharRenderer.mount(positionedCanvas, extractCharProps(props, 'main'));
  this._highlightCharRenderer.mount(positionedCanvas, extractCharProps(props, 'highlight'));
};

HanziWriterRenderer.prototype.render = function (props) {
  this._outlineCharRenderer.render(extractCharProps(props, 'outline'));
  this._mainCharRenderer.render(extractCharProps(props, 'main'));
  this._highlightCharRenderer.render(extractCharProps(props, 'highlight'));
};

module.exports = HanziWriterRenderer;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Renderer = __webpack_require__(3);
var StrokeRenderer = __webpack_require__(8);

var _require = __webpack_require__(0),
    assign = _require.assign,
    inherits = _require.inherits;

var exractStrokeProps = function exractStrokeProps(strokeNum, props) {
  if (!props.strokes) return props;
  return assign({
    usePolygonMasks: props.usePolygonMasks,
    strokeColor: props.strokeColor,
    radicalColor: props.radicalColor,
    strokeWidth: props.strokeWidth
  }, props.strokes[strokeNum]);
};

function CharacterRenderer(character) {
  var _this = this;

  CharacterRenderer.super_.call(this);
  this._oldProps = {};
  this.character = character;
  this.strokeRenderers = this.character.strokes.map(function (stroke) {
    return _this.registerChild(new StrokeRenderer(stroke));
  });
}

inherits(CharacterRenderer, Renderer);

CharacterRenderer.prototype.mount = function (canvas, props) {
  var subCanvas = canvas.createSubCanvas();
  this._group = subCanvas.svg;
  this.strokeRenderers.forEach(function (strokeRenderer, i) {
    strokeRenderer.mount(subCanvas, exractStrokeProps(i, props));
  });
};

CharacterRenderer.prototype.render = function (props) {
  if (props.opacity !== this._oldProps.opacity) {
    this._group.style.opacity = props.opacity;
  }
  for (var i = 0; i < this.strokeRenderers.length; i += 1) {
    this.strokeRenderers[i].render(exractStrokeProps(i, props));
  }
  this._oldProps = props;
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

var _require2 = __webpack_require__(9),
    extendPointOnLine = _require2.extendPointOnLine,
    getLineSegmentsPortion = _require2.getLineSegmentsPortion,
    getLineSegmentsLength = _require2.getLineSegmentsLength,
    filterParallelPoints = _require2.filterParallelPoints,
    linesToPolygon = _require2.linesToPolygon;

var STROKE_WIDTH = 200;

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

// take points on a path and move their end point backwards by distance
var extendEnd = function extendEnd(points, distance) {
  if (points.length < 2) return points;
  var p1 = points[points.length - 2];
  var p2 = points[points.length - 1];
  var newEnd = extendPointOnLine(p1, p2, distance);
  var extendedPoints = points.slice(0, points.length - 1);
  extendedPoints.push(newEnd);
  return extendedPoints;
};

// this is a stroke composed of several stroke parts
function StrokeRenderer(stroke) {
  StrokeRenderer.super_.call(this);
  this._oldProps = {};
  this._stroke = stroke;
  this._maskPathLength = getLineSegmentsLength(stroke.points) + STROKE_WIDTH / 2;
}
inherits(StrokeRenderer, Renderer);

StrokeRenderer.prototype.mount = function (canvas, props) {
  var usePolygonMasks = props.usePolygonMasks;

  this._path = svg.createElm('path');
  var maskType = usePolygonMasks ? 'clipPath' : 'mask';
  this._mask = svg.createElm(maskType);
  this._maskPath = svg.createElm('path');
  var maskId = 'mask-' + counter();
  svg.attr(this._mask, 'id', maskId);

  svg.attr(this._path, 'd', this._stroke.path);
  this._path.style.opacity = 0;
  var maskAttr = usePolygonMasks ? 'clip-path' : 'mask';
  svg.attr(this._path, maskAttr, 'url(#' + maskId + ')');

  this.extendedMaskPoints = extendStart(filterParallelPoints(this._stroke.points), STROKE_WIDTH / 2);
  if (usePolygonMasks) {
    this.extendedMaskPoints = extendEnd(this.extendedMaskPoints, STROKE_WIDTH / 2);
    this._polyMaskTip = svg.createElm('circle');
    // need to add this to the mask before the maskPath or else weird things happen. Not sure why
    this._mask.appendChild(this._polyMaskTip);
    svg.attr(this._polyMaskTip, 'r', STROKE_WIDTH / 2);
    this._setPolyMaskPortion(1);
  } else {
    svg.attr(this._maskPath, 'd', svg.getPathString(this.extendedMaskPoints));
    svg.attrs(this._maskPath, {
      stroke: '#FFFFFF',
      'stroke-width': STROKE_WIDTH,
      fill: 'none',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'miter',
      'stroke-dasharray': this._maskPathLength + ',' + this._maskPathLength
    });
  }

  this._mask.appendChild(this._maskPath);
  canvas.defs.appendChild(this._mask);
  canvas.svg.appendChild(this._path);
  return this;
};

StrokeRenderer.prototype.render = function (props) {
  if (this._isDestroyed) return;

  var usePolygonMasks = props.usePolygonMasks;

  if (props.displayPortion !== this._oldProps.displayPortion) {
    if (usePolygonMasks) {
      this._setPolyMaskPortion(props.displayPortion);
    } else {
      this._maskPath.style['stroke-dashoffset'] = this._getStrokeDashoffset(props.displayPortion);
    }
  }

  var color = this._getColor(props);
  if (color !== this._getColor(this._oldProps)) {
    svg.attrs(this._path, {
      fill: color,
      stroke: color
    });
  }

  if (props.strokeWidth !== this._oldProps.strokeWidth) {
    svg.attrs(this._path, { strokeWidth: props.strokeWidth });
  }

  if (props.opacity !== this._oldProps.opacity) {
    this._path.style.opacity = props.opacity;
  }
  this._oldProps = props;
};

StrokeRenderer.prototype._setPolyMaskPortion = function (portion) {
  var strokePointsPortion = getLineSegmentsPortion(this.extendedMaskPoints, portion);
  var pathString = svg.getPathString(linesToPolygon(strokePointsPortion, STROKE_WIDTH), true);
  var endPoint = strokePointsPortion[strokePointsPortion.length - 1];
  svg.attr(this._maskPath, 'd', pathString);
  svg.attr(this._polyMaskTip, 'cx', endPoint.x);
  svg.attr(this._polyMaskTip, 'cy', endPoint.y);
};

// StrokeRenderer.prototype.show = function(animation) {
//   if (this.options.usePolygonMasks) {
//     this._setPolyMaskPortion(1);
//   } else {
//     this._maskPath.style['stroke-dashoffset'] = 0;
//   }
//   const tween = new svg.StyleTween(this._path, 'opacity', 1, {
//     duration: this.options.strokeFadeDuration,
//     ensureEndStyle: true,
//   });
//   animation.registerSvgAnimation(tween);
//   return tween.start();
// };

// StrokeRenderer.prototype.hide = function(animation) {
//   const tween = new svg.StyleTween(this._path, 'opacity', 0, {
//     duration: this.options.strokeFadeDuration,
//     ensureEndStyle: true,
//   });
//   animation.registerSvgAnimation(tween);
//   return tween.start();
// };

// StrokeRenderer.prototype.animate = function(animation) {
//   if (!animation.isActive()) return null;
//   this.showImmediate();
//   const strokeLength = this._stroke.getLength();
//   const duration = (strokeLength + 600) / (3 * this.options.strokeAnimationSpeed);
//   let tween;
//   if (this.options.usePolygonMasks) {
//     this._setPolyMaskPortion(0);
//     tween = new svg.Tween((portion => this._setPolyMaskPortion(portion)), { duration });
//   } else {
//     // safari has a bug where setting the dashoffset to exactly the length causes a brief flicker
//     this._maskPath.style['stroke-dashoffset'] = this._maskPathLength * 0.999;
//     tween = new svg.StyleTween(this._maskPath, 'stroke-dashoffset', 0, { duration });
//   }
//   animation.registerSvgAnimation(tween);
//   return tween.start();
// };
// StrokeRenderer.prototype.hideImmediate = function() { this._path.style.opacity = 0; };
// StrokeRenderer.prototype.showImmediate = function() { this._path.style.opacity = 1; };

// StrokeRenderer.prototype.highlight = function(animation) {
//   return this.animate(animation).then(() => this.hide(animation));
// };

StrokeRenderer.prototype._getStrokeDashoffset = function (displayPortion) {
  return this._maskPathLength * 0.999 * (1 - displayPortion);
};

StrokeRenderer.prototype._getColor = function (_ref) {
  var strokeColor = _ref.strokeColor,
      radicalColor = _ref.radicalColor;

  return radicalColor && this._stroke.isInRadical ? radicalColor : strokeColor;
};

module.exports = StrokeRenderer;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Point = __webpack_require__(1);

// return a new point, p3, which is on the same line as p1 and p2, but distance away
// from p2. p1, p2, p3 will always lie on the line in that order
var extendPointOnLine = function extendPointOnLine(p1, p2, distance) {
  var vect = p2.subtract(p1);
  var norm = distance / vect.getMagnitude();
  return new Point(p2.x + norm * vect.x, p2.y + norm * vect.y);
};

// return 2 points distance from targetPoint on line perpendicular to the line between
// targetPoint and refPoint
var getPerpendicularPointsAtDist = function getPerpendicularPointsAtDist(targetPoint, refPoint, distance) {
  var vect = targetPoint.subtract(refPoint);
  var norm = distance / vect.getMagnitude();
  // simulate taking a cross-product with the vector (0, 0, 1) to get the new perpendicular vect
  var perpVect = new Point(norm * vect.y, -1 * norm * vect.x);
  return [targetPoint.add(perpVect), targetPoint.subtract(perpVect)];
};

// get the intersection point of 2 lines defined by 2 points each
// from https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
var getLinesIntersectPoint = function getLinesIntersectPoint(l1p1, l1p2, l2p1, l2p2) {
  var x1 = l1p1.x;
  var x2 = l1p2.x;
  var x3 = l2p1.x;
  var x4 = l2p2.x;
  var y1 = l1p1.y;
  var y2 = l1p2.y;
  var y3 = l2p1.y;
  var y4 = l2p2.y;
  var xNumerator = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  var yNumerator = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  var denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  return new Point(xNumerator / denominator, yNumerator / denominator);
};

var getLineSegmentsLength = function getLineSegmentsLength(points) {
  var totalDist = 0;
  for (var i = 1; i < points.length; i += 1) {
    totalDist += Point.getDistance(points[i], points[i - 1]);
  }
  return totalDist;
};

var getLineSegmentsPortion = function getLineSegmentsPortion(points, portion) {
  if (points.length < 2 || portion >= 1) return points;
  if (portion === 0) return [points[0]];
  var totalDist = getLineSegmentsLength(points);
  var portionedPoints = [points[0]];
  var portionedDist = totalDist * portion;
  var cumuativeDist = 0;
  for (var i = 1; i < points.length; i += 1) {
    var lastPoint = points[i - 1];
    var segmentLength = Point.getDistance(points[i], lastPoint);
    if (cumuativeDist + segmentLength >= portionedDist) {
      var vect = points[i].subtract(lastPoint);
      var norm = (portionedDist - cumuativeDist) / segmentLength;
      portionedPoints.push(new Point(lastPoint.x + norm * vect.x, lastPoint.y + norm * vect.y));
      return portionedPoints;
    }
    cumuativeDist += segmentLength;
    portionedPoints.push(points[i]);
  }
  return portionedPoints;
};

// remove intermediate points that are on the same line as the points to either side
var filterParallelPoints = function filterParallelPoints(points) {
  if (points.length < 3) return points;
  var filteredPoints = [points[0], points[1]];
  points.slice(2).forEach(function (point, i) {
    var numFilteredPoints = filteredPoints.length;
    var curVect = point.subtract(filteredPoints[numFilteredPoints - 1]);
    var prevVect = filteredPoints[numFilteredPoints - 1].subtract(filteredPoints[numFilteredPoints - 2]);
    // this is the z coord of the cross-product. If this is 0 then they're parallel
    var isParallel = curVect.y * prevVect.x - curVect.x * prevVect.y === 0;
    if (isParallel) {
      filteredPoints.pop();
    }
    filteredPoints.push(point);
  });
  return filteredPoints;
};

// given the points of a polyline, return the points outlining a polygon that's that polyline stroked with thickness
var linesToPolygon = function linesToPolygon(points, thickness) {
  if (points.length < 2) return points;
  var dist = thickness / 2;
  var topSegments = [];
  var bottomSegments = [];
  for (var i = 1; i < points.length; i += 1) {
    var startPoints = getPerpendicularPointsAtDist(points[i - 1], points[i], dist);
    var endPoints = getPerpendicularPointsAtDist(points[i], points[i - 1], dist);
    topSegments.push({ start: startPoints[0], end: endPoints[1] });
    bottomSegments.push({ start: startPoints[1], end: endPoints[0] });
  }
  var topPoints = [topSegments[0].start];
  var bottomPoints = [bottomSegments[0].start];
  for (var _i = 1; _i < topSegments.length; _i += 1) {
    var topIntersect = getLinesIntersectPoint(topSegments[_i - 1].start, topSegments[_i - 1].end, topSegments[_i].start, topSegments[_i].end);
    var bottomIntersect = getLinesIntersectPoint(bottomSegments[_i - 1].start, bottomSegments[_i - 1].end, bottomSegments[_i].start, bottomSegments[_i].end);
    topPoints.push(topIntersect);
    bottomPoints.push(bottomIntersect);
  }

  var topEndPoint = topSegments[topSegments.length - 1].end;
  var bottomEndPoint = bottomSegments[bottomSegments.length - 1].end;

  var endOverlapIntersect = getLinesIntersectPoint(topPoints[topPoints.length - 1], bottomPoints[bottomPoints.length - 1], topEndPoint, bottomEndPoint);

  // correct for case where there's a hard corner and we're overlapping an area we already drew
  if (Point.getDistance(endOverlapIntersect, points[points.length - 1]) < dist) {
    var topVect = topEndPoint.subtract(points[points.length - 1]);
    var overlapVect = endOverlapIntersect.subtract(points[points.length - 1]);
    // figure out if the top point is overlapping of the bottom point is overlapping by using dot-product
    var isTopOverlapping = topVect.x * overlapVect.x + topVect.y * overlapVect.y > 0;
    if (isTopOverlapping) {
      topEndPoint = endOverlapIntersect;
    } else {
      bottomEndPoint = endOverlapIntersect;
    }
  }

  topPoints.push(topEndPoint);
  bottomPoints.push(bottomEndPoint);
  bottomPoints.reverse();
  return topPoints.concat(bottomPoints);
};

module.exports = {
  extendPointOnLine: extendPointOnLine,
  filterParallelPoints: filterParallelPoints,
  getLineSegmentsLength: getLineSegmentsLength,
  getLineSegmentsPortion: getLineSegmentsPortion,
  getLinesIntersectPoint: getLinesIntersectPoint,
  getPerpendicularPointsAtDist: getPerpendicularPointsAtDist,
  linesToPolygon: linesToPolygon
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    copyAndMergeDeep = _require.copyAndMergeDeep;

function StateManager(character, options, onStateChange) {
  this._onStateChange = onStateChange;
  this.state = {
    options: {
      usePolygonMasks: options.usePolygonMasks,
      drawingFadeDuration: options.drawingFadeDuration,
      drawingWidth: options.drawingWidth,
      strokeWidth: options.strokeWidth
    },
    character: {
      main: {
        strokeColor: options.strokeColor,
        radicalColor: options.radicalColor,
        opacity: options.showCharacter ? 1 : 0,
        strokes: {}
      },
      outline: {
        strokeColor: options.outlineColor,
        opacity: options.showOutline ? 1 : 0,
        strokes: {}
      },
      highlight: {
        strokeColor: options.highlightColor,
        opacity: 1,
        strokes: {}
      }
    }
  };
  for (var i = 0; i < character.strokes.length; i += 1) {
    this.state.character.main.strokes[i] = {
      opacity: 1,
      displayPortion: 1
    };
    this.state.character.outline.strokes[i] = {
      opacity: 1,
      displayPortion: 1
    };
    this.state.character.highlight.strokes[i] = {
      opacity: 1,
      displayPortion: 1
    };
  }
}

StateManager.prototype.updateState = function (stateChanges) {
  var nextState = copyAndMergeDeep(this.state, stateChanges);
  this._onStateChange(nextState, this.state);
  this.state = nextState;
};

module.exports = StateManager;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Point = __webpack_require__(1);
var Stroke = __webpack_require__(12);
var Character = __webpack_require__(13);

function CharDataParser() {}

CharDataParser.prototype.generateCharacter = function (symbol, charJson) {
  var strokes = this.generateStrokes(charJson);
  return new Character(symbol, strokes);
};

CharDataParser.prototype.generateStrokes = function (charJson) {
  var isInRadical = function isInRadical(strokeNum) {
    return charJson.radStrokes && charJson.radStrokes.indexOf(strokeNum) >= 0;
  };

  return charJson.strokes.map(function (path, index) {
    var points = charJson.medians[index].map(function (pointData) {
      var _pointData = _slicedToArray(pointData, 2),
          x = _pointData[0],
          y = _pointData[1];

      return new Point(x, y);
    });
    return new Stroke(path, points, index, isInRadical(index));
  });
};

module.exports = CharDataParser;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Point = __webpack_require__(1);

function Stroke(path, points, strokeNum) {
  var isInRadical = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  this.path = path;
  this.points = points;
  this.strokeNum = strokeNum;
  this.isInRadical = isInRadical;
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
    var dist = Point.getDistance(point, lastPoint);
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
    return Point.getDistance(strokePoint, point);
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Point = __webpack_require__(1);

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
  return Point.getBounds([new Point(0, 900), new Point(1024, -124)]);
};

module.exports = Character;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Point = __webpack_require__(1);

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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var StrokeMatcher = __webpack_require__(16);
var UserStroke = __webpack_require__(17);
var UserStrokeRenderer = __webpack_require__(18);

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
      promises.push(_this._handleSuccess(nextStroke, animation));
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Point = __webpack_require__(1);

var _require = __webpack_require__(0),
    average = _require.average;

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
  var startingDist = Point.getDistance(closestStroke.getStartingPoint(), points[0]);
  var endingDist = Point.getDistance(closestStroke.getEndingPoint(), points[points.length - 1]);
  return startingDist < START_AND_END_DIST_THRESHOLD && endingDist < START_AND_END_DIST_THRESHOLD;
};

StrokeMatcher.prototype._directionMatches = function (points, stroke) {
  var edgeVectors = this._getEdgeVectors(points);
  var strokeVectors = stroke.getVectors();
  var similarities = edgeVectors.map(function (edgeVector) {
    var strokeSimilarities = strokeVectors.map(function (strokeVector) {
      return Point.cosineSimilarity(strokeVector, edgeVector);
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
    length += Point.getDistance(point, lastPoint);
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Point = __webpack_require__(1);

function UserStroke(startingPoint) {
  this.points = [startingPoint];
}

UserStroke.prototype.getBounds = function () {
  return Point.getBounds(this.points);
};

UserStroke.prototype.appendPoint = function (point) {
  this.points.push(point);
};

module.exports = UserStroke;

/***/ }),
/* 18 */
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
    'stroke-width': this.options.strokeWidth,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  };
};

module.exports = UserStrokeRenderer;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// corresponds to the integer in the gh-pages branch under the cdn folder
// make sure to check out a new version of the master branch in gh-pages when changing the data format
// otherwise this may break any existing hanzi-writer deploys in the wild
var VERSION = '1';
var getCharDataUrl = function getCharDataUrl(char) {
  return 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@' + VERSION + '/' + char + '.json';
};

module.exports = function (char, onLoad, onError) {
  // load char data from hanziwriter.org cdn (currently hosted on github pages)
  var xhr = new global.XMLHttpRequest();
  if (xhr.overrideMimeType) {
    // IE 9 and 10 don't seem to support this...
    xhr.overrideMimeType('application/json');
  }
  xhr.open('GET', getCharDataUrl(char), true);
  xhr.onerror = function (event) {
    onError(xhr, event);
  };
  xhr.onreadystatechange = function () {
    // TODO: error handling
    if (xhr.readyState !== 4) return;

    if (xhr.status === 200) {
      onLoad(JSON.parse(xhr.responseText));
    } else if (onError) {
      onError(xhr);
    }
  };
  xhr.send(null);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Animation = __webpack_require__(21);

function Animator() {
  this._lastAnimation = null;
}

Animator.prototype.animate = function (func) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var animation = this._setupAnimation(options);
  return func(animation).then(function () {
    return animation.finish();
  });
};

Animator.prototype._setupAnimation = function (options) {
  this.cancel();
  this._lastAnimation = new Animation(options);
  return this._lastAnimation;
};

Animator.prototype.cancel = function () {
  if (this._lastAnimation) this._lastAnimation.cancel();
};

module.exports = Animator;

/***/ }),
/* 21 */
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

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    callIfExists = _require.callIfExists;

function LoadingManager(options) {
  this._loadCounter = 0;
  this._options = options;
  this._isLoading = false;
  this._loadingPromise = null;

  // use this to attribute to determine if there was a problem with loading
  this.loadingFailed = false;
}

LoadingManager.prototype._debouncedLoad = function (char, count) {
  var _this = this;

  // these wrappers ignore all responses except the most recent.
  var wrappedResolve = function wrappedResolve(data) {
    if (count === _this._loadCounter) _this._resolve(data);
  };
  var wrappedReject = function wrappedReject(reason) {
    if (count === _this._loadCounter) _this._reject(reason);
  };

  var returnedData = this._options.charDataLoader(char, wrappedResolve, wrappedReject);
  if (returnedData) wrappedResolve(returnedData);
};

LoadingManager.prototype._setupLoadingPromise = function () {
  var _this2 = this;

  this._loadingPromise = new Promise(function (resolve, reject) {
    _this2._resolve = resolve;
    _this2._reject = reject;
  }).then(function (data) {
    _this2._isLoading = false;
    callIfExists(_this2._options.onLoadCharDataSuccess, data);
    return data;
  }, function (reason) {
    _this2._isLoading = false;
    _this2.loadingFailed = true;
    callIfExists(_this2._options.onLoadCharDataError, reason);
    // If error callback wasn't provided, throw an error so the developer will be aware something went wrong
    if (!_this2._options.onLoadCharDataError) {
      if (reason instanceof Error) throw reason;
      var err = new Error('Failed to load char data for ' + _this2._loadingChar);
      err.reason = reason;
      throw err;
    }
  });
};

LoadingManager.prototype.loadCharData = function (char) {
  this._loadingChar = char;
  if (!this._isLoading) {
    this._setupLoadingPromise();
  }
  this.loadingFailed = false;
  this._isLoading = true;
  this._loadCounter += 1;
  this._debouncedLoad(char, this._loadCounter);
  return this._loadingPromise;
};

module.exports = LoadingManager;

/***/ })
/******/ ]);