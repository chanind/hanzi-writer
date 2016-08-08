/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _CharacterRenderer = __webpack_require__(1);

	var _CharacterRenderer2 = _interopRequireDefault(_CharacterRenderer);

	var _PositionerRenderer = __webpack_require__(11);

	var _PositionerRenderer2 = _interopRequireDefault(_PositionerRenderer);

	var _Point = __webpack_require__(12);

	var _Point2 = _interopRequireDefault(_Point);

	var _ZdtStrokeParser = __webpack_require__(13);

	var _ZdtStrokeParser2 = _interopRequireDefault(_ZdtStrokeParser);

	var _Positioner = __webpack_require__(17);

	var _Positioner2 = _interopRequireDefault(_Positioner);

	var _Quiz = __webpack_require__(18);

	var _Quiz2 = _interopRequireDefault(_Quiz);

	var _utils = __webpack_require__(6);

	var _defaultCharDataLoader = __webpack_require__(22);

	var _defaultCharDataLoader2 = _interopRequireDefault(_defaultCharDataLoader);

	var _Animator = __webpack_require__(23);

	var _Animator2 = _interopRequireDefault(_Animator);

	var _svg = __webpack_require__(25);

	var _svg2 = _interopRequireDefault(_svg);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	__webpack_require__(26); // polyfill for old IE and whatnot

	var defaultOptions = {
	  charDataLoader: _defaultCharDataLoader2.default,
	  showOutline: true,
	  showCharacter: true,

	  // positioning options

	  width: null,
	  height: null,
	  padding: 20,

	  // animation options

	  strokeAnimationDuration: 300,
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

	var HanziWriter = (function () {
	  function HanziWriter(element, character) {
	    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    _classCallCheck(this, HanziWriter);

	    this._animator = new _Animator2.default();
	    this._svg = (0, _svg2.default)(element);
	    this.setOptions(options);
	    this.setCharacter(character);
	    this._setupListeners();
	    this._quiz = null;
	  }

	  HanziWriter.prototype.setOptions = function setOptions(options) {
	    this._options = (0, _utils.copyAndExtend)(defaultOptions, options);
	    this._mainCharOptions = {
	      strokeColor: this._options.strokeColor,
	      strokeWidth: this._options.strokeWidth,
	      strokeAnimationDuration: this._options.strokeAnimationDuration,
	      delayBetweenStrokes: this._options.delayBetweenStrokes
	    };
	    this._outlineCharOptions = (0, _utils.copyAndExtend)(this._mainCharOptions, {
	      strokeColor: this._options.outlineColor,
	      strokeWidth: this._options.outlineWidth
	    });
	    this._highlightCharOptions = (0, _utils.copyAndExtend)(this._mainCharOptions, {
	      strokeColor: this._options.highlightColor,
	      strokeAnimationDuration: this._options.strokeHighlightDuration
	    });
	    this._userStrokeOptions = {
	      strokeColor: this._options.drawingColor,
	      strokeWidth: this._options.drawingWidth,
	      fadeDuration: this._options.drawingFadeDuration
	    };
	  };

	  // ------ public API ------ //

	  HanziWriter.prototype.showCharacter = function showCharacter() {
	    var _this = this;

	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    this._animateWithData(function (animation) {
	      return _this._characterRenderer.show(animation);
	    }, options);
	  };

	  HanziWriter.prototype.hideCharacter = function hideCharacter() {
	    var _this2 = this;

	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    this._animateWithData(function (animation) {
	      return _this2._characterRenderer.hide(animation);
	    }, options);
	  };

	  HanziWriter.prototype.animateCharacter = function animateCharacter() {
	    var _this3 = this;

	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    this.cancelQuiz();
	    this._animateWithData(function (animation) {
	      return _this3._characterRenderer.animate(animation);
	    }, options);
	  };

	  HanziWriter.prototype.showOutline = function showOutline() {
	    var _this4 = this;

	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    this._animateWithData(function (animation) {
	      return _this4._outlineRenderer.show(animation);
	    }, options);
	  };

	  HanziWriter.prototype.hideOutline = function hideOutline() {
	    var _this5 = this;

	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    this._animateWithData(function (animation) {
	      return _this5._outlineRenderer.hide(animation);
	    }, options);
	  };

	  HanziWriter.prototype.quiz = function quiz() {
	    var _this6 = this;

	    var quizOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    this._withData(function () {
	      _this6.cancelQuiz();
	      _this6._quiz = new _Quiz2.default({
	        canvas: _this6._canvas,
	        animator: _this6._animator,
	        character: _this6._character,
	        characterRenderer: _this6._characterRenderer,
	        highlightRenderer: _this6._highlightRenderer,
	        quizOptions: (0, _utils.copyAndExtend)(_this6._options, quizOptions),
	        userStrokeOptions: _this6._userStrokeOptions
	      });
	    });
	  };

	  HanziWriter.prototype.cancelQuiz = function cancelQuiz() {
	    if (this._quiz) this._quiz.cancel();
	    this._quiz = null;
	  };

	  HanziWriter.prototype.setCharacter = function setCharacter(char) {
	    var _this7 = this;

	    this.cancelQuiz();
	    if (this._positionerRenderer) this._positionerRenderer.destroy();
	    if (this._characterRenderer) this._characterRenderer.destroy();
	    if (this._outlineRenderer) this._outlineRenderer.destroy();
	    if (this._highlightRenderer) this._highlightRenderer.destroy();
	    this._withDataPromise = this._loadCharacterData(char).then(function (pathStrings) {
	      var zdtStrokeParser = new _ZdtStrokeParser2.default();
	      _this7._character = zdtStrokeParser.generateCharacter(char, pathStrings);
	      _this7._positioner = new _Positioner2.default(_this7._character, _this7._options);

	      _this7._positionerRenderer = new _PositionerRenderer2.default(_this7._positioner).setCanvas(_this7._svg);
	      _this7._canvas = _this7._positionerRenderer.getPositionedCanvas();

	      _this7._outlineRenderer = new _CharacterRenderer2.default(_this7._character, _this7._outlineCharOptions).setCanvas(_this7._canvas).draw();
	      _this7._characterRenderer = new _CharacterRenderer2.default(_this7._character, _this7._mainCharOptions).setCanvas(_this7._canvas).draw();
	      _this7._highlightRenderer = new _CharacterRenderer2.default(_this7._character, _this7._highlightCharOptions).setCanvas(_this7._canvas).draw();

	      if (_this7._options.showCharacter) _this7._characterRenderer.showImmediate();
	      if (_this7._options.showOutline) _this7._outlineRenderer.showImmediate();
	    });
	  };

	  // ------------- //

	  HanziWriter.prototype._loadCharacterData = function _loadCharacterData(char) {
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

	  HanziWriter.prototype._withData = function _withData(func) {
	    this._withDataPromise = this._withDataPromise.then(func);
	    return this._withDataPromise;
	  };

	  HanziWriter.prototype._setupListeners = function _setupListeners() {
	    var _this9 = this;

	    this._svg.node.addEventListener('mousedown', function (evt) {
	      if (_this9.isLoadingCharData || !_this9._quiz) return;
	      evt.preventDefault();
	      _this9._forwardToQuiz('startUserStroke', _this9._getMousePoint(evt));
	    });
	    this._svg.node.addEventListener('touchstart', function (evt) {
	      if (_this9.isLoadingCharData || !_this9._quiz) return;
	      evt.preventDefault();
	      _this9._forwardToQuiz('startUserStroke', _this9._getTouchPoint(evt));
	    });
	    this._svg.node.addEventListener('mousemove', function (evt) {
	      if (_this9.isLoadingCharData || !_this9._quiz) return;
	      evt.preventDefault();
	      _this9._forwardToQuiz('continueUserStroke', _this9._getMousePoint(evt));
	    });
	    this._svg.node.addEventListener('touchmove', function (evt) {
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

	  HanziWriter.prototype._forwardToQuiz = function _forwardToQuiz(method) {
	    var _quiz;

	    if (!this._quiz) return;

	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    (_quiz = this._quiz)[method].apply(_quiz, args);
	  };

	  HanziWriter.prototype._getMousePoint = function _getMousePoint(evt) {
	    var box = this._svg.node.getBoundingClientRect();
	    return this._positioner.convertExternalPoint(new _Point2.default(evt.clientX - box.left, evt.clientY - box.top));
	  };

	  HanziWriter.prototype._getTouchPoint = function _getTouchPoint(evt) {
	    var box = this._svg.node.getBoundingClientRect();
	    var x = evt.touches[0].clientX - box.left;
	    var y = evt.touches[0].clientY - box.top;
	    return this._positioner.convertExternalPoint(new _Point2.default(x, y));
	  };

	  HanziWriter.prototype._animate = function _animate(func) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    return this._animator.animate(func, options);
	  };

	  HanziWriter.prototype._animateWithData = function _animateWithData(func) {
	    var _this10 = this;

	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    return this._withData(function () {
	      return _this10._animate(func, options);
	    });
	  };

	  return HanziWriter;
	})();

	// set up window.HanziWriter if we're in the browser

	if (typeof window !== 'undefined') {
	  (function () {
	    // store whatever used to be called HanziWriter in case of a conflict
	    var previousHanziWriter = window.HanziWriter;

	    // add a jQuery-esque noConflict method to restore the previous window.HanziWriter if necessary
	    HanziWriter.noConflict = function () {
	      window.HanziWriter = previousHanziWriter;
	      return HanziWriter;
	    };

	    window.HanziWriter = HanziWriter;
	  })();
	}

	// set up module.exports if we're in node/webpack
	if (true) {
	  module.exports = HanziWriter;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Renderer2 = __webpack_require__(2);

	var _Renderer3 = _interopRequireDefault(_Renderer2);

	var _StrokeRenderer = __webpack_require__(3);

	var _StrokeRenderer2 = _interopRequireDefault(_StrokeRenderer);

	var _utils = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CharacterRenderer = (function (_Renderer) {
	  _inherits(CharacterRenderer, _Renderer);

	  function CharacterRenderer(character) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, CharacterRenderer);

	    var _this = _possibleConstructorReturn(this, _Renderer.call(this));

	    _this.options = options;
	    _this.character = character;
	    _this.strokeRenderers = _this.character.getStrokes().map(function (stroke) {
	      return _this.registerChild(new _StrokeRenderer2.default(stroke, options));
	    });
	    return _this;
	  }

	  CharacterRenderer.prototype.getBounds = function getBounds() {
	    return this.character.getBounds();
	  };

	  CharacterRenderer.prototype.show = function show(animation) {
	    var promises = this.strokeRenderers.map(function (strokeRenderer) {
	      return strokeRenderer.show(animation);
	    });
	    return Promise.all(promises);
	  };

	  CharacterRenderer.prototype.showImmediate = function showImmediate() {
	    this.strokeRenderers.map(function (renderer) {
	      return renderer.showImmediate();
	    });
	  };

	  CharacterRenderer.prototype.hide = function hide(animation) {
	    var promises = this.strokeRenderers.map(function (strokeRenderer) {
	      return strokeRenderer.hide(animation);
	    });
	    return Promise.all(promises);
	  };

	  CharacterRenderer.prototype.hideImmediate = function hideImmediate() {
	    this.strokeRenderers.map(function (renderer) {
	      return renderer.hideImmediate();
	    });
	  };

	  CharacterRenderer.prototype.flash = function flash(animation) {
	    var _this2 = this;

	    return this.show(animation).then(function () {
	      return _this2.hide(animation);
	    });
	  };

	  CharacterRenderer.prototype.showStroke = function showStroke(strokeNum, animation) {
	    return this.getStrokeRenderer(strokeNum).show(animation);
	  };

	  CharacterRenderer.prototype.draw = function draw() {
	    for (var _iterator = this.strokeRenderers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var strokeRenderer = _ref;

	      strokeRenderer.draw();
	    }
	    return this;
	  };

	  CharacterRenderer.prototype.getStrokeRenderer = function getStrokeRenderer(strokeNum) {
	    return this.strokeRenderers[strokeNum];
	  };

	  CharacterRenderer.prototype.animate = function animate(animation) {
	    var _this3 = this;

	    if (!animation.isActive()) return null;
	    var renderChain = this.hide(animation);
	    this.strokeRenderers.forEach(function (strokeRenderer, index) {
	      if (index > 0) renderChain = renderChain.then(function () {
	        return (0, _utils.timeout)(_this3.options.delayBetweenStrokes);
	      });
	      renderChain = renderChain.then(function () {
	        return strokeRenderer.animate(animation);
	      });
	    });
	    return renderChain;
	  };

	  CharacterRenderer.prototype.setCanvas = function setCanvas(canvas) {
	    _Renderer.prototype.setCanvas.call(this, canvas);
	    for (var _iterator2 = this.strokeRenderers, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	      var _ref2;

	      if (_isArray2) {
	        if (_i2 >= _iterator2.length) break;
	        _ref2 = _iterator2[_i2++];
	      } else {
	        _i2 = _iterator2.next();
	        if (_i2.done) break;
	        _ref2 = _i2.value;
	      }

	      var strokeRenderer = _ref2;

	      strokeRenderer.setCanvas(canvas);
	    }
	    return this;
	  };

	  return CharacterRenderer;
	})(_Renderer3.default);

	exports.default = CharacterRenderer;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Renderer = (function () {
	  function Renderer() {
	    _classCallCheck(this, Renderer);

	    this.isDestroyed = false; // check this in children in animations, etc
	    this.childRenderers = [];
	    this.parentRenderer = null;
	  }

	  // implement in children

	  Renderer.prototype.draw = function draw() {
	    return this;
	  };

	  Renderer.prototype.registerChild = function registerChild(child) {
	    this.childRenderers.push(child);
	    child.setParent(this);
	    return child;
	  };

	  Renderer.prototype.setParent = function setParent(parent) {
	    this.parentRenderer = parent;
	    return this;
	  };

	  Renderer.prototype.setCanvas = function setCanvas(canvas) {
	    this.canvas = canvas;
	    return this;
	  };

	  // extend this in children with extra behavior

	  Renderer.prototype.destroy = function destroy() {
	    this.isDestroyed = true;
	    for (var _iterator = this.childRenderers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var child = _ref;

	      child.destroy();
	    }
	  };

	  return Renderer;
	})();

	exports.default = Renderer;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Renderer2 = __webpack_require__(2);

	var _Renderer3 = _interopRequireDefault(_Renderer2);

	var _StrokePartRenderer = __webpack_require__(4);

	var _StrokePartRenderer2 = _interopRequireDefault(_StrokePartRenderer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// this is a stroke composed of several stroke parts

	var StrokeRenderer = (function (_Renderer) {
	  _inherits(StrokeRenderer, _Renderer);

	  function StrokeRenderer(stroke) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, StrokeRenderer);

	    var _this = _possibleConstructorReturn(this, _Renderer.call(this));

	    _this.stroke = stroke;
	    _this.strokePartRenderers = _this.stroke.getStrokeParts().map(function (strokePart) {
	      return _this.registerChild(new _StrokePartRenderer2.default(strokePart, stroke, options));
	    });
	    _this.options = options;
	    return _this;
	  }

	  StrokeRenderer.prototype.show = function show(animation) {
	    var promises = this.strokePartRenderers.map(function (strokePartRenderer) {
	      return strokePartRenderer.show(animation);
	    });
	    return Promise.all(promises);
	  };

	  StrokeRenderer.prototype.showImmediate = function showImmediate() {
	    this.strokePartRenderers.map(function (renderer) {
	      return renderer.showImmediate();
	    });
	  };

	  StrokeRenderer.prototype.hide = function hide(animation) {
	    var promises = this.strokePartRenderers.map(function (strokePartRenderer) {
	      return strokePartRenderer.hide(animation);
	    });
	    return Promise.all(promises);
	  };

	  StrokeRenderer.prototype.hideImmediate = function hideImmediate() {
	    this.strokePartRenderers.map(function (renderer) {
	      return renderer.hideImmediate();
	    });
	  };

	  StrokeRenderer.prototype.draw = function draw() {
	    for (var _iterator = this.strokePartRenderers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var strokePartRenderer = _ref;

	      strokePartRenderer.draw(this.canvas);
	    }
	    return this;
	  };

	  StrokeRenderer.prototype.animate = function animate(animation) {
	    if (!animation.isActive()) return null;
	    var renderChain = Promise.resolve();
	    this.strokePartRenderers.forEach(function (strokePartRenderer) {
	      renderChain = renderChain.then(function () {
	        return strokePartRenderer.animate(animation);
	      });
	    });
	    return renderChain;
	  };

	  StrokeRenderer.prototype.highlight = function highlight(animation) {
	    var _this2 = this;

	    return this.animate(animation).then(function () {
	      return _this2.hide(animation);
	    });
	  };

	  StrokeRenderer.prototype.setCanvas = function setCanvas(canvas) {
	    _Renderer.prototype.setCanvas.call(this, canvas);
	    for (var _iterator2 = this.strokePartRenderers, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	      var _ref2;

	      if (_isArray2) {
	        if (_i2 >= _iterator2.length) break;
	        _ref2 = _iterator2[_i2++];
	      } else {
	        _i2 = _iterator2.next();
	        if (_i2.done) break;
	        _ref2 = _i2.value;
	      }

	      var strokePartRenderer = _ref2;

	      strokePartRenderer.setCanvas(canvas);
	    }
	  };

	  return StrokeRenderer;
	})(_Renderer3.default);

	exports.default = StrokeRenderer;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _PathRenderer2 = __webpack_require__(5);

	var _PathRenderer3 = _interopRequireDefault(_PathRenderer2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var StrokePartRenderer = (function (_PathRenderer) {
	  _inherits(StrokePartRenderer, _PathRenderer);

	  function StrokePartRenderer(strokePart, stroke) {
	    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    _classCallCheck(this, StrokePartRenderer);

	    var _this = _possibleConstructorReturn(this, _PathRenderer.call(this));

	    _this.options = options;
	    _this.strokePart = strokePart;
	    _this.stroke = stroke;
	    return _this;
	  }

	  StrokePartRenderer.prototype.getPathString = function getPathString() {
	    return _PathRenderer.prototype.getPathString.call(this) + ' z';
	  };

	  StrokePartRenderer.prototype.getPoints = function getPoints() {
	    return this.strokePart.getPoints();
	  };

	  StrokePartRenderer.prototype.markAnimationPoints = function markAnimationPoints() {
	    var start = this.strokePart.getStartingPoint();
	    var end = this.strokePart.getEndingPoint();
	    this.canvas.circle(10).attr({ fill: '#9F9' }).move(start.getX(), start.getY());
	    this.canvas.circle(10).attr({ fill: '#9F9' }).move(end.getX(), end.getY());
	  };

	  StrokePartRenderer.prototype.draw = function draw() {
	    _PathRenderer.prototype.draw.call(this);
	    this.path.attr(this.getStrokeAttrs()).attr({ opacity: 0 });
	    return this;
	  };

	  StrokePartRenderer.prototype.show = function show(animation) {
	    var _this2 = this;

	    return new Promise(function (resolve, reject) {
	      var svgAnimation = _this2.path.animate(_this2.options.strokeAnimationDuration).opacity(1).after(resolve);
	      animation.registerSvgAnimation(svgAnimation);
	    });
	  };

	  StrokePartRenderer.prototype.hide = function hide(animation) {
	    var _this3 = this;

	    return new Promise(function (resolve, reject) {
	      var svgAnimation = _this3.path.animate(_this3.options.strokeAnimationDuration).opacity(0).after(resolve);
	      animation.registerSvgAnimation(svgAnimation);
	    });
	  };

	  StrokePartRenderer.prototype.hideImmediate = function hideImmediate() {
	    this.path.opacity(0);
	  };

	  StrokePartRenderer.prototype.showImmediate = function showImmediate() {
	    this.path.opacity(1);
	  };

	  StrokePartRenderer.prototype.animate = function animate(animation) {
	    var _this4 = this;

	    var start = this.strokePart.getStartingPoint();
	    if (!this.path) this.drawPath();
	    if (!this.mask) {
	      this.mask = this.canvas.circle(0).center(start.getX(), start.getY());
	      this.path.clipWith(this.mask);
	    }

	    this.mask.radius(0);
	    this.path.attr({ opacity: 1 }).attr(this.getStrokeAttrs());

	    return new Promise(function (resolve, reject) {
	      var svgAnimation = _this4.mask.animate(_this4.options.strokeAnimationDuration / _this4.stroke.getNumStrokeParts()).radius(_this4.strokePart.getLength()).after(resolve);

	      animation.registerSvgAnimation(svgAnimation);
	    });
	  };

	  StrokePartRenderer.prototype.destroy = function destroy() {
	    _PathRenderer.prototype.destroy.call(this);
	    if (this.mask) this.mask.remove();
	  };

	  StrokePartRenderer.prototype.getStrokeAttrs = function getStrokeAttrs() {
	    return {
	      fill: this.options.strokeColor,
	      stroke: this.options.strokeColor,
	      'stroke-width': this.options.strokeWidth
	    };
	  };

	  return StrokePartRenderer;
	})(_PathRenderer3.default);

	module.exports = StrokePartRenderer;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Renderer2 = __webpack_require__(2);

	var _Renderer3 = _interopRequireDefault(_Renderer2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PathRenderer = (function (_Renderer) {
	  _inherits(PathRenderer, _Renderer);

	  function PathRenderer() {
	    _classCallCheck(this, PathRenderer);

	    return _possibleConstructorReturn(this, _Renderer.apply(this, arguments));
	  }

	  PathRenderer.prototype.getPoints = function getPoints() {}; // overwrite in children

	  PathRenderer.prototype.getPathString = function getPathString() {
	    var points = this.getPoints();
	    var start = points[0];
	    var remainingPoints = points.slice(1);
	    var pathString = 'M ' + start.getX() + ' ' + start.getY();
	    for (var _iterator = remainingPoints, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var point = _ref;

	      pathString += ' L ' + point.getX() + ' ' + point.getY();
	    }
	    return pathString;
	  };

	  PathRenderer.prototype.drawPath = function drawPath() {
	    this.path = this.canvas.path(this.getPathString());
	    return this.path;
	  };

	  PathRenderer.prototype.draw = function draw() {
	    this.drawPath();
	    return this;
	  };

	  PathRenderer.prototype.destroy = function destroy() {
	    _Renderer.prototype.destroy.call(this);
	    if (this.path) this.path.remove();
	  };

	  return PathRenderer;
	})(_Renderer3.default);

	exports.default = PathRenderer;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.copyAndExtend = copyAndExtend;
	exports.inArray = inArray;
	exports.emptyFunc = emptyFunc;
	exports.arrayMax = arrayMax;
	exports.arrayMin = arrayMin;
	exports.getExtremes = getExtremes;
	exports.callIfExists = callIfExists;
	exports.average = average;
	exports.timeout = timeout;

	var _util = __webpack_require__(7);

	// TODO: recursive clone
	var clone = function clone(obj) {
	  return (0, _util._extend)({}, obj);
	};

	function copyAndExtend(original) {
	  var changes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var copy = clone(original);
	  (0, _util._extend)(copy, changes);
	  return copy;
	}

	function inArray(val, array) {
	  for (var _iterator = array, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	    var _ref;

	    if (_isArray) {
	      if (_i >= _iterator.length) break;
	      _ref = _iterator[_i++];
	    } else {
	      _i = _iterator.next();
	      if (_i.done) break;
	      _ref = _i.value;
	    }

	    var arrayVal = _ref;

	    if (val === arrayVal) return true;
	  }
	  return false;
	}

	function emptyFunc() {}

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
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (callback) callback.apply(undefined, args);
	}

	function average(arr) {
	  var sum = 0;
	  for (var _iterator2 = arr, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	    var _ref2;

	    if (_isArray2) {
	      if (_i2 >= _iterator2.length) break;
	      _ref2 = _iterator2[_i2++];
	    } else {
	      _i2 = _iterator2.next();
	      if (_i2.done) break;
	      _ref2 = _i2.value;
	    }

	    var val = _ref2;

	    sum += val;
	  }
	  return sum / arr.length;
	}

	function timeout() {
	  var duration = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	  return new Promise(function (resolve, reject) {
	    setTimeout(resolve, duration);
	  });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(9);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(10);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(8)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Renderer2 = __webpack_require__(2);

	var _Renderer3 = _interopRequireDefault(_Renderer2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PositionerRenderer = (function (_Renderer) {
	  _inherits(PositionerRenderer, _Renderer);

	  function PositionerRenderer(positioner) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, PositionerRenderer);

	    var _this = _possibleConstructorReturn(this, _Renderer.call(this));

	    _this.positioner = positioner;
	    _this.positonedCanvas = null;
	    return _this;
	  }

	  PositionerRenderer.prototype.getPositionedCanvas = function getPositionedCanvas() {
	    return this.positonedCanvas;
	  };

	  PositionerRenderer.prototype.setCanvas = function setCanvas(canvas) {
	    _Renderer.prototype.setCanvas.call(this, canvas);
	    this.positonedCanvas = this.canvas.group().move(this.positioner.getXOffset(), this.positioner.getYOffset()).transform({ scaleX: this.positioner.getScale(), scaleY: this.positioner.getScale() });
	    return this;
	  };

	  PositionerRenderer.prototype.destroy = function destroy() {
	    _Renderer.prototype.destroy.call(this);
	    this.positonedCanvas.remove();
	  };

	  return PositionerRenderer;
	})(_Renderer3.default);

	exports.default = PositionerRenderer;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Point = (function () {
	  function Point(x, y) {
	    _classCallCheck(this, Point);

	    this._x = parseInt(x, 10);
	    this._y = parseInt(y, 10);
	  }

	  Point.prototype.getX = function getX() {
	    return this._x;
	  };

	  Point.prototype.getY = function getY() {
	    return this._y;
	  };

	  // return a new point subtracting point from this

	  Point.prototype.subtract = function subtract(point) {
	    return new Point(this.getX() - point.getX(), this.getY() - point.getY());
	  };

	  Point.prototype.getMagnitude = function getMagnitude() {
	    return Math.sqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2));
	  };

	  Point.prototype.equals = function equals(point) {
	    if (!point) return false;
	    return point.getX() === this.getX() && point.getY() === this.getY();
	  };

	  return Point;
	})();

	Point.getBounds = function (points) {
	  var xs = points.map(function (point) {
	    return point.getX();
	  });
	  var ys = points.map(function (point) {
	    return point.getY();
	  });
	  var maxX = (0, _utils.arrayMax)(xs);
	  var maxY = (0, _utils.arrayMax)(ys);
	  var minX = (0, _utils.arrayMin)(xs);
	  var minY = (0, _utils.arrayMin)(ys);
	  return [new Point(minX, minY), new Point(maxX, maxY)];
	};

	// boundable here refers to any object with a getBounds() method
	Point.getOverallBounds = function (boundables) {
	  var bounds = [];
	  for (var _iterator = boundables, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	    var _ref;

	    if (_isArray) {
	      if (_i >= _iterator.length) break;
	      _ref = _iterator[_i++];
	    } else {
	      _i = _iterator.next();
	      if (_i.done) break;
	      _ref = _i.value;
	    }

	    var boundable = _ref;

	    var _boundable$getBounds = boundable.getBounds();

	    var lowerBound = _boundable$getBounds[0];
	    var upperBound = _boundable$getBounds[1];

	    bounds.push(lowerBound);
	    bounds.push(upperBound);
	  }
	  return Point.getBounds(bounds);
	};

	Point.getDistance = function (point1, point2) {
	  var difference = point1.subtract(point2);
	  return difference.getMagnitude();
	};

	Point.cosineSimilarity = function (point1, point2) {
	  var rawDotProduct = point1.getX() * point2.getX() + point1.getY() * point2.getY();
	  return rawDotProduct / point1.getMagnitude() / point2.getMagnitude();
	};

	exports.default = Point;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Point = __webpack_require__(12);

	var _Point2 = _interopRequireDefault(_Point);

	var _Stroke = __webpack_require__(14);

	var _Stroke2 = _interopRequireDefault(_Stroke);

	var _StrokePart = __webpack_require__(15);

	var _StrokePart2 = _interopRequireDefault(_StrokePart);

	var _Character = __webpack_require__(16);

	var _Character2 = _interopRequireDefault(_Character);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ZdtStrokeParser = (function () {
	  function ZdtStrokeParser() {
	    _classCallCheck(this, ZdtStrokeParser);
	  }

	  ZdtStrokeParser.prototype.generateCharacter = function generateCharacter(symbol, zdtPathStrings) {
	    var strokes = this.generateStrokes(zdtPathStrings);
	    return new _Character2.default(symbol, strokes);
	  };

	  ZdtStrokeParser.prototype.generateStrokes = function generateStrokes(zdtPathStrings) {
	    var strokes = [];
	    var strokeParts = [];
	    var strokeNum = 0;
	    for (var _iterator = zdtPathStrings, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var zdtPathString = _ref;

	      var _extractStrokeData2 = this._extractStrokeData(zdtPathString);

	      var points = _extractStrokeData2.points;
	      var isComplete = _extractStrokeData2.isComplete;
	      var strokeType = _extractStrokeData2.strokeType;

	      var strokePart = new _StrokePart2.default(strokeType, points);
	      strokeParts.push(strokePart);
	      if (isComplete) {
	        strokes.push(new _Stroke2.default(strokeParts, strokeNum));
	        strokeNum += 1;
	        strokeParts = [];
	      }
	    }
	    // for some single-stroke chars such as '乙' it appears the ZDT data lacks 'P' at the end of the stroke
	    if (strokeParts.length > 0) {
	      strokes.push(new _Stroke2.default(strokeParts, strokeNum));
	    }
	    return strokes;
	  };

	  ZdtStrokeParser.prototype._extractStrokeData = function _extractStrokeData(zdtPathString) {
	    var _this = this;

	    var _zdtPathString$split = zdtPathString.split(':');

	    var metadataString = _zdtPathString$split[0];
	    var rawPathString = _zdtPathString$split[1];

	    var pathString = rawPathString.replace(/;?\s*$/, '');
	    var points = pathString.split(';').map(function (pointString) {
	      return _this._parsePoint(pointString);
	    });
	    var isComplete = metadataString[2] === 'P';
	    var strokeType = parseInt(metadataString[1], 10);
	    return { points: points, isComplete: isComplete, strokeType: strokeType };
	  };

	  ZdtStrokeParser.prototype._parsePoint = function _parsePoint(pointString) {
	    var _pointString$split = pointString.split(',');

	    var x = _pointString$split[0];
	    var y = _pointString$split[1];

	    return new _Point2.default(x, y);
	  };

	  return ZdtStrokeParser;
	})();

	exports.default = ZdtStrokeParser;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Point = __webpack_require__(12);

	var _Point2 = _interopRequireDefault(_Point);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Stroke = (function () {
	  function Stroke(strokeParts, strokeNum) {
	    _classCallCheck(this, Stroke);

	    this._strokeParts = strokeParts;
	    this._strokeNum = strokeNum;
	  }

	  Stroke.prototype.getStrokeParts = function getStrokeParts() {
	    return this._strokeParts;
	  };

	  Stroke.prototype.getNumStrokeParts = function getNumStrokeParts() {
	    return this._strokeParts.length;
	  };

	  Stroke.prototype.getStrokeNum = function getStrokeNum() {
	    return this._strokeNum;
	  };

	  Stroke.prototype.getBounds = function getBounds() {
	    return _Point2.default.getOverallBounds(this._strokeParts);
	  };

	  Stroke.prototype.getLength = function getLength() {
	    return this._strokeParts.reduce(function (acc, part) {
	      return acc + part.getLength();
	    }, 0);
	  };

	  Stroke.prototype.getVectors = function getVectors() {
	    return this._strokeParts.map(function (strokePart) {
	      return strokePart.getVector();
	    });
	  };

	  Stroke.prototype.getStartingPoint = function getStartingPoint() {
	    return this._strokeParts[0].getStartingPoint();
	  };

	  Stroke.prototype.getEndingPoint = function getEndingPoint() {
	    return this._strokeParts[this._strokeParts.length - 1].getEndingPoint();
	  };

	  Stroke.prototype.getDistance = function getDistance(point) {
	    var distances = this._strokeParts.map(function (strokePart) {
	      return strokePart.getDistance(point);
	    });
	    return Math.min.apply(Math, distances);
	  };

	  Stroke.prototype.getAverageDistance = function getAverageDistance(points) {
	    var totalDist = 0;
	    for (var _iterator = points, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var point = _ref;

	      totalDist += this.getDistance(point);
	    }
	    return totalDist / points.length;
	  };

	  return Stroke;
	})();

	exports.default = Stroke;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Point = __webpack_require__(12);

	var _Point2 = _interopRequireDefault(_Point);

	var _utils = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var StrokePart = (function () {
	  function StrokePart(strokeType, points) {
	    _classCallCheck(this, StrokePart);

	    this._strokeType = strokeType;
	    this._points = points;
	  }

	  StrokePart.prototype.getPoints = function getPoints() {
	    return this._points;
	  };

	  StrokePart.prototype.getStrokeType = function getStrokeType() {
	    return this._strokeType;
	  };

	  StrokePart.prototype.getBounds = function getBounds() {
	    return _Point2.default.getBounds(this._points);
	  };

	  StrokePart.prototype.getVector = function getVector() {
	    return this.getEndingPoint().subtract(this.getStartingPoint());
	  };

	  // http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points

	  StrokePart.prototype.getDistance = function getDistance(point) {
	    var start = this.getStartingPoint();
	    var end = this.getEndingPoint();
	    var dx = end.getX() - start.getX();
	    var dy = end.getY() - start.getY();
	    var length = this.getLength();
	    return Math.abs(dy * point.getX() - dx * point.getY() - start.getX() * end.getY() + start.getY() * end.getX()) / length;
	  };

	  StrokePart.prototype.getLength = function getLength() {
	    var start = this.getStartingPoint();
	    var end = this.getEndingPoint();
	    return _Point2.default.getDistance(start, end);
	  };

	  StrokePart.prototype.getStartingPoint = function getStartingPoint() {
	    return this._getExtremePoint(false);
	  };

	  StrokePart.prototype.getEndingPoint = function getEndingPoint() {
	    return this._getExtremePoint(true);
	  };

	  // where to start or end drawing the stroke based on the stroke type

	  StrokePart.prototype._getExtremePoint = function _getExtremePoint(isReverse) {
	    var strokeType = this.getStrokeType();
	    var points = this.getPoints();
	    var adjStrokeType = strokeType;
	    var adjIsReverse = isReverse;
	    var xs = points.map(function (point) {
	      return point.getX();
	    });
	    var ys = points.map(function (point) {
	      return point.getY();
	    });
	    var extremeXs = (0, _utils.getExtremes)(xs);
	    var extremeYs = (0, _utils.getExtremes)(ys);

	    // handle reversed strokes
	    if (strokeType > StrokePart.FORWARD_SLASH_STROKE) {
	      adjStrokeType = strokeType - StrokePart.FORWARD_SLASH_STROKE;
	      adjIsReverse = !isReverse;
	    }

	    var minIndex = adjIsReverse ? 0 : 2;
	    var maxIndex = adjIsReverse ? 2 : 0;
	    var midIndex = 1;

	    if (adjStrokeType === StrokePart.HORIZONTAL_STROKE) return new _Point2.default(extremeXs[minIndex], extremeYs[midIndex]);
	    if (adjStrokeType === StrokePart.BACK_SLASH_STROKE) return new _Point2.default(extremeXs[minIndex], extremeYs[minIndex]);
	    if (adjStrokeType === StrokePart.VERTICAL_STROKE) return new _Point2.default(extremeXs[midIndex], extremeYs[minIndex]);
	    if (adjStrokeType === StrokePart.FORWARD_SLASH_STROKE) return new _Point2.default(extremeXs[maxIndex], extremeYs[minIndex]);
	  };

	  return StrokePart;
	})();

	StrokePart.HORIZONTAL_STROKE = 1;
	StrokePart.BACK_SLASH_STROKE = 2;
	StrokePart.VERTICAL_STROKE = 3;
	StrokePart.FORWARD_SLASH_STROKE = 4;
	StrokePart.REVERSE_HORIZONTAL_STROKE = 5;
	StrokePart.REVERSE_BACK_SLASH_STROKE = 6;
	StrokePart.REVERSE_VERTICAL_STROKE = 7;
	StrokePart.REVERSE_FORWARD_SLASH_STROKE = 8;

	exports.default = StrokePart;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Point = __webpack_require__(12);

	var _Point2 = _interopRequireDefault(_Point);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Character = (function () {
	  function Character(symbol, strokes) {
	    _classCallCheck(this, Character);

	    this._symbol = symbol;
	    this._strokes = strokes;
	  }

	  Character.prototype.getSymbol = function getSymbol() {
	    return this._symbol;
	  };

	  Character.prototype.getStrokes = function getStrokes() {
	    return this._strokes;
	  };

	  Character.prototype.getStroke = function getStroke(strokeNum) {
	    return this._strokes[strokeNum];
	  };

	  Character.prototype.getNumStrokes = function getNumStrokes() {
	    return this._strokes.length;
	  };

	  Character.prototype.getBounds = function getBounds() {
	    return _Point2.default.getOverallBounds(this.getStrokes());
	  };

	  return Character;
	})();

	exports.default = Character;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Point = __webpack_require__(12);

	var _Point2 = _interopRequireDefault(_Point);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Positioner = (function () {
	  function Positioner(character, options) {
	    _classCallCheck(this, Positioner);

	    this._character = character;
	    this._options = options;
	    this._calculateScaleAndOffset();
	  }

	  Positioner.prototype.convertExternalPoint = function convertExternalPoint(point) {
	    var x = (point.getX() - this._xOffset) / this._scale;
	    var y = (point.getY() - this._yOffset) / this._scale;
	    return new _Point2.default(x, y);
	  };

	  Positioner.prototype.getXOffset = function getXOffset() {
	    return this._xOffset;
	  };

	  Positioner.prototype.getYOffset = function getYOffset() {
	    return this._yOffset;
	  };

	  Positioner.prototype.getScale = function getScale() {
	    return this._scale;
	  };

	  Positioner.prototype._calculateScaleAndOffset = function _calculateScaleAndOffset() {
	    var bounds = this._character.getBounds();
	    var preScaledWidth = bounds[1].getX() - bounds[0].getX();
	    var preScaledHeight = bounds[1].getY() - bounds[0].getY();
	    var effectiveWidth = this._options.width - 2 * this._options.padding;
	    var effectiveHeight = this._options.height - 2 * this._options.padding;
	    var scaleX = effectiveWidth / preScaledWidth;
	    var scaleY = effectiveHeight / preScaledHeight;

	    this._scale = Math.min(scaleX, scaleY);

	    var xCenteringBuffer = this._options.padding + (effectiveWidth - this._scale * preScaledWidth) / 2;
	    var yCenteringBuffer = this._options.padding + (effectiveHeight - this._scale * preScaledHeight) / 2;
	    this._xOffset = -1 * bounds[0].getX() * this._scale + xCenteringBuffer;
	    this._yOffset = -1 * bounds[0].getY() * this._scale + yCenteringBuffer;
	  };

	  return Positioner;
	})();

	exports.default = Positioner;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _StrokeMatcher = __webpack_require__(19);

	var _StrokeMatcher2 = _interopRequireDefault(_StrokeMatcher);

	var _UserStroke = __webpack_require__(20);

	var _UserStroke2 = _interopRequireDefault(_UserStroke);

	var _UserStrokeRenderer = __webpack_require__(21);

	var _UserStrokeRenderer2 = _interopRequireDefault(_UserStrokeRenderer);

	var _utils = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Quiz = (function () {
	  // TODO: too many dependencies... do something about this

	  function Quiz(_ref) {
	    var canvas = _ref.canvas;
	    var animator = _ref.animator;
	    var character = _ref.character;
	    var characterRenderer = _ref.characterRenderer;
	    var highlightRenderer = _ref.highlightRenderer;
	    var quizOptions = _ref.quizOptions;
	    var userStrokeOptions = _ref.userStrokeOptions;

	    _classCallCheck(this, Quiz);

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
	    this._strokeMatcher = new _StrokeMatcher2.default();

	    this._setupCharacter();
	  }

	  Quiz.prototype.startUserStroke = function startUserStroke(point) {
	    if (!this._isActive) return null;
	    if (this._userStroke) return this.endUserStroke();
	    this._userStroke = new _UserStroke2.default(point);
	    this._userStrokeRenderer = new _UserStrokeRenderer2.default(this._userStroke, this._userStrokeOptions);
	    this._userStrokeRenderer.setCanvas(this._canvas).draw();
	  };

	  Quiz.prototype.continueUserStroke = function continueUserStroke(point) {
	    if (!this._userStroke) return;
	    this._userStroke.appendPoint(point);
	    this._userStrokeRenderer.updatePath();
	  };

	  Quiz.prototype.endUserStroke = function endUserStroke() {
	    var _this = this;

	    if (!this._userStroke) return Promise.resolve();

	    this._animator.animate(function (animation) {
	      var promises = [];
	      var matchingStroke = _this._strokeMatcher.getMatchingStroke(_this._userStroke, _this._character.getStrokes());
	      promises.push(_this._userStrokeRenderer.fadeAndRemove(animation));
	      _this._userStroke = null;
	      _this._userStrokeRenderer = null;
	      if (!_this._isActive) return Promise.resolve();

	      if (_this._isValidStroke(matchingStroke)) {
	        _this._handleSuccess(matchingStroke, animation);
	      } else {
	        _this._handleFailure();
	        if (_this._numRecentMistakes >= _this._quizOptions.showHintAfterMisses) {
	          promises.push(_this._highlightCorrectStroke(animation));
	        }
	      }
	      return Promise.all(promises);
	    });
	  };

	  Quiz.prototype.cancel = function cancel() {
	    this._isActive = false;
	  };

	  Quiz.prototype._handleSuccess = function _handleSuccess(stroke, animation) {
	    var _this2 = this;

	    (0, _utils.callIfExists)(this._quizOptions.onCorrectStroke, {
	      character: this._character.getSymbol(),
	      strokeNum: this._currentStrokeIndex,
	      mistakesOnStroke: this._numRecentMistakes,
	      totalMistakes: this._totalMistakes,
	      strokesRemaining: this._character.getNumStrokes() - this._currentStrokeIndex - 1
	    });
	    this._currentStrokeIndex += 1;
	    this._numRecentMistakes = 0;
	    var promise = this._drawMatchingStroke(stroke, animation);
	    if (this._currentStrokeIndex === this._character.getNumStrokes()) {
	      (0, _utils.callIfExists)(this._quizOptions.onComplete, {
	        character: this._character.getSymbol(),
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

	  Quiz.prototype._handleFailure = function _handleFailure() {
	    this._numRecentMistakes += 1;
	    this._totalMistakes += 1;
	    (0, _utils.callIfExists)(this._quizOptions.onMistake, {
	      character: this._character.getSymbol(),
	      strokeNum: this._currentStrokeIndex,
	      mistakesOnStroke: this._numRecentMistakes,
	      totalMistakes: this._totalMistakes,
	      strokesRemaining: this._character.getNumStrokes() - this._currentStrokeIndex
	    });
	  };

	  Quiz.prototype._highlightCorrectStroke = function _highlightCorrectStroke(animation) {
	    var strokeHintRenderer = this._highlightRenderer.getStrokeRenderer(this._currentStrokeIndex);
	    return strokeHintRenderer.highlight(animation);
	  };

	  Quiz.prototype._drawMatchingStroke = function _drawMatchingStroke(stroke, animation) {
	    this._drawnStrokes.push(stroke);
	    return this._characterRenderer.showStroke(stroke.getStrokeNum(), animation);
	  };

	  Quiz.prototype._isValidStroke = function _isValidStroke(stroke) {
	    if (!stroke) return false;
	    if ((0, _utils.inArray)(stroke, this._drawnStrokes)) return false;
	    return stroke === this._character.getStroke(this._currentStrokeIndex);
	  };

	  // hide the caracter

	  Quiz.prototype._setupCharacter = function _setupCharacter() {
	    var _this3 = this;

	    this._animator.animate(function (animation) {
	      return _this3._characterRenderer.hide(animation);
	    });
	  };

	  return Quiz;
	})();

	exports.default = Quiz;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Point = __webpack_require__(12);

	var _Point2 = _interopRequireDefault(_Point);

	var _utils = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AVG_DIST_THRESHOLD = 50; // bigger = more lenient
	var LENGTH_RATIO_THRESHOLD = 0.5; // 0 to 1, bigger = more lenient
	var COSINE_SIMILARITY_THRESHOLD = 0; // -1 to 1, smaller = more lenient
	var START_AND_END_DIST_THRESHOLD = 100; // bigger = more lenient

	var StrokeMatcher = (function () {
	  function StrokeMatcher() {
	    _classCallCheck(this, StrokeMatcher);
	  }

	  StrokeMatcher.prototype.getMatchingStroke = function getMatchingStroke(userStroke, strokes) {
	    var points = this._stripDuplicates(userStroke.getPoints());
	    if (points.length < 2) return null;

	    var closestStroke = null;
	    var bestAvgDist = 0;
	    for (var _iterator = strokes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var stroke = _ref;

	      var avgDist = stroke.getAverageDistance(points);
	      if (avgDist < bestAvgDist || !closestStroke) {
	        closestStroke = stroke;
	        bestAvgDist = avgDist;
	      }
	    }

	    var withinDistThresh = bestAvgDist < AVG_DIST_THRESHOLD;
	    var lengthRatio = this._getLength(points) / closestStroke.getLength();
	    var withinLengthThresh = lengthRatio > 1 - LENGTH_RATIO_THRESHOLD && lengthRatio < 1 + LENGTH_RATIO_THRESHOLD;
	    var startAndEndMatch = this._startAndEndMatches(points, closestStroke);
	    var directionMatches = this._directionMatches(points, closestStroke);
	    if (withinDistThresh && withinLengthThresh && startAndEndMatch && directionMatches) {
	      return closestStroke;
	    }
	    return null;
	  };

	  StrokeMatcher.prototype._startAndEndMatches = function _startAndEndMatches(points, closestStroke) {
	    var startingDist = _Point2.default.getDistance(closestStroke.getStartingPoint(), points[0]);
	    var endingDist = _Point2.default.getDistance(closestStroke.getEndingPoint(), points[points.length - 1]);
	    return startingDist < START_AND_END_DIST_THRESHOLD && endingDist < START_AND_END_DIST_THRESHOLD;
	  };

	  StrokeMatcher.prototype._directionMatches = function _directionMatches(points, stroke) {
	    var edgeVectors = this._getEdgeVectors(points);
	    var strokeVectors = stroke.getVectors();
	    var similarities = [];

	    var _loop = function _loop() {
	      if (_isArray2) {
	        if (_i2 >= _iterator2.length) return 'break';
	        _ref2 = _iterator2[_i2++];
	      } else {
	        _i2 = _iterator2.next();
	        if (_i2.done) return 'break';
	        _ref2 = _i2.value;
	      }

	      var edgeVector = _ref2;

	      var strokeSimilarities = strokeVectors.map(function (strokeVector) {
	        return _Point2.default.cosineSimilarity(strokeVector, edgeVector);
	      });
	      var maxSimilarity = Math.max.apply(Math, strokeSimilarities);
	      similarities.push(maxSimilarity);
	    };

	    for (var _iterator2 = edgeVectors, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	      var _ref2;

	      var _ret = _loop();

	      if (_ret === 'break') break;
	    }
	    var avgSimilarity = (0, _utils.average)(similarities);
	    return avgSimilarity > COSINE_SIMILARITY_THRESHOLD;
	  };

	  StrokeMatcher.prototype._stripDuplicates = function _stripDuplicates(points) {
	    if (points.length < 2) return points;
	    var dedupedPoints = [points[0]];
	    for (var _iterator3 = points.slice(1), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
	      var _ref3;

	      if (_isArray3) {
	        if (_i3 >= _iterator3.length) break;
	        _ref3 = _iterator3[_i3++];
	      } else {
	        _i3 = _iterator3.next();
	        if (_i3.done) break;
	        _ref3 = _i3.value;
	      }

	      var point = _ref3;

	      if (!point.equals(dedupedPoints[dedupedPoints.length - 1])) {
	        dedupedPoints.push(point);
	      }
	    }
	    return dedupedPoints;
	  };

	  StrokeMatcher.prototype._getLength = function _getLength(points) {
	    var length = 0;
	    var lastPoint = points[0];
	    for (var _iterator4 = points, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
	      var _ref4;

	      if (_isArray4) {
	        if (_i4 >= _iterator4.length) break;
	        _ref4 = _iterator4[_i4++];
	      } else {
	        _i4 = _iterator4.next();
	        if (_i4.done) break;
	        _ref4 = _i4.value;
	      }

	      var point = _ref4;

	      length += _Point2.default.getDistance(point, lastPoint);
	      lastPoint = point;
	    }
	    return length;
	  };

	  // returns a list of the direction of all segments in the line connecting the points

	  StrokeMatcher.prototype._getEdgeVectors = function _getEdgeVectors(points) {
	    var vectors = [];
	    var lastPoint = points[0];
	    for (var _iterator5 = points.slice(1), _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
	      var _ref5;

	      if (_isArray5) {
	        if (_i5 >= _iterator5.length) break;
	        _ref5 = _iterator5[_i5++];
	      } else {
	        _i5 = _iterator5.next();
	        if (_i5.done) break;
	        _ref5 = _i5.value;
	      }

	      var point = _ref5;

	      vectors.push(point.subtract(lastPoint));
	    }
	    return vectors;
	  };

	  return StrokeMatcher;
	})();

	exports.default = StrokeMatcher;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Point = __webpack_require__(12);

	var _Point2 = _interopRequireDefault(_Point);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UserStroke = (function () {
	  function UserStroke(startingPoint) {
	    _classCallCheck(this, UserStroke);

	    this._points = [startingPoint];
	  }

	  UserStroke.prototype.getPoints = function getPoints() {
	    return this._points;
	  };

	  UserStroke.prototype.getBounds = function getBounds() {
	    return _Point2.default.getBounds(this._points);
	  };

	  UserStroke.prototype.appendPoint = function appendPoint(point) {
	    this._points.push(point);
	  };

	  return UserStroke;
	})();

	exports.default = UserStroke;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _PathRenderer2 = __webpack_require__(5);

	var _PathRenderer3 = _interopRequireDefault(_PathRenderer2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var UserStrokeRenderer = (function (_PathRenderer) {
	  _inherits(UserStrokeRenderer, _PathRenderer);

	  function UserStrokeRenderer(userStroke) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, UserStrokeRenderer);

	    var _this = _possibleConstructorReturn(this, _PathRenderer.call(this));

	    _this.options = options;
	    _this.userStroke = userStroke;
	    return _this;
	  }

	  UserStrokeRenderer.prototype.getPoints = function getPoints() {
	    return this.userStroke.getPoints();
	  };

	  UserStrokeRenderer.prototype.updatePath = function updatePath() {
	    this.path.plot(this.getPathString());
	  };

	  UserStrokeRenderer.prototype.draw = function draw() {
	    _PathRenderer.prototype.draw.call(this);
	    this.path.attr(this.getStrokeAttrs());
	    return this;
	  };

	  UserStrokeRenderer.prototype.fadeAndRemove = function fadeAndRemove(animation) {
	    var _this2 = this;

	    return new Promise(function (resolve, reject) {
	      var svgAnimation = _this2.path.animate(_this2.options.fadeDuration).attr({ opacity: 0 }).after(resolve);
	      animation.registerSvgAnimation(svgAnimation);
	    }).then(function () {
	      return _this2.destroy();
	    });
	  };

	  UserStrokeRenderer.prototype.getStrokeAttrs = function getStrokeAttrs() {
	    return {
	      fill: 'none',
	      stroke: this.options.strokeColor,
	      'stroke-width': this.options.strokeWidth
	    };
	  };

	  return UserStrokeRenderer;
	})(_PathRenderer3.default);

	exports.default = UserStrokeRenderer;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports.default = function (char, onLoad) {
	  // load char data from hanziwriter.org cdn (currently hosted on github pages)
	  var xhr = new XMLHttpRequest();
	  if (xhr.overrideMimeType) {
	    // IE 9 and 10 don't seem to support this...
	    xhr.overrideMimeType('application/json');
	  }
	  xhr.open('GET', getCharDataUrl(char), true);
	  xhr.onreadystatechange = function () {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	      onLoad(JSON.parse(xhr.responseText));
	    }
	  };
	  xhr.send(null);
	};

	// corresponds to the integer in the gh-pages branch under the cdn folder
	// make sure to check out a new version of the master branch in gh-pages when changing the data format
	// otherwise this may break any existing hanzi-writer deploys in the wild
	var DATA_VERSION = 1;
	var getCharDataUrl = function getCharDataUrl(char) {
	  return 'http://chanind.github.io/hanzi-writer/cdn/' + DATA_VERSION + '/data/' + char + '.json';
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Animation = __webpack_require__(24);

	var _Animation2 = _interopRequireDefault(_Animation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Animator = (function () {
	  function Animator() {
	    _classCallCheck(this, Animator);
	  }

	  Animator.prototype.construct = function construct() {
	    this._lastAnimation = null;
	  };

	  Animator.prototype.animate = function animate(func) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var animation = this._setupAnimation(options);
	    func(animation).then(function () {
	      return animation.finish();
	    });
	  };

	  Animator.prototype._setupAnimation = function _setupAnimation(options) {
	    if (this._lastAnimation) this._lastAnimation.cancel();
	    this._lastAnimation = new _Animation2.default(options);
	    return this._lastAnimation;
	  };

	  return Animator;
	})();

	exports.default = Animator;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Animation = (function () {
	  function Animation() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, Animation);

	    this._svgAnimations = [];
	    this._isActive = true;
	    this._callback = options.onComplete;
	  }

	  Animation.prototype.cancel = function cancel() {
	    if (!this.isActive()) return;

	    this._isActive = false;
	    for (var _iterator = this._svgAnimations, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var svgAnimation = _ref;

	      svgAnimation.stop(true);
	    }
	  };

	  Animation.prototype.registerSvgAnimation = function registerSvgAnimation(svgAnimation) {
	    this._svgAnimations.push(svgAnimation);
	  };

	  Animation.prototype.isActive = function isActive() {
	    return this._isActive;
	  };

	  Animation.prototype.finish = function finish() {
	    if (this.isActive()) {
	      this._isActive = false;
	      (0, _utils.callIfExists)(this._callback);
	    }
	  };

	  return Animation;
	})();

	exports.default = Animation;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	* svg.js - A lightweight library for manipulating and animating SVG.
	* @version 2.2.4
	* http://www.svgjs.com
	*
	* @copyright Wout Fierens <wout@impinc.co.uk>
	* @license MIT
	*
	* BUILT: Tue Dec 29 2015 13:14:32 GMT+0100 (Mitteleuropäische Zeit)
	*/;
	(function(root, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(){
	      return factory(root, root.document)
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  } else if (typeof exports === 'object') {
	    module.exports = root.document ? factory(root, root.document) : function(w){ return factory(w, w.document) }
	  } else {
	    root.SVG = factory(root, root.document)
	  }
	}(typeof window !== "undefined" ? window : this, function(window, document) {

	// The main wrapping element
	var SVG = this.SVG = function(element) {
	  if (SVG.supported) {
	    element = new SVG.Doc(element)

	    if (!SVG.parser)
	      SVG.prepare(element)

	    return element
	  }
	}

	// Default namespaces
	SVG.ns    = 'http://www.w3.org/2000/svg'
	SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
	SVG.xlink = 'http://www.w3.org/1999/xlink'
	SVG.svgjs = 'http://svgjs.com/svgjs'

	// Svg support test
	SVG.supported = (function() {
	  return !! document.createElementNS &&
	         !! document.createElementNS(SVG.ns,'svg').createSVGRect
	})()

	// Don't bother to continue if SVG is not supported
	if (!SVG.supported) return false

	// Element id sequence
	SVG.did  = 1000

	// Get next named element id
	SVG.eid = function(name) {
	  return 'Svgjs' + capitalize(name) + (SVG.did++)
	}

	// Method for element creation
	SVG.create = function(name) {
	  // create element
	  var element = document.createElementNS(this.ns, name)

	  // apply unique id
	  element.setAttribute('id', this.eid(name))

	  return element
	}

	// Method for extending objects
	SVG.extend = function() {
	  var modules, methods, key, i

	  // Get list of modules
	  modules = [].slice.call(arguments)

	  // Get object with extensions
	  methods = modules.pop()

	  for (i = modules.length - 1; i >= 0; i--)
	    if (modules[i])
	      for (key in methods)
	        modules[i].prototype[key] = methods[key]

	  // Make sure SVG.Set inherits any newly added methods
	  if (SVG.Set && SVG.Set.inherit)
	    SVG.Set.inherit()
	}

	// Invent new element
	SVG.invent = function(config) {
	  // Create element initializer
	  var initializer = typeof config.create == 'function' ?
	    config.create :
	    function() {
	      this.constructor.call(this, SVG.create(config.create))
	    }

	  // Inherit prototype
	  if (config.inherit)
	    initializer.prototype = new config.inherit

	  // Extend with methods
	  if (config.extend)
	    SVG.extend(initializer, config.extend)

	  // Attach construct method to parent
	  if (config.construct)
	    SVG.extend(config.parent || SVG.Container, config.construct)

	  return initializer
	}

	// Adopt existing svg elements
	SVG.adopt = function(node) {
	  // check for presence of node
	  if (!node) return null

	  // make sure a node isn't already adopted
	  if (node.instance) return node.instance

	  // initialize variables
	  var element

	  // adopt with element-specific settings
	  if (node.nodeName == 'svg')
	    element = node.parentNode instanceof SVGElement ? new SVG.Nested : new SVG.Doc
	  else if (node.nodeName == 'linearGradient')
	    element = new SVG.Gradient('linear')
	  else if (node.nodeName == 'radialGradient')
	    element = new SVG.Gradient('radial')
	  else if (SVG[capitalize(node.nodeName)])
	    element = new SVG[capitalize(node.nodeName)]
	  else
	    element = new SVG.Element(node)

	  // ensure references
	  element.type  = node.nodeName
	  element.node  = node
	  node.instance = element

	  // SVG.Class specific preparations
	  if (element instanceof SVG.Doc)
	    element.namespace().defs()

	  // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
	  element.setData(JSON.parse(node.getAttribute('svgjs:data')) || {})

	  return element
	}

	// Initialize parsing element
	SVG.prepare = function(element) {
	  // Select document body and create invisible svg element
	  var body = document.getElementsByTagName('body')[0]
	    , draw = (body ? new SVG.Doc(body) : element.nested()).size(2, 0)
	    , path = SVG.create('path')

	  // Insert parsers
	  draw.node.appendChild(path)

	  // Create parser object
	  SVG.parser = {
	    body: body || element.parent()
	  , draw: draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden')
	  , poly: draw.polyline().node
	  , path: path
	  }
	}

	// Storage for regular expressions
	SVG.regex = {
	  // Parse unit value
	  unit:             /^(-?[\d\.]+)([a-z%]{0,2})$/

	  // Parse hex value
	, hex:              /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

	  // Parse rgb value
	, rgb:              /rgb\((\d+),(\d+),(\d+)\)/

	  // Parse reference id
	, reference:        /#([a-z0-9\-_]+)/i

	  // Parse matrix wrapper
	, matrix:           /matrix\(|\)/g

	  // Elements of a matrix
	, matrixElements:   /,*\s+|,/

	  // Whitespace
	, whitespace:       /\s/g

	  // Test hex value
	, isHex:            /^#[a-f0-9]{3,6}$/i

	  // Test rgb value
	, isRgb:            /^rgb\(/

	  // Test css declaration
	, isCss:            /[^:]+:[^;]+;?/

	  // Test for blank string
	, isBlank:          /^(\s+)?$/

	  // Test for numeric string
	, isNumber:         /^-?[\d\.]+$/

	  // Test for percent value
	, isPercent:        /^-?[\d\.]+%$/

	  // Test for image url
	, isImage:          /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

	  // The following regex are used to parse the d attribute of a path

	  // Replaces all negative exponents
	, negExp:           /e\-/gi

	  // Replaces all comma
	, comma:            /,/g

	  // Replaces all hyphens
	, hyphen:           /\-/g

	  // Replaces and tests for all path letters
	, pathLetters:      /[MLHVCSQTAZ]/gi

	  // yes we need this one, too
	, isPathLetter:     /[MLHVCSQTAZ]/i

	  // split at whitespaces
	, whitespaces:      /\s+/

	  // matches X
	, X:                /X/g
	}
	SVG.utils = {
	    // Map function
	    map: function(array, block) {
	    var i
	      , il = array.length
	      , result = []

	    for (i = 0; i < il; i++)
	      result.push(block(array[i]))

	    return result
	  }

	  // Degrees to radians
	, radians: function(d) {
	    return d % 360 * Math.PI / 180
	  }
	  // Radians to degrees
	, degrees: function(r) {
	    return r * 180 / Math.PI % 360
	  }
	, filterSVGElements: function(p) {
	    return [].filter.call(p, function(el){ return el instanceof SVGElement })
	  }

	}

	SVG.defaults = {
	  // Default attribute values
	  attrs: {
	    // fill and stroke
	    'fill-opacity':     1
	  , 'stroke-opacity':   1
	  , 'stroke-width':     0
	  , 'stroke-linejoin':  'miter'
	  , 'stroke-linecap':   'butt'
	  , fill:               '#000000'
	  , stroke:             '#000000'
	  , opacity:            1
	    // position
	  , x:                  0
	  , y:                  0
	  , cx:                 0
	  , cy:                 0
	    // size
	  , width:              0
	  , height:             0
	    // radius
	  , r:                  0
	  , rx:                 0
	  , ry:                 0
	    // gradient
	  , offset:             0
	  , 'stop-opacity':     1
	  , 'stop-color':       '#000000'
	    // text
	  , 'font-size':        16
	  , 'font-family':      'Helvetica, Arial, sans-serif'
	  , 'text-anchor':      'start'
	  }

	}
	// Module for color convertions
	SVG.Color = function(color) {
	  var match

	  // initialize defaults
	  this.r = 0
	  this.g = 0
	  this.b = 0

	  // parse color
	  if (typeof color === 'string') {
	    if (SVG.regex.isRgb.test(color)) {
	      // get rgb values
	      match = SVG.regex.rgb.exec(color.replace(/\s/g,''))

	      // parse numeric values
	      this.r = parseInt(match[1])
	      this.g = parseInt(match[2])
	      this.b = parseInt(match[3])

	    } else if (SVG.regex.isHex.test(color)) {
	      // get hex values
	      match = SVG.regex.hex.exec(fullHex(color))

	      // parse numeric values
	      this.r = parseInt(match[1], 16)
	      this.g = parseInt(match[2], 16)
	      this.b = parseInt(match[3], 16)

	    }

	  } else if (typeof color === 'object') {
	    this.r = color.r
	    this.g = color.g
	    this.b = color.b

	  }

	}

	SVG.extend(SVG.Color, {
	  // Default to hex conversion
	  toString: function() {
	    return this.toHex()
	  }
	  // Build hex value
	, toHex: function() {
	    return '#'
	      + compToHex(this.r)
	      + compToHex(this.g)
	      + compToHex(this.b)
	  }
	  // Build rgb value
	, toRgb: function() {
	    return 'rgb(' + [this.r, this.g, this.b].join() + ')'
	  }
	  // Calculate true brightness
	, brightness: function() {
	    return (this.r / 255 * 0.30)
	         + (this.g / 255 * 0.59)
	         + (this.b / 255 * 0.11)
	  }
	  // Make color morphable
	, morph: function(color) {
	    this.destination = new SVG.Color(color)

	    return this
	  }
	  // Get morphed color at given position
	, at: function(pos) {
	    // make sure a destination is defined
	    if (!this.destination) return this

	    // normalise pos
	    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

	    // generate morphed color
	    return new SVG.Color({
	      r: ~~(this.r + (this.destination.r - this.r) * pos)
	    , g: ~~(this.g + (this.destination.g - this.g) * pos)
	    , b: ~~(this.b + (this.destination.b - this.b) * pos)
	    })
	  }

	})

	// Testers

	// Test if given value is a color string
	SVG.Color.test = function(color) {
	  color += ''
	  return SVG.regex.isHex.test(color)
	      || SVG.regex.isRgb.test(color)
	}

	// Test if given value is a rgb object
	SVG.Color.isRgb = function(color) {
	  return color && typeof color.r == 'number'
	               && typeof color.g == 'number'
	               && typeof color.b == 'number'
	}

	// Test if given value is a color
	SVG.Color.isColor = function(color) {
	  return SVG.Color.isRgb(color) || SVG.Color.test(color)
	}
	// Module for array conversion
	SVG.Array = function(array, fallback) {
	  array = (array || []).valueOf()

	  // if array is empty and fallback is provided, use fallback
	  if (array.length == 0 && fallback)
	    array = fallback.valueOf()

	  // parse array
	  this.value = this.parse(array)
	}

	SVG.extend(SVG.Array, {
	  // Make array morphable
	  morph: function(array) {
	    this.destination = this.parse(array)

	    // normalize length of arrays
	    if (this.value.length != this.destination.length) {
	      var lastValue       = this.value[this.value.length - 1]
	        , lastDestination = this.destination[this.destination.length - 1]

	      while(this.value.length > this.destination.length)
	        this.destination.push(lastDestination)
	      while(this.value.length < this.destination.length)
	        this.value.push(lastValue)
	    }

	    return this
	  }
	  // Clean up any duplicate points
	, settle: function() {
	    // find all unique values
	    for (var i = 0, il = this.value.length, seen = []; i < il; i++)
	      if (seen.indexOf(this.value[i]) == -1)
	        seen.push(this.value[i])

	    // set new value
	    return this.value = seen
	  }
	  // Get morphed array at given position
	, at: function(pos) {
	    // make sure a destination is defined
	    if (!this.destination) return this

	    // generate morphed array
	    for (var i = 0, il = this.value.length, array = []; i < il; i++)
	      array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)

	    return new SVG.Array(array)
	  }
	  // Convert array to string
	, toString: function() {
	    return this.value.join(' ')
	  }
	  // Real value
	, valueOf: function() {
	    return this.value
	  }
	  // Parse whitespace separated string
	, parse: function(array) {
	    array = array.valueOf()

	    // if already is an array, no need to parse it
	    if (Array.isArray(array)) return array

	    return this.split(array)
	  }
	  // Strip unnecessary whitespace
	, split: function(string) {
	    return string.trim().split(/\s+/)
	  }
	  // Reverse array
	, reverse: function() {
	    this.value.reverse()

	    return this
	  }

	})
	// Poly points array
	SVG.PointArray = function(array, fallback) {
	  this.constructor.call(this, array, fallback || [[0,0]])
	}

	// Inherit from SVG.Array
	SVG.PointArray.prototype = new SVG.Array

	SVG.extend(SVG.PointArray, {
	  // Convert array to string
	  toString: function() {
	    // convert to a poly point string
	    for (var i = 0, il = this.value.length, array = []; i < il; i++)
	      array.push(this.value[i].join(','))

	    return array.join(' ')
	  }
	  // Convert array to line object
	, toLine: function() {
	    return {
	      x1: this.value[0][0]
	    , y1: this.value[0][1]
	    , x2: this.value[1][0]
	    , y2: this.value[1][1]
	    }
	  }
	  // Get morphed array at given position
	, at: function(pos) {
	    // make sure a destination is defined
	    if (!this.destination) return this

	    // generate morphed point string
	    for (var i = 0, il = this.value.length, array = []; i < il; i++)
	      array.push([
	        this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
	      , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
	      ])

	    return new SVG.PointArray(array)
	  }
	  // Parse point string
	, parse: function(array) {
	    array = array.valueOf()

	    // if already is an array, no need to parse it
	    if (Array.isArray(array)) return array

	    // split points
	    array = this.split(array)

	    // parse points
	    for (var i = 0, il = array.length, p, points = []; i < il; i++) {
	      p = array[i].split(',')
	      points.push([parseFloat(p[0]), parseFloat(p[1])])
	    }

	    return points
	  }
	  // Move point string
	, move: function(x, y) {
	    var box = this.bbox()

	    // get relative offset
	    x -= box.x
	    y -= box.y

	    // move every point
	    if (!isNaN(x) && !isNaN(y))
	      for (var i = this.value.length - 1; i >= 0; i--)
	        this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]

	    return this
	  }
	  // Resize poly string
	, size: function(width, height) {
	    var i, box = this.bbox()

	    // recalculate position of all points according to new size
	    for (i = this.value.length - 1; i >= 0; i--) {
	      this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
	      this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
	    }

	    return this
	  }
	  // Get bounding box of points
	, bbox: function() {
	    SVG.parser.poly.setAttribute('points', this.toString())

	    return SVG.parser.poly.getBBox()
	  }

	})
	// Path points array
	SVG.PathArray = function(array, fallback) {
	  this.constructor.call(this, array, fallback || [['M', 0, 0]])
	}

	// Inherit from SVG.Array
	SVG.PathArray.prototype = new SVG.Array

	SVG.extend(SVG.PathArray, {
	  // Convert array to string
	  toString: function() {
	    return arrayToString(this.value)
	  }
	  // Move path string
	, move: function(x, y) {
	    // get bounding box of current situation
	    var box = this.bbox()

	    // get relative offset
	    x -= box.x
	    y -= box.y

	    if (!isNaN(x) && !isNaN(y)) {
	      // move every point
	      for (var l, i = this.value.length - 1; i >= 0; i--) {
	        l = this.value[i][0]

	        if (l == 'M' || l == 'L' || l == 'T')  {
	          this.value[i][1] += x
	          this.value[i][2] += y

	        } else if (l == 'H')  {
	          this.value[i][1] += x

	        } else if (l == 'V')  {
	          this.value[i][1] += y

	        } else if (l == 'C' || l == 'S' || l == 'Q')  {
	          this.value[i][1] += x
	          this.value[i][2] += y
	          this.value[i][3] += x
	          this.value[i][4] += y

	          if (l == 'C')  {
	            this.value[i][5] += x
	            this.value[i][6] += y
	          }

	        } else if (l == 'A')  {
	          this.value[i][6] += x
	          this.value[i][7] += y
	        }

	      }
	    }

	    return this
	  }
	  // Resize path string
	, size: function(width, height) {
	    // get bounding box of current situation
	    var i, l, box = this.bbox()

	    // recalculate position of all points according to new size
	    for (i = this.value.length - 1; i >= 0; i--) {
	      l = this.value[i][0]

	      if (l == 'M' || l == 'L' || l == 'T')  {
	        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
	        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y

	      } else if (l == 'H')  {
	        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x

	      } else if (l == 'V')  {
	        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y

	      } else if (l == 'C' || l == 'S' || l == 'Q')  {
	        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
	        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
	        this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x
	        this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y

	        if (l == 'C')  {
	          this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x
	          this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
	        }

	      } else if (l == 'A')  {
	        // resize radii
	        this.value[i][1] = (this.value[i][1] * width)  / box.width
	        this.value[i][2] = (this.value[i][2] * height) / box.height

	        // move position values
	        this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
	        this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
	      }

	    }

	    return this
	  }
	  // Absolutize and parse path to array
	, parse: function(array) {
	    // if it's already a patharray, no need to parse it
	    if (array instanceof SVG.PathArray) return array.valueOf()

	    // prepare for parsing
	    var i, x0, y0, s, seg, arr
	      , x = 0
	      , y = 0
	      , paramCnt = { 'M':2, 'L':2, 'H':1, 'V':1, 'C':6, 'S':4, 'Q':4, 'T':2, 'A':7 }

	    if(typeof array == 'string'){

	      array = array
	        .replace(SVG.regex.negExp, 'X')         // replace all negative exponents with certain char
	        .replace(SVG.regex.pathLetters, ' $& ') // put some room between letters and numbers
	        .replace(SVG.regex.hyphen, ' -')        // add space before hyphen
	        .replace(SVG.regex.comma, ' ')          // unify all spaces
	        .replace(SVG.regex.X, 'e-')             // add back the expoent
	        .trim()                                 // trim
	        .split(SVG.regex.whitespaces)           // split into array

	      // at this place there could be parts like ['3.124.854.32'] because we could not determine the point as seperator till now
	      // we fix this elements in the next loop
	      for(i = array.length; --i;){
	        if(array[i].indexOf('.') != array[i].lastIndexOf('.')){
	          var split = array[i].split('.') // split at the point
	          var first = [split.shift(), split.shift()].join('.') // join the first number together
	          array.splice.apply(array, [i, 1].concat(first, split.map(function(el){ return '.'+el }))) // add first and all other entries back to array
	        }
	      }

	    }else{
	      array = array.reduce(function(prev, curr){
	        return [].concat.apply(prev, curr)
	      }, [])
	    }

	    // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]

	    var arr = []

	    do{

	      // Test if we have a path letter
	      if(SVG.regex.isPathLetter.test(array[0])){
	        s = array[0]
	        array.shift()
	      // If last letter was a move command and we got no new, it defaults to [L]ine
	      }else if(s == 'M'){
	        s = 'L'
	      }else if(s == 'm'){
	        s = 'l'
	      }

	      // add path letter as first element
	      seg = [s.toUpperCase()]

	      // push all necessary parameters to segment
	      for(i = 0; i < paramCnt[seg[0]]; ++i){
	        seg.push(parseFloat(array.shift()))
	      }

	      // upper case
	      if(s == seg[0]){

	        if(s == 'M' || s == 'L' || s == 'C' || s == 'Q'){
	          x = seg[paramCnt[seg[0]]-1]
	          y = seg[paramCnt[seg[0]]]
	        }else if(s == 'V'){
	          y = seg[1]
	        }else if(s == 'H'){
	          x = seg[1]
	        }else if(s == 'A'){
	          x = seg[6]
	          y = seg[7]
	        }

	      // lower case
	      }else{

	        // convert relative to absolute values
	        if(s == 'm' || s == 'l' || s == 'c' || s == 's' || s == 'q' || s == 't'){

	          seg[1] += x
	          seg[2] += y

	          if(seg[3] != null){
	            seg[3] += x
	            seg[4] += y
	          }

	          if(seg[5] != null){
	            seg[5] += x
	            seg[6] += y
	          }

	          // move pointer
	          x = seg[paramCnt[seg[0]]-1]
	          y = seg[paramCnt[seg[0]]]

	        }else if(s == 'v'){
	          seg[1] += y
	          y = seg[1]
	        }else if(s == 'h'){
	          seg[1] += x
	          x = seg[1]
	        }else if(s == 'a'){
	          seg[6] += x
	          seg[7] += y
	          x = seg[6]
	          y = seg[7]
	        }

	      }

	      if(seg[0] == 'M'){
	        x0 = x
	        y0 = y
	      }

	      if(seg[0] == 'Z'){
	        x = x0
	        y = y0
	      }

	      arr.push(seg)

	    }while(array.length)

	    return arr

	  }
	  // Get bounding box of path
	, bbox: function() {
	    SVG.parser.path.setAttribute('d', this.toString())

	    return SVG.parser.path.getBBox()
	  }

	})
	// Module for unit convertions
	SVG.Number = SVG.invent({
	  // Initialize
	  create: function(value, unit) {
	    // initialize defaults
	    this.value = 0
	    this.unit  = unit || ''

	    // parse value
	    if (typeof value === 'number') {
	      // ensure a valid numeric value
	      this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value

	    } else if (typeof value === 'string') {
	      unit = value.match(SVG.regex.unit)

	      if (unit) {
	        // make value numeric
	        this.value = parseFloat(unit[1])

	        // normalize
	        if (unit[2] == '%')
	          this.value /= 100
	        else if (unit[2] == 's')
	          this.value *= 1000

	        // store unit
	        this.unit = unit[2]
	      }

	    } else {
	      if (value instanceof SVG.Number) {
	        this.value = value.valueOf()
	        this.unit  = value.unit
	      }
	    }

	  }
	  // Add methods
	, extend: {
	    // Stringalize
	    toString: function() {
	      return (
	        this.unit == '%' ?
	          ~~(this.value * 1e8) / 1e6:
	        this.unit == 's' ?
	          this.value / 1e3 :
	          this.value
	      ) + this.unit
	    }
	  , // Convert to primitive
	    valueOf: function() {
	      return this.value
	    }
	    // Add number
	  , plus: function(number) {
	      return new SVG.Number(this + new SVG.Number(number), this.unit)
	    }
	    // Subtract number
	  , minus: function(number) {
	      return this.plus(-new SVG.Number(number))
	    }
	    // Multiply number
	  , times: function(number) {
	      return new SVG.Number(this * new SVG.Number(number), this.unit)
	    }
	    // Divide number
	  , divide: function(number) {
	      return new SVG.Number(this / new SVG.Number(number), this.unit)
	    }
	    // Convert to different unit
	  , to: function(unit) {
	      var number = new SVG.Number(this)

	      if (typeof unit === 'string')
	        number.unit = unit

	      return number
	    }
	    // Make number morphable
	  , morph: function(number) {
	      this.destination = new SVG.Number(number)

	      return this
	    }
	    // Get morphed number at given position
	  , at: function(pos) {
	      // Make sure a destination is defined
	      if (!this.destination) return this

	      // Generate new morphed number
	      return new SVG.Number(this.destination)
	          .minus(this)
	          .times(pos)
	          .plus(this)
	    }

	  }
	})

	SVG.ViewBox = function(element) {
	  var x, y, width, height
	    , wm   = 1 // width multiplier
	    , hm   = 1 // height multiplier
	    , box  = element.bbox()
	    , view = (element.attr('viewBox') || '').match(/-?[\d\.]+/g)
	    , we   = element
	    , he   = element

	  // get dimensions of current node
	  width  = new SVG.Number(element.width())
	  height = new SVG.Number(element.height())

	  // find nearest non-percentual dimensions
	  while (width.unit == '%') {
	    wm *= width.value
	    width = new SVG.Number(we instanceof SVG.Doc ? we.parent().offsetWidth : we.parent().width())
	    we = we.parent()
	  }
	  while (height.unit == '%') {
	    hm *= height.value
	    height = new SVG.Number(he instanceof SVG.Doc ? he.parent().offsetHeight : he.parent().height())
	    he = he.parent()
	  }

	  // ensure defaults
	  this.x      = box.x
	  this.y      = box.y
	  this.width  = width  * wm
	  this.height = height * hm
	  this.zoom   = 1

	  if (view) {
	    // get width and height from viewbox
	    x      = parseFloat(view[0])
	    y      = parseFloat(view[1])
	    width  = parseFloat(view[2])
	    height = parseFloat(view[3])

	    // calculate zoom accoring to viewbox
	    this.zoom = ((this.width / this.height) > (width / height)) ?
	      this.height / height :
	      this.width  / width

	    // calculate real pixel dimensions on parent SVG.Doc element
	    this.x      = x
	    this.y      = y
	    this.width  = width
	    this.height = height

	  }

	}

	//
	SVG.extend(SVG.ViewBox, {
	  // Parse viewbox to string
	  toString: function() {
	    return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
	  }

	})

	SVG.Element = SVG.invent({
	  // Initialize node
	  create: function(node) {
	    // make stroke value accessible dynamically
	    this._stroke = SVG.defaults.attrs.stroke

	    // initialize data object
	    this.dom = {}

	    // create circular reference
	    if (this.node = node) {
	      this.type = node.nodeName
	      this.node.instance = this

	      // store current attribute value
	      this._stroke = node.getAttribute('stroke') || this._stroke
	    }
	  }

	  // Add class methods
	, extend: {
	    // Move over x-axis
	    x: function(x) {
	      return this.attr('x', x)
	    }
	    // Move over y-axis
	  , y: function(y) {
	      return this.attr('y', y)
	    }
	    // Move by center over x-axis
	  , cx: function(x) {
	      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
	    }
	    // Move by center over y-axis
	  , cy: function(y) {
	      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)
	    }
	    // Move element to given x and y values
	  , move: function(x, y) {
	      return this.x(x).y(y)
	    }
	    // Move element by its center
	  , center: function(x, y) {
	      return this.cx(x).cy(y)
	    }
	    // Set width of element
	  , width: function(width) {
	      return this.attr('width', width)
	    }
	    // Set height of element
	  , height: function(height) {
	      return this.attr('height', height)
	    }
	    // Set element size to given width and height
	  , size: function(width, height) {
	      var p = proportionalSize(this.bbox(), width, height)

	      return this
	        .width(new SVG.Number(p.width))
	        .height(new SVG.Number(p.height))
	    }
	    // Clone element
	  , clone: function() {
	      // clone element and assign new id
	      var clone = assignNewId(this.node.cloneNode(true))

	      // insert the clone after myself
	      this.after(clone)

	      return clone
	    }
	    // Remove element
	  , remove: function() {
	      if (this.parent())
	        this.parent().removeElement(this)

	      return this
	    }
	    // Replace element
	  , replace: function(element) {
	      this.after(element).remove()

	      return element
	    }
	    // Add element to given container and return self
	  , addTo: function(parent) {
	      return parent.put(this)
	    }
	    // Add element to given container and return container
	  , putIn: function(parent) {
	      return parent.add(this)
	    }
	    // Get / set id
	  , id: function(id) {
	      return this.attr('id', id)
	    }
	    // Checks whether the given point inside the bounding box of the element
	  , inside: function(x, y) {
	      var box = this.bbox()

	      return x > box.x
	          && y > box.y
	          && x < box.x + box.width
	          && y < box.y + box.height
	    }
	    // Show element
	  , show: function() {
	      return this.style('display', '')
	    }
	    // Hide element
	  , hide: function() {
	      return this.style('display', 'none')
	    }
	    // Is element visible?
	  , visible: function() {
	      return this.style('display') != 'none'
	    }
	    // Return id on string conversion
	  , toString: function() {
	      return this.attr('id')
	    }
	    // Return array of classes on the node
	  , classes: function() {
	      var attr = this.attr('class')

	      return attr == null ? [] : attr.trim().split(/\s+/)
	    }
	    // Return true if class exists on the node, false otherwise
	  , hasClass: function(name) {
	      return this.classes().indexOf(name) != -1
	    }
	    // Add class to the node
	  , addClass: function(name) {
	      if (!this.hasClass(name)) {
	        var array = this.classes()
	        array.push(name)
	        this.attr('class', array.join(' '))
	      }

	      return this
	    }
	    // Remove class from the node
	  , removeClass: function(name) {
	      if (this.hasClass(name)) {
	        this.attr('class', this.classes().filter(function(c) {
	          return c != name
	        }).join(' '))
	      }

	      return this
	    }
	    // Toggle the presence of a class on the node
	  , toggleClass: function(name) {
	      return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
	    }
	    // Get referenced element form attribute value
	  , reference: function(attr) {
	      return SVG.get(this.attr(attr))
	    }
	    // Returns the parent element instance
	  , parent: function(type) {
	      var parent = this

	      // check for parent
	      if(!parent.node.parentNode) return null

	      // get parent element
	      parent = SVG.adopt(parent.node.parentNode)

	      if(!type) return parent

	      // loop trough ancestors if type is given
	      while(parent.node instanceof SVGElement){
	        if(typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
	        parent = SVG.adopt(parent.node.parentNode)
	      }
	    }
	    // Get parent document
	  , doc: function() {
	      return this instanceof SVG.Doc ? this : this.parent(SVG.Doc)
	    }
	    // return array of all ancestors of given type up to the root svg
	  , parents: function(type) {
	      var parents = [], parent = this

	      do{
	        parent = parent.parent(type)
	        if(!parent || !parent.node) break

	        parents.push(parent)
	      } while(parent.parent)

	      return parents
	    }
	    // matches the element vs a css selector
	  , matches: function(selector){
	      return matches(this.node, selector)
	    }
	    // Returns the svg node to call native svg methods on it
	  , native: function() {
	      return this.node
	    }
	    // Import raw svg
	  , svg: function(svg) {
	      // create temporary holder
	      var well = document.createElement('svg')

	      // act as a setter if svg is given
	      if (svg && this instanceof SVG.Parent) {
	        // dump raw svg
	        well.innerHTML = '<svg>' + svg.replace(/\n/, '').replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>') + '</svg>'

	        // transplant nodes
	        for (var i = 0, il = well.firstChild.childNodes.length; i < il; i++)
	          this.node.appendChild(well.firstChild.firstChild)

	      // otherwise act as a getter
	      } else {
	        // create a wrapping svg element in case of partial content
	        well.appendChild(svg = document.createElement('svg'))

	        // write svgjs data to the dom
	        this.writeDataToDom()

	        // insert a copy of this node
	        svg.appendChild(this.node.cloneNode(true))

	        // return target element
	        return well.innerHTML.replace(/^<svg>/, '').replace(/<\/svg>$/, '')
	      }

	      return this
	    }
	  // write svgjs data to the dom
	  , writeDataToDom: function() {

	      // dump variables recursively
	      if(this.each || this.lines){
	        var fn = this.each ? this : this.lines();
	        fn.each(function(){
	          this.writeDataToDom()
	        })
	      }

	      // remove previously set data
	      this.node.removeAttribute('svgjs:data')

	      if(Object.keys(this.dom).length)
	        this.node.setAttributeNS(SVG.svgjs, 'svgjs:data', JSON.stringify(this.dom))

	      return this
	    }
	  // set given data to the elements data property
	  , setData: function(o){
	      this.dom = o
	      return this
	    }
	  }
	})

	SVG.FX = SVG.invent({
	  // Initialize FX object
	  create: function(element) {
	    // store target element
	    this.target = element
	  }

	  // Add class methods
	, extend: {
	    // Add animation parameters and start animation
	    animate: function(d, ease, delay) {
	      var akeys, skeys, key
	        , element = this.target
	        , fx = this

	      // dissect object if one is passed
	      if (typeof d == 'object') {
	        delay = d.delay
	        ease = d.ease
	        d = d.duration
	      }

	      // ensure default duration and easing
	      d = d == '=' ? d : d == null ? 1000 : new SVG.Number(d).valueOf()
	      ease = ease || '<>'

	      // process values
	      fx.at = function(pos) {
	        var i

	        // normalise pos
	        pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

	        // collect attribute keys
	        if (akeys == null) {
	          akeys = []
	          for (key in fx.attrs)
	            akeys.push(key)

	          // make sure morphable elements are scaled, translated and morphed all together
	          if (element.morphArray && (fx.destination.plot || akeys.indexOf('points') > -1)) {
	            // get destination
	            var box
	              , p = new element.morphArray(fx.destination.plot || fx.attrs.points || element.array())

	            // add size
	            if (fx.destination.size)
	              p.size(fx.destination.size.width.to, fx.destination.size.height.to)

	            // add movement
	            box = p.bbox()
	            if (fx.destination.x)
	              p.move(fx.destination.x.to, box.y)
	            else if (fx.destination.cx)
	              p.move(fx.destination.cx.to - box.width / 2, box.y)

	            box = p.bbox()
	            if (fx.destination.y)
	              p.move(box.x, fx.destination.y.to)
	            else if (fx.destination.cy)
	              p.move(box.x, fx.destination.cy.to - box.height / 2)

	            // reset destination values
	            fx.destination = {
	              plot: element.array().morph(p)
	            }
	          }
	        }

	        // collect style keys
	        if (skeys == null) {
	          skeys = []
	          for (key in fx.styles)
	            skeys.push(key)
	        }

	        // apply easing
	        pos = ease == '<>' ?
	          (-Math.cos(pos * Math.PI) / 2) + 0.5 :
	        ease == '>' ?
	          Math.sin(pos * Math.PI / 2) :
	        ease == '<' ?
	          -Math.cos(pos * Math.PI / 2) + 1 :
	        ease == '-' ?
	          pos :
	        typeof ease == 'function' ?
	          ease(pos) :
	          pos

	        // run plot function
	        if (fx.destination.plot) {
	          element.plot(fx.destination.plot.at(pos))

	        } else {
	          // run all x-position properties
	          if (fx.destination.x)
	            element.x(fx.destination.x.at(pos))
	          else if (fx.destination.cx)
	            element.cx(fx.destination.cx.at(pos))

	          // run all y-position properties
	          if (fx.destination.y)
	            element.y(fx.destination.y.at(pos))
	          else if (fx.destination.cy)
	            element.cy(fx.destination.cy.at(pos))

	          // run all size properties
	          if (fx.destination.size)
	            element.size(fx.destination.size.width.at(pos), fx.destination.size.height.at(pos))
	        }

	        // run all viewbox properties
	        if (fx.destination.viewbox)
	          element.viewbox(
	            fx.destination.viewbox.x.at(pos)
	          , fx.destination.viewbox.y.at(pos)
	          , fx.destination.viewbox.width.at(pos)
	          , fx.destination.viewbox.height.at(pos)
	          )

	        // run leading property
	        if (fx.destination.leading)
	          element.leading(fx.destination.leading.at(pos))

	        // animate attributes
	        for (i = akeys.length - 1; i >= 0; i--)
	          element.attr(akeys[i], at(fx.attrs[akeys[i]], pos))

	        // animate styles
	        for (i = skeys.length - 1; i >= 0; i--)
	          element.style(skeys[i], at(fx.styles[skeys[i]], pos))

	        // callback for each keyframe
	        if (fx.situation.during)
	          fx.situation.during.call(element, pos, function(from, to) {
	            return at({ from: from, to: to }, pos)
	          })
	      }

	      if (typeof d === 'number') {
	        // delay animation
	        this.timeout = setTimeout(function() {
	          var start = new Date().getTime()

	          // initialize situation object
	          fx.situation.start    = start
	          fx.situation.play     = true
	          fx.situation.finish   = start + d
	          fx.situation.duration = d
	          fx.situation.ease     = ease

	          // render function
	          fx.render = function() {

	            if (fx.situation.play === true) {
	              // calculate pos
	              var time = new Date().getTime()
	                , pos = time > fx.situation.finish ? 1 : (time - fx.situation.start) / d

	              // reverse pos if animation is reversed
	              if (fx.situation.reversing)
	                pos = -pos + 1

	              // process values
	              fx.at(pos)

	              // finish off animation
	              if (time > fx.situation.finish) {
	                if (fx.destination.plot)
	                  element.plot(new SVG.PointArray(fx.destination.plot.destination).settle())

	                if (fx.situation.loop === true || (typeof fx.situation.loop == 'number' && fx.situation.loop > 0)) {
	                  // register reverse
	                  if (fx.situation.reverse)
	                    fx.situation.reversing = !fx.situation.reversing

	                  if (typeof fx.situation.loop == 'number') {
	                    // reduce loop count
	                    if (!fx.situation.reverse || fx.situation.reversing)
	                      --fx.situation.loop

	                    // remove last loop if reverse is disabled
	                    if (!fx.situation.reverse && fx.situation.loop == 1)
	                      --fx.situation.loop
	                  }

	                  fx.animate(d, ease, delay)
	                } else {
	                  fx.situation.after ? fx.situation.after.apply(element, [fx]) : fx.stop()
	                }

	              } else {
	                fx.animationFrame = requestAnimationFrame(fx.render)
	              }
	            } else {
	              fx.animationFrame = requestAnimationFrame(fx.render)
	            }

	          }

	          // start animation
	          fx.render()

	        }, new SVG.Number(delay).valueOf())
	      }

	      return this
	    }
	    // Get bounding box of target element
	  , bbox: function() {
	      return this.target.bbox()
	    }
	    // Add animatable attributes
	  , attr: function(a, v) {
	      // apply attributes individually
	      if (typeof a == 'object') {
	        for (var key in a)
	          this.attr(key, a[key])

	      } else {
	        // get the current state
	        var from = this.target.attr(a)

	        // detect format
	        if (a == 'transform') {
	          // merge given transformation with an existing one
	          if (this.attrs[a])
	            v = this.attrs[a].destination.multiply(v)

	          // prepare matrix for morphing
	          this.attrs[a] = (new SVG.Matrix(this.target)).morph(v)

	          // add parametric rotation values
	          if (this.param) {
	            // get initial rotation
	            v = this.target.transform('rotation')

	            // add param
	            this.attrs[a].param = {
	              from: this.target.param || { rotation: v, cx: this.param.cx, cy: this.param.cy }
	            , to:   this.param
	            }
	          }

	        } else {
	          this.attrs[a] = SVG.Color.isColor(v) ?
	            // prepare color for morphing
	            new SVG.Color(from).morph(v) :
	          SVG.regex.unit.test(v) ?
	            // prepare number for morphing
	            new SVG.Number(from).morph(v) :
	            // prepare for plain morphing
	            { from: from, to: v }
	        }
	      }

	      return this
	    }
	    // Add animatable styles
	  , style: function(s, v) {
	      if (typeof s == 'object')
	        for (var key in s)
	          this.style(key, s[key])

	      else
	        this.styles[s] = { from: this.target.style(s), to: v }

	      return this
	    }
	    // Animatable x-axis
	  , x: function(x) {
	      this.destination.x = new SVG.Number(this.target.x()).morph(x)

	      return this
	    }
	    // Animatable y-axis
	  , y: function(y) {
	      this.destination.y = new SVG.Number(this.target.y()).morph(y)

	      return this
	    }
	    // Animatable center x-axis
	  , cx: function(x) {
	      this.destination.cx = new SVG.Number(this.target.cx()).morph(x)

	      return this
	    }
	    // Animatable center y-axis
	  , cy: function(y) {
	      this.destination.cy = new SVG.Number(this.target.cy()).morph(y)

	      return this
	    }
	    // Add animatable move
	  , move: function(x, y) {
	      return this.x(x).y(y)
	    }
	    // Add animatable center
	  , center: function(x, y) {
	      return this.cx(x).cy(y)
	    }
	    // Add animatable size
	  , size: function(width, height) {
	      if (this.target instanceof SVG.Text) {
	        // animate font size for Text elements
	        this.attr('font-size', width)

	      } else {
	        // animate bbox based size for all other elements
	        var box = this.target.bbox()

	        this.destination.size = {
	          width:  new SVG.Number(box.width).morph(width)
	        , height: new SVG.Number(box.height).morph(height)
	        }
	      }

	      return this
	    }
	    // Add animatable plot
	  , plot: function(p) {
	      this.destination.plot = p

	      return this
	    }
	    // Add leading method
	  , leading: function(value) {
	      if (this.target.destination.leading)
	        this.destination.leading = new SVG.Number(this.target.destination.leading).morph(value)

	      return this
	    }
	    // Add animatable viewbox
	  , viewbox: function(x, y, width, height) {
	      if (this.target instanceof SVG.Container) {
	        var box = this.target.viewbox()

	        this.destination.viewbox = {
	          x:      new SVG.Number(box.x).morph(x)
	        , y:      new SVG.Number(box.y).morph(y)
	        , width:  new SVG.Number(box.width).morph(width)
	        , height: new SVG.Number(box.height).morph(height)
	        }
	      }

	      return this
	    }
	    // Add animateable gradient update
	  , update: function(o) {
	      if (this.target instanceof SVG.Stop) {
	        if (o.opacity != null) this.attr('stop-opacity', o.opacity)
	        if (o.color   != null) this.attr('stop-color', o.color)
	        if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
	      }

	      return this
	    }
	    // Add callback for each keyframe
	  , during: function(during) {
	      this.situation.during = during

	      return this
	    }
	    // Callback after animation
	  , after: function(after) {
	      this.situation.after = after

	      return this
	    }
	    // Make loopable
	  , loop: function(times, reverse) {
	      // store current loop and total loops
	      this.situation.loop = this.situation.loops = times || true

	      // make reversable
	      this.situation.reverse = !!reverse

	      return this
	    }
	    // Stop running animation
	  , stop: function(fulfill) {
	      // fulfill animation
	      if (fulfill === true) {

	        this.animate(0)

	        if (this.situation.after)
	          this.situation.after.apply(this.target, [this])

	      } else {
	        // stop current animation
	        clearTimeout(this.timeout)
	        cancelAnimationFrame(this.animationFrame);

	        // reset storage for properties
	        this.attrs       = {}
	        this.styles      = {}
	        this.situation   = {}
	        this.destination = {}
	      }

	      return this
	    }
	    // Pause running animation
	  , pause: function() {
	      if (this.situation.play === true) {
	        this.situation.play  = false
	        this.situation.pause = new Date().getTime()
	      }

	      return this
	    }
	    // Play running animation
	  , play: function() {
	      if (this.situation.play === false) {
	        var pause = new Date().getTime() - this.situation.pause

	        this.situation.finish += pause
	        this.situation.start  += pause
	        this.situation.play    = true
	      }

	      return this
	    }

	  }

	  // Define parent class
	, parent: SVG.Element

	  // Add method to parent elements
	, construct: {
	    // Get fx module or create a new one, then animate with given duration and ease
	    animate: function(d, ease, delay) {
	      return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d, ease, delay)
	    }
	    // Stop current animation; this is an alias to the fx instance
	  , stop: function(fulfill) {
	      if (this.fx)
	        this.fx.stop(fulfill)

	      return this
	    }
	    // Pause current animation
	  , pause: function() {
	      if (this.fx)
	        this.fx.pause()

	      return this
	    }
	    // Play paused current animation
	  , play: function() {
	      if (this.fx)
	        this.fx.play()

	      return this
	    }

	  }
	})

	SVG.BBox = SVG.invent({
	  // Initialize
	  create: function(element) {
	    // get values if element is given
	    if (element) {
	      var box

	      // yes this is ugly, but Firefox can be a bitch when it comes to elements that are not yet rendered
	      try {
	        // find native bbox
	        box = element.node.getBBox()
	      } catch(e) {
	        if(element instanceof SVG.Shape){
	          var clone = element.clone().addTo(SVG.parser.draw)
	          box = clone.bbox()
	          clone.remove()
	        }else{
	          box = {
	            x:      element.node.clientLeft
	          , y:      element.node.clientTop
	          , width:  element.node.clientWidth
	          , height: element.node.clientHeight
	          }
	        }
	      }

	      // plain x and y
	      this.x = box.x
	      this.y = box.y

	      // plain width and height
	      this.width  = box.width
	      this.height = box.height
	    }

	    // add center, right and bottom
	    fullBox(this)
	  }

	  // Define Parent
	, parent: SVG.Element

	  // Constructor
	, construct: {
	    // Get bounding box
	    bbox: function() {
	      return new SVG.BBox(this)
	    }
	  }

	})

	SVG.TBox = SVG.invent({
	  // Initialize
	  create: function(element) {
	    // get values if element is given
	    if (element) {
	      var t   = element.ctm().extract()
	        , box = element.bbox()

	      // width and height including transformations
	      this.width  = box.width  * t.scaleX
	      this.height = box.height * t.scaleY

	      // x and y including transformations
	      this.x = box.x + t.x
	      this.y = box.y + t.y
	    }

	    // add center, right and bottom
	    fullBox(this)
	  }

	  // Define Parent
	, parent: SVG.Element

	  // Constructor
	, construct: {
	    // Get transformed bounding box
	    tbox: function() {
	      return new SVG.TBox(this)
	    }
	  }

	})


	SVG.RBox = SVG.invent({
	  // Initialize
	  create: function(element) {
	    if (element) {
	      var e    = element.doc().parent()
	        , box  = element.node.getBoundingClientRect()
	        , zoom = 1

	      // get screen offset
	      this.x = box.left
	      this.y = box.top

	      // subtract parent offset
	      this.x -= e.offsetLeft
	      this.y -= e.offsetTop

	      while (e = e.offsetParent) {
	        this.x -= e.offsetLeft
	        this.y -= e.offsetTop
	      }

	      // calculate cumulative zoom from svg documents
	      e = element
	      while (e.parent && (e = e.parent())) {
	        if (e.viewbox) {
	          zoom *= e.viewbox().zoom
	          this.x -= e.x() || 0
	          this.y -= e.y() || 0
	        }
	      }

	      // recalculate viewbox distortion
	      this.width  = box.width  /= zoom
	      this.height = box.height /= zoom
	    }

	    // add center, right and bottom
	    fullBox(this)

	    // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
	    this.x += window.pageXOffset
	    this.y += window.pageYOffset
	  }

	  // define Parent
	, parent: SVG.Element

	  // Constructor
	, construct: {
	    // Get rect box
	    rbox: function() {
	      return new SVG.RBox(this)
	    }
	  }

	})

	// Add universal merge method
	;[SVG.BBox, SVG.TBox, SVG.RBox].forEach(function(c) {

	  SVG.extend(c, {
	    // Merge rect box with another, return a new instance
	    merge: function(box) {
	      var b = new c()

	      // merge boxes
	      b.x      = Math.min(this.x, box.x)
	      b.y      = Math.min(this.y, box.y)
	      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
	      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y

	      return fullBox(b)
	    }

	  })

	})

	SVG.Matrix = SVG.invent({
	  // Initialize
	  create: function(source) {
	    var i, base = arrayToMatrix([1, 0, 0, 1, 0, 0])

	    // ensure source as object
	    source = source instanceof SVG.Element ?
	      source.matrixify() :
	    typeof source === 'string' ?
	      stringToMatrix(source) :
	    arguments.length == 6 ?
	      arrayToMatrix([].slice.call(arguments)) :
	    typeof source === 'object' ?
	      source : base

	    // merge source
	    for (i = abcdef.length - 1; i >= 0; i--)
	      this[abcdef[i]] = source && typeof source[abcdef[i]] === 'number' ?
	        source[abcdef[i]] : base[abcdef[i]]
	  }

	  // Add methods
	, extend: {
	    // Extract individual transformations
	    extract: function() {
	      // find delta transform points
	      var px    = deltaTransformPoint(this, 0, 1)
	        , py    = deltaTransformPoint(this, 1, 0)
	        , skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90

	      return {
	        // translation
	        x:        this.e
	      , y:        this.f
	        // skew
	      , skewX:    -skewX
	      , skewY:    180 / Math.PI * Math.atan2(py.y, py.x)
	        // scale
	      , scaleX:   Math.sqrt(this.a * this.a + this.b * this.b)
	      , scaleY:   Math.sqrt(this.c * this.c + this.d * this.d)
	        // rotation
	      , rotation: skewX
	      , a: this.a
	      , b: this.b
	      , c: this.c
	      , d: this.d
	      , e: this.e
	      , f: this.f
	      }
	    }
	    // Clone matrix
	  , clone: function() {
	      return new SVG.Matrix(this)
	    }
	    // Morph one matrix into another
	  , morph: function(matrix) {
	      // store new destination
	      this.destination = new SVG.Matrix(matrix)

	      return this
	    }
	    // Get morphed matrix at a given position
	  , at: function(pos) {
	      // make sure a destination is defined
	      if (!this.destination) return this

	      // calculate morphed matrix at a given position
	      var matrix = new SVG.Matrix({
	        a: this.a + (this.destination.a - this.a) * pos
	      , b: this.b + (this.destination.b - this.b) * pos
	      , c: this.c + (this.destination.c - this.c) * pos
	      , d: this.d + (this.destination.d - this.d) * pos
	      , e: this.e + (this.destination.e - this.e) * pos
	      , f: this.f + (this.destination.f - this.f) * pos
	      })

	      // process parametric rotation if present
	      if (this.param && this.param.to) {
	        // calculate current parametric position
	        var param = {
	          rotation: this.param.from.rotation + (this.param.to.rotation - this.param.from.rotation) * pos
	        , cx:       this.param.from.cx
	        , cy:       this.param.from.cy
	        }

	        // rotate matrix
	        matrix = matrix.rotate(
	          (this.param.to.rotation - this.param.from.rotation * 2) * pos
	        , param.cx
	        , param.cy
	        )

	        // store current parametric values
	        matrix.param = param
	      }

	      return matrix
	    }
	    // Multiplies by given matrix
	  , multiply: function(matrix) {
	      return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()))
	    }
	    // Inverses matrix
	  , inverse: function() {
	      return new SVG.Matrix(this.native().inverse())
	    }
	    // Translate matrix
	  , translate: function(x, y) {
	      return new SVG.Matrix(this.native().translate(x || 0, y || 0))
	    }
	    // Scale matrix
	  , scale: function(x, y, cx, cy) {
	      // support universal scale
	      if (arguments.length == 1 || arguments.length == 3)
	        y = x
	      if (arguments.length == 3) {
	        cy = cx
	        cx = y
	      }

	      return this.around(cx, cy, new SVG.Matrix(x, 0, 0, y, 0, 0))
	    }
	    // Rotate matrix
	  , rotate: function(r, cx, cy) {
	      // convert degrees to radians
	      r = SVG.utils.radians(r)

	      return this.around(cx, cy, new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0))
	    }
	    // Flip matrix on x or y, at a given offset
	  , flip: function(a, o) {
	      return a == 'x' ? this.scale(-1, 1, o, 0) : this.scale(1, -1, 0, o)
	    }
	    // Skew
	  , skew: function(x, y, cx, cy) {
	      return this.around(cx, cy, this.native().skewX(x || 0).skewY(y || 0))
	    }
	    // SkewX
	  , skewX: function(x, cx, cy) {
	      return this.around(cx, cy, this.native().skewX(x || 0))
	    }
	    // SkewY
	  , skewY: function(y, cx, cy) {
	      return this.around(cx, cy, this.native().skewY(y || 0))
	    }
	    // Transform around a center point
	  , around: function(cx, cy, matrix) {
	      return this
	        .multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0))
	        .multiply(matrix)
	        .multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0))
	    }
	    // Convert to native SVGMatrix
	  , native: function() {
	      // create new matrix
	      var matrix = SVG.parser.draw.node.createSVGMatrix()

	      // update with current values
	      for (var i = abcdef.length - 1; i >= 0; i--)
	        matrix[abcdef[i]] = this[abcdef[i]]

	      return matrix
	    }
	    // Convert matrix to string
	  , toString: function() {
	      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
	    }
	  }

	  // Define parent
	, parent: SVG.Element

	  // Add parent method
	, construct: {
	    // Get current matrix
	    ctm: function() {
	      return new SVG.Matrix(this.node.getCTM())
	    },
	    // Get current screen matrix
	    screenCTM: function() {
	      return new SVG.Matrix(this.node.getScreenCTM())
	    }

	  }

	})
	SVG.extend(SVG.Element, {
	  // Set svg element attribute
	  attr: function(a, v, n) {
	    // act as full getter
	    if (a == null) {
	      // get an object of attributes
	      a = {}
	      v = this.node.attributes
	      for (n = v.length - 1; n >= 0; n--)
	        a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue

	      return a

	    } else if (typeof a == 'object') {
	      // apply every attribute individually if an object is passed
	      for (v in a) this.attr(v, a[v])

	    } else if (v === null) {
	        // remove value
	        this.node.removeAttribute(a)

	    } else if (v == null) {
	      // act as a getter if the first and only argument is not an object
	      v = this.node.getAttribute(a)
	      return v == null ?
	        SVG.defaults.attrs[a] :
	      SVG.regex.isNumber.test(v) ?
	        parseFloat(v) : v

	    } else {
	      // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
	      if (a == 'stroke-width')
	        this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
	      else if (a == 'stroke')
	        this._stroke = v

	      // convert image fill and stroke to patterns
	      if (a == 'fill' || a == 'stroke') {
	        if (SVG.regex.isImage.test(v))
	          v = this.doc().defs().image(v, 0, 0)

	        if (v instanceof SVG.Image)
	          v = this.doc().defs().pattern(0, 0, function() {
	            this.add(v)
	          })
	      }

	      // ensure correct numeric values (also accepts NaN and Infinity)
	      if (typeof v === 'number')
	        v = new SVG.Number(v)

	      // ensure full hex color
	      else if (SVG.Color.isColor(v))
	        v = new SVG.Color(v)

	      // parse array values
	      else if (Array.isArray(v))
	        v = new SVG.Array(v)

	      // store parametric transformation values locally
	      else if (v instanceof SVG.Matrix && v.param)
	        this.param = v.param

	      // if the passed attribute is leading...
	      if (a == 'leading') {
	        // ... call the leading method instead
	        if (this.leading)
	          this.leading(v)
	      } else {
	        // set given attribute on node
	        typeof n === 'string' ?
	          this.node.setAttributeNS(n, a, v.toString()) :
	          this.node.setAttribute(a, v.toString())
	      }

	      // rebuild if required
	      if (this.rebuild && (a == 'font-size' || a == 'x'))
	        this.rebuild(a, v)
	    }

	    return this
	  }
	})
	SVG.extend(SVG.Element, SVG.FX, {
	  // Add transformations
	  transform: function(o, relative) {
	    // get target in case of the fx module, otherwise reference this
	    var target = this.target || this
	      , matrix

	    // act as a getter
	    if (typeof o !== 'object') {
	      // get current matrix
	      matrix = new SVG.Matrix(target).extract()

	      // add parametric rotation
	      if (typeof this.param === 'object') {
	        matrix.rotation = this.param.rotation
	        matrix.cx       = this.param.cx
	        matrix.cy       = this.param.cy
	      }

	      return typeof o === 'string' ? matrix[o] : matrix
	    }

	    // get current matrix
	    matrix = this instanceof SVG.FX && this.attrs.transform ?
	      this.attrs.transform :
	      new SVG.Matrix(target)

	    // ensure relative flag
	    relative = !!relative || !!o.relative

	    // act on matrix
	    if (o.a != null) {
	      matrix = relative ?
	        // relative
	        matrix.multiply(new SVG.Matrix(o)) :
	        // absolute
	        new SVG.Matrix(o)

	    // act on rotation
	    } else if (o.rotation != null) {
	      // ensure centre point
	      ensureCentre(o, target)

	      // relativize rotation value
	      if (relative) {
	        o.rotation += this.param && this.param.rotation != null ?
	          this.param.rotation :
	          matrix.extract().rotation
	      }

	      // store parametric values
	      this.param = o

	      // apply transformation
	      if (this instanceof SVG.Element) {
	        matrix = relative ?
	          // relative
	          matrix.rotate(o.rotation, o.cx, o.cy) :
	          // absolute
	          matrix.rotate(o.rotation - matrix.extract().rotation, o.cx, o.cy)
	      }

	    // act on scale
	    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
	      // ensure centre point
	      ensureCentre(o, target)

	      // ensure scale values on both axes
	      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
	      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1

	      if (!relative) {
	        // absolute; multiply inversed values
	        var e = matrix.extract()
	        o.scaleX = o.scaleX * 1 / e.scaleX
	        o.scaleY = o.scaleY * 1 / e.scaleY
	      }

	      matrix = matrix.scale(o.scaleX, o.scaleY, o.cx, o.cy)

	    // act on skew
	    } else if (o.skewX != null || o.skewY != null) {
	      // ensure centre point
	      ensureCentre(o, target)

	      // ensure skew values on both axes
	      o.skewX = o.skewX != null ? o.skewX : 0
	      o.skewY = o.skewY != null ? o.skewY : 0

	      if (!relative) {
	        // absolute; reset skew values
	        var e = matrix.extract()
	        matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX, e.skewY, o.cx, o.cy).inverse())
	      }

	      matrix = matrix.skew(o.skewX, o.skewY, o.cx, o.cy)

	    // act on flip
	    } else if (o.flip) {
	      matrix = matrix.flip(
	        o.flip
	      , o.offset == null ? target.bbox()['c' + o.flip] : o.offset
	      )

	    // act on translate
	    } else if (o.x != null || o.y != null) {
	      if (relative) {
	        // relative
	        matrix = matrix.translate(o.x, o.y)
	      } else {
	        // absolute
	        if (o.x != null) matrix.e = o.x
	        if (o.y != null) matrix.f = o.y
	      }
	    }

	    return this.attr(this instanceof SVG.Pattern ? 'patternTransform' : this instanceof SVG.Gradient ? 'gradientTransform' : 'transform', matrix)
	  }
	})

	SVG.extend(SVG.Element, {
	  // Reset all transformations
	  untransform: function() {
	    return this.attr('transform', null)
	  },
	  // merge the whole transformation chain into one matrix and returns it
	  matrixify: function() {

	    var matrix = (this.attr('transform') || '')
	      // split transformations
	      .split(/\)\s*/).slice(0,-1).map(function(str){
	        // generate key => value pairs
	        var kv = str.trim().split('(')
	        return [kv[0], kv[1].split(SVG.regex.matrixElements).map(function(str){ return parseFloat(str) })]
	      })
	      // calculate every transformation into one matrix
	      .reduce(function(matrix, transform){

	        if(transform[0] == 'matrix') return matrix.multiply(arrayToMatrix(transform[1]))
	        return matrix[transform[0]].apply(matrix, transform[1])

	      }, new SVG.Matrix())

	    return matrix
	  },
	  // add an element to another parent without changing the visual representation on the screen
	  toParent: function(parent) {
	    if(this == parent) return this
	    var ctm = this.screenCTM()
	    var temp = parent.rect(1,1)
	    var pCtm = temp.screenCTM().inverse()
	    temp.remove()

	    this.addTo(parent).untransform().transform(pCtm.multiply(ctm))

	    return this
	  },
	  // same as above with parent equals root-svg
	  toDoc: function() {
	    return this.toParent(this.doc())
	  }

	})

	SVG.extend(SVG.Element, {
	  // Dynamic style generator
	  style: function(s, v) {
	    if (arguments.length == 0) {
	      // get full style
	      return this.node.style.cssText || ''

	    } else if (arguments.length < 2) {
	      // apply every style individually if an object is passed
	      if (typeof s == 'object') {
	        for (v in s) this.style(v, s[v])

	      } else if (SVG.regex.isCss.test(s)) {
	        // parse css string
	        s = s.split(';')

	        // apply every definition individually
	        for (var i = 0; i < s.length; i++) {
	          v = s[i].split(':')
	          this.style(v[0].replace(/\s+/g, ''), v[1])
	        }
	      } else {
	        // act as a getter if the first and only argument is not an object
	        return this.node.style[camelCase(s)]
	      }

	    } else {
	      this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v
	    }

	    return this
	  }
	})
	SVG.Parent = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    this.constructor.call(this, element)
	  }

	  // Inherit from
	, inherit: SVG.Element

	  // Add class methods
	, extend: {
	    // Returns all child elements
	    children: function() {
	      return SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(node) {
	        return SVG.adopt(node)
	      })
	    }
	    // Add given element at a position
	  , add: function(element, i) {
	      if (!this.has(element)) {
	        // define insertion index if none given
	        i = i == null ? this.children().length : i

	        // add element references
	        this.node.insertBefore(element.node, this.node.childNodes[i] || null)
	      }

	      return this
	    }
	    // Basically does the same as `add()` but returns the added element instead
	  , put: function(element, i) {
	      this.add(element, i)
	      return element
	    }
	    // Checks if the given element is a child
	  , has: function(element) {
	      return this.index(element) >= 0
	    }
	    // Gets index of given element
	  , index: function(element) {
	      return this.children().indexOf(element)
	    }
	    // Get a element at the given index
	  , get: function(i) {
	      return this.children()[i]
	    }
	    // Get first child, skipping the defs node
	  , first: function() {
	      return this.children()[0]
	    }
	    // Get the last child
	  , last: function() {
	      return this.children()[this.children().length - 1]
	    }
	    // Iterates over all children and invokes a given block
	  , each: function(block, deep) {
	      var i, il
	        , children = this.children()

	      for (i = 0, il = children.length; i < il; i++) {
	        if (children[i] instanceof SVG.Element)
	          block.apply(children[i], [i, children])

	        if (deep && (children[i] instanceof SVG.Container))
	          children[i].each(block, deep)
	      }

	      return this
	    }
	    // Remove a given child
	  , removeElement: function(element) {
	      this.node.removeChild(element.node)

	      return this
	    }
	    // Remove all elements in this container
	  , clear: function() {
	      // remove children
	      while(this.node.hasChildNodes())
	        this.node.removeChild(this.node.lastChild)

	      // remove defs reference
	      delete this._defs

	      return this
	    }
	  , // Get defs
	    defs: function() {
	      return this.doc().defs()
	    }
	  }

	})

	SVG.extend(SVG.Parent, {

	  ungroup: function(parent, depth) {
	    if(depth === 0 || this instanceof SVG.Defs) return this

	    parent = parent || (this instanceof SVG.Doc ? this : this.parent(SVG.Parent))
	    depth = depth || Infinity

	    this.each(function(){
	      if(this instanceof SVG.Defs) return this
	      if(this instanceof SVG.Parent) return this.ungroup(parent, depth-1)
	      return this.toParent(parent)
	    })

	    this.node.firstChild || this.remove()

	    return this
	  },

	  flatten: function(parent, depth) {
	    return this.ungroup(parent, depth)
	  }

	})
	SVG.Container = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    this.constructor.call(this, element)
	  }

	  // Inherit from
	, inherit: SVG.Parent

	  // Add class methods
	, extend: {
	    // Get the viewBox and calculate the zoom value
	    viewbox: function(v) {
	      if (arguments.length == 0)
	        // act as a getter if there are no arguments
	        return new SVG.ViewBox(this)

	      // otherwise act as a setter
	      v = arguments.length == 1 ?
	        [v.x, v.y, v.width, v.height] :
	        [].slice.call(arguments)

	      return this.attr('viewBox', v)
	    }
	  }

	})
	// Add events to elements
	;[  'click'
	  , 'dblclick'
	  , 'mousedown'
	  , 'mouseup'
	  , 'mouseover'
	  , 'mouseout'
	  , 'mousemove'
	  // , 'mouseenter' -> not supported by IE
	  // , 'mouseleave' -> not supported by IE
	  , 'touchstart'
	  , 'touchmove'
	  , 'touchleave'
	  , 'touchend'
	  , 'touchcancel' ].forEach(function(event) {

	  // add event to SVG.Element
	  SVG.Element.prototype[event] = function(f) {
	    var self = this

	    // bind event to element rather than element node
	    this.node['on' + event] = typeof f == 'function' ?
	      function() { return f.apply(self, arguments) } : null

	    return this
	  }

	})

	// Initialize listeners stack
	SVG.listeners = []
	SVG.handlerMap = []

	// Add event binder in the SVG namespace
	SVG.on = function(node, event, listener, binding) {
	  // create listener, get object-index
	  var l     = listener.bind(binding || node.instance || node)
	    , index = (SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1
	    , ev    = event.split('.')[0]
	    , ns    = event.split('.')[1] || '*'


	  // ensure valid object
	  SVG.listeners[index]         = SVG.listeners[index]         || {}
	  SVG.listeners[index][ev]     = SVG.listeners[index][ev]     || {}
	  SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {}

	  // reference listener
	  SVG.listeners[index][ev][ns][listener] = l

	  // add listener
	  node.addEventListener(ev, l, false)
	}

	// Add event unbinder in the SVG namespace
	SVG.off = function(node, event, listener) {
	  var index = SVG.handlerMap.indexOf(node)
	    , ev    = event && event.split('.')[0]
	    , ns    = event && event.split('.')[1]

	  if(index == -1) return

	  if (listener) {
	    // remove listener reference
	    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']) {
	      // remove listener
	      node.removeEventListener(ev, SVG.listeners[index][ev][ns || '*'][listener], false)

	      delete SVG.listeners[index][ev][ns || '*'][listener]
	    }

	  } else if (ns && ev) {
	    // remove all listeners for a namespaced event
	    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]) {
	      for (listener in SVG.listeners[index][ev][ns])
	        SVG.off(node, [ev, ns].join('.'), listener)

	      delete SVG.listeners[index][ev][ns]
	    }

	  } else if (ns){
	    // remove all listeners for a specific namespace
	    for(event in SVG.listeners[index]){
	        for(namespace in SVG.listeners[index][event]){
	            if(ns === namespace){
	                SVG.off(node, [event, ns].join('.'))
	            }
	        }
	    }

	  } else if (ev) {
	    // remove all listeners for the event
	    if (SVG.listeners[index][ev]) {
	      for (namespace in SVG.listeners[index][ev])
	        SVG.off(node, [ev, namespace].join('.'))

	      delete SVG.listeners[index][ev]
	    }

	  } else {
	    // remove all listeners on a given node
	    for (event in SVG.listeners[index])
	      SVG.off(node, event)

	    delete SVG.listeners[index]

	  }
	}

	//
	SVG.extend(SVG.Element, {
	  // Bind given event to listener
	  on: function(event, listener, binding) {
	    SVG.on(this.node, event, listener, binding)

	    return this
	  }
	  // Unbind event from listener
	, off: function(event, listener) {
	    SVG.off(this.node, event, listener)

	    return this
	  }
	  // Fire given event
	, fire: function(event, data) {

	    // Dispatch event
	    if(event instanceof Event){
	        this.node.dispatchEvent(event)
	    }else{
	        this.node.dispatchEvent(new CustomEvent(event, {detail:data}))
	    }

	    return this
	  }
	})

	SVG.Defs = SVG.invent({
	  // Initialize node
	  create: 'defs'

	  // Inherit from
	, inherit: SVG.Container

	})
	SVG.G = SVG.invent({
	  // Initialize node
	  create: 'g'

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Move over x-axis
	    x: function(x) {
	      return x == null ? this.transform('x') : this.transform({ x: x - this.x() }, true)
	    }
	    // Move over y-axis
	  , y: function(y) {
	      return y == null ? this.transform('y') : this.transform({ y: y - this.y() }, true)
	    }
	    // Move by center over x-axis
	  , cx: function(x) {
	      return x == null ? this.tbox().cx : this.x(x - this.tbox().width / 2)
	    }
	    // Move by center over y-axis
	  , cy: function(y) {
	      return y == null ? this.tbox().cy : this.y(y - this.tbox().height / 2)
	    }
	  , gbox: function() {

	      var bbox  = this.bbox()
	        , trans = this.transform()

	      bbox.x  += trans.x
	      bbox.x2 += trans.x
	      bbox.cx += trans.x

	      bbox.y  += trans.y
	      bbox.y2 += trans.y
	      bbox.cy += trans.y

	      return bbox
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create a group element
	    group: function() {
	      return this.put(new SVG.G)
	    }
	  }
	})

	// ### This module adds backward / forward functionality to elements.

	//
	SVG.extend(SVG.Element, {
	  // Get all siblings, including myself
	  siblings: function() {
	    return this.parent().children()
	  }
	  // Get the curent position siblings
	, position: function() {
	    return this.parent().index(this)
	  }
	  // Get the next element (will return null if there is none)
	, next: function() {
	    return this.siblings()[this.position() + 1]
	  }
	  // Get the next element (will return null if there is none)
	, previous: function() {
	    return this.siblings()[this.position() - 1]
	  }
	  // Send given element one step forward
	, forward: function() {
	    var i = this.position() + 1
	      , p = this.parent()

	    // move node one step forward
	    p.removeElement(this).add(this, i)

	    // make sure defs node is always at the top
	    if (p instanceof SVG.Doc)
	      p.node.appendChild(p.defs().node)

	    return this
	  }
	  // Send given element one step backward
	, backward: function() {
	    var i = this.position()

	    if (i > 0)
	      this.parent().removeElement(this).add(this, i - 1)

	    return this
	  }
	  // Send given element all the way to the front
	, front: function() {
	    var p = this.parent()

	    // Move node forward
	    p.node.appendChild(this.node)

	    // Make sure defs node is always at the top
	    if (p instanceof SVG.Doc)
	      p.node.appendChild(p.defs().node)

	    return this
	  }
	  // Send given element all the way to the back
	, back: function() {
	    if (this.position() > 0)
	      this.parent().removeElement(this).add(this, 0)

	    return this
	  }
	  // Inserts a given element before the targeted element
	, before: function(element) {
	    element.remove()

	    var i = this.position()

	    this.parent().add(element, i)

	    return this
	  }
	  // Insters a given element after the targeted element
	, after: function(element) {
	    element.remove()

	    var i = this.position()

	    this.parent().add(element, i + 1)

	    return this
	  }

	})
	SVG.Mask = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('mask'))

	    // keep references to masked elements
	    this.targets = []
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Unmask all masked elements and remove itself
	    remove: function() {
	      // unmask all targets
	      for (var i = this.targets.length - 1; i >= 0; i--)
	        if (this.targets[i])
	          this.targets[i].unmask()
	      this.targets = []

	      // remove mask from parent
	      this.parent().removeElement(this)

	      return this
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create masking element
	    mask: function() {
	      return this.defs().put(new SVG.Mask)
	    }
	  }
	})


	SVG.extend(SVG.Element, {
	  // Distribute mask to svg element
	  maskWith: function(element) {
	    // use given mask or create a new one
	    this.masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element)

	    // store reverence on self in mask
	    this.masker.targets.push(this)

	    // apply mask
	    return this.attr('mask', 'url("#' + this.masker.attr('id') + '")')
	  }
	  // Unmask element
	, unmask: function() {
	    delete this.masker
	    return this.attr('mask', null)
	  }

	})

	SVG.ClipPath = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('clipPath'))

	    // keep references to clipped elements
	    this.targets = []
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Unclip all clipped elements and remove itself
	    remove: function() {
	      // unclip all targets
	      for (var i = this.targets.length - 1; i >= 0; i--)
	        if (this.targets[i])
	          this.targets[i].unclip()
	      this.targets = []

	      // remove clipPath from parent
	      this.parent().removeElement(this)

	      return this
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create clipping element
	    clip: function() {
	      return this.defs().put(new SVG.ClipPath)
	    }
	  }
	})

	//
	SVG.extend(SVG.Element, {
	  // Distribute clipPath to svg element
	  clipWith: function(element) {
	    // use given clip or create a new one
	    this.clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element)

	    // store reverence on self in mask
	    this.clipper.targets.push(this)

	    // apply mask
	    return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")')
	  }
	  // Unclip element
	, unclip: function() {
	    delete this.clipper
	    return this.attr('clip-path', null)
	  }

	})
	SVG.Gradient = SVG.invent({
	  // Initialize node
	  create: function(type) {
	    this.constructor.call(this, SVG.create(type + 'Gradient'))

	    // store type
	    this.type = type
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Add a color stop
	    at: function(offset, color, opacity) {
	      return this.put(new SVG.Stop).update(offset, color, opacity)
	    }
	    // Update gradient
	  , update: function(block) {
	      // remove all stops
	      this.clear()

	      // invoke passed block
	      if (typeof block == 'function')
	        block.call(this, this)

	      return this
	    }
	    // Return the fill id
	  , fill: function() {
	      return 'url(#' + this.id() + ')'
	    }
	    // Alias string convertion to fill
	  , toString: function() {
	      return this.fill()
	    }
	    // custom attr to handle transform
	  , attr: function(a, b, c) {
	      if(a == 'transform') a = 'gradientTransform'
	      return SVG.Container.prototype.attr.call(this, a, b, c)
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create gradient element in defs
	    gradient: function(type, block) {
	      return this.defs().gradient(type, block)
	    }
	  }
	})

	// Add animatable methods to both gradient and fx module
	SVG.extend(SVG.Gradient, SVG.FX, {
	  // From position
	  from: function(x, y) {
	    return (this.target || this).type == 'radial' ?
	      this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
	      this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
	  }
	  // To position
	, to: function(x, y) {
	    return (this.target || this).type == 'radial' ?
	      this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
	      this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
	  }
	})

	// Base gradient generation
	SVG.extend(SVG.Defs, {
	  // define gradient
	  gradient: function(type, block) {
	    return this.put(new SVG.Gradient(type)).update(block)
	  }

	})

	SVG.Stop = SVG.invent({
	  // Initialize node
	  create: 'stop'

	  // Inherit from
	, inherit: SVG.Element

	  // Add class methods
	, extend: {
	    // add color stops
	    update: function(o) {
	      if (typeof o == 'number' || o instanceof SVG.Number) {
	        o = {
	          offset:  arguments[0]
	        , color:   arguments[1]
	        , opacity: arguments[2]
	        }
	      }

	      // set attributes
	      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
	      if (o.color   != null) this.attr('stop-color', o.color)
	      if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))

	      return this
	    }
	  }

	})

	SVG.Pattern = SVG.invent({
	  // Initialize node
	  create: 'pattern'

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Return the fill id
	    fill: function() {
	      return 'url(#' + this.id() + ')'
	    }
	    // Update pattern by rebuilding
	  , update: function(block) {
	      // remove content
	      this.clear()

	      // invoke passed block
	      if (typeof block == 'function')
	        block.call(this, this)

	      return this
	    }
	    // Alias string convertion to fill
	  , toString: function() {
	      return this.fill()
	    }
	    // custom attr to handle transform
	  , attr: function(a, b, c) {
	      if(a == 'transform') a = 'patternTransform'
	      return SVG.Container.prototype.attr.call(this, a, b, c)
	    }

	  }

	  // Add parent method
	, construct: {
	    // Create pattern element in defs
	    pattern: function(width, height, block) {
	      return this.defs().pattern(width, height, block)
	    }
	  }
	})

	SVG.extend(SVG.Defs, {
	  // Define gradient
	  pattern: function(width, height, block) {
	    return this.put(new SVG.Pattern).update(block).attr({
	      x:            0
	    , y:            0
	    , width:        width
	    , height:       height
	    , patternUnits: 'userSpaceOnUse'
	    })
	  }

	})
	SVG.Doc = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    if (element) {
	      // ensure the presence of a dom element
	      element = typeof element == 'string' ?
	        document.getElementById(element) :
	        element

	      // If the target is an svg element, use that element as the main wrapper.
	      // This allows svg.js to work with svg documents as well.
	      if (element.nodeName == 'svg') {
	        this.constructor.call(this, element)
	      } else {
	        this.constructor.call(this, SVG.create('svg'))
	        element.appendChild(this.node)
	      }

	      // set svg element attributes and ensure defs node
	      this.namespace().size('100%', '100%').defs()
	    }
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Add namespaces
	    namespace: function() {
	      return this
	        .attr({ xmlns: SVG.ns, version: '1.1' })
	        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
	        .attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns)
	    }
	    // Creates and returns defs element
	  , defs: function() {
	      if (!this._defs) {
	        var defs

	        // Find or create a defs element in this instance
	        if (defs = this.node.getElementsByTagName('defs')[0])
	          this._defs = SVG.adopt(defs)
	        else
	          this._defs = new SVG.Defs

	        // Make sure the defs node is at the end of the stack
	        this.node.appendChild(this._defs.node)
	      }

	      return this._defs
	    }
	    // custom parent method
	  , parent: function() {
	      return this.node.parentNode.nodeName == '#document' ? null : this.node.parentNode
	    }
	    // Fix for possible sub-pixel offset. See:
	    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
	  , spof: function(spof) {
	      var pos = this.node.getScreenCTM()

	      if (pos)
	        this
	          .style('left', (-pos.e % 1) + 'px')
	          .style('top',  (-pos.f % 1) + 'px')

	      return this
	    }

	      // Removes the doc from the DOM
	  , remove: function() {
	      if(this.parent()) {
	        this.parent().removeChild(this.node);
	      }

	      return this;
	    }
	  }

	})

	SVG.Shape = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    this.constructor.call(this, element)
	  }

	  // Inherit from
	, inherit: SVG.Element

	})

	SVG.Bare = SVG.invent({
	  // Initialize
	  create: function(element, inherit) {
	    // construct element
	    this.constructor.call(this, SVG.create(element))

	    // inherit custom methods
	    if (inherit)
	      for (var method in inherit.prototype)
	        if (typeof inherit.prototype[method] === 'function')
	          this[method] = inherit.prototype[method]
	  }

	  // Inherit from
	, inherit: SVG.Element

	  // Add methods
	, extend: {
	    // Insert some plain text
	    words: function(text) {
	      // remove contents
	      while (this.node.hasChildNodes())
	        this.node.removeChild(this.node.lastChild)

	      // create text node
	      this.node.appendChild(document.createTextNode(text))

	      return this
	    }
	  }
	})


	SVG.extend(SVG.Parent, {
	  // Create an element that is not described by SVG.js
	  element: function(element, inherit) {
	    return this.put(new SVG.Bare(element, inherit))
	  }
	  // Add symbol element
	, symbol: function() {
	    return this.defs().element('symbol', SVG.Container)
	  }

	})
	SVG.Use = SVG.invent({
	  // Initialize node
	  create: 'use'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // Use element as a reference
	    element: function(element, file) {
	      // Set lined element
	      return this.attr('href', (file || '') + '#' + element, SVG.xlink)
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create a use element
	    use: function(element, file) {
	      return this.put(new SVG.Use).element(element, file)
	    }
	  }
	})
	SVG.Rect = SVG.invent({
	  // Initialize node
	  create: 'rect'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add parent method
	, construct: {
	    // Create a rect element
	    rect: function(width, height) {
	      return this.put(new SVG.Rect()).size(width, height)
	    }
	  }
	})
	SVG.Circle = SVG.invent({
	  // Initialize node
	  create: 'circle'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add parent method
	, construct: {
	    // Create circle element, based on ellipse
	    circle: function(size) {
	      return this.put(new SVG.Circle).rx(new SVG.Number(size).divide(2)).move(0, 0)
	    }
	  }
	})

	SVG.extend(SVG.Circle, SVG.FX, {
	  // Radius x value
	  rx: function(rx) {
	    return this.attr('r', rx)
	  }
	  // Alias radius x value
	, ry: function(ry) {
	    return this.rx(ry)
	  }
	})

	SVG.Ellipse = SVG.invent({
	  // Initialize node
	  create: 'ellipse'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add parent method
	, construct: {
	    // Create an ellipse
	    ellipse: function(width, height) {
	      return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
	    }
	  }
	})

	SVG.extend(SVG.Ellipse, SVG.Rect, SVG.FX, {
	  // Radius x value
	  rx: function(rx) {
	    return this.attr('rx', rx)
	  }
	  // Radius y value
	, ry: function(ry) {
	    return this.attr('ry', ry)
	  }
	})

	// Add common method
	SVG.extend(SVG.Circle, SVG.Ellipse, {
	    // Move over x-axis
	    x: function(x) {
	      return x == null ? this.cx() - this.rx() : this.cx(x + this.rx())
	    }
	    // Move over y-axis
	  , y: function(y) {
	      return y == null ? this.cy() - this.ry() : this.cy(y + this.ry())
	    }
	    // Move by center over x-axis
	  , cx: function(x) {
	      return x == null ? this.attr('cx') : this.attr('cx', x)
	    }
	    // Move by center over y-axis
	  , cy: function(y) {
	      return y == null ? this.attr('cy') : this.attr('cy', y)
	    }
	    // Set width of element
	  , width: function(width) {
	      return width == null ? this.rx() * 2 : this.rx(new SVG.Number(width).divide(2))
	    }
	    // Set height of element
	  , height: function(height) {
	      return height == null ? this.ry() * 2 : this.ry(new SVG.Number(height).divide(2))
	    }
	    // Custom size function
	  , size: function(width, height) {
	      var p = proportionalSize(this.bbox(), width, height)

	      return this
	        .rx(new SVG.Number(p.width).divide(2))
	        .ry(new SVG.Number(p.height).divide(2))
	    }
	})
	SVG.Line = SVG.invent({
	  // Initialize node
	  create: 'line'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // Get array
	    array: function() {
	      return new SVG.PointArray([
	        [ this.attr('x1'), this.attr('y1') ]
	      , [ this.attr('x2'), this.attr('y2') ]
	      ])
	    }
	    // Overwrite native plot() method
	  , plot: function(x1, y1, x2, y2) {
	      if (arguments.length == 4)
	        x1 = { x1: x1, y1: y1, x2: x2, y2: y2 }
	      else
	        x1 = new SVG.PointArray(x1).toLine()

	      return this.attr(x1)
	    }
	    // Move by left top corner
	  , move: function(x, y) {
	      return this.attr(this.array().move(x, y).toLine())
	    }
	    // Set element size to given width and height
	  , size: function(width, height) {
	      var p = proportionalSize(this.bbox(), width, height)

	      return this.attr(this.array().size(p.width, p.height).toLine())
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create a line element
	    line: function(x1, y1, x2, y2) {
	      return this.put(new SVG.Line).plot(x1, y1, x2, y2)
	    }
	  }
	})

	SVG.Polyline = SVG.invent({
	  // Initialize node
	  create: 'polyline'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add parent method
	, construct: {
	    // Create a wrapped polyline element
	    polyline: function(p) {
	      return this.put(new SVG.Polyline).plot(p)
	    }
	  }
	})

	SVG.Polygon = SVG.invent({
	  // Initialize node
	  create: 'polygon'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add parent method
	, construct: {
	    // Create a wrapped polygon element
	    polygon: function(p) {
	      return this.put(new SVG.Polygon).plot(p)
	    }
	  }
	})

	// Add polygon-specific functions
	SVG.extend(SVG.Polyline, SVG.Polygon, {
	  // Get array
	  array: function() {
	    return this._array || (this._array = new SVG.PointArray(this.attr('points')))
	  }
	  // Plot new path
	, plot: function(p) {
	    return this.attr('points', (this._array = new SVG.PointArray(p)))
	  }
	  // Move by left top corner
	, move: function(x, y) {
	    return this.attr('points', this.array().move(x, y))
	  }
	  // Set element size to given width and height
	, size: function(width, height) {
	    var p = proportionalSize(this.bbox(), width, height)

	    return this.attr('points', this.array().size(p.width, p.height))
	  }

	})
	// unify all point to point elements
	SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, {
	  // Define morphable array
	  morphArray:  SVG.PointArray
	  // Move by left top corner over x-axis
	, x: function(x) {
	    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
	  }
	  // Move by left top corner over y-axis
	, y: function(y) {
	    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
	  }
	  // Set width of element
	, width: function(width) {
	    var b = this.bbox()

	    return width == null ? b.width : this.size(width, b.height)
	  }
	  // Set height of element
	, height: function(height) {
	    var b = this.bbox()

	    return height == null ? b.height : this.size(b.width, height)
	  }
	})
	SVG.Path = SVG.invent({
	  // Initialize node
	  create: 'path'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // Define morphable array
	    morphArray:  SVG.PathArray
	    // Get array
	  , array: function() {
	      return this._array || (this._array = new SVG.PathArray(this.attr('d')))
	    }
	    // Plot new poly points
	  , plot: function(p) {
	      return this.attr('d', (this._array = new SVG.PathArray(p)))
	    }
	    // Move by left top corner
	  , move: function(x, y) {
	      return this.attr('d', this.array().move(x, y))
	    }
	    // Move by left top corner over x-axis
	  , x: function(x) {
	      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
	    }
	    // Move by left top corner over y-axis
	  , y: function(y) {
	      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
	    }
	    // Set element size to given width and height
	  , size: function(width, height) {
	      var p = proportionalSize(this.bbox(), width, height)

	      return this.attr('d', this.array().size(p.width, p.height))
	    }
	    // Set width of element
	  , width: function(width) {
	      return width == null ? this.bbox().width : this.size(width, this.bbox().height)
	    }
	    // Set height of element
	  , height: function(height) {
	      return height == null ? this.bbox().height : this.size(this.bbox().width, height)
	    }

	  }

	  // Add parent method
	, construct: {
	    // Create a wrapped path element
	    path: function(d) {
	      return this.put(new SVG.Path).plot(d)
	    }
	  }
	})
	SVG.Image = SVG.invent({
	  // Initialize node
	  create: 'image'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // (re)load image
	    load: function(url) {
	      if (!url) return this

	      var self = this
	        , img  = document.createElement('img')

	      // preload image
	      img.onload = function() {
	        var p = self.parent(SVG.Pattern)

	        if(p === null) return

	        // ensure image size
	        if (self.width() == 0 && self.height() == 0)
	          self.size(img.width, img.height)

	        // ensure pattern size if not set
	        if (p && p.width() == 0 && p.height() == 0)
	          p.size(self.width(), self.height())

	        // callback
	        if (typeof self._loaded === 'function')
	          self._loaded.call(self, {
	            width:  img.width
	          , height: img.height
	          , ratio:  img.width / img.height
	          , url:    url
	          })
	      }

	      return this.attr('href', (img.src = this.src = url), SVG.xlink)
	    }
	    // Add loaded callback
	  , loaded: function(loaded) {
	      this._loaded = loaded
	      return this
	    }
	  }

	  // Add parent method
	, construct: {
	    // create image element, load image and set its size
	    image: function(source, width, height) {
	      return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
	    }
	  }

	})
	SVG.Text = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('text'))

	    this.dom.leading = new SVG.Number(1.3)    // store leading value for rebuilding
	    this._rebuild = true                      // enable automatic updating of dy values
	    this._build   = false                     // disable build mode for adding multiple lines

	    // set default font
	    this.attr('font-family', SVG.defaults.attrs['font-family'])
	  }

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    clone: function(){
	      // clone element and assign new id
	      var clone = assignNewId(this.node.cloneNode(true))

	      // insert the clone after myself
	      this.after(clone)

	      return clone
	    }
	    // Move over x-axis
	  , x: function(x) {
	      // act as getter
	      if (x == null)
	        return this.attr('x')

	      // move lines as well if no textPath is present
	      if (!this.textPath)
	        this.lines().each(function() { if (this.dom.newLined) this.x(x) })

	      return this.attr('x', x)
	    }
	    // Move over y-axis
	  , y: function(y) {
	      var oy = this.attr('y')
	        , o  = typeof oy === 'number' ? oy - this.bbox().y : 0

	      // act as getter
	      if (y == null)
	        return typeof oy === 'number' ? oy - o : oy

	      return this.attr('y', typeof y === 'number' ? y + o : y)
	    }
	    // Move center over x-axis
	  , cx: function(x) {
	      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
	    }
	    // Move center over y-axis
	  , cy: function(y) {
	      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
	    }
	    // Set the text content
	  , text: function(text) {
	      // act as getter
	      if (typeof text === 'undefined'){
	        var text = ''
	        var children = this.node.childNodes
	        for(var i = 0, len = children.length; i < len; ++i){

	          // add newline if its not the first child and newLined is set to true
	          if(i != 0 && children[i].nodeType != 3 && SVG.adopt(children[i]).dom.newLined == true){
	            text += '\n'
	          }

	          // add content of this node
	          text += children[i].textContent
	        }

	        return text
	      }

	      // remove existing content
	      this.clear().build(true)

	      if (typeof text === 'function') {
	        // call block
	        text.call(this, this)

	      } else {
	        // store text and make sure text is not blank
	        text = text.split('\n')

	        // build new lines
	        for (var i = 0, il = text.length; i < il; i++)
	          this.tspan(text[i]).newLine()
	      }

	      // disable build mode and rebuild lines
	      return this.build(false).rebuild()
	    }
	    // Set font size
	  , size: function(size) {
	      return this.attr('font-size', size).rebuild()
	    }
	    // Set / get leading
	  , leading: function(value) {
	      // act as getter
	      if (value == null)
	        return this.dom.leading

	      // act as setter
	      this.dom.leading = new SVG.Number(value)

	      return this.rebuild()
	    }
	    // Get all the first level lines
	  , lines: function() {
	      // filter tspans and map them to SVG.js instances
	      var lines = SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(el){
	        return SVG.adopt(el)
	      })

	      // return an instance of SVG.set
	      return new SVG.Set(lines)
	    }
	    // Rebuild appearance type
	  , rebuild: function(rebuild) {
	      // store new rebuild flag if given
	      if (typeof rebuild == 'boolean')
	        this._rebuild = rebuild

	      // define position of all lines
	      if (this._rebuild) {
	        var self = this
	          , blankLineOffset = 0
	          , dy = this.dom.leading * new SVG.Number(this.attr('font-size'))

	        this.lines().each(function() {
	          if (this.dom.newLined) {
	            if (!this.textPath)
	              this.attr('x', self.attr('x'))

	            if(this.text() == '\n') {
	              blankLineOffset += dy
	            }else{
	              this.attr('dy', dy + blankLineOffset)
	              blankLineOffset = 0
	            }
	          }
	        })

	        this.fire('rebuild')
	      }

	      return this
	    }
	    // Enable / disable build mode
	  , build: function(build) {
	      this._build = !!build
	      return this
	    }
	    // overwrite method from parent to set data properly
	  , setData: function(o){
	      this.dom = o
	      this.dom.leading = o.leading ? new SVG.Number(o.leading.value, o.leading.unit) : new SVG.Number(1.3)
	      return this
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create text element
	    text: function(text) {
	      return this.put(new SVG.Text).text(text)
	    }
	    // Create plain text element
	  , plain: function(text) {
	      return this.put(new SVG.Text).plain(text)
	    }
	  }

	})

	SVG.Tspan = SVG.invent({
	  // Initialize node
	  create: 'tspan'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // Set text content
	    text: function(text) {
	      if(text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')

	      typeof text === 'function' ? text.call(this, this) : this.plain(text)

	      return this
	    }
	    // Shortcut dx
	  , dx: function(dx) {
	      return this.attr('dx', dx)
	    }
	    // Shortcut dy
	  , dy: function(dy) {
	      return this.attr('dy', dy)
	    }
	    // Create new line
	  , newLine: function() {
	      // fetch text parent
	      var t = this.parent(SVG.Text)

	      // mark new line
	      this.dom.newLined = true

	      // apply new hy¡n
	      return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x())
	    }
	  }

	})

	SVG.extend(SVG.Text, SVG.Tspan, {
	  // Create plain text node
	  plain: function(text) {
	    // clear if build mode is disabled
	    if (this._build === false)
	      this.clear()

	    // create text node
	    this.node.appendChild(document.createTextNode(text))

	    return this
	  }
	  // Create a tspan
	, tspan: function(text) {
	    var node  = (this.textPath && this.textPath() || this).node
	      , tspan = new SVG.Tspan

	    // clear if build mode is disabled
	    if (this._build === false)
	      this.clear()

	    // add new tspan
	    node.appendChild(tspan.node)

	    return tspan.text(text)
	  }
	  // Clear all lines
	, clear: function() {
	    var node = (this.textPath && this.textPath() || this).node

	    // remove existing child nodes
	    while (node.hasChildNodes())
	      node.removeChild(node.lastChild)

	    return this
	  }
	  // Get length of text element
	, length: function() {
	    return this.node.getComputedTextLength()
	  }
	})

	SVG.TextPath = SVG.invent({
	  // Initialize node
	  create: 'textPath'

	  // Inherit from
	, inherit: SVG.Element

	  // Define parent class
	, parent: SVG.Text

	  // Add parent method
	, construct: {
	    // Create path for text to run on
	    path: function(d) {
	      // create textPath element
	      var path  = new SVG.TextPath
	        , track = this.doc().defs().path(d)

	      // move lines to textpath
	      while (this.node.hasChildNodes())
	        path.node.appendChild(this.node.firstChild)

	      // add textPath element as child node
	      this.node.appendChild(path.node)

	      // link textPath to path and add content
	      path.attr('href', '#' + track, SVG.xlink)

	      return this
	    }
	    // Plot path if any
	  , plot: function(d) {
	      var track = this.track()

	      if (track)
	        track.plot(d)

	      return this
	    }
	    // Get the path track element
	  , track: function() {
	      var path = this.textPath()

	      if (path)
	        return path.reference('href')
	    }
	    // Get the textPath child
	  , textPath: function() {
	      if (this.node.firstChild && this.node.firstChild.nodeName == 'textPath')
	        return SVG.adopt(this.node.firstChild)
	    }
	  }
	})
	SVG.Nested = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('svg'))

	    this.style('overflow', 'visible')
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add parent method
	, construct: {
	    // Create nested svg document
	    nested: function() {
	      return this.put(new SVG.Nested)
	    }
	  }
	})
	SVG.A = SVG.invent({
	  // Initialize node
	  create: 'a'

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Link url
	    to: function(url) {
	      return this.attr('href', url, SVG.xlink)
	    }
	    // Link show attribute
	  , show: function(target) {
	      return this.attr('show', target, SVG.xlink)
	    }
	    // Link target attribute
	  , target: function(target) {
	      return this.attr('target', target)
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create a hyperlink element
	    link: function(url) {
	      return this.put(new SVG.A).to(url)
	    }
	  }
	})

	SVG.extend(SVG.Element, {
	  // Create a hyperlink element
	  linkTo: function(url) {
	    var link = new SVG.A

	    if (typeof url == 'function')
	      url.call(link, link)
	    else
	      link.to(url)

	    return this.parent().put(link).put(this)
	  }

	})
	SVG.Marker = SVG.invent({
	  // Initialize node
	  create: 'marker'

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Set width of element
	    width: function(width) {
	      return this.attr('markerWidth', width)
	    }
	    // Set height of element
	  , height: function(height) {
	      return this.attr('markerHeight', height)
	    }
	    // Set marker refX and refY
	  , ref: function(x, y) {
	      return this.attr('refX', x).attr('refY', y)
	    }
	    // Update marker
	  , update: function(block) {
	      // remove all content
	      this.clear()

	      // invoke passed block
	      if (typeof block == 'function')
	        block.call(this, this)

	      return this
	    }
	    // Return the fill id
	  , toString: function() {
	      return 'url(#' + this.id() + ')'
	    }
	  }

	  // Add parent method
	, construct: {
	    marker: function(width, height, block) {
	      // Create marker element in defs
	      return this.defs().marker(width, height, block)
	    }
	  }

	})

	SVG.extend(SVG.Defs, {
	  // Create marker
	  marker: function(width, height, block) {
	    // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
	    return this.put(new SVG.Marker)
	      .size(width, height)
	      .ref(width / 2, height / 2)
	      .viewbox(0, 0, width, height)
	      .attr('orient', 'auto')
	      .update(block)
	  }

	})

	SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path, {
	  // Create and attach markers
	  marker: function(marker, width, height, block) {
	    var attr = ['marker']

	    // Build attribute name
	    if (marker != 'all') attr.push(marker)
	    attr = attr.join('-')

	    // Set marker attribute
	    marker = arguments[1] instanceof SVG.Marker ?
	      arguments[1] :
	      this.doc().marker(width, height, block)

	    return this.attr(attr, marker)
	  }

	})
	// Define list of available attributes for stroke and fill
	var sugar = {
	  stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
	, fill:   ['color', 'opacity', 'rule']
	, prefix: function(t, a) {
	    return a == 'color' ? t : t + '-' + a
	  }
	}

	// Add sugar for fill and stroke
	;['fill', 'stroke'].forEach(function(m) {
	  var i, extension = {}

	  extension[m] = function(o) {
	    if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
	      this.attr(m, o)

	    else
	      // set all attributes from sugar.fill and sugar.stroke list
	      for (i = sugar[m].length - 1; i >= 0; i--)
	        if (o[sugar[m][i]] != null)
	          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])

	    return this
	  }

	  SVG.extend(SVG.Element, SVG.FX, extension)

	})

	SVG.extend(SVG.Element, SVG.FX, {
	  // Map rotation to transform
	  rotate: function(d, cx, cy) {
	    return this.transform({ rotation: d, cx: cx, cy: cy })
	  }
	  // Map skew to transform
	, skew: function(x, y, cx, cy) {
	    return this.transform({ skewX: x, skewY: y, cx: cx, cy: cy })
	  }
	  // Map scale to transform
	, scale: function(x, y, cx, cy) {
	    return arguments.length == 1  || arguments.length == 3 ?
	      this.transform({ scale: x, cx: y, cy: cx }) :
	      this.transform({ scaleX: x, scaleY: y, cx: cx, cy: cy })
	  }
	  // Map translate to transform
	, translate: function(x, y) {
	    return this.transform({ x: x, y: y })
	  }
	  // Map flip to transform
	, flip: function(a, o) {
	    return this.transform({ flip: a, offset: o })
	  }
	  // Map matrix to transform
	, matrix: function(m) {
	    return this.attr('transform', new SVG.Matrix(m))
	  }
	  // Opacity
	, opacity: function(value) {
	    return this.attr('opacity', value)
	  }
	  // Relative move over x axis
	, dx: function(x) {
	    return this.x((this.target || this).x() + x)
	  }
	  // Relative move over y axis
	, dy: function(y) {
	    return this.y((this.target || this).y() + y)
	  }
	  // Relative move over x and y axes
	, dmove: function(x, y) {
	    return this.dx(x).dy(y)
	  }
	})

	SVG.extend(SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.FX, {
	  // Add x and y radius
	  radius: function(x, y) {
	    var type = (this.target || this).type;
	    return type == 'radial' || type == 'circle' ?
	      this.attr({ 'r': new SVG.Number(x) }) :
	      this.rx(x).ry(y == null ? x : y)
	  }
	})

	SVG.extend(SVG.Path, {
	  // Get path length
	  length: function() {
	    return this.node.getTotalLength()
	  }
	  // Get point at length
	, pointAt: function(length) {
	    return this.node.getPointAtLength(length)
	  }
	})

	SVG.extend(SVG.Parent, SVG.Text, SVG.FX, {
	  // Set font
	  font: function(o) {
	    for (var k in o)
	      k == 'leading' ?
	        this.leading(o[k]) :
	      k == 'anchor' ?
	        this.attr('text-anchor', o[k]) :
	      k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style' ?
	        this.attr('font-'+ k, o[k]) :
	        this.attr(k, o[k])

	    return this
	  }
	})


	SVG.Set = SVG.invent({
	  // Initialize
	  create: function(members) {
	    // Set initial state
	    Array.isArray(members) ? this.members = members : this.clear()
	  }

	  // Add class methods
	, extend: {
	    // Add element to set
	    add: function() {
	      var i, il, elements = [].slice.call(arguments)

	      for (i = 0, il = elements.length; i < il; i++)
	        this.members.push(elements[i])

	      return this
	    }
	    // Remove element from set
	  , remove: function(element) {
	      var i = this.index(element)

	      // remove given child
	      if (i > -1)
	        this.members.splice(i, 1)

	      return this
	    }
	    // Iterate over all members
	  , each: function(block) {
	      for (var i = 0, il = this.members.length; i < il; i++)
	        block.apply(this.members[i], [i, this.members])

	      return this
	    }
	    // Restore to defaults
	  , clear: function() {
	      // initialize store
	      this.members = []

	      return this
	    }
	    // Get the length of a set
	  , length: function() {
	      return this.members.length
	    }
	    // Checks if a given element is present in set
	  , has: function(element) {
	      return this.index(element) >= 0
	    }
	    // retuns index of given element in set
	  , index: function(element) {
	      return this.members.indexOf(element)
	    }
	    // Get member at given index
	  , get: function(i) {
	      return this.members[i]
	    }
	    // Get first member
	  , first: function() {
	      return this.get(0)
	    }
	    // Get last member
	  , last: function() {
	      return this.get(this.members.length - 1)
	    }
	    // Default value
	  , valueOf: function() {
	      return this.members
	    }
	    // Get the bounding box of all members included or empty box if set has no items
	  , bbox: function(){
	      var box = new SVG.BBox()

	      // return an empty box of there are no members
	      if (this.members.length == 0)
	        return box

	      // get the first rbox and update the target bbox
	      var rbox = this.members[0].rbox()
	      box.x      = rbox.x
	      box.y      = rbox.y
	      box.width  = rbox.width
	      box.height = rbox.height

	      this.each(function() {
	        // user rbox for correct position and visual representation
	        box = box.merge(this.rbox())
	      })

	      return box
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create a new set
	    set: function(members) {
	      return new SVG.Set(members)
	    }
	  }
	})

	SVG.FX.Set = SVG.invent({
	  // Initialize node
	  create: function(set) {
	    // store reference to set
	    this.set = set
	  }

	})

	// Alias methods
	SVG.Set.inherit = function() {
	  var m
	    , methods = []

	  // gather shape methods
	  for(var m in SVG.Shape.prototype)
	    if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
	      methods.push(m)

	  // apply shape aliasses
	  methods.forEach(function(method) {
	    SVG.Set.prototype[method] = function() {
	      for (var i = 0, il = this.members.length; i < il; i++)
	        if (this.members[i] && typeof this.members[i][method] == 'function')
	          this.members[i][method].apply(this.members[i], arguments)

	      return method == 'animate' ? (this.fx || (this.fx = new SVG.FX.Set(this))) : this
	    }
	  })

	  // clear methods for the next round
	  methods = []

	  // gather fx methods
	  for(var m in SVG.FX.prototype)
	    if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.FX.Set.prototype[m] != 'function')
	      methods.push(m)

	  // apply fx aliasses
	  methods.forEach(function(method) {
	    SVG.FX.Set.prototype[method] = function() {
	      for (var i = 0, il = this.set.members.length; i < il; i++)
	        this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)

	      return this
	    }
	  })
	}




	SVG.extend(SVG.Element, {
	  // Store data values on svg nodes
	  data: function(a, v, r) {
	    if (typeof a == 'object') {
	      for (v in a)
	        this.data(v, a[v])

	    } else if (arguments.length < 2) {
	      try {
	        return JSON.parse(this.attr('data-' + a))
	      } catch(e) {
	        return this.attr('data-' + a)
	      }

	    } else {
	      this.attr(
	        'data-' + a
	      , v === null ?
	          null :
	        r === true || typeof v === 'string' || typeof v === 'number' ?
	          v :
	          JSON.stringify(v)
	      )
	    }

	    return this
	  }
	})
	SVG.extend(SVG.Element, {
	  // Remember arbitrary data
	  remember: function(k, v) {
	    // remember every item in an object individually
	    if (typeof arguments[0] == 'object')
	      for (var v in k)
	        this.remember(v, k[v])

	    // retrieve memory
	    else if (arguments.length == 1)
	      return this.memory()[k]

	    // store memory
	    else
	      this.memory()[k] = v

	    return this
	  }

	  // Erase a given memory
	, forget: function() {
	    if (arguments.length == 0)
	      this._memory = {}
	    else
	      for (var i = arguments.length - 1; i >= 0; i--)
	        delete this.memory()[arguments[i]]

	    return this
	  }

	  // Initialize or return local memory object
	, memory: function() {
	    return this._memory || (this._memory = {})
	  }

	})
	// Method for getting an element by id
	SVG.get = function(id) {
	  var node = document.getElementById(idFromReference(id) || id)
	  return SVG.adopt(node)
	}

	// Select elements by query string
	SVG.select = function(query, parent) {
	  return new SVG.Set(
	    SVG.utils.map((parent || document).querySelectorAll(query), function(node) {
	      return SVG.adopt(node)
	    })
	  )
	}

	SVG.extend(SVG.Parent, {
	  // Scoped select method
	  select: function(query) {
	    return SVG.select(query, this.node)
	  }

	})
	// tests if a given selector matches an element
	function matches(el, selector) {
	  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
	}

	// Convert dash-separated-string to camelCase
	function camelCase(s) {
	  return s.toLowerCase().replace(/-(.)/g, function(m, g) {
	    return g.toUpperCase()
	  })
	}

	// Capitalize first letter of a string
	function capitalize(s) {
	  return s.charAt(0).toUpperCase() + s.slice(1)
	}

	// Ensure to six-based hex
	function fullHex(hex) {
	  return hex.length == 4 ?
	    [ '#',
	      hex.substring(1, 2), hex.substring(1, 2)
	    , hex.substring(2, 3), hex.substring(2, 3)
	    , hex.substring(3, 4), hex.substring(3, 4)
	    ].join('') : hex
	}

	// Component to hex value
	function compToHex(comp) {
	  var hex = comp.toString(16)
	  return hex.length == 1 ? '0' + hex : hex
	}

	// Calculate proportional width and height values when necessary
	function proportionalSize(box, width, height) {
	  if (height == null)
	    height = box.height / box.width * width
	  else if (width == null)
	    width = box.width / box.height * height

	  return {
	    width:  width
	  , height: height
	  }
	}

	// Delta transform point
	function deltaTransformPoint(matrix, x, y) {
	  return {
	    x: x * matrix.a + y * matrix.c + 0
	  , y: x * matrix.b + y * matrix.d + 0
	  }
	}

	// Map matrix array to object
	function arrayToMatrix(a) {
	  return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
	}

	// Parse matrix if required
	function parseMatrix(matrix) {
	  if (!(matrix instanceof SVG.Matrix))
	    matrix = new SVG.Matrix(matrix)

	  return matrix
	}

	// Add centre point to transform object
	function ensureCentre(o, target) {
	  o.cx = o.cx == null ? target.bbox().cx : o.cx
	  o.cy = o.cy == null ? target.bbox().cy : o.cy
	}

	// Convert string to matrix
	function stringToMatrix(source) {
	  // remove matrix wrapper and split to individual numbers
	  source = source
	    .replace(SVG.regex.whitespace, '')
	    .replace(SVG.regex.matrix, '')
	    .split(SVG.regex.matrixElements)

	  // convert string values to floats and convert to a matrix-formatted object
	  return arrayToMatrix(
	    SVG.utils.map(source, function(n) {
	      return parseFloat(n)
	    })
	  )
	}

	// Calculate position according to from and to
	function at(o, pos) {
	  // number recalculation (don't bother converting to SVG.Number for performance reasons)
	  return typeof o.from == 'number' ?
	    o.from + (o.to - o.from) * pos :

	  // instance recalculation
	  o instanceof SVG.Color || o instanceof SVG.Number || o instanceof SVG.Matrix ? o.at(pos) :

	  // for all other values wait until pos has reached 1 to return the final value
	  pos < 1 ? o.from : o.to
	}

	// PathArray Helpers
	function arrayToString(a) {
	  for (var i = 0, il = a.length, s = ''; i < il; i++) {
	    s += a[i][0]

	    if (a[i][1] != null) {
	      s += a[i][1]

	      if (a[i][2] != null) {
	        s += ' '
	        s += a[i][2]

	        if (a[i][3] != null) {
	          s += ' '
	          s += a[i][3]
	          s += ' '
	          s += a[i][4]

	          if (a[i][5] != null) {
	            s += ' '
	            s += a[i][5]
	            s += ' '
	            s += a[i][6]

	            if (a[i][7] != null) {
	              s += ' '
	              s += a[i][7]
	            }
	          }
	        }
	      }
	    }
	  }

	  return s + ' '
	}

	// Deep new id assignment
	function assignNewId(node) {
	  // do the same for SVG child nodes as well
	  for (var i = node.childNodes.length - 1; i >= 0; i--)
	    if (node.childNodes[i] instanceof SVGElement)
	      assignNewId(node.childNodes[i])

	  return SVG.adopt(node).id(SVG.eid(node.nodeName))
	}

	// Add more bounding box properties
	function fullBox(b) {
	  if (b.x == null) {
	    b.x      = 0
	    b.y      = 0
	    b.width  = 0
	    b.height = 0
	  }

	  b.w  = b.width
	  b.h  = b.height
	  b.x2 = b.x + b.width
	  b.y2 = b.y + b.height
	  b.cx = b.x + b.width / 2
	  b.cy = b.y + b.height / 2

	  return b
	}

	// Get id from reference string
	function idFromReference(url) {
	  var m = url.toString().match(SVG.regex.reference)

	  if (m) return m[1]
	}

	// Create matrix array for looping
	var abcdef = 'abcdef'.split('')
	// Add CustomEvent to IE9 and IE10
	if (typeof CustomEvent !== 'function') {
	  // Code from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
	  var CustomEvent = function(event, options) {
	    options = options || { bubbles: false, cancelable: false, detail: undefined }
	    var e = document.createEvent('CustomEvent')
	    e.initCustomEvent(event, options.bubbles, options.cancelable, options.detail)
	    return e
	  }

	  CustomEvent.prototype = window.Event.prototype

	  window.CustomEvent = CustomEvent
	}

	// requestAnimationFrame / cancelAnimationFrame Polyfill with fallback based on Paul Irish
	(function(w) {
	  var lastTime = 0
	  var vendors = ['moz', 'webkit']

	  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	    w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame']
	    w.cancelAnimationFrame  = w[vendors[x] + 'CancelAnimationFrame'] ||
	                              w[vendors[x] + 'CancelRequestAnimationFrame']
	  }

	  w.requestAnimationFrame = w.requestAnimationFrame ||
	    function(callback) {
	      var currTime = new Date().getTime()
	      var timeToCall = Math.max(0, 16 - (currTime - lastTime))

	      var id = w.setTimeout(function() {
	        callback(currTime + timeToCall)
	      }, timeToCall)

	      lastTime = currTime + timeToCall
	      return id
	    }

	  w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;

	}(window))

	return SVG

	}));

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	__webpack_require__(27);

	__webpack_require__(214);

	if (global._babelPolyfill) {
	  throw new Error("only one instance of babel-polyfill is allowed");
	}
	global._babelPolyfill = true;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(28);
	__webpack_require__(61);
	__webpack_require__(67);
	__webpack_require__(69);
	__webpack_require__(71);
	__webpack_require__(73);
	__webpack_require__(75);
	__webpack_require__(77);
	__webpack_require__(78);
	__webpack_require__(79);
	__webpack_require__(80);
	__webpack_require__(81);
	__webpack_require__(82);
	__webpack_require__(83);
	__webpack_require__(84);
	__webpack_require__(85);
	__webpack_require__(86);
	__webpack_require__(87);
	__webpack_require__(88);
	__webpack_require__(91);
	__webpack_require__(92);
	__webpack_require__(93);
	__webpack_require__(95);
	__webpack_require__(96);
	__webpack_require__(97);
	__webpack_require__(98);
	__webpack_require__(99);
	__webpack_require__(100);
	__webpack_require__(101);
	__webpack_require__(103);
	__webpack_require__(104);
	__webpack_require__(105);
	__webpack_require__(107);
	__webpack_require__(108);
	__webpack_require__(109);
	__webpack_require__(111);
	__webpack_require__(112);
	__webpack_require__(113);
	__webpack_require__(114);
	__webpack_require__(115);
	__webpack_require__(116);
	__webpack_require__(117);
	__webpack_require__(118);
	__webpack_require__(119);
	__webpack_require__(120);
	__webpack_require__(121);
	__webpack_require__(122);
	__webpack_require__(123);
	__webpack_require__(124);
	__webpack_require__(129);
	__webpack_require__(130);
	__webpack_require__(134);
	__webpack_require__(135);
	__webpack_require__(137);
	__webpack_require__(138);
	__webpack_require__(143);
	__webpack_require__(144);
	__webpack_require__(147);
	__webpack_require__(149);
	__webpack_require__(151);
	__webpack_require__(153);
	__webpack_require__(154);
	__webpack_require__(155);
	__webpack_require__(157);
	__webpack_require__(158);
	__webpack_require__(160);
	__webpack_require__(161);
	__webpack_require__(162);
	__webpack_require__(163);
	__webpack_require__(170);
	__webpack_require__(173);
	__webpack_require__(174);
	__webpack_require__(176);
	__webpack_require__(177);
	__webpack_require__(178);
	__webpack_require__(179);
	__webpack_require__(180);
	__webpack_require__(181);
	__webpack_require__(182);
	__webpack_require__(183);
	__webpack_require__(184);
	__webpack_require__(185);
	__webpack_require__(186);
	__webpack_require__(187);
	__webpack_require__(189);
	__webpack_require__(190);
	__webpack_require__(191);
	__webpack_require__(192);
	__webpack_require__(193);
	__webpack_require__(194);
	__webpack_require__(196);
	__webpack_require__(197);
	__webpack_require__(198);
	__webpack_require__(199);
	__webpack_require__(201);
	__webpack_require__(202);
	__webpack_require__(204);
	__webpack_require__(205);
	__webpack_require__(207);
	__webpack_require__(208);
	__webpack_require__(209);
	__webpack_require__(212);
	__webpack_require__(213);
	module.exports = __webpack_require__(32);

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $                 = __webpack_require__(29)
	  , $export           = __webpack_require__(30)
	  , DESCRIPTORS       = __webpack_require__(35)
	  , createDesc        = __webpack_require__(34)
	  , html              = __webpack_require__(41)
	  , cel               = __webpack_require__(42)
	  , has               = __webpack_require__(44)
	  , cof               = __webpack_require__(45)
	  , invoke            = __webpack_require__(46)
	  , fails             = __webpack_require__(36)
	  , anObject          = __webpack_require__(47)
	  , aFunction         = __webpack_require__(40)
	  , isObject          = __webpack_require__(43)
	  , toObject          = __webpack_require__(48)
	  , toIObject         = __webpack_require__(50)
	  , toInteger         = __webpack_require__(52)
	  , toIndex           = __webpack_require__(53)
	  , toLength          = __webpack_require__(54)
	  , IObject           = __webpack_require__(51)
	  , IE_PROTO          = __webpack_require__(38)('__proto__')
	  , createArrayMethod = __webpack_require__(55)
	  , arrayIndexOf      = __webpack_require__(60)(false)
	  , ObjectProto       = Object.prototype
	  , ArrayProto        = Array.prototype
	  , arraySlice        = ArrayProto.slice
	  , arrayJoin         = ArrayProto.join
	  , defineProperty    = $.setDesc
	  , getOwnDescriptor  = $.getDesc
	  , defineProperties  = $.setDescs
	  , factories         = {}
	  , IE8_DOM_DEFINE;

	if(!DESCRIPTORS){
	  IE8_DOM_DEFINE = !fails(function(){
	    return defineProperty(cel('div'), 'a', {get: function(){ return 7; }}).a != 7;
	  });
	  $.setDesc = function(O, P, Attributes){
	    if(IE8_DOM_DEFINE)try {
	      return defineProperty(O, P, Attributes);
	    } catch(e){ /* empty */ }
	    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	    if('value' in Attributes)anObject(O)[P] = Attributes.value;
	    return O;
	  };
	  $.getDesc = function(O, P){
	    if(IE8_DOM_DEFINE)try {
	      return getOwnDescriptor(O, P);
	    } catch(e){ /* empty */ }
	    if(has(O, P))return createDesc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
	  };
	  $.setDescs = defineProperties = function(O, Properties){
	    anObject(O);
	    var keys   = $.getKeys(Properties)
	      , length = keys.length
	      , i = 0
	      , P;
	    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
	    return O;
	  };
	}
	$export($export.S + $export.F * !DESCRIPTORS, 'Object', {
	  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $.getDesc,
	  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	  defineProperty: $.setDesc,
	  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
	  defineProperties: defineProperties
	});

	  // IE 8- don't enum bug keys
	var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
	            'toLocaleString,toString,valueOf').split(',')
	  // Additional keys for getOwnPropertyNames
	  , keys2 = keys1.concat('length', 'prototype')
	  , keysLen1 = keys1.length;

	// Create object with `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = cel('iframe')
	    , i      = keysLen1
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict.prototype[keys1[i]];
	  return createDict();
	};
	var createGetKeys = function(names, length){
	  return function(object){
	    var O      = toIObject(object)
	      , i      = 0
	      , result = []
	      , key;
	    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	    // Don't enum bug & hidden keys
	    while(length > i)if(has(O, key = names[i++])){
	      ~arrayIndexOf(result, key) || result.push(key);
	    }
	    return result;
	  };
	};
	var Empty = function(){};
	$export($export.S, 'Object', {
	  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	  getPrototypeOf: $.getProto = $.getProto || function(O){
	    O = toObject(O);
	    if(has(O, IE_PROTO))return O[IE_PROTO];
	    if(typeof O.constructor == 'function' && O instanceof O.constructor){
	      return O.constructor.prototype;
	    } return O instanceof Object ? ObjectProto : null;
	  },
	  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
	  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	  create: $.create = $.create || function(O, /*?*/Properties){
	    var result;
	    if(O !== null){
	      Empty.prototype = anObject(O);
	      result = new Empty();
	      Empty.prototype = null;
	      // add "__proto__" for Object.getPrototypeOf shim
	      result[IE_PROTO] = O;
	    } else result = createDict();
	    return Properties === undefined ? result : defineProperties(result, Properties);
	  },
	  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
	  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false)
	});

	var construct = function(F, len, args){
	  if(!(len in factories)){
	    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
	    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
	  }
	  return factories[len](F, args);
	};

	// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
	$export($export.P, 'Function', {
	  bind: function bind(that /*, args... */){
	    var fn       = aFunction(this)
	      , partArgs = arraySlice.call(arguments, 1);
	    var bound = function(/* args... */){
	      var args = partArgs.concat(arraySlice.call(arguments));
	      return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
	    };
	    if(isObject(fn.prototype))bound.prototype = fn.prototype;
	    return bound;
	  }
	});

	// fallback for not array-like ES3 strings and DOM objects
	$export($export.P + $export.F * fails(function(){
	  if(html)arraySlice.call(html);
	}), 'Array', {
	  slice: function(begin, end){
	    var len   = toLength(this.length)
	      , klass = cof(this);
	    end = end === undefined ? len : end;
	    if(klass == 'Array')return arraySlice.call(this, begin, end);
	    var start  = toIndex(begin, len)
	      , upTo   = toIndex(end, len)
	      , size   = toLength(upTo - start)
	      , cloned = Array(size)
	      , i      = 0;
	    for(; i < size; i++)cloned[i] = klass == 'String'
	      ? this.charAt(start + i)
	      : this[start + i];
	    return cloned;
	  }
	});
	$export($export.P + $export.F * (IObject != Object), 'Array', {
	  join: function join(separator){
	    return arrayJoin.call(IObject(this), separator === undefined ? ',' : separator);
	  }
	});

	// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
	$export($export.S, 'Array', {isArray: __webpack_require__(57)});

	var createArrayReduce = function(isRight){
	  return function(callbackfn, memo){
	    aFunction(callbackfn);
	    var O      = IObject(this)
	      , length = toLength(O.length)
	      , index  = isRight ? length - 1 : 0
	      , i      = isRight ? -1 : 1;
	    if(arguments.length < 2)for(;;){
	      if(index in O){
	        memo = O[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if(isRight ? index < 0 : length <= index){
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }
	    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
	      memo = callbackfn(memo, O[index], index, this);
	    }
	    return memo;
	  };
	};

	var methodize = function($fn){
	  return function(arg1/*, arg2 = undefined */){
	    return $fn(this, arg1, arguments[1]);
	  };
	};

	$export($export.P, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: $.each = $.each || methodize(createArrayMethod(0)),
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: methodize(createArrayMethod(1)),
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: methodize(createArrayMethod(2)),
	  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
	  some: methodize(createArrayMethod(3)),
	  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
	  every: methodize(createArrayMethod(4)),
	  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
	  reduce: createArrayReduce(false),
	  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
	  reduceRight: createArrayReduce(true),
	  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
	  indexOf: methodize(arrayIndexOf),
	  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
	  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
	    var O      = toIObject(this)
	      , length = toLength(O.length)
	      , index  = length - 1;
	    if(arguments.length > 1)index = Math.min(index, toInteger(fromIndex));
	    if(index < 0)index = toLength(length + index);
	    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
	    return -1;
	  }
	});

	// 20.3.3.1 / 15.9.4.4 Date.now()
	$export($export.S, 'Date', {now: function(){ return +new Date; }});

	var lz = function(num){
	  return num > 9 ? num : '0' + num;
	};

	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
	// PhantomJS / old WebKit has a broken implementations
	$export($export.P + $export.F * (fails(function(){
	  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
	}) || !fails(function(){
	  new Date(NaN).toISOString();
	})), 'Date', {
	  toISOString: function toISOString(){
	    if(!isFinite(this))throw RangeError('Invalid time value');
	    var d = this
	      , y = d.getUTCFullYear()
	      , m = d.getUTCMilliseconds()
	      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
	    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
	      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
	      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
	      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
	  }
	});

