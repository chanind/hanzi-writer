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

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	  _createClass(HanziWriter, [{
	    key: 'setOptions',
	    value: function setOptions(options) {
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
	    }

	    // ------ public API ------ //

	  }, {
	    key: 'showCharacter',
	    value: function showCharacter() {
	      var _this = this;

	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this._animateWithData(function (animation) {
	        return _this._characterRenderer.show(animation);
	      }, options);
	    }
	  }, {
	    key: 'hideCharacter',
	    value: function hideCharacter() {
	      var _this2 = this;

	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this._animateWithData(function (animation) {
	        return _this2._characterRenderer.hide(animation);
	      }, options);
	    }
	  }, {
	    key: 'animateCharacter',
	    value: function animateCharacter() {
	      var _this3 = this;

	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this.cancelQuiz();
	      this._animateWithData(function (animation) {
	        return _this3._characterRenderer.animate(animation);
	      }, options);
	    }
	  }, {
	    key: 'showOutline',
	    value: function showOutline() {
	      var _this4 = this;

	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this._animateWithData(function (animation) {
	        return _this4._outlineRenderer.show(animation);
	      }, options);
	    }
	  }, {
	    key: 'hideOutline',
	    value: function hideOutline() {
	      var _this5 = this;

	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this._animateWithData(function (animation) {
	        return _this5._outlineRenderer.hide(animation);
	      }, options);
	    }
	  }, {
	    key: 'quiz',
	    value: function quiz() {
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
	    }
	  }, {
	    key: 'cancelQuiz',
	    value: function cancelQuiz() {
	      if (this._quiz) this._quiz.cancel();
	      this._quiz = null;
	    }
	  }, {
	    key: 'setCharacter',
	    value: function setCharacter(char) {
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
	    }

	    // ------------- //

	  }, {
	    key: '_loadCharacterData',
	    value: function _loadCharacterData(char) {
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
	    }
	  }, {
	    key: '_withData',
	    value: function _withData(func) {
	      this._withDataPromise = this._withDataPromise.then(func);
	      return this._withDataPromise;
	    }
	  }, {
	    key: '_setupListeners',
	    value: function _setupListeners() {
	      var _this9 = this;

	      this._svg.node.addEventListener('mousedown', function (evt) {
	        evt.preventDefault();
	        if (_this9.isLoadingCharData) return;
	        _this9._forwardToQuiz('startUserStroke', _this9._getMousePoint(evt));
	      });
	      this._svg.node.addEventListener('touchstart', function (evt) {
	        evt.preventDefault();
	        if (_this9.isLoadingCharData) return;
	        _this9._forwardToQuiz('startUserStroke', _this9._getTouchPoint(evt));
	      });
	      this._svg.node.addEventListener('mousemove', function (evt) {
	        evt.preventDefault();
	        if (_this9.isLoadingCharData) return;
	        _this9._forwardToQuiz('continueUserStroke', _this9._getMousePoint(evt));
	      });
	      this._svg.node.addEventListener('touchmove', function (evt) {
	        evt.preventDefault();
	        if (_this9.isLoadingCharData) return;
	        _this9._forwardToQuiz('continueUserStroke', _this9._getTouchPoint(evt));
	      });

	      // TODO: fix
	      document.addEventListener('mouseup', function () {
	        return _this9._forwardToQuiz('endUserStroke');
	      });
	      document.addEventListener('touchend', function () {
	        return _this9._forwardToQuiz('endUserStroke');
	      });
	    }
	  }, {
	    key: '_forwardToQuiz',
	    value: function _forwardToQuiz(method) {
	      var _quiz;

	      if (!this._quiz) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_quiz = this._quiz)[method].apply(_quiz, args);
	    }
	  }, {
	    key: '_getMousePoint',
	    value: function _getMousePoint(evt) {
	      return this._positioner.convertExternalPoint(new _Point2.default(evt.offsetX, evt.offsetY));
	    }
	  }, {
	    key: '_getTouchPoint',
	    value: function _getTouchPoint(evt) {
	      var x = evt.touches[0].pageX - this._svg.node.offsetLeft;
	      var y = evt.touches[0].pageY - this._svg.node.offsetTop;
	      return this._positioner.convertExternalPoint(new _Point2.default(x, y));
	    }
	  }, {
	    key: '_animate',
	    value: function _animate(func) {
	      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      return this._animator.animate(func, options);
	    }
	  }, {
	    key: '_animateWithData',
	    value: function _animateWithData(func) {
	      var _this10 = this;

	      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      return this._withData(function () {
	        return _this10._animate(func, options);
	      });
	    }
	  }]);

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
	exports.default = HanziWriter;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CharacterRenderer).call(this));

	    _this.options = options;
	    _this.character = character;
	    _this.strokeRenderers = _this.character.getStrokes().map(function (stroke) {
	      return _this.registerChild(new _StrokeRenderer2.default(stroke, options));
	    });
	    return _this;
	  }

	  _createClass(CharacterRenderer, [{
	    key: 'getBounds',
	    value: function getBounds() {
	      return this.character.getBounds();
	    }
	  }, {
	    key: 'show',
	    value: function show(animation) {
	      var promises = this.strokeRenderers.map(function (strokeRenderer) {
	        return strokeRenderer.show(animation);
	      });
	      return Promise.all(promises);
	    }
	  }, {
	    key: 'showImmediate',
	    value: function showImmediate() {
	      this.strokeRenderers.map(function (renderer) {
	        return renderer.showImmediate();
	      });
	    }
	  }, {
	    key: 'hide',
	    value: function hide(animation) {
	      var promises = this.strokeRenderers.map(function (strokeRenderer) {
	        return strokeRenderer.hide(animation);
	      });
	      return Promise.all(promises);
	    }
	  }, {
	    key: 'hideImmediate',
	    value: function hideImmediate() {
	      this.strokeRenderers.map(function (renderer) {
	        return renderer.hideImmediate();
	      });
	    }
	  }, {
	    key: 'flash',
	    value: function flash(animation) {
	      var _this2 = this;

	      return this.show(animation).then(function () {
	        return _this2.hide(animation);
	      });
	    }
	  }, {
	    key: 'showStroke',
	    value: function showStroke(strokeNum, animation) {
	      return this.getStrokeRenderer(strokeNum).show(animation);
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.strokeRenderers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var strokeRenderer = _step.value;

	          strokeRenderer.draw();
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return this;
	    }
	  }, {
	    key: 'getStrokeRenderer',
	    value: function getStrokeRenderer(strokeNum) {
	      return this.strokeRenderers[strokeNum];
	    }
	  }, {
	    key: 'animate',
	    value: function animate(animation) {
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
	    }
	  }, {
	    key: 'setCanvas',
	    value: function setCanvas(canvas) {
	      _get(Object.getPrototypeOf(CharacterRenderer.prototype), 'setCanvas', this).call(this, canvas);
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = this.strokeRenderers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var strokeRenderer = _step2.value;

	          strokeRenderer.setCanvas(canvas);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }

	      return this;
	    }
	  }]);

	  return CharacterRenderer;
	})(_Renderer3.default);

	exports.default = CharacterRenderer;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Renderer = (function () {
	  function Renderer() {
	    _classCallCheck(this, Renderer);

	    this.isDestroyed = false; // check this in children in animations, etc
	    this.childRenderers = [];
	    this.parentRenderer = null;
	  }

	  // implement in children

	  _createClass(Renderer, [{
	    key: "draw",
	    value: function draw() {
	      return this;
	    }
	  }, {
	    key: "registerChild",
	    value: function registerChild(child) {
	      this.childRenderers.push(child);
	      child.setParent(this);
	      return child;
	    }
	  }, {
	    key: "setParent",
	    value: function setParent(parent) {
	      this.parentRenderer = parent;
	      return this;
	    }
	  }, {
	    key: "setCanvas",
	    value: function setCanvas(canvas) {
	      this.canvas = canvas;
	      return this;
	    }

	    // extend this in children with extra behavior

	  }, {
	    key: "destroy",
	    value: function destroy() {
	      this.isDestroyed = true;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.childRenderers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var child = _step.value;

	          child.destroy();
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }]);

	  return Renderer;
	})();

	exports.default = Renderer;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StrokeRenderer).call(this));

	    _this.stroke = stroke;
	    _this.strokePartRenderers = _this.stroke.getStrokeParts().map(function (strokePart) {
	      return _this.registerChild(new _StrokePartRenderer2.default(strokePart, stroke, options));
	    });
	    _this.options = options;
	    return _this;
	  }

	  _createClass(StrokeRenderer, [{
	    key: 'show',
	    value: function show(animation) {
	      var promises = this.strokePartRenderers.map(function (strokePartRenderer) {
	        return strokePartRenderer.show(animation);
	      });
	      return Promise.all(promises);
	    }
	  }, {
	    key: 'showImmediate',
	    value: function showImmediate() {
	      this.strokePartRenderers.map(function (renderer) {
	        return renderer.showImmediate();
	      });
	    }
	  }, {
	    key: 'hide',
	    value: function hide(animation) {
	      var promises = this.strokePartRenderers.map(function (strokePartRenderer) {
	        return strokePartRenderer.hide(animation);
	      });
	      return Promise.all(promises);
	    }
	  }, {
	    key: 'hideImmediate',
	    value: function hideImmediate() {
	      this.strokePartRenderers.map(function (renderer) {
	        return renderer.hideImmediate();
	      });
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.strokePartRenderers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var strokePartRenderer = _step.value;

	          strokePartRenderer.draw(this.canvas);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return this;
	    }
	  }, {
	    key: 'animate',
	    value: function animate(animation) {
	      if (!animation.isActive()) return null;
	      var renderChain = Promise.resolve();
	      this.strokePartRenderers.forEach(function (strokePartRenderer) {
	        renderChain = renderChain.then(function () {
	          return strokePartRenderer.animate(animation);
	        });
	      });
	      return renderChain;
	    }
	  }, {
	    key: 'highlight',
	    value: function highlight(animation) {
	      var _this2 = this;

	      return this.animate(animation).then(function () {
	        return _this2.hide(animation);
	      });
	    }
	  }, {
	    key: 'setCanvas',
	    value: function setCanvas(canvas) {
	      _get(Object.getPrototypeOf(StrokeRenderer.prototype), 'setCanvas', this).call(this, canvas);
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = this.strokePartRenderers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var strokePartRenderer = _step2.value;

	          strokePartRenderer.setCanvas(canvas);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }]);

	  return StrokeRenderer;
	})(_Renderer3.default);

	exports.default = StrokeRenderer;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StrokePartRenderer).call(this));

	    _this.options = options;
	    _this.strokePart = strokePart;
	    _this.stroke = stroke;
	    return _this;
	  }

	  _createClass(StrokePartRenderer, [{
	    key: 'getPathString',
	    value: function getPathString() {
	      return _get(Object.getPrototypeOf(StrokePartRenderer.prototype), 'getPathString', this).call(this) + ' z';
	    }
	  }, {
	    key: 'getPoints',
	    value: function getPoints() {
	      return this.strokePart.getPoints();
	    }
	  }, {
	    key: 'markAnimationPoints',
	    value: function markAnimationPoints() {
	      var start = this.strokePart.getStartingPoint();
	      var end = this.strokePart.getEndingPoint();
	      this.canvas.circle(10).attr({ fill: '#9F9' }).move(start.getX(), start.getY());
	      this.canvas.circle(10).attr({ fill: '#9F9' }).move(end.getX(), end.getY());
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      _get(Object.getPrototypeOf(StrokePartRenderer.prototype), 'draw', this).call(this);
	      this.path.attr(this.getStrokeAttrs()).attr({ opacity: 0 });
	      return this;
	    }
	  }, {
	    key: 'show',
	    value: function show(animation) {
	      var _this2 = this;

	      return new Promise(function (resolve, reject) {
	        var svgAnimation = _this2.path.animate(_this2.options.strokeAnimationDuration).opacity(1).after(resolve);
	        animation.registerSvgAnimation(svgAnimation);
	      });
	    }
	  }, {
	    key: 'hide',
	    value: function hide(animation) {
	      var _this3 = this;

	      return new Promise(function (resolve, reject) {
	        var svgAnimation = _this3.path.animate(_this3.options.strokeAnimationDuration).opacity(0).after(resolve);
	        animation.registerSvgAnimation(svgAnimation);
	      });
	    }
	  }, {
	    key: 'hideImmediate',
	    value: function hideImmediate() {
	      this.path.opacity(0);
	    }
	  }, {
	    key: 'showImmediate',
	    value: function showImmediate() {
	      this.path.opacity(1);
	    }
	  }, {
	    key: 'animate',
	    value: function animate(animation) {
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
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      _get(Object.getPrototypeOf(StrokePartRenderer.prototype), 'destroy', this).call(this);
	      if (this.mask) this.mask.remove();
	    }
	  }, {
	    key: 'getStrokeAttrs',
	    value: function getStrokeAttrs() {
	      return {
	        fill: this.options.strokeColor,
	        stroke: this.options.strokeColor,
	        'stroke-width': this.options.strokeWidth
	      };
	    }
	  }]);

	  return StrokePartRenderer;
	})(_PathRenderer3.default);

	module.exports = StrokePartRenderer;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PathRenderer).apply(this, arguments));
	  }

	  _createClass(PathRenderer, [{
	    key: 'getPoints',
	    value: function getPoints() {} // overwrite in children

	  }, {
	    key: 'getPathString',
	    value: function getPathString() {
	      var points = this.getPoints();
	      var start = points[0];
	      var remainingPoints = points.slice(1);
	      var pathString = 'M ' + start.getX() + ' ' + start.getY();
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = remainingPoints[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var point = _step.value;

	          pathString += ' L ' + point.getX() + ' ' + point.getY();
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return pathString;
	    }
	  }, {
	    key: 'drawPath',
	    value: function drawPath() {
	      this.path = this.canvas.path(this.getPathString());
	      return this.path;
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      this.drawPath();
	      return this;
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      _get(Object.getPrototypeOf(PathRenderer.prototype), 'destroy', this).call(this);
	      if (this.path) this.path.remove();
	    }
	  }]);

	  return PathRenderer;
	})(_Renderer3.default);

	exports.default = PathRenderer;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
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
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var arrayVal = _step.value;

	      if (val === arrayVal) return true;
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
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
	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = arr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var val = _step2.value;

	      sum += val;
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
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

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PositionerRenderer).call(this));

	    _this.positioner = positioner;
	    _this.positonedCanvas = null;
	    return _this;
	  }

	  _createClass(PositionerRenderer, [{
	    key: 'getPositionedCanvas',
	    value: function getPositionedCanvas() {
	      return this.positonedCanvas;
	    }
	  }, {
	    key: 'setCanvas',
	    value: function setCanvas(canvas) {
	      _get(Object.getPrototypeOf(PositionerRenderer.prototype), 'setCanvas', this).call(this, canvas);
	      this.positonedCanvas = this.canvas.group().move(this.positioner.getXOffset(), this.positioner.getYOffset()).transform({ scaleX: this.positioner.getScale(), scaleY: this.positioner.getScale() });
	      return this;
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      _get(Object.getPrototypeOf(PositionerRenderer.prototype), 'destroy', this).call(this);
	      this.positonedCanvas.remove();
	    }
	  }]);

	  return PositionerRenderer;
	})(_Renderer3.default);

	exports.default = PositionerRenderer;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Point = (function () {
	  function Point(x, y) {
	    _classCallCheck(this, Point);

	    this._x = parseInt(x, 10);
	    this._y = parseInt(y, 10);
	  }

	  _createClass(Point, [{
	    key: 'getX',
	    value: function getX() {
	      return this._x;
	    }
	  }, {
	    key: 'getY',
	    value: function getY() {
	      return this._y;
	    }

	    // return a new point subtracting point from this

	  }, {
	    key: 'subtract',
	    value: function subtract(point) {
	      return new Point(this.getX() - point.getX(), this.getY() - point.getY());
	    }
	  }, {
	    key: 'getMagnitude',
	    value: function getMagnitude() {
	      return Math.sqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2));
	    }
	  }, {
	    key: 'equals',
	    value: function equals(point) {
	      if (!point) return false;
	      return point.getX() === this.getX() && point.getY() === this.getY();
	    }
	  }]);

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
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = boundables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var boundable = _step.value;

	      var _boundable$getBounds = boundable.getBounds();

	      var _boundable$getBounds2 = _slicedToArray(_boundable$getBounds, 2);

	      var lowerBound = _boundable$getBounds2[0];
	      var upperBound = _boundable$getBounds2[1];

	      bounds.push(lowerBound);
	      bounds.push(upperBound);
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
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

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	  _createClass(ZdtStrokeParser, [{
	    key: 'generateCharacter',
	    value: function generateCharacter(symbol, zdtPathStrings) {
	      var strokes = this.generateStrokes(zdtPathStrings);
	      return new _Character2.default(symbol, strokes);
	    }
	  }, {
	    key: 'generateStrokes',
	    value: function generateStrokes(zdtPathStrings) {
	      var strokes = [];
	      var strokeParts = [];
	      var strokeNum = 0;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = zdtPathStrings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var zdtPathString = _step.value;

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
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return strokes;
	    }
	  }, {
	    key: '_extractStrokeData',
	    value: function _extractStrokeData(zdtPathString) {
	      var _this = this;

	      var _zdtPathString$split = zdtPathString.split(':');

	      var _zdtPathString$split2 = _slicedToArray(_zdtPathString$split, 2);

	      var metadataString = _zdtPathString$split2[0];
	      var rawPathString = _zdtPathString$split2[1];

	      var pathString = rawPathString.replace(/;?\s*$/, '');
	      var points = pathString.split(';').map(function (pointString) {
	        return _this._parsePoint(pointString);
	      });
	      var isComplete = metadataString[2] === 'P';
	      var strokeType = parseInt(metadataString[1], 10);
	      return { points: points, isComplete: isComplete, strokeType: strokeType };
	    }
	  }, {
	    key: '_parsePoint',
	    value: function _parsePoint(pointString) {
	      var _pointString$split = pointString.split(',');

	      var _pointString$split2 = _slicedToArray(_pointString$split, 2);

	      var x = _pointString$split2[0];
	      var y = _pointString$split2[1];

	      return new _Point2.default(x, y);
	    }
	  }]);

	  return ZdtStrokeParser;
	})();

	exports.default = ZdtStrokeParser;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	  _createClass(Stroke, [{
	    key: 'getStrokeParts',
	    value: function getStrokeParts() {
	      return this._strokeParts;
	    }
	  }, {
	    key: 'getNumStrokeParts',
	    value: function getNumStrokeParts() {
	      return this._strokeParts.length;
	    }
	  }, {
	    key: 'getStrokeNum',
	    value: function getStrokeNum() {
	      return this._strokeNum;
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds() {
	      return _Point2.default.getOverallBounds(this._strokeParts);
	    }
	  }, {
	    key: 'getLength',
	    value: function getLength() {
	      return this._strokeParts.reduce(function (acc, part) {
	        return acc + part.getLength();
	      }, 0);
	    }
	  }, {
	    key: 'getVectors',
	    value: function getVectors() {
	      return this._strokeParts.map(function (strokePart) {
	        return strokePart.getVector();
	      });
	    }
	  }, {
	    key: 'getStartingPoint',
	    value: function getStartingPoint() {
	      return this._strokeParts[0].getStartingPoint();
	    }
	  }, {
	    key: 'getEndingPoint',
	    value: function getEndingPoint() {
	      return this._strokeParts[this._strokeParts.length - 1].getEndingPoint();
	    }
	  }, {
	    key: 'getDistance',
	    value: function getDistance(point) {
	      var distances = this._strokeParts.map(function (strokePart) {
	        return strokePart.getDistance(point);
	      });
	      return Math.min.apply(Math, distances);
	    }
	  }, {
	    key: 'getAverageDistance',
	    value: function getAverageDistance(points) {
	      var totalDist = 0;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var point = _step.value;

	          totalDist += this.getDistance(point);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return totalDist / points.length;
	    }
	  }]);

	  return Stroke;
	})();

	exports.default = Stroke;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	  _createClass(StrokePart, [{
	    key: 'getPoints',
	    value: function getPoints() {
	      return this._points;
	    }
	  }, {
	    key: 'getStrokeType',
	    value: function getStrokeType() {
	      return this._strokeType;
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds() {
	      return _Point2.default.getBounds(this._points);
	    }
	  }, {
	    key: 'getVector',
	    value: function getVector() {
	      return this.getEndingPoint().subtract(this.getStartingPoint());
	    }

	    // http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points

	  }, {
	    key: 'getDistance',
	    value: function getDistance(point) {
	      var start = this.getStartingPoint();
	      var end = this.getEndingPoint();
	      var dx = end.getX() - start.getX();
	      var dy = end.getY() - start.getY();
	      var length = this.getLength();
	      return Math.abs(dy * point.getX() - dx * point.getY() - start.getX() * end.getY() + start.getY() * end.getX()) / length;
	    }
	  }, {
	    key: 'getLength',
	    value: function getLength() {
	      var start = this.getStartingPoint();
	      var end = this.getEndingPoint();
	      return _Point2.default.getDistance(start, end);
	    }
	  }, {
	    key: 'getStartingPoint',
	    value: function getStartingPoint() {
	      return this._getExtremePoint(false);
	    }
	  }, {
	    key: 'getEndingPoint',
	    value: function getEndingPoint() {
	      return this._getExtremePoint(true);
	    }

	    // where to start or end drawing the stroke based on the stroke type

	  }, {
	    key: '_getExtremePoint',
	    value: function _getExtremePoint(isReverse) {
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
	    }
	  }]);

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

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	  _createClass(Character, [{
	    key: 'getSymbol',
	    value: function getSymbol() {
	      return this._symbol;
	    }
	  }, {
	    key: 'getStrokes',
	    value: function getStrokes() {
	      return this._strokes;
	    }
	  }, {
	    key: 'getStroke',
	    value: function getStroke(strokeNum) {
	      return this._strokes[strokeNum];
	    }
	  }, {
	    key: 'getNumStrokes',
	    value: function getNumStrokes() {
	      return this._strokes.length;
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds() {
	      return _Point2.default.getOverallBounds(this.getStrokes());
	    }
	  }]);

	  return Character;
	})();

	exports.default = Character;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	  _createClass(Positioner, [{
	    key: 'convertExternalPoint',
	    value: function convertExternalPoint(point) {
	      var x = (point.getX() - this._xOffset) / this._scale;
	      var y = (point.getY() - this._yOffset) / this._scale;
	      return new _Point2.default(x, y);
	    }
	  }, {
	    key: 'getXOffset',
	    value: function getXOffset() {
	      return this._xOffset;
	    }
	  }, {
	    key: 'getYOffset',
	    value: function getYOffset() {
	      return this._yOffset;
	    }
	  }, {
	    key: 'getScale',
	    value: function getScale() {
	      return this._scale;
	    }
	  }, {
	    key: '_calculateScaleAndOffset',
	    value: function _calculateScaleAndOffset() {
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
	    }
	  }]);

	  return Positioner;
	})();

	exports.default = Positioner;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	  _createClass(Quiz, [{
	    key: 'startUserStroke',
	    value: function startUserStroke(point) {
	      if (!this._isActive) return null;
	      if (this._userStroke) return this.endUserStroke();
	      this._userStroke = new _UserStroke2.default(point);
	      this._userStrokeRenderer = new _UserStrokeRenderer2.default(this._userStroke, this._userStrokeOptions);
	      this._userStrokeRenderer.setCanvas(this._canvas).draw();
	    }
	  }, {
	    key: 'continueUserStroke',
	    value: function continueUserStroke(point) {
	      if (!this._userStroke) return;
	      this._userStroke.appendPoint(point);
	      this._userStrokeRenderer.updatePath();
	    }
	  }, {
	    key: 'endUserStroke',
	    value: function endUserStroke() {
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
	          _this._handleFaiulure();
	          if (_this._numRecentMistakes >= _this._quizOptions.showHintAfterMisses) {
	            promises.push(_this._highlightCorrectStroke(animation));
	          }
	        }
	        return Promise.all(promises);
	      });
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel() {
	      this._isActive = false;
	    }
	  }, {
	    key: '_handleSuccess',
	    value: function _handleSuccess(stroke, animation) {
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
	    }
	  }, {
	    key: '_handleFaiulure',
	    value: function _handleFaiulure() {
	      this._numRecentMistakes += 1;
	      this._totalMistakes += 1;
	      (0, _utils.callIfExists)(this._quizOptions.onCorrectStroke, {
	        character: this._character.getSymbol(),
	        strokeNum: this._currentStrokeIndex,
	        mistakesOnStroke: this._numRecentMistakes,
	        totalMistakes: this._totalMistakes,
	        strokesRemaining: this._character.getNumStrokes() - this._currentStrokeIndex
	      });
	    }
	  }, {
	    key: '_highlightCorrectStroke',
	    value: function _highlightCorrectStroke(animation) {
	      var strokeHintRenderer = this._highlightRenderer.getStrokeRenderer(this._currentStrokeIndex);
	      return strokeHintRenderer.highlight(animation);
	    }
	  }, {
	    key: '_drawMatchingStroke',
	    value: function _drawMatchingStroke(stroke, animation) {
	      this._drawnStrokes.push(stroke);
	      return this._characterRenderer.showStroke(stroke.getStrokeNum(), animation);
	    }
	  }, {
	    key: '_isValidStroke',
	    value: function _isValidStroke(stroke) {
	      if (!stroke) return false;
	      if ((0, _utils.inArray)(stroke, this._drawnStrokes)) return false;
	      return stroke === this._character.getStroke(this._currentStrokeIndex);
	    }

	    // hide the caracter

	  }, {
	    key: '_setupCharacter',
	    value: function _setupCharacter() {
	      var _this3 = this;

	      this._animator.animate(function (animation) {
	        return _this3._characterRenderer.hide(animation);
	      });
	    }
	  }]);

	  return Quiz;
	})();

	exports.default = Quiz;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	  _createClass(StrokeMatcher, [{
	    key: 'getMatchingStroke',
	    value: function getMatchingStroke(userStroke, strokes) {
	      var points = this._stripDuplicates(userStroke.getPoints());
	      if (points.length < 2) return null;

	      var closestStroke = null;
	      var bestAvgDist = 0;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = strokes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var stroke = _step.value;

	          var avgDist = stroke.getAverageDistance(points);
	          if (avgDist < bestAvgDist || !closestStroke) {
	            closestStroke = stroke;
	            bestAvgDist = avgDist;
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
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
	    }
	  }, {
	    key: '_startAndEndMatches',
	    value: function _startAndEndMatches(points, closestStroke) {
	      var startingDist = _Point2.default.getDistance(closestStroke.getStartingPoint(), points[0]);
	      var endingDist = _Point2.default.getDistance(closestStroke.getEndingPoint(), points[points.length - 1]);
	      return startingDist < START_AND_END_DIST_THRESHOLD && endingDist < START_AND_END_DIST_THRESHOLD;
	    }
	  }, {
	    key: '_directionMatches',
	    value: function _directionMatches(points, stroke) {
	      var edgeVectors = this._getEdgeVectors(points);
	      var strokeVectors = stroke.getVectors();
	      var similarities = [];
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        var _loop = function _loop() {
	          var edgeVector = _step2.value;

	          var strokeSimilarities = strokeVectors.map(function (strokeVector) {
	            return _Point2.default.cosineSimilarity(strokeVector, edgeVector);
	          });
	          var maxSimilarity = Math.max.apply(Math, strokeSimilarities);
	          similarities.push(maxSimilarity);
	        };

	        for (var _iterator2 = edgeVectors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          _loop();
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }

	      var avgSimilarity = (0, _utils.average)(similarities);
	      return avgSimilarity > COSINE_SIMILARITY_THRESHOLD;
	    }
	  }, {
	    key: '_stripDuplicates',
	    value: function _stripDuplicates(points) {
	      if (points.length < 2) return points;
	      var dedupedPoints = [points[0]];
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = points.slice(1)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var point = _step3.value;

	          if (!point.equals(dedupedPoints[dedupedPoints.length - 1])) {
	            dedupedPoints.push(point);
	          }
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }

	      return dedupedPoints;
	    }
	  }, {
	    key: '_getLength',
	    value: function _getLength(points) {
	      var length = 0;
	      var lastPoint = points[0];
	      var _iteratorNormalCompletion4 = true;
	      var _didIteratorError4 = false;
	      var _iteratorError4 = undefined;

	      try {
	        for (var _iterator4 = points[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	          var point = _step4.value;

	          length += _Point2.default.getDistance(point, lastPoint);
	          lastPoint = point;
	        }
	      } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion4 && _iterator4.return) {
	            _iterator4.return();
	          }
	        } finally {
	          if (_didIteratorError4) {
	            throw _iteratorError4;
	          }
	        }
	      }

	      return length;
	    }

	    // returns a list of the direction of all segments in the line connecting the points

	  }, {
	    key: '_getEdgeVectors',
	    value: function _getEdgeVectors(points) {
	      var vectors = [];
	      var lastPoint = points[0];
	      var _iteratorNormalCompletion5 = true;
	      var _didIteratorError5 = false;
	      var _iteratorError5 = undefined;

	      try {
	        for (var _iterator5 = points.slice(1)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	          var point = _step5.value;

	          vectors.push(point.subtract(lastPoint));
	        }
	      } catch (err) {
	        _didIteratorError5 = true;
	        _iteratorError5 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion5 && _iterator5.return) {
	            _iterator5.return();
	          }
	        } finally {
	          if (_didIteratorError5) {
	            throw _iteratorError5;
	          }
	        }
	      }

	      return vectors;
	    }
	  }]);

	  return StrokeMatcher;
	})();

	exports.default = StrokeMatcher;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Point = __webpack_require__(12);

	var _Point2 = _interopRequireDefault(_Point);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UserStroke = (function () {
	  function UserStroke(startingPoint) {
	    _classCallCheck(this, UserStroke);

	    this._points = [startingPoint];
	  }

	  _createClass(UserStroke, [{
	    key: 'getPoints',
	    value: function getPoints() {
	      return this._points;
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds() {
	      return _Point2.default.getBounds(this._points);
	    }
	  }, {
	    key: 'appendPoint',
	    value: function appendPoint(point) {
	      this._points.push(point);
	    }
	  }]);

	  return UserStroke;
	})();

	exports.default = UserStroke;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UserStrokeRenderer).call(this));

	    _this.options = options;
	    _this.userStroke = userStroke;
	    return _this;
	  }

	  _createClass(UserStrokeRenderer, [{
	    key: 'getPoints',
	    value: function getPoints() {
	      return this.userStroke.getPoints();
	    }
	  }, {
	    key: 'updatePath',
	    value: function updatePath() {
	      this.path.plot(this.getPathString());
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      _get(Object.getPrototypeOf(UserStrokeRenderer.prototype), 'draw', this).call(this);
	      this.path.attr(this.getStrokeAttrs());
	      return this;
	    }
	  }, {
	    key: 'fadeAndRemove',
	    value: function fadeAndRemove(animation) {
	      var _this2 = this;

	      return new Promise(function (resolve, reject) {
	        var svgAnimation = _this2.path.animate(_this2.options.fadeDuration).attr({ opacity: 0 }).after(resolve);
	        animation.registerSvgAnimation(svgAnimation);
	      }).then(function () {
	        return _this2.destroy();
	      });
	    }
	  }, {
	    key: 'getStrokeAttrs',
	    value: function getStrokeAttrs() {
	      return {
	        fill: 'none',
	        stroke: this.options.strokeColor,
	        'stroke-width': this.options.strokeWidth
	      };
	    }
	  }]);

	  return UserStrokeRenderer;
	})(_PathRenderer3.default);

	exports.default = UserStrokeRenderer;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (char, onLoad) {
	  // load char data from hanziwriter.org cdn (currently hosted on github pages)
	  var xhr = new XMLHttpRequest();
	  xhr.overrideMimeType('application/json');
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

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Animation = __webpack_require__(24);

	var _Animation2 = _interopRequireDefault(_Animation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Animator = (function () {
	  function Animator() {
	    _classCallCheck(this, Animator);
	  }

	  _createClass(Animator, [{
	    key: 'construct',
	    value: function construct() {
	      this._lastAnimation = null;
	    }
	  }, {
	    key: 'animate',
	    value: function animate(func) {
	      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      var animation = this._setupAnimation(options);
	      func(animation).then(function () {
	        return animation.finish();
	      });
	    }
	  }, {
	    key: '_setupAnimation',
	    value: function _setupAnimation(options) {
	      if (this._lastAnimation) this._lastAnimation.cancel();
	      this._lastAnimation = new _Animation2.default(options);
	      return this._lastAnimation;
	    }
	  }]);

	  return Animator;
	})();

	exports.default = Animator;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

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

	  _createClass(Animation, [{
	    key: 'cancel',
	    value: function cancel() {
	      if (!this.isActive()) return;

	      this._isActive = false;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this._svgAnimations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var svgAnimation = _step.value;

	          svgAnimation.stop(true);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'registerSvgAnimation',
	    value: function registerSvgAnimation(svgAnimation) {
	      this._svgAnimations.push(svgAnimation);
	    }
	  }, {
	    key: 'isActive',
	    value: function isActive() {
	      return this._isActive;
	    }
	  }, {
	    key: 'finish',
	    value: function finish() {
	      if (this.isActive()) {
	        this._isActive = false;
	        (0, _utils.callIfExists)(this._callback);
	      }
	    }
	  }]);

	  return Animation;
	})();

	exports.default = Animation;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	* svg.js - A lightweight library for manipulating and animating SVG.
	* @version 2.1.1
	* http://www.svgjs.com
	*
	* @copyright Wout Fierens <wout@impinc.co.uk>
	* @license MIT
	*
	* BUILT: Mon Oct 05 2015 20:47:18 GMT+0200 (Mitteleuropäische Sommerzeit)
	*/;

	(function(root, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    module.exports = factory(require, exports, module);
	  } else {
	    root.SVG = factory();
	  }
	}(this, function(require, exports, module) {

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
	    /* fill and stroke */
	    'fill-opacity':     1
	  , 'stroke-opacity':   1
	  , 'stroke-width':     0
	  , 'stroke-linejoin':  'miter'
	  , 'stroke-linecap':   'butt'
	  , fill:               '#000000'
	  , stroke:             '#000000'
	  , opacity:            1
	    /* position */
	  , x:                  0
	  , y:                  0
	  , cx:                 0
	  , cy:                 0
	    /* size */  
	  , width:              0
	  , height:             0
	    /* radius */  
	  , r:                  0
	  , rx:                 0
	  , ry:                 0
	    /* gradient */  
	  , offset:             0
	  , 'stop-opacity':     1
	  , 'stop-color':       '#000000'
	    /* text */
	  , 'font-size':        16
	  , 'font-family':      'Helvetica, Arial, sans-serif'
	  , 'text-anchor':      'start'
	  }
	  
	}
	// Module for color convertions
	SVG.Color = function(color) {
	  var match
	  
	  /* initialize defaults */
	  this.r = 0
	  this.g = 0
	  this.b = 0
	  
	  /* parse color */
	  if (typeof color === 'string') {
	    if (SVG.regex.isRgb.test(color)) {
	      /* get rgb values */
	      match = SVG.regex.rgb.exec(color.replace(/\s/g,''))
	      
	      /* parse numeric values */
	      this.r = parseInt(match[1])
	      this.g = parseInt(match[2])
	      this.b = parseInt(match[3])
	      
	    } else if (SVG.regex.isHex.test(color)) {
	      /* get hex values */
	      match = SVG.regex.hex.exec(fullHex(color))

	      /* parse numeric values */
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
	    /* make sure a destination is defined */
	    if (!this.destination) return this

	    /* normalise pos */
	    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

	    /* generate morphed color */
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

	  /* if array is empty and fallback is provided, use fallback */
	  if (array.length == 0 && fallback)
	    array = fallback.valueOf()

	  /* parse array */
	  this.value = this.parse(array)
	}

	SVG.extend(SVG.Array, {
	  // Make array morphable
	  morph: function(array) {
	    this.destination = this.parse(array)

	    /* normalize length of arrays */
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
	    /* find all unique values */
	    for (var i = 0, il = this.value.length, seen = []; i < il; i++)
	      if (seen.indexOf(this.value[i]) == -1)
	        seen.push(this.value[i])

	    /* set new value */
	    return this.value = seen
	  }
	  // Get morphed array at given position
	, at: function(pos) {
	    /* make sure a destination is defined */
	    if (!this.destination) return this

	    /* generate morphed array */
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

	    /* if already is an array, no need to parse it */
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
	    /* convert to a poly point string */
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
	    /* make sure a destination is defined */
	    if (!this.destination) return this

	    /* generate morphed point string */
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

	    /* if already is an array, no need to parse it */
	    if (Array.isArray(array)) return array

	    /* split points */
	    array = this.split(array)

	    /* parse points */
	    for (var i = 0, il = array.length, p, points = []; i < il; i++) {
	      p = array[i].split(',')
	      points.push([parseFloat(p[0]), parseFloat(p[1])])
	    }

	    return points
	  }
	  // Move point string
	, move: function(x, y) {
	    var box = this.bbox()

	    /* get relative offset */
	    x -= box.x
	    y -= box.y

	    /* move every point */
	    if (!isNaN(x) && !isNaN(y))
	      for (var i = this.value.length - 1; i >= 0; i--)
	        this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]

	    return this
	  }
	  // Resize poly string
	, size: function(width, height) {
	    var i, box = this.bbox()

	    /* recalculate position of all points according to new size */
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
			/* get bounding box of current situation */
			var box = this.bbox()
			
	    /* get relative offset */
	    x -= box.x
	    y -= box.y

	    if (!isNaN(x) && !isNaN(y)) {
	      /* move every point */
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
			/* get bounding box of current situation */
			var i, l, box = this.bbox()

	    /* recalculate position of all points according to new size */
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
	        /* resize radii */
	        this.value[i][1] = (this.value[i][1] * width)  / box.width
	        this.value[i][2] = (this.value[i][2] * height) / box.height

	        /* move position values */
	        this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
	        this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
	      }

	    }

	    return this
	  }
	  // Absolutize and parse path to array
	, parse: function(array) {
	    /* if it's already is a patharray, no need to parse it */
	    if (array instanceof SVG.PathArray) return array.valueOf()

	    /* prepare for parsing */
	    var i, il, x0, y0, x1, y1, x2, y2, s, seg, segs
	      , x = 0
	      , y = 0
	    
	    /* populate working path */
	    SVG.parser.path.setAttribute('d', typeof array === 'string' ? array : arrayToString(array))
	    
	    /* get segments */
	    segs = SVG.parser.path.pathSegList

	    for (i = 0, il = segs.numberOfItems; i < il; ++i) {
	      seg = segs.getItem(i)
	      s = seg.pathSegTypeAsLetter

	      /* yes, this IS quite verbose but also about 30 times faster than .test() with a precompiled regex */
	      if (s == 'M' || s == 'L' || s == 'H' || s == 'V' || s == 'C' || s == 'S' || s == 'Q' || s == 'T' || s == 'A') {
	        if ('x' in seg) x = seg.x
	        if ('y' in seg) y = seg.y

	      } else {
	        if ('x1' in seg) x1 = x + seg.x1
	        if ('x2' in seg) x2 = x + seg.x2
	        if ('y1' in seg) y1 = y + seg.y1
	        if ('y2' in seg) y2 = y + seg.y2
	        if ('x'  in seg) x += seg.x
	        if ('y'  in seg) y += seg.y

	        if (s == 'm')
	          segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x, y), i)
	        else if (s == 'l')
	          segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x, y), i)
	        else if (s == 'h')
	          segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x), i)
	        else if (s == 'v')
	          segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y), i)
	        else if (s == 'c')
	          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i)
	        else if (s == 's')
	          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i)
	        else if (s == 'q')
	          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i)
	        else if (s == 't')
	          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i)
	        else if (s == 'a')
	          segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i)
	        else if (s == 'z' || s == 'Z') {
	          x = x0
	          y = y0
	        }
	      }

	      /* record the start of a subpath */
	      if (s == 'M' || s == 'm') {
	        x0 = x
	        y0 = y
	      }
	    }

	    /* build internal representation */
	    array = []
	    segs  = SVG.parser.path.pathSegList
	    
	    for (i = 0, il = segs.numberOfItems; i < il; ++i) {
	      seg = segs.getItem(i)
	      s = seg.pathSegTypeAsLetter
	      x = [s]

	      if (s == 'M' || s == 'L' || s == 'T')
	        x.push(seg.x, seg.y)
	      else if (s == 'H')
	        x.push(seg.x)
	      else if (s == 'V')
	        x.push(seg.y)
	      else if (s == 'C')
	        x.push(seg.x1, seg.y1, seg.x2, seg.y2, seg.x, seg.y)
	      else if (s == 'S')
	        x.push(seg.x2, seg.y2, seg.x, seg.y)
	      else if (s == 'Q')
	        x.push(seg.x1, seg.y1, seg.x, seg.y)
	      else if (s == 'A')
	        x.push(seg.r1, seg.r2, seg.angle, seg.largeArcFlag | 0, seg.sweepFlag | 0, seg.x, seg.y)

	      /* store segment */
	      array.push(x)
	    }
	    
	    return array
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
	    , wm   = 1 /* width multiplier */
	    , hm   = 1 /* height multiplier */
	    , box  = element.bbox()
	    , view = (element.attr('viewBox') || '').match(/-?[\d\.]+/g)
	    , we   = element
	    , he   = element

	  /* get dimensions of current node */
	  width  = new SVG.Number(element.width())
	  height = new SVG.Number(element.height())

	  /* find nearest non-percentual dimensions */
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
	  
	  /* ensure defaults */
	  this.x      = box.x
	  this.y      = box.y
	  this.width  = width  * wm
	  this.height = height * hm
	  this.zoom   = 1
	  
	  if (view) {
	    /* get width and height from viewbox */
	    x      = parseFloat(view[0])
	    y      = parseFloat(view[1])
	    width  = parseFloat(view[2])
	    height = parseFloat(view[3])
	    
	    /* calculate zoom accoring to viewbox */
	    this.zoom = ((this.width / this.height) > (width / height)) ?
	      this.height / height :
	      this.width  / width

	    /* calculate real pixel dimensions on parent SVG.Doc element */
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
	      if (this.node.parentNode) {
	        // get parent element
	        var parent = SVG.adopt(this.node.parentNode)

	        // if a specific type is given, find a parent with that class
	        if (type)
	          while (!(parent instanceof type) && parent.node.parentNode instanceof SVGElement)
	            parent = SVG.adopt(parent.node.parentNode)

	        return parent
	      }
	    }
	    // Get parent document
	  , doc: function(type) {
	      return this instanceof SVG.Doc ? this : this.parent(SVG.Doc)
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

	        // insert a copy of this node
	        svg.appendChild(this.node.cloneNode(true))

	        // return target element
	        return well.innerHTML.replace(/^<svg>/, '').replace(/<\/svg>$/, '')
	      }

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
	          this.attrs[a] = this.target.ctm().morph(v)

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
	        // mimic bbox
	        box = {
	          x:      element.node.clientLeft
	        , y:      element.node.clientTop
	        , width:  element.node.clientWidth
	        , height: element.node.clientHeight
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
	    this.x += window.scrollX
	    this.y += window.scrollY
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
	    // apply calculated matrix to element
	    this.attr('transform', matrix)

	    return matrix
	  }
	})
	SVG.extend(SVG.Element, {
	  // Dynamic style generator
	  style: function(s, v) {
	    if (arguments.length == 0) {
	      /* get full style */
	      return this.node.style.cssText || ''
	    
	    } else if (arguments.length < 2) {
	      /* apply every style individually if an object is passed */
	      if (typeof s == 'object') {
	        for (v in s) this.style(v, s[v])
	      
	      } else if (SVG.regex.isCss.test(s)) {
	        /* parse css string */
	        s = s.split(';')

	        /* apply every definition individually */
	        for (var i = 0; i < s.length; i++) {
	          v = s[i].split(':')
	          this.style(v[0].replace(/\s+/g, ''), v[1])
	        }
	      } else {
	        /* act as a getter if the first and only argument is not an object */
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
	        /* act as a getter if there are no arguments */
	        return new SVG.ViewBox(this)
	      
	      /* otherwise act as a setter */
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
	  
	  /* add event to SVG.Element */
	  SVG.Element.prototype[event] = function(f) {
	    var self = this
	    
	    /* bind event to element rather than element node */
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
	      return x == null ? this.transform('x') : this.transform({ x: -this.x() + x }, true)
	    }
	    // Move over y-axis
	  , y: function(y) {
	      return y == null ? this.transform('y') : this.transform({ y: -this.y() + y }, true)
	    }
	    // Move by center over x-axis
	  , cx: function(x) {
	      return x == null ? this.tbox().cx : this.x(x - this.tbox().width / 2)
	    }
	    // Move by center over y-axis
	  , cy: function(y) {
	      return y == null ? this.tbox().cy : this.y(y - this.tbox().height / 2)
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

	    /* keep references to masked elements */
	    this.targets = []
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Unmask all masked elements and remove itself
	    remove: function() {
	      /* unmask all targets */
	      for (var i = this.targets.length - 1; i >= 0; i--)
	        if (this.targets[i])
	          this.targets[i].unmask()
	      delete this.targets

	      /* remove mask from parent */
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
	    /* use given mask or create a new one */
	    this.masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element)

	    /* store reverence on self in mask */
	    this.masker.targets.push(this)
	    
	    /* apply mask */
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

	    /* keep references to clipped elements */
	    this.targets = []
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Unclip all clipped elements and remove itself
	    remove: function() {
	      /* unclip all targets */
	      for (var i = this.targets.length - 1; i >= 0; i--)
	        if (this.targets[i])
	          this.targets[i].unclip()
	      delete this.targets

	      /* remove clipPath from parent */
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
	    /* use given clip or create a new one */
	    this.clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element)

	    /* store reverence on self in mask */
	    this.clipper.targets.push(this)
	    
	    /* apply mask */
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
	    
	    /* store type */
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
	      /* remove all stops */
	      this.clear()
	      
	      /* invoke passed block */
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

	      /* set attributes */
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
	      /* ensure the presence of a dom element */
	      element = typeof element == 'string' ?
	        document.getElementById(element) :
	        element
	      
	      /* If the target is an svg element, use that element as the main wrapper.
	         This allows svg.js to work with svg documents as well. */
	      if (element.nodeName == 'svg') {
	        this.constructor.call(this, element)
	      } else {
	        this.constructor.call(this, SVG.create('svg'))
	        element.appendChild(this.node)
	      }
	      
	      /* set svg element attributes and ensure defs node */
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
	      /* Set lined element */
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
	      return this.put(new SVG.Rect().size(width, height))
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
	    
	    this._leading = new SVG.Number(1.3)    // store leading value for rebuilding
	    this._rebuild = true                   // enable automatic updating of dy values
	    this._build   = false                  // disable build mode for adding multiple lines

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

	      // mark first level tspans as newlines
	      clone.lines().each(function(){
	        this.newLined = true
	      })
	      
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
	        this.lines().each(function() { if (this.newLined) this.x(x) })

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
	      if (typeof text === 'undefined') return this.content
	      
	      // remove existing content
	      this.clear().build(true)
	      
	      if (typeof text === 'function') {
	        // call block
	        text.call(this, this)

	      } else {
	        // store text and make sure text is not blank
	        text = (this.content = text).split('\n')
	        
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
	        return this._leading
	      
	      // act as setter
	      this._leading = new SVG.Number(value)
	      
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
	        
	        this.lines().each(function() {
	          if (this.newLined) {
	            if (!this.textPath)
	              this.attr('x', self.attr('x'))
	            
	            this.attr('dy', self._leading * new SVG.Number(self.attr('font-size'))) 
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
	      this.newLined = true

	      // apply new hy¡n
	      return this.dy(t._leading * t.attr('font-size')).attr('x', t.x())
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
	    this.node.appendChild(document.createTextNode((this.content = text)))
	    
	    return this
	  }
	  // Create a tspan
	, tspan: function(text) {
	    var node  = (this.textPath() || this).node
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
	    var node = (this.textPath() || this).node

	    // remove existing child nodes
	    while (node.hasChildNodes())
	      node.removeChild(node.lastChild)
	    
	    // reset content references 
	    if (this instanceof SVG.Text)
	      this.content = ''
	    
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
	      /* remove all content */
	      this.clear()
	      
	      /* invoke passed block */
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

	/* Add sugar for fill and stroke */
	;['fill', 'stroke'].forEach(function(m) {
	  var i, extension = {}

	  extension[m] = function(o) {
	    if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
	      this.attr(m, o)

	    else
	      /* set all attributes from sugar.fill and sugar.stroke list */
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



	//
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
	    /* remember every item in an object individually */
	    if (typeof arguments[0] == 'object')
	      for (var v in k)
	        this.remember(v, k[v])

	    /* retrieve memory */
	    else if (arguments.length == 1)
	      return this.memory()[k]

	    /* store memory */
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
	  if (node) return SVG.adopt(node)
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
	return SVG;

	}));


/***/ }
/******/ ]);