/***/ },
/* 29 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(31)
	  , core      = __webpack_require__(32)
	  , hide      = __webpack_require__(33)
	  , redefine  = __webpack_require__(37)
	  , ctx       = __webpack_require__(39)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
	    , key, own, out, exp;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if(target && !own)redefine(target, key, out);
	    // export
	    if(exports[key] != out)hide(exports, key, exp);
	    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
	  }
	};
	global.core = core;
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 31 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 32 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(29)
	  , createDesc = __webpack_require__(34);
	module.exports = __webpack_require__(35) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(36)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// add fake Function#toString
	// for correct work wrapped methods / constructors with methods like LoDash isNative
	var global    = __webpack_require__(31)
	  , hide      = __webpack_require__(33)
	  , SRC       = __webpack_require__(38)('src')
	  , TO_STRING = 'toString'
	  , $toString = Function[TO_STRING]
	  , TPL       = ('' + $toString).split(TO_STRING);

	__webpack_require__(32).inspectSource = function(it){
	  return $toString.call(it);
	};

	(module.exports = function(O, key, val, safe){
	  if(typeof val == 'function'){
	    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	    val.hasOwnProperty('name') || hide(val, 'name', key);
	  }
	  if(O === global){
	    O[key] = val;
	  } else {
	    if(!safe)delete O[key];
	    hide(O, key, val);
	  }
	})(Function.prototype, TO_STRING, function toString(){
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});

/***/ },
/* 38 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(40);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(31).document && document.documentElement;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(43)
	  , document = __webpack_require__(31).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(43);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(49);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(51)
	  , defined = __webpack_require__(49);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(45);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(52)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(52)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx      = __webpack_require__(39)
	  , IObject  = __webpack_require__(51)
	  , toObject = __webpack_require__(48)
	  , toLength = __webpack_require__(54)
	  , asc      = __webpack_require__(56);
	module.exports = function(TYPE){
	  var IS_MAP        = TYPE == 1
	    , IS_FILTER     = TYPE == 2
	    , IS_SOME       = TYPE == 3
	    , IS_EVERY      = TYPE == 4
	    , IS_FIND_INDEX = TYPE == 6
	    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
	  return function($this, callbackfn, that){
	    var O      = toObject($this)
	      , self   = IObject(O)
	      , f      = ctx(callbackfn, that, 3)
	      , length = toLength(self.length)
	      , index  = 0
	      , result = IS_MAP ? asc($this, length) : IS_FILTER ? asc($this, 0) : undefined
	      , val, res;
	    for(;length > index; index++)if(NO_HOLES || index in self){
	      val = self[index];
	      res = f(val, index, O);
	      if(TYPE){
	        if(IS_MAP)result[index] = res;            // map
	        else if(res)switch(TYPE){
	          case 3: return true;                    // some
	          case 5: return val;                     // find
	          case 6: return index;                   // findIndex
	          case 2: result.push(val);               // filter
	        } else if(IS_EVERY)return false;          // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var isObject = __webpack_require__(43)
	  , isArray  = __webpack_require__(57)
	  , SPECIES  = __webpack_require__(58)('species');
	module.exports = function(original, length){
	  var C;
	  if(isArray(original)){
	    C = original.constructor;
	    // cross-realm fallback
	    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
	    if(isObject(C)){
	      C = C[SPECIES];
	      if(C === null)C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length);
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(45);
	module.exports = Array.isArray || function(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(59)('wks')
	  , uid    = __webpack_require__(38)
	  , Symbol = __webpack_require__(31).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(31)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(50)
	  , toLength  = __webpack_require__(54)
	  , toIndex   = __webpack_require__(53);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $              = __webpack_require__(29)
	  , global         = __webpack_require__(31)
	  , has            = __webpack_require__(44)
	  , DESCRIPTORS    = __webpack_require__(35)
	  , $export        = __webpack_require__(30)
	  , redefine       = __webpack_require__(37)
	  , $fails         = __webpack_require__(36)
	  , shared         = __webpack_require__(59)
	  , setToStringTag = __webpack_require__(62)
	  , uid            = __webpack_require__(38)
	  , wks            = __webpack_require__(58)
	  , keyOf          = __webpack_require__(63)
	  , $names         = __webpack_require__(64)
	  , enumKeys       = __webpack_require__(65)
	  , isArray        = __webpack_require__(57)
	  , anObject       = __webpack_require__(47)
	  , toIObject      = __webpack_require__(50)
	  , createDesc     = __webpack_require__(34)
	  , getDesc        = $.getDesc
	  , setDesc        = $.setDesc
	  , _create        = $.create
	  , getNames       = $names.get
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , setter         = false
	  , HIDDEN         = wks('_hidden')
	  , isEnum         = $.isEnum
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , useNative      = typeof $Symbol == 'function'
	  , ObjectProto    = Object.prototype;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(setDesc({}, 'a', {
	    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = getDesc(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  setDesc(it, key, D);
	  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
	} : setDesc;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = function(it){
	  return typeof it == 'symbol';
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(D && has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
	    ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  var D = getDesc(it = toIObject(it), key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	};
	var $stringify = function stringify(it){
	  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	  var args = [it]
	    , i    = 1
	    , $$   = arguments
	    , replacer, $replacer;
	  while($$.length > i)args.push($$[i++]);
	  replacer = args[1];
	  if(typeof replacer == 'function')$replacer = replacer;
	  if($replacer || !isArray(replacer))replacer = function(key, value){
	    if($replacer)value = $replacer.call(this, key, value);
	    if(!isSymbol(value))return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(){
	    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString(){
	    return this._k;
	  });

	  isSymbol = function(it){
	    return it instanceof $Symbol;
	  };

	  $.create     = $create;
	  $.isEnum     = $propertyIsEnumerable;
	  $.getDesc    = $getOwnPropertyDescriptor;
	  $.setDesc    = $defineProperty;
	  $.setDescs   = $defineProperties;
	  $.getNames   = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(66)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	  'species,split,toPrimitive,toStringTag,unscopables'
	).split(','), function(it){
	  var sym = wks(it);
	  symbolStatics[it] = useNative ? sym : wrap(sym);
	});

	setter = true;

	$export($export.G + $export.W, {Symbol: $Symbol});

	$export($export.S, 'Symbol', symbolStatics);

	$export($export.S + $export.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(29).setDesc
	  , has = __webpack_require__(44)
	  , TAG = __webpack_require__(58)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(29)
	  , toIObject = __webpack_require__(50);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(50)
	  , getNames  = __webpack_require__(29).getNames
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var $ = __webpack_require__(29);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getSymbols = $.getSymbols;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = $.isEnum
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
	  }
	  return keys;
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = false;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(30);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(68)});

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(29)
	  , toObject = __webpack_require__(48)
	  , IObject  = __webpack_require__(51);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(36)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.10 Object.is(value1, value2)
	var $export = __webpack_require__(30);
	$export($export.S, 'Object', {is: __webpack_require__(70)});

/***/ },
/* 70 */
/***/ function(module, exports) {

	// 7.2.9 SameValue(x, y)
	module.exports = Object.is || function is(x, y){
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(30);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(72).set});

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(29).getDesc
	  , isObject = __webpack_require__(43)
	  , anObject = __webpack_require__(47);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(39)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.3.6 Object.prototype.toString()
	var classof = __webpack_require__(74)
	  , test    = {};
	test[__webpack_require__(58)('toStringTag')] = 'z';
	if(test + '' != '[object z]'){
	  __webpack_require__(37)(Object.prototype, 'toString', function toString(){
	    return '[object ' + classof(this) + ']';
	  }, true);
	}

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(45)
	  , TAG = __webpack_require__(58)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.5 Object.freeze(O)
	var isObject = __webpack_require__(43);

	__webpack_require__(76)('freeze', function($freeze){
	  return function freeze(it){
	    return $freeze && isObject(it) ? $freeze(it) : it;
	  };
	});

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(30)
	  , core    = __webpack_require__(32)
	  , fails   = __webpack_require__(36);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.17 Object.seal(O)
	var isObject = __webpack_require__(43);

	__webpack_require__(76)('seal', function($seal){
	  return function seal(it){
	    return $seal && isObject(it) ? $seal(it) : it;
	  };
	});

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.15 Object.preventExtensions(O)
	var isObject = __webpack_require__(43);

	__webpack_require__(76)('preventExtensions', function($preventExtensions){
	  return function preventExtensions(it){
	    return $preventExtensions && isObject(it) ? $preventExtensions(it) : it;
	  };
	});

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.12 Object.isFrozen(O)
	var isObject = __webpack_require__(43);

	__webpack_require__(76)('isFrozen', function($isFrozen){
	  return function isFrozen(it){
	    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
	  };
	});

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.13 Object.isSealed(O)
	var isObject = __webpack_require__(43);

	__webpack_require__(76)('isSealed', function($isSealed){
	  return function isSealed(it){
	    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
	  };
	});

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.11 Object.isExtensible(O)
	var isObject = __webpack_require__(43);

	__webpack_require__(76)('isExtensible', function($isExtensible){
	  return function isExtensible(it){
	    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
	  };
	});

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(50);

	__webpack_require__(76)('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(48);

	__webpack_require__(76)('getPrototypeOf', function($getPrototypeOf){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(48);

	__webpack_require__(76)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(76)('getOwnPropertyNames', function(){
	  return __webpack_require__(64).get;
	});

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var setDesc    = __webpack_require__(29).setDesc
	  , createDesc = __webpack_require__(34)
	  , has        = __webpack_require__(44)
	  , FProto     = Function.prototype
	  , nameRE     = /^\s*function ([^ (]*)/
	  , NAME       = 'name';
	// 19.2.4.2 name
	NAME in FProto || __webpack_require__(35) && setDesc(FProto, NAME, {
	  configurable: true,
	  get: function(){
	    var match = ('' + this).match(nameRE)
	      , name  = match ? match[1] : '';
	    has(this, NAME) || setDesc(this, NAME, createDesc(5, name));
	    return name;
	  }
	});

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $             = __webpack_require__(29)
	  , isObject      = __webpack_require__(43)
	  , HAS_INSTANCE  = __webpack_require__(58)('hasInstance')
	  , FunctionProto = Function.prototype;
	// 19.2.3.6 Function.prototype[@@hasInstance](V)
	if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
	  if(typeof this != 'function' || !isObject(O))return false;
	  if(!isObject(this.prototype))return O instanceof this;
	  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	  while(O = $.getProto(O))if(this.prototype === O)return true;
	  return false;
	}});

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $           = __webpack_require__(29)
	  , global      = __webpack_require__(31)
	  , has         = __webpack_require__(44)
	  , cof         = __webpack_require__(45)
	  , toPrimitive = __webpack_require__(89)
	  , fails       = __webpack_require__(36)
	  , $trim       = __webpack_require__(90).trim
	  , NUMBER      = 'Number'
	  , $Number     = global[NUMBER]
	  , Base        = $Number
	  , proto       = $Number.prototype
	  // Opera ~12 has broken Object#toString
	  , BROKEN_COF  = cof($.create(proto)) == NUMBER
	  , TRIM        = 'trim' in String.prototype;

	// 7.1.3 ToNumber(argument)
	var toNumber = function(argument){
	  var it = toPrimitive(argument, false);
	  if(typeof it == 'string' && it.length > 2){
	    it = TRIM ? it.trim() : $trim(it, 3);
	    var first = it.charCodeAt(0)
	      , third, radix, maxCode;
	    if(first === 43 || first === 45){
	      third = it.charCodeAt(2);
	      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if(first === 48){
	      switch(it.charCodeAt(1)){
	        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
	        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
	        default : return +it;
	      }
	      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
	        code = digits.charCodeAt(i);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if(code < 48 || code > maxCode)return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
	  $Number = function Number(value){
	    var it = arguments.length < 1 ? 0 : value
	      , that = this;
	    return that instanceof $Number
	      // check on 1..constructor(foo) case
	      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
	        ? new Base(toNumber(it)) : toNumber(it);
	  };
	  $.each.call(__webpack_require__(35) ? $.getNames(Base) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES6 (in case, if modules with ES6 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), function(key){
	    if(has(Base, key) && !has($Number, key)){
	      $.setDesc($Number, key, $.getDesc(Base, key));
	    }
	  });
	  $Number.prototype = proto;
	  proto.constructor = $Number;
	  __webpack_require__(37)(global, NUMBER, $Number);
	}

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(43);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(30)
	  , defined = __webpack_require__(49)
	  , fails   = __webpack_require__(36)
	  , spaces  = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	      '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'
	  , space   = '[' + spaces + ']'
	  , non     = '\u200b\u0085'
	  , ltrim   = RegExp('^' + space + space + '*')
	  , rtrim   = RegExp(space + space + '*$');

	var exporter = function(KEY, exec){
	  var exp  = {};
	  exp[KEY] = exec(trim);
	  $export($export.P + $export.F * fails(function(){
	    return !!spaces[KEY]() || non[KEY]() != non;
	  }), 'String', exp);
	};

	// 1 -> String#trimLeft
	// 2 -> String#trimRight
	// 3 -> String#trim
	var trim = exporter.trim = function(string, TYPE){
	  string = String(defined(string));
	  if(TYPE & 1)string = string.replace(ltrim, '');
	  if(TYPE & 2)string = string.replace(rtrim, '');
	  return string;
	};

	module.exports = exporter;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.1 Number.EPSILON
	var $export = __webpack_require__(30);

	$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.2 Number.isFinite(number)
	var $export   = __webpack_require__(30)
	  , _isFinite = __webpack_require__(31).isFinite;

	$export($export.S, 'Number', {
	  isFinite: function isFinite(it){
	    return typeof it == 'number' && _isFinite(it);
	  }
	});

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(30);

	$export($export.S, 'Number', {isInteger: __webpack_require__(94)});

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(43)
	  , floor    = Math.floor;
	module.exports = function isInteger(it){
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.4 Number.isNaN(number)
	var $export = __webpack_require__(30);

	$export($export.S, 'Number', {
	  isNaN: function isNaN(number){
	    return number != number;
	  }
	});

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.5 Number.isSafeInteger(number)
	var $export   = __webpack_require__(30)
	  , isInteger = __webpack_require__(94)
	  , abs       = Math.abs;

	$export($export.S, 'Number', {
	  isSafeInteger: function isSafeInteger(number){
	    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
	  }
	});

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.6 Number.MAX_SAFE_INTEGER
	var $export = __webpack_require__(30);

	$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.10 Number.MIN_SAFE_INTEGER
	var $export = __webpack_require__(30);

	$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.12 Number.parseFloat(string)
	var $export = __webpack_require__(30);

	$export($export.S, 'Number', {parseFloat: parseFloat});

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.13 Number.parseInt(string, radix)
	var $export = __webpack_require__(30);

	$export($export.S, 'Number', {parseInt: parseInt});

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.3 Math.acosh(x)
	var $export = __webpack_require__(30)
	  , log1p   = __webpack_require__(102)
	  , sqrt    = Math.sqrt
	  , $acosh  = Math.acosh;

	// V8 bug https://code.google.com/p/v8/issues/detail?id=3509
	$export($export.S + $export.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
	  acosh: function acosh(x){
	    return (x = +x) < 1 ? NaN : x > 94906265.62425156
	      ? Math.log(x) + Math.LN2
	      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
	  }
	});

/***/ },
/* 102 */
/***/ function(module, exports) {

	// 20.2.2.20 Math.log1p(x)
	module.exports = Math.log1p || function log1p(x){
	  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
	};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.5 Math.asinh(x)
	var $export = __webpack_require__(30);

	function asinh(x){
	  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
	}

	$export($export.S, 'Math', {asinh: asinh});

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.7 Math.atanh(x)
	var $export = __webpack_require__(30);

	$export($export.S, 'Math', {
	  atanh: function atanh(x){
	    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
	  }
	});

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.9 Math.cbrt(x)
	var $export = __webpack_require__(30)
	  , sign    = __webpack_require__(106);

	$export($export.S, 'Math', {
	  cbrt: function cbrt(x){
	    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
	  }
	});

/***/ },
/* 106 */
/***/ function(module, exports) {

	// 20.2.2.28 Math.sign(x)
	module.exports = Math.sign || function sign(x){
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.11 Math.clz32(x)
	var $export = __webpack_require__(30);

	$export($export.S, 'Math', {
	  clz32: function clz32(x){
	    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
	  }
	});

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.12 Math.cosh(x)
	var $export = __webpack_require__(30)
	  , exp     = Math.exp;

	$export($export.S, 'Math', {
	  cosh: function cosh(x){
	    return (exp(x = +x) + exp(-x)) / 2;
	  }
	});

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.14 Math.expm1(x)
	var $export = __webpack_require__(30);

	$export($export.S, 'Math', {expm1: __webpack_require__(110)});

/***/ },
/* 110 */
/***/ function(module, exports) {

	// 20.2.2.14 Math.expm1(x)
	module.exports = Math.expm1 || function expm1(x){
	  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
	};

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.16 Math.fround(x)
	var $export   = __webpack_require__(30)
	  , sign      = __webpack_require__(106)
	  , pow       = Math.pow
	  , EPSILON   = pow(2, -52)
	  , EPSILON32 = pow(2, -23)
	  , MAX32     = pow(2, 127) * (2 - EPSILON32)
	  , MIN32     = pow(2, -126);

	var roundTiesToEven = function(n){
	  return n + 1 / EPSILON - 1 / EPSILON;
	};


	$export($export.S, 'Math', {
	  fround: function fround(x){
	    var $abs  = Math.abs(x)
	      , $sign = sign(x)
	      , a, result;
	    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
	    a = (1 + EPSILON32 / EPSILON) * $abs;
	    result = a - (a - $abs);
	    if(result > MAX32 || result != result)return $sign * Infinity;
	    return $sign * result;
	  }
	});

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
	var $export = __webpack_require__(30)
	  , abs     = Math.abs;

	$export($export.S, 'Math', {
	  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
	    var sum   = 0
	      , i     = 0
	      , $$    = arguments
	      , $$len = $$.length
	      , larg  = 0
	      , arg, div;
	    while(i < $$len){
	      arg = abs($$[i++]);
	      if(larg < arg){
	        div  = larg / arg;
	        sum  = sum * div * div + 1;
	        larg = arg;
	      } else if(arg > 0){
	        div  = arg / larg;
	        sum += div * div;
	      } else sum += arg;
	    }
	    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
	  }
	});

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.18 Math.imul(x, y)
	var $export = __webpack_require__(30)
	  , $imul   = Math.imul;

	// some WebKit versions fails with big numbers, some has wrong arity
	$export($export.S + $export.F * __webpack_require__(36)(function(){
	  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
	}), 'Math', {
	  imul: function imul(x, y){
	    var UINT16 = 0xffff
	      , xn = +x
	      , yn = +y
	      , xl = UINT16 & xn
	      , yl = UINT16 & yn;
	    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
	  }
	});

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.21 Math.log10(x)
	var $export = __webpack_require__(30);

	$export($export.S, 'Math', {
	  log10: function log10(x){
	    return Math.log(x) / Math.LN10;
	  }
	});

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.20 Math.log1p(x)
	var $export = __webpack_require__(30);

	$export($export.S, 'Math', {log1p: __webpack_require__(102)});

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.22 Math.log2(x)
	var $export = __webpack_require__(30);

	$export($export.S, 'Math', {
	  log2: function log2(x){
	    return Math.log(x) / Math.LN2;
	  }
	});

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.28 Math.sign(x)
	var $export = __webpack_require__(30);

	$export($export.S, 'Math', {sign: __webpack_require__(106)});

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.30 Math.sinh(x)
	var $export = __webpack_require__(30)
	  , expm1   = __webpack_require__(110)
	  , exp     = Math.exp;

	// V8 near Chromium 38 has a problem with very small numbers
	$export($export.S + $export.F * __webpack_require__(36)(function(){
	  return !Math.sinh(-2e-17) != -2e-17;
	}), 'Math', {
	  sinh: function sinh(x){
	    return Math.abs(x = +x) < 1
	      ? (expm1(x) - expm1(-x)) / 2
	      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
	  }
	});

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.33 Math.tanh(x)
	var $export = __webpack_require__(30)
	  , expm1   = __webpack_require__(110)
	  , exp     = Math.exp;

	$export($export.S, 'Math', {
	  tanh: function tanh(x){
	    var a = expm1(x = +x)
	      , b = expm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
	  }
	});

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	// 20.2.2.34 Math.trunc(x)
	var $export = __webpack_require__(30);

	$export($export.S, 'Math', {
	  trunc: function trunc(it){
	    return (it > 0 ? Math.floor : Math.ceil)(it);
	  }
	});

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	var $export        = __webpack_require__(30)
	  , toIndex        = __webpack_require__(53)
	  , fromCharCode   = String.fromCharCode
	  , $fromCodePoint = String.fromCodePoint;

	// length should be 1, old FF problem
	$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
	  // 21.1.2.2 String.fromCodePoint(...codePoints)
	  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
	    var res   = []
	      , $$    = arguments
	      , $$len = $$.length
	      , i     = 0
	      , code;
	    while($$len > i){
	      code = +$$[i++];
	      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
	      res.push(code < 0x10000
	        ? fromCharCode(code)
	        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
	      );
	    } return res.join('');
	  }
	});

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	var $export   = __webpack_require__(30)
	  , toIObject = __webpack_require__(50)
	  , toLength  = __webpack_require__(54);

	$export($export.S, 'String', {
	  // 21.1.2.4 String.raw(callSite, ...substitutions)
	  raw: function raw(callSite){
	    var tpl   = toIObject(callSite.raw)
	      , len   = toLength(tpl.length)
	      , $$    = arguments
	      , $$len = $$.length
	      , res   = []
	      , i     = 0;
	    while(len > i){
	      res.push(String(tpl[i++]));
	      if(i < $$len)res.push(String($$[i]));
	    } return res.join('');
	  }
	});

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 21.1.3.25 String.prototype.trim()
	__webpack_require__(90)('trim', function($trim){
	  return function trim(){
	    return $trim(this, 3);
	  };
	});

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(125)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(126)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(52)
	  , defined   = __webpack_require__(49);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(66)
	  , $export        = __webpack_require__(30)
	  , redefine       = __webpack_require__(37)
	  , hide           = __webpack_require__(33)
	  , has            = __webpack_require__(44)
	  , Iterators      = __webpack_require__(127)
	  , $iterCreate    = __webpack_require__(128)
	  , setToStringTag = __webpack_require__(62)
	  , getProto       = __webpack_require__(29).getProto
	  , ITERATOR       = __webpack_require__(58)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 127 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $              = __webpack_require__(29)
	  , descriptor     = __webpack_require__(34)
	  , setToStringTag = __webpack_require__(62)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(33)(IteratorPrototype, __webpack_require__(58)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(30)
	  , $at     = __webpack_require__(125)(false);
	$export($export.P, 'String', {
	  // 21.1.3.3 String.prototype.codePointAt(pos)
	  codePointAt: function codePointAt(pos){
	    return $at(this, pos);
	  }
	});

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
	'use strict';
	var $export   = __webpack_require__(30)
	  , toLength  = __webpack_require__(54)
	  , context   = __webpack_require__(131)
	  , ENDS_WITH = 'endsWith'
	  , $endsWith = ''[ENDS_WITH];

	$export($export.P + $export.F * __webpack_require__(133)(ENDS_WITH), 'String', {
	  endsWith: function endsWith(searchString /*, endPosition = @length */){
	    var that = context(this, searchString, ENDS_WITH)
	      , $$   = arguments
	      , endPosition = $$.length > 1 ? $$[1] : undefined
	      , len    = toLength(that.length)
	      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
	      , search = String(searchString);
	    return $endsWith
	      ? $endsWith.call(that, search, end)
	      : that.slice(end - search.length, end) === search;
	  }
	});

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	// helper for String#{startsWith, endsWith, includes}
	var isRegExp = __webpack_require__(132)
	  , defined  = __webpack_require__(49);

	module.exports = function(that, searchString, NAME){
	  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
	  return String(defined(that));
	};

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.8 IsRegExp(argument)
	var isObject = __webpack_require__(43)
	  , cof      = __webpack_require__(45)
	  , MATCH    = __webpack_require__(58)('match');
	module.exports = function(it){
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
	};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	var MATCH = __webpack_require__(58)('match');
	module.exports = function(KEY){
	  var re = /./;
	  try {
	    '/./'[KEY](re);
	  } catch(e){
	    try {
	      re[MATCH] = false;
	      return !'/./'[KEY](re);
	    } catch(f){ /* empty */ }
	  } return true;
	};

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	// 21.1.3.7 String.prototype.includes(searchString, position = 0)
	'use strict';
	var $export  = __webpack_require__(30)
	  , context  = __webpack_require__(131)
	  , INCLUDES = 'includes';

	$export($export.P + $export.F * __webpack_require__(133)(INCLUDES), 'String', {
	  includes: function includes(searchString /*, position = 0 */){
	    return !!~context(this, searchString, INCLUDES)
	      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(30);

	$export($export.P, 'String', {
	  // 21.1.3.13 String.prototype.repeat(count)
	  repeat: __webpack_require__(136)
	});

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var toInteger = __webpack_require__(52)
	  , defined   = __webpack_require__(49);

	module.exports = function repeat(count){
	  var str = String(defined(this))
	    , res = ''
	    , n   = toInteger(count);
	  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
	  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
	  return res;
	};

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
	'use strict';
	var $export     = __webpack_require__(30)
	  , toLength    = __webpack_require__(54)
	  , context     = __webpack_require__(131)
	  , STARTS_WITH = 'startsWith'
	  , $startsWith = ''[STARTS_WITH];

	$export($export.P + $export.F * __webpack_require__(133)(STARTS_WITH), 'String', {
	  startsWith: function startsWith(searchString /*, position = 0 */){
	    var that   = context(this, searchString, STARTS_WITH)
	      , $$     = arguments
	      , index  = toLength(Math.min($$.length > 1 ? $$[1] : undefined, that.length))
	      , search = String(searchString);
	    return $startsWith
	      ? $startsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx         = __webpack_require__(39)
	  , $export     = __webpack_require__(30)
	  , toObject    = __webpack_require__(48)
	  , call        = __webpack_require__(139)
	  , isArrayIter = __webpack_require__(140)
	  , toLength    = __webpack_require__(54)
	  , getIterFn   = __webpack_require__(141);
	$export($export.S + $export.F * !__webpack_require__(142)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , $$      = arguments
	      , $$len   = $$.length
	      , mapfn   = $$len > 1 ? $$[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        result[index] = mapping ? mapfn(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(47);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(127)
	  , ITERATOR   = __webpack_require__(58)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(74)
	  , ITERATOR  = __webpack_require__(58)('iterator')
	  , Iterators = __webpack_require__(127);
	module.exports = __webpack_require__(32).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(58)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(30);

	// WebKit Array.of isn't generic
	$export($export.S + $export.F * __webpack_require__(36)(function(){
	  function F(){}
	  return !(Array.of.call(F) instanceof F);
	}), 'Array', {
	  // 22.1.2.3 Array.of( ...items)
	  of: function of(/* ...args */){
	    var index  = 0
	      , $$     = arguments
	      , $$len  = $$.length
	      , result = new (typeof this == 'function' ? this : Array)($$len);
	    while($$len > index)result[index] = $$[index++];
	    result.length = $$len;
	    return result;
	  }
	});

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(145)
	  , step             = __webpack_require__(146)
	  , Iterators        = __webpack_require__(127)
	  , toIObject        = __webpack_require__(50);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(126)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = __webpack_require__(58)('unscopables')
	  , ArrayProto  = Array.prototype;
	if(ArrayProto[UNSCOPABLES] == undefined)__webpack_require__(33)(ArrayProto, UNSCOPABLES, {});
	module.exports = function(key){
	  ArrayProto[UNSCOPABLES][key] = true;
	};

/***/ },
/* 146 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(148)('Array');

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(31)
	  , $           = __webpack_require__(29)
	  , DESCRIPTORS = __webpack_require__(35)
	  , SPECIES     = __webpack_require__(58)('species');

	module.exports = function(KEY){
	  var C = global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	var $export = __webpack_require__(30);

	$export($export.P, 'Array', {copyWithin: __webpack_require__(150)});

	__webpack_require__(145)('copyWithin');

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	'use strict';
	var toObject = __webpack_require__(48)
	  , toIndex  = __webpack_require__(53)
	  , toLength = __webpack_require__(54);

	module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
	  var O     = toObject(this)
	    , len   = toLength(O.length)
	    , to    = toIndex(target, len)
	    , from  = toIndex(start, len)
	    , $$    = arguments
	    , end   = $$.length > 2 ? $$[2] : undefined
	    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
	    , inc   = 1;
	  if(from < to && to < from + count){
	    inc  = -1;
	    from += count - 1;
	    to   += count - 1;
	  }
	  while(count-- > 0){
	    if(from in O)O[to] = O[from];
	    else delete O[to];
	    to   += inc;
	    from += inc;
	  } return O;
	};

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	var $export = __webpack_require__(30);

	$export($export.P, 'Array', {fill: __webpack_require__(152)});

	__webpack_require__(145)('fill');

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	'use strict';
	var toObject = __webpack_require__(48)
	  , toIndex  = __webpack_require__(53)
	  , toLength = __webpack_require__(54);
	module.exports = [].fill || function fill(value /*, start = 0, end = @length */){
	  var O      = toObject(this)
	    , length = toLength(O.length)
	    , $$     = arguments
	    , $$len  = $$.length
	    , index  = toIndex($$len > 1 ? $$[1] : undefined, length)
	    , end    = $$len > 2 ? $$[2] : undefined
	    , endPos = end === undefined ? length : toIndex(end, length);
	  while(endPos > index)O[index++] = value;
	  return O;
	};

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
	var $export = __webpack_require__(30)
	  , $find   = __webpack_require__(55)(5)
	  , KEY     = 'find'
	  , forced  = true;
	// Shouldn't skip holes
	if(KEY in [])Array(1)[KEY](function(){ forced = false; });
	$export($export.P + $export.F * forced, 'Array', {
	  find: function find(callbackfn/*, that = undefined */){
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	__webpack_require__(145)(KEY);

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
	var $export = __webpack_require__(30)
	  , $find   = __webpack_require__(55)(6)
	  , KEY     = 'findIndex'
	  , forced  = true;
	// Shouldn't skip holes
	if(KEY in [])Array(1)[KEY](function(){ forced = false; });
	$export($export.P + $export.F * forced, 'Array', {
	  findIndex: function findIndex(callbackfn/*, that = undefined */){
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	__webpack_require__(145)(KEY);

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(29)
	  , global   = __webpack_require__(31)
	  , isRegExp = __webpack_require__(132)
	  , $flags   = __webpack_require__(156)
	  , $RegExp  = global.RegExp
	  , Base     = $RegExp
	  , proto    = $RegExp.prototype
	  , re1      = /a/g
	  , re2      = /a/g
	  // "new" creates a new object, old webkit buggy here
	  , CORRECT_NEW = new $RegExp(re1) !== re1;

	if(__webpack_require__(35) && (!CORRECT_NEW || __webpack_require__(36)(function(){
	  re2[__webpack_require__(58)('match')] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
	}))){
	  $RegExp = function RegExp(p, f){
	    var piRE = isRegExp(p)
	      , fiU  = f === undefined;
	    return !(this instanceof $RegExp) && piRE && p.constructor === $RegExp && fiU ? p
	      : CORRECT_NEW
	        ? new Base(piRE && !fiU ? p.source : p, f)
	        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f);
	  };
	  $.each.call($.getNames(Base), function(key){
	    key in $RegExp || $.setDesc($RegExp, key, {
	      configurable: true,
	      get: function(){ return Base[key]; },
	      set: function(it){ Base[key] = it; }
	    });
	  });
	  proto.constructor = $RegExp;
	  $RegExp.prototype = proto;
	  __webpack_require__(37)(global, 'RegExp', $RegExp);
	}

	__webpack_require__(148)('RegExp');

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 21.2.5.3 get RegExp.prototype.flags
	var anObject = __webpack_require__(47);
	module.exports = function(){
	  var that   = anObject(this)
	    , result = '';
	  if(that.global)     result += 'g';
	  if(that.ignoreCase) result += 'i';
	  if(that.multiline)  result += 'm';
	  if(that.unicode)    result += 'u';
	  if(that.sticky)     result += 'y';
	  return result;
	};

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	// 21.2.5.3 get RegExp.prototype.flags()
	var $ = __webpack_require__(29);
	if(__webpack_require__(35) && /./g.flags != 'g')$.setDesc(RegExp.prototype, 'flags', {
	  configurable: true,
	  get: __webpack_require__(156)
	});

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	// @@match logic
	__webpack_require__(159)('match', 1, function(defined, MATCH){
	  // 21.1.3.11 String.prototype.match(regexp)
	  return function match(regexp){
	    'use strict';
	    var O  = defined(this)
	      , fn = regexp == undefined ? undefined : regexp[MATCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	  };
	});

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var hide     = __webpack_require__(33)
	  , redefine = __webpack_require__(37)
	  , fails    = __webpack_require__(36)
	  , defined  = __webpack_require__(49)
	  , wks      = __webpack_require__(58);

	module.exports = function(KEY, length, exec){
	  var SYMBOL   = wks(KEY)
	    , original = ''[KEY];
	  if(fails(function(){
	    var O = {};
	    O[SYMBOL] = function(){ return 7; };
	    return ''[KEY](O) != 7;
	  })){
	    redefine(String.prototype, KEY, exec(defined, SYMBOL, original));
	    hide(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function(string, arg){ return original.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function(string){ return original.call(string, this); }
	    );
	  }
	};

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	// @@replace logic
	__webpack_require__(159)('replace', 2, function(defined, REPLACE, $replace){
	  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
	  return function replace(searchValue, replaceValue){
	    'use strict';
	    var O  = defined(this)
	      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
	    return fn !== undefined
	      ? fn.call(searchValue, O, replaceValue)
	      : $replace.call(String(O), searchValue, replaceValue);
	  };
	});

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	// @@search logic
	__webpack_require__(159)('search', 1, function(defined, SEARCH){
	  // 21.1.3.15 String.prototype.search(regexp)
	  return function search(regexp){
	    'use strict';
	    var O  = defined(this)
	      , fn = regexp == undefined ? undefined : regexp[SEARCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	  };
	});

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	// @@split logic
	__webpack_require__(159)('split', 2, function(defined, SPLIT, $split){
	  // 21.1.3.17 String.prototype.split(separator, limit)
	  return function split(separator, limit){
	    'use strict';
	    var O  = defined(this)
	      , fn = separator == undefined ? undefined : separator[SPLIT];
	    return fn !== undefined
	      ? fn.call(separator, O, limit)
	      : $split.call(String(O), separator, limit);
	  };
	});

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $          = __webpack_require__(29)
	  , LIBRARY    = __webpack_require__(66)
	  , global     = __webpack_require__(31)
	  , ctx        = __webpack_require__(39)
	  , classof    = __webpack_require__(74)
	  , $export    = __webpack_require__(30)
	  , isObject   = __webpack_require__(43)
	  , anObject   = __webpack_require__(47)
	  , aFunction  = __webpack_require__(40)
	  , strictNew  = __webpack_require__(164)
	  , forOf      = __webpack_require__(165)
	  , setProto   = __webpack_require__(72).set
	  , same       = __webpack_require__(70)
	  , SPECIES    = __webpack_require__(58)('species')
	  , speciesConstructor = __webpack_require__(166)
	  , asap       = __webpack_require__(167)
	  , PROMISE    = 'Promise'
	  , process    = global.process
	  , isNode     = classof(process) == 'process'
	  , P          = global[PROMISE]
	  , Wrapper;

	var testResolve = function(sub){
	  var test = new P(function(){});
	  if(sub)test.constructor = Object;
	  return P.resolve(test) === test;
	};

	var USE_NATIVE = function(){
	  var works = false;
	  function P2(x){
	    var self = new P(x);
	    setProto(self, P2.prototype);
	    return self;
	  }
	  try {
	    works = P && P.resolve && testResolve();
	    setProto(P2, P);
	    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
	    // actual Firefox has broken subclass support, test that
	    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
	      works = false;
	    }
	    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
	    if(works && __webpack_require__(35)){
	      var thenableThenGotten = false;
	      P.resolve($.setDesc({}, 'then', {
	        get: function(){ thenableThenGotten = true; }
	      }));
	      works = thenableThenGotten;
	    }
	  } catch(e){ works = false; }
	  return works;
	}();

	// helpers
	var sameConstructor = function(a, b){
	  // library wrapper special case
	  if(LIBRARY && a === P && b === Wrapper)return true;
	  return same(a, b);
	};
	var getConstructor = function(C){
	  var S = anObject(C)[SPECIES];
	  return S != undefined ? S : C;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var PromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve),
	  this.reject  = aFunction(reject)
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(record, isReject){
	  if(record.n)return;
	  record.n = true;
	  var chain = record.c;
	  asap(function(){
	    var value = record.v
	      , ok    = record.s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , result, then;
	      try {
	        if(handler){
	          if(!ok)record.h = true;
	          result = handler === true ? value : handler(value);
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    chain.length = 0;
	    record.n = false;
	    if(isReject)setTimeout(function(){
	      var promise = record.p
	        , handler, console;
	      if(isUnhandled(promise)){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      } record.a = undefined;
	    }, 1);
	  });
	};
	var isUnhandled = function(promise){
	  var record = promise._d
	    , chain  = record.a || record.c
	    , i      = 0
	    , reaction;
	  if(record.h)return false;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var $reject = function(value){
	  var record = this;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  record.v = value;
	  record.s = 2;
	  record.a = record.c.slice();
	  notify(record, true);
	};
	var $resolve = function(value){
	  var record = this
	    , then;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  try {
	    if(record.p === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      asap(function(){
	        var wrapper = {r: record, d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      record.v = value;
	      record.s = 1;
	      notify(record, false);
	    }
	  } catch(e){
	    $reject.call({r: record, d: false}, e); // wrap
	  }
	};

	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  P = function Promise(executor){
	    aFunction(executor);
	    var record = this._d = {
	      p: strictNew(this, P, PROMISE),         // <- promise
	      c: [],                                  // <- awaiting reactions
	      a: undefined,                           // <- checked in isUnhandled reactions
	      s: 0,                                   // <- state
	      d: false,                               // <- done
	      v: undefined,                           // <- value
	      h: false,                               // <- handled rejection
	      n: false                                // <- notify
	    };
	    try {
	      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
	    } catch(err){
	      $reject.call(record, err);
	    }
	  };
	  __webpack_require__(169)(P.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction = new PromiseCapability(speciesConstructor(this, P))
	        , promise  = reaction.promise
	        , record   = this._d;
	      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      record.c.push(reaction);
	      if(record.a)record.a.push(reaction);
	      if(record.s)notify(record, false);
	      return promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
	__webpack_require__(62)(P, PROMISE);
	__webpack_require__(148)(PROMISE);
	Wrapper = __webpack_require__(32)[PROMISE];

	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = new PromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof P && sameConstructor(x.constructor, this))return x;
	    var capability = new PromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(142)(function(iter){
	  P.all(iter)['catch'](function(){});
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = getConstructor(this)
	      , capability = new PromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject
	      , values     = [];
	    var abrupt = perform(function(){
	      forOf(iterable, false, values.push, values);
	      var remaining = values.length
	        , results   = Array(remaining);
	      if(remaining)$.each.call(values, function(promise, index){
	        var alreadyCalled = false;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled = true;
	          results[index] = value;
	          --remaining || resolve(results);
	        }, reject);
	      });
	      else resolve(results);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = getConstructor(this)
	      , capability = new PromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ },
/* 164 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(39)
	  , call        = __webpack_require__(139)
	  , isArrayIter = __webpack_require__(140)
	  , anObject    = __webpack_require__(47)
	  , toLength    = __webpack_require__(54)
	  , getIterFn   = __webpack_require__(141);
	module.exports = function(iterable, entries, fn, that){
	  var iterFn = getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    call(iterator, f, step.value, entries);
	  }
	};

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(47)
	  , aFunction = __webpack_require__(40)
	  , SPECIES   = __webpack_require__(58)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(31)
	  , macrotask = __webpack_require__(168).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(45)(process) == 'process'
	  , head, last, notify;

	var flush = function(){
	  var parent, domain, fn;
	  if(isNode && (parent = process.domain)){
	    process.domain = null;
	    parent.exit();
	  }
	  while(head){
	    domain = head.domain;
	    fn     = head.fn;
	    if(domain)domain.enter();
	    fn(); // <- currently we use it only for Promise - try / catch not required
	    if(domain)domain.exit();
	    head = head.next;
	  } last = undefined;
	  if(parent)parent.enter();
	};

	// Node.js
	if(isNode){
	  notify = function(){
	    process.nextTick(flush);
	  };
	// browsers with MutationObserver
	} else if(Observer){
	  var toggle = 1
	    , node   = document.createTextNode('');
	  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	  notify = function(){
	    node.data = toggle = -toggle;
	  };
	// environments with maybe non-completely correct, but existent Promise
	} else if(Promise && Promise.resolve){
	  notify = function(){
	    Promise.resolve().then(flush);
	  };
	// for other environments - macrotask based on:
	// - setImmediate
	// - MessageChannel
	// - window.postMessag
	// - onreadystatechange
	// - setTimeout
	} else {
	  notify = function(){
	    // strange IE + webpack dev server bug - use .call(global)
	    macrotask.call(global, flush);
	  };
	}

	module.exports = function asap(fn){
	  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
	  if(last)last.next = task;
	  if(!head){
	    head = task;
	    notify();
	  } last = task;
	};

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(39)
	  , invoke             = __webpack_require__(46)
	  , html               = __webpack_require__(41)
	  , cel                = __webpack_require__(42)
	  , global             = __webpack_require__(31)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listner = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(45)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listner;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listner, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	var redefine = __webpack_require__(37);
	module.exports = function(target, src){
	  for(var key in src)redefine(target, key, src[key]);
	  return target;
	};

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(171);

	// 23.1 Map Objects
	__webpack_require__(172)('Map', function(get){
	  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key){
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value){
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $            = __webpack_require__(29)
	  , hide         = __webpack_require__(33)
	  , redefineAll  = __webpack_require__(169)
	  , ctx          = __webpack_require__(39)
	  , strictNew    = __webpack_require__(164)
	  , defined      = __webpack_require__(49)
	  , forOf        = __webpack_require__(165)
	  , $iterDefine  = __webpack_require__(126)
	  , step         = __webpack_require__(146)
	  , ID           = __webpack_require__(38)('id')
	  , $has         = __webpack_require__(44)
	  , isObject     = __webpack_require__(43)
	  , setSpecies   = __webpack_require__(148)
	  , DESCRIPTORS  = __webpack_require__(35)
	  , isExtensible = Object.isExtensible || isObject
	  , SIZE         = DESCRIPTORS ? '_s' : 'size'
	  , id           = 0;

	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!$has(it, ID)){
	    // can't set id to frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add id
	    if(!create)return 'E';
	    // add missing object id
	    hide(it, ID, ++id);
	  // return object id with prefix
	  } return 'O' + it[ID];
	};

	var getEntry = function(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that._i[index];
	  // frozen object case
	  for(entry = that._f; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	};

	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      strictNew(that, C, NAME);
	      that._i = $.create(null); // index
	      that._f = undefined;      // first entry
	      that._l = undefined;      // last entry
	      that[SIZE] = 0;           // size
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that._f == entry)that._f = next;
	          if(that._l == entry)that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
	          , entry;
	        while(entry = entry ? entry.n : this._f){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that._f)that._f = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function(C, NAME, IS_MAP){
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function(iterated, kind){
	      this._t = iterated;  // target
	      this._k = kind;      // kind
	      this._l = undefined; // previous
	    }, function(){
	      var that  = this
	        , kind  = that._k
	        , entry = that._l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global         = __webpack_require__(31)
	  , $export        = __webpack_require__(30)
	  , redefine       = __webpack_require__(37)
	  , redefineAll    = __webpack_require__(169)
	  , forOf          = __webpack_require__(165)
	  , strictNew      = __webpack_require__(164)
	  , isObject       = __webpack_require__(43)
	  , fails          = __webpack_require__(36)
	  , $iterDetect    = __webpack_require__(142)
	  , setToStringTag = __webpack_require__(62);

	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = global[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  var fixMethod = function(KEY){
	    var fn = proto[KEY];
	    redefine(proto, KEY,
	      KEY == 'delete' ? function(a){
	        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'has' ? function has(a){
	        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'get' ? function get(a){
	        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
	        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
	    );
	  };
	  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
	    new C().entries().next();
	  }))){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	  } else {
	    var instance             = new C
	      // early implementations not supports chaining
	      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
	      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
	      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
	      // most early implementations doesn't supports iterables, most modern - not close it correctly
	      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
	      // for early implementations -0 and +0 not the same
	      , BUGGY_ZERO;
	    if(!ACCEPT_ITERABLES){ 
	      C = wrapper(function(target, iterable){
	        strictNew(target, C, NAME);
	        var that = new Base;
	        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	        return that;
	      });
	      C.prototype = proto;
	      proto.constructor = C;
	    }
	    IS_WEAK || instance.forEach(function(val, key){
	      BUGGY_ZERO = 1 / key === -Infinity;
	    });
	    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }
	    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
	    // weak collections should not contains .clear method
	    if(IS_WEAK && proto.clear)delete proto.clear;
	  }

	  setToStringTag(C, NAME);

	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F * (C != Base), O);

	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(171);

	// 23.2 Set Objects
	__webpack_require__(172)('Set', function(get){
	  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value){
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $            = __webpack_require__(29)
	  , redefine     = __webpack_require__(37)
	  , weak         = __webpack_require__(175)
	  , isObject     = __webpack_require__(43)
	  , has          = __webpack_require__(44)
	  , frozenStore  = weak.frozenStore
	  , WEAK         = weak.WEAK
	  , isExtensible = Object.isExtensible || isObject
	  , tmp          = {};

	// 23.3 WeakMap Objects
	var $WeakMap = __webpack_require__(172)('WeakMap', function(get){
	  return function WeakMap(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.3.3.3 WeakMap.prototype.get(key)
	  get: function get(key){
	    if(isObject(key)){
	      if(!isExtensible(key))return frozenStore(this).get(key);
	      if(has(key, WEAK))return key[WEAK][this._i];
	    }
	  },
	  // 23.3.3.5 WeakMap.prototype.set(key, value)
	  set: function set(key, value){
	    return weak.def(this, key, value);
	  }
	}, weak, true, true);

	// IE11 WeakMap frozen keys fix
	if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
	  $.each.call(['delete', 'has', 'get', 'set'], function(key){
	    var proto  = $WeakMap.prototype
	      , method = proto[key];
	    redefine(proto, key, function(a, b){
	      // store frozen objects on leaky map
	      if(isObject(a) && !isExtensible(a)){
	        var result = frozenStore(this)[key](a, b);
	        return key == 'set' ? this : result;
	      // store all the rest on native weakmap
	      } return method.call(this, a, b);
	    });
	  });
	}

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var hide              = __webpack_require__(33)
	  , redefineAll       = __webpack_require__(169)
	  , anObject          = __webpack_require__(47)
	  , isObject          = __webpack_require__(43)
	  , strictNew         = __webpack_require__(164)
	  , forOf             = __webpack_require__(165)
	  , createArrayMethod = __webpack_require__(55)
	  , $has              = __webpack_require__(44)
	  , WEAK              = __webpack_require__(38)('weak')
	  , isExtensible      = Object.isExtensible || isObject
	  , arrayFind         = createArrayMethod(5)
	  , arrayFindIndex    = createArrayMethod(6)
	  , id                = 0;

	// fallback for frozen keys
	var frozenStore = function(that){
	  return that._l || (that._l = new FrozenStore);
	};
	var FrozenStore = function(){
	  this.a = [];
	};
	var findFrozen = function(store, key){
	  return arrayFind(store.a, function(it){
	    return it[0] === key;
	  });
	};
	FrozenStore.prototype = {
	  get: function(key){
	    var entry = findFrozen(this, key);
	    if(entry)return entry[1];
	  },
	  has: function(key){
	    return !!findFrozen(this, key);
	  },
	  set: function(key, value){
	    var entry = findFrozen(this, key);
	    if(entry)entry[1] = value;
	    else this.a.push([key, value]);
	  },
	  'delete': function(key){
	    var index = arrayFindIndex(this.a, function(it){
	      return it[0] === key;
	    });
	    if(~index)this.a.splice(index, 1);
	    return !!~index;
	  }
	};

	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      strictNew(that, C, NAME);
	      that._i = id++;      // collection id
	      that._l = undefined; // leak store for frozen objects
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function(key){
	        if(!isObject(key))return false;
	        if(!isExtensible(key))return frozenStore(this)['delete'](key);
	        return $has(key, WEAK) && $has(key[WEAK], this._i) && delete key[WEAK][this._i];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has(key){
	        if(!isObject(key))return false;
	        if(!isExtensible(key))return frozenStore(this).has(key);
	        return $has(key, WEAK) && $has(key[WEAK], this._i);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    if(!isExtensible(anObject(key))){
	      frozenStore(that).set(key, value);
	    } else {
	      $has(key, WEAK) || hide(key, WEAK, {});
	      key[WEAK][that._i] = value;
	    } return that;
	  },
	  frozenStore: frozenStore,
	  WEAK: WEAK
	};

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var weak = __webpack_require__(175);

	// 23.4 WeakSet Objects
	__webpack_require__(172)('WeakSet', function(get){
	  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.4.3.1 WeakSet.prototype.add(value)
	  add: function add(value){
	    return weak.def(this, value, true);
	  }
	}, weak, false, true);

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
	var $export = __webpack_require__(30)
	  , _apply  = Function.apply;

	$export($export.S, 'Reflect', {
	  apply: function apply(target, thisArgument, argumentsList){
	    return _apply.call(target, thisArgument, argumentsList);
	  }
	});

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
	var $         = __webpack_require__(29)
	  , $export   = __webpack_require__(30)
	  , aFunction = __webpack_require__(40)
	  , anObject  = __webpack_require__(47)
	  , isObject  = __webpack_require__(43)
	  , bind      = Function.bind || __webpack_require__(32).Function.prototype.bind;

	// MS Edge supports only 2 arguments
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	$export($export.S + $export.F * __webpack_require__(36)(function(){
	  function F(){}
	  return !(Reflect.construct(function(){}, [], F) instanceof F);
	}), 'Reflect', {
	  construct: function construct(Target, args /*, newTarget*/){
	    aFunction(Target);
	    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
	    if(Target == newTarget){
	      // w/o altered newTarget, optimization for 0-4 arguments
	      if(args != undefined)switch(anObject(args).length){
	        case 0: return new Target;
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      $args.push.apply($args, args);
	      return new (bind.apply(Target, $args));
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto    = newTarget.prototype
	      , instance = $.create(isObject(proto) ? proto : Object.prototype)
	      , result   = Function.apply.call(Target, instance, args);
	    return isObject(result) ? result : instance;
	  }
	});

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
	var $        = __webpack_require__(29)
	  , $export  = __webpack_require__(30)
	  , anObject = __webpack_require__(47);

	// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
	$export($export.S + $export.F * __webpack_require__(36)(function(){
	  Reflect.defineProperty($.setDesc({}, 1, {value: 1}), 1, {value: 2});
	}), 'Reflect', {
	  defineProperty: function defineProperty(target, propertyKey, attributes){
	    anObject(target);
	    try {
	      $.setDesc(target, propertyKey, attributes);
	      return true;
	    } catch(e){
	      return false;
	    }
	  }
	});

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.4 Reflect.deleteProperty(target, propertyKey)
	var $export  = __webpack_require__(30)
	  , getDesc  = __webpack_require__(29).getDesc
	  , anObject = __webpack_require__(47);

	$export($export.S, 'Reflect', {
	  deleteProperty: function deleteProperty(target, propertyKey){
	    var desc = getDesc(anObject(target), propertyKey);
	    return desc && !desc.configurable ? false : delete target[propertyKey];
	  }
	});

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 26.1.5 Reflect.enumerate(target)
	var $export  = __webpack_require__(30)
	  , anObject = __webpack_require__(47);
	var Enumerate = function(iterated){
	  this._t = anObject(iterated); // target
	  this._i = 0;                  // next index
	  var keys = this._k = []       // keys
	    , key;
	  for(key in iterated)keys.push(key);
	};
	__webpack_require__(128)(Enumerate, 'Object', function(){
	  var that = this
	    , keys = that._k
	    , key;
	  do {
	    if(that._i >= keys.length)return {value: undefined, done: true};
	  } while(!((key = keys[that._i++]) in that._t));
	  return {value: key, done: false};
	});

	$export($export.S, 'Reflect', {
	  enumerate: function enumerate(target){
	    return new Enumerate(target);
	  }
	});

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.6 Reflect.get(target, propertyKey [, receiver])
	var $        = __webpack_require__(29)
	  , has      = __webpack_require__(44)
	  , $export  = __webpack_require__(30)
	  , isObject = __webpack_require__(43)
	  , anObject = __webpack_require__(47);

	function get(target, propertyKey/*, receiver*/){
	  var receiver = arguments.length < 3 ? target : arguments[2]
	    , desc, proto;
	  if(anObject(target) === receiver)return target[propertyKey];
	  if(desc = $.getDesc(target, propertyKey))return has(desc, 'value')
	    ? desc.value
	    : desc.get !== undefined
	      ? desc.get.call(receiver)
	      : undefined;
	  if(isObject(proto = $.getProto(target)))return get(proto, propertyKey, receiver);
	}

	$export($export.S, 'Reflect', {get: get});

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
	var $        = __webpack_require__(29)
	  , $export  = __webpack_require__(30)
	  , anObject = __webpack_require__(47);

	$export($export.S, 'Reflect', {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
	    return $.getDesc(anObject(target), propertyKey);
	  }
	});

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.8 Reflect.getPrototypeOf(target)
	var $export  = __webpack_require__(30)
	  , getProto = __webpack_require__(29).getProto
	  , anObject = __webpack_require__(47);

	$export($export.S, 'Reflect', {
	  getPrototypeOf: function getPrototypeOf(target){
	    return getProto(anObject(target));
	  }
	});

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.9 Reflect.has(target, propertyKey)
	var $export = __webpack_require__(30);

	$export($export.S, 'Reflect', {
	  has: function has(target, propertyKey){
	    return propertyKey in target;
	  }
	});

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.10 Reflect.isExtensible(target)
	var $export       = __webpack_require__(30)
	  , anObject      = __webpack_require__(47)
	  , $isExtensible = Object.isExtensible;

	$export($export.S, 'Reflect', {
	  isExtensible: function isExtensible(target){
	    anObject(target);
	    return $isExtensible ? $isExtensible(target) : true;
	  }
	});

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.11 Reflect.ownKeys(target)
	var $export = __webpack_require__(30);

	$export($export.S, 'Reflect', {ownKeys: __webpack_require__(188)});

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	// all object keys, includes non-enumerable and symbols
	var $        = __webpack_require__(29)
	  , anObject = __webpack_require__(47)
	  , Reflect  = __webpack_require__(31).Reflect;
	module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
	  var keys       = $.getNames(anObject(it))
	    , getSymbols = $.getSymbols;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.12 Reflect.preventExtensions(target)
	var $export            = __webpack_require__(30)
	  , anObject           = __webpack_require__(47)
	  , $preventExtensions = Object.preventExtensions;

	$export($export.S, 'Reflect', {
	  preventExtensions: function preventExtensions(target){
	    anObject(target);
	    try {
	      if($preventExtensions)$preventExtensions(target);
	      return true;
	    } catch(e){
	      return false;
	    }
	  }
	});

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
	var $          = __webpack_require__(29)
	  , has        = __webpack_require__(44)
	  , $export    = __webpack_require__(30)
	  , createDesc = __webpack_require__(34)
	  , anObject   = __webpack_require__(47)
	  , isObject   = __webpack_require__(43);

	function set(target, propertyKey, V/*, receiver*/){
	  var receiver = arguments.length < 4 ? target : arguments[3]
	    , ownDesc  = $.getDesc(anObject(target), propertyKey)
	    , existingDescriptor, proto;
	  if(!ownDesc){
	    if(isObject(proto = $.getProto(target))){
	      return set(proto, propertyKey, V, receiver);
	    }
	    ownDesc = createDesc(0);
	  }
	  if(has(ownDesc, 'value')){
	    if(ownDesc.writable === false || !isObject(receiver))return false;
	    existingDescriptor = $.getDesc(receiver, propertyKey) || createDesc(0);
	    existingDescriptor.value = V;
	    $.setDesc(receiver, propertyKey, existingDescriptor);
	    return true;
	  }
	  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
	}

	$export($export.S, 'Reflect', {set: set});

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	// 26.1.14 Reflect.setPrototypeOf(target, proto)
	var $export  = __webpack_require__(30)
	  , setProto = __webpack_require__(72);

	if(setProto)$export($export.S, 'Reflect', {
	  setPrototypeOf: function setPrototypeOf(target, proto){
	    setProto.check(target, proto);
	    try {
	      setProto.set(target, proto);
	      return true;
	    } catch(e){
	      return false;
	    }
	  }
	});

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export   = __webpack_require__(30)
	  , $includes = __webpack_require__(60)(true);

	$export($export.P, 'Array', {
	  // https://github.com/domenic/Array.prototype.includes
	  includes: function includes(el /*, fromIndex = 0 */){
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	__webpack_require__(145)('includes');

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/mathiasbynens/String.prototype.at
	var $export = __webpack_require__(30)
	  , $at     = __webpack_require__(125)(true);

	$export($export.P, 'String', {
	  at: function at(pos){
	    return $at(this, pos);
	  }
	});

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(30)
	  , $pad    = __webpack_require__(195);

	$export($export.P, 'String', {
	  padLeft: function padLeft(maxLength /*, fillString = ' ' */){
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
	  }
	});

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/ljharb/proposal-string-pad-left-right
	var toLength = __webpack_require__(54)
	  , repeat   = __webpack_require__(136)
	  , defined  = __webpack_require__(49);

	module.exports = function(that, maxLength, fillString, left){
	  var S            = String(defined(that))
	    , stringLength = S.length
	    , fillStr      = fillString === undefined ? ' ' : String(fillString)
	    , intMaxLength = toLength(maxLength);
	  if(intMaxLength <= stringLength)return S;
	  if(fillStr == '')fillStr = ' ';
	  var fillLen = intMaxLength - stringLength
	    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
	  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
	  return left ? stringFiller + S : S + stringFiller;
	};

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(30)
	  , $pad    = __webpack_require__(195);

	$export($export.P, 'String', {
	  padRight: function padRight(maxLength /*, fillString = ' ' */){
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
	  }
	});

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
	__webpack_require__(90)('trimLeft', function($trim){
	  return function trimLeft(){
	    return $trim(this, 1);
	  };
	});

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
	__webpack_require__(90)('trimRight', function($trim){
	  return function trimRight(){
	    return $trim(this, 2);
	  };
	});

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/benjamingr/RexExp.escape
	var $export = __webpack_require__(30)
	  , $re     = __webpack_require__(200)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

	$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});


/***/ },
/* 200 */
/***/ function(module, exports) {

	module.exports = function(regExp, replace){
	  var replacer = replace === Object(replace) ? function(part){
	    return replace[part];
	  } : replace;
	  return function(it){
	    return String(it).replace(regExp, replacer);
	  };
	};

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	// https://gist.github.com/WebReflection/9353781
	var $          = __webpack_require__(29)
	  , $export    = __webpack_require__(30)
	  , ownKeys    = __webpack_require__(188)
	  , toIObject  = __webpack_require__(50)
	  , createDesc = __webpack_require__(34);

	$export($export.S, 'Object', {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
	    var O       = toIObject(object)
	      , setDesc = $.setDesc
	      , getDesc = $.getDesc
	      , keys    = ownKeys(O)
	      , result  = {}
	      , i       = 0
	      , key, D;
	    while(keys.length > i){
	      D = getDesc(O, key = keys[i++]);
	      if(key in result)setDesc(result, key, createDesc(0, D));
	      else result[key] = D;
	    } return result;
	  }
	});

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	// http://goo.gl/XkBrjD
	var $export = __webpack_require__(30)
	  , $values = __webpack_require__(203)(false);

	$export($export.S, 'Object', {
	  values: function values(it){
	    return $values(it);
	  }
	});

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(29)
	  , toIObject = __webpack_require__(50)
	  , isEnum    = $.isEnum;
	module.exports = function(isEntries){
	  return function(it){
	    var O      = toIObject(it)
	      , keys   = $.getKeys(O)
	      , length = keys.length
	      , i      = 0
	      , result = []
	      , key;
	    while(length > i)if(isEnum.call(O, key = keys[i++])){
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	// http://goo.gl/XkBrjD
	var $export  = __webpack_require__(30)
	  , $entries = __webpack_require__(203)(true);

	$export($export.S, 'Object', {
	  entries: function entries(it){
	    return $entries(it);
	  }
	});

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(30);

	$export($export.P, 'Map', {toJSON: __webpack_require__(206)('Map')});

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var forOf   = __webpack_require__(165)
	  , classof = __webpack_require__(74);
	module.exports = function(NAME){
	  return function toJSON(){
	    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
	    var arr = [];
	    forOf(this, false, arr.push, arr);
	    return arr;
	  };
	};

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(30);

	$export($export.P, 'Set', {toJSON: __webpack_require__(206)('Set')});

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	// JavaScript 1.6 / Strawman array statics shim
	var $       = __webpack_require__(29)
	  , $export = __webpack_require__(30)
	  , $ctx    = __webpack_require__(39)
	  , $Array  = __webpack_require__(32).Array || Array
	  , statics = {};
	var setStatics = function(keys, length){
	  $.each.call(keys.split(','), function(key){
	    if(length == undefined && key in $Array)statics[key] = $Array[key];
	    else if(key in [])statics[key] = $ctx(Function.call, [][key], length);
	  });
	};
	setStatics('pop,reverse,shift,keys,values,entries', 1);
	setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
	setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
	           'reduce,reduceRight,copyWithin,fill');
	$export($export.S, 'Array', statics);

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	// ie9- setTimeout & setInterval additional parameters fix
	var global     = __webpack_require__(31)
	  , $export    = __webpack_require__(30)
	  , invoke     = __webpack_require__(46)
	  , partial    = __webpack_require__(210)
	  , navigator  = global.navigator
	  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
	var wrap = function(set){
	  return MSIE ? function(fn, time /*, ...args */){
	    return set(invoke(
	      partial,
	      [].slice.call(arguments, 2),
	      typeof fn == 'function' ? fn : Function(fn)
	    ), time);
	  } : set;
	};
	$export($export.G + $export.B + $export.F * MSIE, {
	  setTimeout:  wrap(global.setTimeout),
	  setInterval: wrap(global.setInterval)
	});

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var path      = __webpack_require__(211)
	  , invoke    = __webpack_require__(46)
	  , aFunction = __webpack_require__(40);
	module.exports = function(/* ...pargs */){
	  var fn     = aFunction(this)
	    , length = arguments.length
	    , pargs  = Array(length)
	    , i      = 0
	    , _      = path._
	    , holder = false;
	  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
	  return function(/* ...args */){
	    var that  = this
	      , $$    = arguments
	      , $$len = $$.length
	      , j = 0, k = 0, args;
	    if(!holder && !$$len)return invoke(fn, pargs, that);
	    args = pargs.slice();
	    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = $$[k++];
	    while($$len > k)args.push($$[k++]);
	    return invoke(fn, args, that);
	  };
	};

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(31);

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(30)
	  , $task   = __webpack_require__(168);
	$export($export.G + $export.B, {
	  setImmediate:   $task.set,
	  clearImmediate: $task.clear
	});

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(144);
	var global      = __webpack_require__(31)
	  , hide        = __webpack_require__(33)
	  , Iterators   = __webpack_require__(127)
	  , ITERATOR    = __webpack_require__(58)('iterator')
	  , NL          = global.NodeList
	  , HTC         = global.HTMLCollection
	  , NLProto     = NL && NL.prototype
	  , HTCProto    = HTC && HTC.prototype
	  , ArrayValues = Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
	if(NLProto && !NLProto[ITERATOR])hide(NLProto, ITERATOR, ArrayValues);
	if(HTCProto && !HTCProto[ITERATOR])hide(HTCProto, ITERATOR, ArrayValues);

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */

	!(function(global) {
	  "use strict";

	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var iteratorSymbol =
	    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided, then outerFn.prototype instanceof Generator.
	    var generator = Object.create((outerFn || Generator).prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `value instanceof AwaitArgument` to determine if the yielded value is
	  // meant to be awaited. Some may consider the name of this method too
	  // cutesy, but they are curmudgeons.
	  runtime.awrap = function(arg) {
	    return new AwaitArgument(arg);
	  };

	  function AwaitArgument(arg) {
	    this.arg = arg;
	  }

	  function AsyncIterator(generator) {
	    // This invoke function is written in a style that assumes some
	    // calling function (or Promise) will handle exceptions.
	    function invoke(method, arg) {
	      var result = generator[method](arg);
	      var value = result.value;
	      return value instanceof AwaitArgument
	        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
	        : Promise.resolve(value).then(function(unwrapped) {
	            // When a yielded Promise is resolved, its final value becomes
	            // the .value of the Promise<{value,done}> result for the
	            // current iteration. If the Promise is rejected, however, the
	            // result for this iteration will be rejected with the same
	            // reason. Note that rejections of yielded Promises are not
	            // thrown back into the generator function, as is the case
	            // when an awaited Promise is rejected. This difference in
	            // behavior between yield and await is important, because it
	            // allows the consumer to decide what to do with the yielded
	            // rejection (swallow it and continue, manually .throw it back
	            // into the generator, abandon iteration, whatever). With
	            // await, by contrast, there is no opportunity to examine the
	            // rejection reason outside the generator function, so the
	            // only option is to throw it from the await expression, and
	            // let the generator function handle the exception.
	            result.value = unwrapped;
	            return result;
	          });
	    }

	    if (typeof process === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }

	    var invokeNext = invoke.bind(generator, "next");
	    var invokeThrow = invoke.bind(generator, "throw");
	    var invokeReturn = invoke.bind(generator, "return");
	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return invoke(method, arg);
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : new Promise(function (resolve) {
	          resolve(callInvokeWithMethodAndArg());
	        });
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );

	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" ||
	              (method === "throw" && delegate.iterator[method] === undefined)) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;

	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }

	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }

	          var record = tryCatch(
	            delegate.iterator[method],
	            delegate.iterator,
	            arg
	          );

	          if (record.type === "throw") {
	            context.delegate = null;

	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }

	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;

	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }

	          context.delegate = null;
	        }

	        if (method === "next") {
	          context._sent = arg;

	          if (state === GenStateSuspendedYield) {
	            context.sent = arg;
	          } else {
	            context.sent = undefined;
	          }
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }

	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }

	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          var info = {
	            value: record.arg,
	            done: context.done
	          };

	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      this.sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }

	      return ContinueSentinel;
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this
	);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(8)))

/***/ }
/******/ ]);