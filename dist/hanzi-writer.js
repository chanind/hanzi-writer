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

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _renderersCharacterRenderer = __webpack_require__(1);

	var _renderersCharacterRenderer2 = _interopRequireDefault(_renderersCharacterRenderer);

	var _renderersUserStrokeRenderer = __webpack_require__(16);

	var _renderersUserStrokeRenderer2 = _interopRequireDefault(_renderersUserStrokeRenderer);

	var _renderersCharacterPositionerRenderer = __webpack_require__(17);

	var _renderersCharacterPositionerRenderer2 = _interopRequireDefault(_renderersCharacterPositionerRenderer);

	var _modelsPoint = __webpack_require__(18);

	var _modelsPoint2 = _interopRequireDefault(_modelsPoint);

	var _modelsUserStroke = __webpack_require__(19);

	var _modelsUserStroke2 = _interopRequireDefault(_modelsUserStroke);

	var _StrokeMatcher = __webpack_require__(20);

	var _StrokeMatcher2 = _interopRequireDefault(_StrokeMatcher);

	var _ZdtStrokeParser = __webpack_require__(21);

	var _ZdtStrokeParser2 = _interopRequireDefault(_ZdtStrokeParser);

	var _utils = __webpack_require__(6);

	var _svgJs = __webpack_require__(25);

	var _svgJs2 = _interopRequireDefault(_svgJs);

	var defaultOptions = {
	  charDataLoader: function charDataLoader(char) {
	    return global.hanziData[char];
	  },
	  width: null,
	  height: null,
	  padding: 20,
	  strokeAnimationDuration: 300,
	  strokeHighlightDuration: 500,
	  strokeHighlightColor: '#AAF',
	  userStrokeFadeDuration: 300,
	  delayBetweenStrokes: 1000,
	  matchDistanceThreshold: 30,
	  userStrokeAttrs: {
	    fill: 'none',
	    stroke: '#333',
	    'stroke-width': 4
	  },
	  strokeAttrs: {
	    fill: '#555',
	    stroke: '#555',
	    'stroke-width': 2
	  },
	  hintAttrs: {
	    fill: '#DDD',
	    stroke: '#DDD',
	    'stroke-width': 2
	  }
	};

	var HanziWriter = (function () {
	  function HanziWriter(element, character) {
	    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    _classCallCheck(this, HanziWriter);

	    this.svg = (0, _svgJs2['default'])(element);
	    this.setOptions(options);
	    this.setCharacter(character);
	    this.setupListeners();
	    this.hintRenderer.draw();
	    this.characterRenderer.draw();
	  }

	  // set up window.HanziWriter if we're in the browser

	  _createClass(HanziWriter, [{
	    key: 'setOptions',
	    value: function setOptions(options) {
	      this.options = (0, _utils.copyAndExtend)(defaultOptions, options);
	      this.baseStrokeAnimationOptions = {
	        strokeAnimationDuration: this.options.strokeAnimationDuration,
	        delayBetweenStrokes: this.options.delayBetweenStrokes
	      };
	    }
	  }, {
	    key: 'showCharacter',
	    value: function showCharacter() {
	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this.characterRenderer.show((0, _utils.copyAndExtend)(this.baseStrokeAnimationOptions, options));
	    }
	  }, {
	    key: 'hideCharacter',
	    value: function hideCharacter() {
	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this.characterRenderer.hide((0, _utils.copyAndExtend)(this.baseStrokeAnimationOptions, options));
	    }
	  }, {
	    key: 'animateCharacter',
	    value: function animateCharacter() {
	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this.characterRenderer.animate((0, _utils.copyAndExtend)(this.baseStrokeAnimationOptions, options));
	    }
	  }, {
	    key: 'showHint',
	    value: function showHint() {
	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this.hintRenderer.show((0, _utils.copyAndExtend)(this.baseStrokeAnimationOptions, options));
	    }
	  }, {
	    key: 'hideHint',
	    value: function hideHint() {
	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this.hintRenderer.hide((0, _utils.copyAndExtend)(this.baseStrokeAnimationOptions, options));
	    }
	  }, {
	    key: 'quiz',
	    value: function quiz() {
	      var quizOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      this.isQuizzing = true;
	      this.hideCharacter(quizOptions);
	      if (quizOptions.showHint) {
	        this.showHint();
	      } else {
	        this.hideHint();
	      }
	      this.enforceStrokeOrder = quizOptions.enforceStrokeOrder;
	      this.currentStrokeIndex = 0;
	      this.numRecentMistakes = 0;
	      this.drawnStrokes = [];
	    }
	  }, {
	    key: 'setCharacter',
	    value: function setCharacter(char) {
	      var pathStrings = this.options.charDataLoader(char);
	      var zdtStrokeParser = new _ZdtStrokeParser2['default']();
	      this.character = zdtStrokeParser.generateCharacter(char, pathStrings);
	      this.characterRenderer = new _renderersCharacterRenderer2['default'](this.character, this.options);
	      this.hintRenderer = new _renderersCharacterRenderer2['default'](this.character, this.getHintOptions());
	      this.positioner = new _renderersCharacterPositionerRenderer2['default'](this.characterRenderer, this.options);
	      this.hintPositioner = new _renderersCharacterPositionerRenderer2['default'](this.hintRenderer, this.options);
	      this.hintPositioner.setCanvas(this.svg);
	      this.positioner.setCanvas(this.svg);
	    }
	  }, {
	    key: 'setupListeners',
	    value: function setupListeners() {
	      var _this = this;

	      this.svg.node.addEventListener('mousedown', function (evt) {
	        evt.preventDefault();
	        _this.startUserStroke(_this.getMousePoint(evt));
	      });
	      this.svg.node.addEventListener('touchstart', function (evt) {
	        evt.preventDefault();
	        _this.startUserStroke(_this.getTouchPoint(evt));
	      });
	      this.svg.node.addEventListener('mousemove', function (evt) {
	        evt.preventDefault();
	        _this.continueUserStroke(_this.getMousePoint(evt));
	      });
	      this.svg.node.addEventListener('touchmove', function (evt) {
	        evt.preventDefault();
	        _this.continueUserStroke(_this.getTouchPoint(evt));
	      });
	      document.addEventListener('mouseup', function () {
	        return _this.endUserStroke();
	      });
	      document.addEventListener('touchend', function () {
	        return _this.endUserStroke();
	      });
	    }
	  }, {
	    key: 'startUserStroke',
	    value: function startUserStroke(point) {
	      this.point = point;
	      if (this.userStroke) return this.endUserStroke();
	      this.userStroke = new _modelsUserStroke2['default'](point);
	      this.userStrokeRenderer = new _renderersUserStrokeRenderer2['default'](this.userStroke, this.options);
	      this.userStrokeRenderer.setCanvas(this.svg);
	      this.userStrokeRenderer.draw();
	    }
	  }, {
	    key: 'continueUserStroke',
	    value: function continueUserStroke(point) {
	      if (this.userStroke) {
	        this.userStroke.appendPoint(point);
	        this.userStrokeRenderer.updatePath();
	      }
	    }
	  }, {
	    key: 'endUserStroke',
	    value: function endUserStroke() {
	      if (!this.userStroke) return;
	      var translatedPoints = this.positioner.convertExternalPoints(this.userStroke.getPoints());
	      var strokeMatcher = new _StrokeMatcher2['default'](this.options);
	      var matchingStroke = strokeMatcher.getMatchingStroke(translatedPoints, this.character.getStrokes());
	      this.userStrokeRenderer.fadeAndRemove();
	      this.userStroke = null;
	      this.userStrokeRenderer = null;
	      if (!this.isQuizzing) return;
	      var isValidStroke = matchingStroke && !(0, _utils.inArray)(matchingStroke, this.drawnStrokes);
	      if (isValidStroke && (!this.enforceStrokeOrder || matchingStroke === this.character.getStroke(this.currentStrokeIndex))) {
	        this.drawnStrokes.push(matchingStroke);
	        this.currentStrokeIndex += 1;
	        this.numRecentMistakes = 0;
	        this.characterRenderer.showStroke(matchingStroke.getStrokeNum());
	        if (this.drawnStrokes.length === this.character.getNumStrokes()) this.isQuizzing = false;
	      } else {
	        this.numRecentMistakes += 1;
	        if (this.numRecentMistakes > 3) this.characterRenderer.getStrokeRenderer(this.currentStrokeIndex).highlight();
	      }
	    }
	  }, {
	    key: 'getMousePoint',
	    value: function getMousePoint(evt) {
	      return new _modelsPoint2['default'](evt.offsetX, evt.offsetY);
	    }
	  }, {
	    key: 'getTouchPoint',
	    value: function getTouchPoint(evt) {
	      var x = evt.touches[0].pageX - this.svg.node.offsetLeft;
	      var y = evt.touches[0].pageY - this.svg.node.offsetTop;
	      return new _modelsPoint2['default'](x, y);
	    }
	  }, {
	    key: 'getHintOptions',
	    value: function getHintOptions() {
	      var hintOptions = (0, _utils.copyAndExtend)({}, this.options);
	      hintOptions.strokeAttrs = this.options.hintAttrs;
	      return hintOptions;
	    }
	  }]);

	  return HanziWriter;
	})();

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
	exports['default'] = HanziWriter;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _Renderer2 = __webpack_require__(2);

	var _Renderer3 = _interopRequireDefault(_Renderer2);

	var _StrokeRenderer = __webpack_require__(3);

	var _StrokeRenderer2 = _interopRequireDefault(_StrokeRenderer);

	var _utils = __webpack_require__(6);

	var CharacterRenderer = (function (_Renderer) {
	  _inherits(CharacterRenderer, _Renderer);

	  function CharacterRenderer(character) {
	    var _this = this;

	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, CharacterRenderer);

	    _get(Object.getPrototypeOf(CharacterRenderer.prototype), 'constructor', this).call(this);
	    this.options = options;
	    this.character = character;
	    this.strokeRenderers = this.character.getStrokes().map(function (stroke) {
	      return _this.registerChild(new _StrokeRenderer2['default'](stroke, options));
	    });
	  }

	  _createClass(CharacterRenderer, [{
	    key: 'getBounds',
	    value: function getBounds() {
	      return this.character.getBounds();
	    }
	  }, {
	    key: 'show',
	    value: function show(animationOptions) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.strokeRenderers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var strokeRenderer = _step.value;

	          strokeRenderer.show(animationOptions);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator['return']) {
	            _iterator['return']();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'hide',
	    value: function hide(animationOptions) {
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = this.strokeRenderers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var strokeRenderer = _step2.value;

	          strokeRenderer.hide(animationOptions);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	            _iterator2['return']();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'showStroke',
	    value: function showStroke(strokeNum, animationOptions) {
	      this.getStrokeRenderer(strokeNum).show(animationOptions);
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = this.strokeRenderers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var strokeRenderer = _step3.value;

	          strokeRenderer.draw();
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	            _iterator3['return']();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'getStrokeRenderer',
	    value: function getStrokeRenderer(strokeNum) {
	      return this.strokeRenderers[strokeNum];
	    }
	  }, {
	    key: 'animate',
	    value: function animate(animationOptions) {
	      var _this2 = this;

	      var proxiedOptions = (0, _utils.copyAndExtend)(animationOptions, {
	        onComplete: function onComplete() {
	          return _this2.animateStroke(0, animationOptions);
	        }
	      });
	      this.hide(proxiedOptions);
	    }
	  }, {
	    key: 'setCanvas',
	    value: function setCanvas(canvas) {
	      _get(Object.getPrototypeOf(CharacterRenderer.prototype), 'setCanvas', this).call(this, canvas);
	      var _iteratorNormalCompletion4 = true;
	      var _didIteratorError4 = false;
	      var _iteratorError4 = undefined;

	      try {
	        for (var _iterator4 = this.strokeRenderers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	          var strokeRenderer = _step4.value;

	          strokeRenderer.setCanvas(canvas);
	        }
	      } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
	            _iterator4['return']();
	          }
	        } finally {
	          if (_didIteratorError4) {
	            throw _iteratorError4;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'animateStroke',
	    value: function animateStroke(strokeNum, animationOptions) {
	      var _this3 = this;

	      var renderNextStroke = function renderNextStroke() {
	        if (strokeNum < _this3.strokeRenderers.length - 1) {
	          var nextStroke = function nextStroke() {
	            return _this3.animateStroke(strokeNum + 1, animationOptions);
	          };
	          setTimeout(nextStroke, _this3.options.delayBetweenStrokes);
	        } else {
	          (0, _utils.callIfExists)(animationOptions.onComplete);
	        }
	      };
	      var strokeRenderer = this.strokeRenderers[strokeNum];
	      var proxiedOptions = (0, _utils.copyAndExtend)(animationOptions, {
	        onComplete: renderNextStroke
	      });
	      strokeRenderer.animate(proxiedOptions);
	    }
	  }]);

	  return CharacterRenderer;
	})(_Renderer3['default']);

	exports['default'] = CharacterRenderer;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Renderer = (function () {
	  function Renderer() {
	    _classCallCheck(this, Renderer);

	    this.isDestroyed = false; // check this in children in animations, etc
	    this.childRenderers = [];
	    this.parentRenderer = null;
	  }

	  _createClass(Renderer, [{
	    key: "draw",
	    value: function draw() {}
	    // implement in children

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
	    }
	  }, {
	    key: "setCanvas",
	    value: function setCanvas(canvas) {
	      this.canvas = canvas;
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
	          if (!_iteratorNormalCompletion && _iterator["return"]) {
	            _iterator["return"]();
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

	exports["default"] = Renderer;
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _Renderer2 = __webpack_require__(2);

	var _Renderer3 = _interopRequireDefault(_Renderer2);

	var _StrokePartRenderer = __webpack_require__(4);

	var _StrokePartRenderer2 = _interopRequireDefault(_StrokePartRenderer);

	var _utils = __webpack_require__(6);

	// this is a stroke composed of several stroke parts

	var StrokeRenderer = (function (_Renderer) {
	  _inherits(StrokeRenderer, _Renderer);

	  function StrokeRenderer(stroke) {
	    var _this = this;

	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, StrokeRenderer);

	    _get(Object.getPrototypeOf(StrokeRenderer.prototype), 'constructor', this).call(this);
	    this.stroke = stroke;
	    this.strokePartRenderers = this.stroke.getStrokeParts().map(function (strokePart) {
	      return _this.registerChild(new _StrokePartRenderer2['default'](strokePart, options));
	    });
	    this.options = options;
	  }

	  _createClass(StrokeRenderer, [{
	    key: 'show',
	    value: function show() {
	      var animationOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.strokePartRenderers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var strokePartRenderer = _step.value;

	          strokePartRenderer.show(animationOptions);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator['return']) {
	            _iterator['return']();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      var animationOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = this.strokePartRenderers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var strokePartRenderer = _step2.value;

	          strokePartRenderer.hide(animationOptions);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	            _iterator2['return']();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = this.strokePartRenderers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var strokePartRenderer = _step3.value;

	          strokePartRenderer.draw(this.canvas);
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	            _iterator3['return']();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'animate',
	    value: function animate() {
	      var animationOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      var spedUpAnimationOptions = this.getSpedUpAnimationOptions(animationOptions);
	      this.animateStrokePart(0, spedUpAnimationOptions);
	    }
	  }, {
	    key: 'setCanvas',
	    value: function setCanvas(canvas) {
	      _get(Object.getPrototypeOf(StrokeRenderer.prototype), 'setCanvas', this).call(this, canvas);
	      var _iteratorNormalCompletion4 = true;
	      var _didIteratorError4 = false;
	      var _iteratorError4 = undefined;

	      try {
	        for (var _iterator4 = this.strokePartRenderers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	          var strokePartRenderer = _step4.value;

	          strokePartRenderer.setCanvas(canvas);
	        }
	      } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
	            _iterator4['return']();
	          }
	        } finally {
	          if (_didIteratorError4) {
	            throw _iteratorError4;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'highlight',
	    value: function highlight() {
	      var _iteratorNormalCompletion5 = true;
	      var _didIteratorError5 = false;
	      var _iteratorError5 = undefined;

	      try {
	        for (var _iterator5 = this.strokePartRenderers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	          var strokePartRenderer = _step5.value;

	          strokePartRenderer.highlight();
	        }
	      } catch (err) {
	        _didIteratorError5 = true;
	        _iteratorError5 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion5 && _iterator5['return']) {
	            _iterator5['return']();
	          }
	        } finally {
	          if (_didIteratorError5) {
	            throw _iteratorError5;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'getSpedUpAnimationOptions',
	    value: function getSpedUpAnimationOptions(animationOptions) {
	      return (0, _utils.copyAndExtend)(animationOptions, {
	        strokeAnimationDuration: animationOptions.strokeAnimationDuration / this.strokePartRenderers.length
	      });
	    }
	  }, {
	    key: 'animateStrokePart',
	    value: function animateStrokePart(strokePartNum, animationOptions) {
	      var _this2 = this;

	      var renderNextStrokePart = function renderNextStrokePart() {
	        if (strokePartNum < _this2.strokePartRenderers.length - 1) {
	          _this2.animateStrokePart(strokePartNum + 1, animationOptions);
	        } else {
	          (0, _utils.callIfExists)(animationOptions.onComplete);
	        }
	      };
	      var strokePartRenderer = this.strokePartRenderers[strokePartNum];
	      var proxiedOptions = (0, _utils.copyAndExtend)(animationOptions, {
	        onComplete: renderNextStrokePart
	      });
	      strokePartRenderer.animate(proxiedOptions);
	    }
	  }]);

	  return StrokeRenderer;
	})(_Renderer3['default']);

	exports['default'] = StrokeRenderer;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _PathRenderer2 = __webpack_require__(5);

	var _PathRenderer3 = _interopRequireDefault(_PathRenderer2);

	var StrokePartRenderer = (function (_PathRenderer) {
	  _inherits(StrokePartRenderer, _PathRenderer);

	  function StrokePartRenderer(strokePart) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, StrokePartRenderer);

	    _get(Object.getPrototypeOf(StrokePartRenderer.prototype), 'constructor', this).call(this);
	    this.options = options;
	    this.strokePart = strokePart;
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
	    key: 'highlight',
	    value: function highlight() {
	      var _this = this;

	      this.path.animate(this.options.strokeHighlightDuration).attr({
	        fill: this.options.strokeHighlightColor,
	        stroke: this.options.strokeHighlightColor,
	        opacity: 1
	      }).after(function () {
	        _this.path.animate(_this.options.strokeHighlightDuration).attr({ opacity: 0 }).after(function () {
	          return _this.path.attr(_this.options.strokeAttrs);
	        });
	      });
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      return _get(Object.getPrototypeOf(StrokePartRenderer.prototype), 'draw', this).call(this).attr(this.options.strokeAttrs).attr({ opacity: 0 });
	    }
	  }, {
	    key: 'show',
	    value: function show(animationOptions) {
	      this.path.animate(animationOptions.strokeAnimationDuration).opacity(1).after(animationOptions.onComplete);
	    }
	  }, {
	    key: 'hide',
	    value: function hide(animationOptions) {
	      this.path.animate(animationOptions.strokeAnimationDuration).opacity(0).after(animationOptions.onComplete);
	    }
	  }, {
	    key: 'animate',
	    value: function animate(animationOptions) {
	      var start = this.strokePart.getStartingPoint();
	      var mask = this.canvas.circle(0).center(start.getX(), start.getY());
	      if (!this.path) this.drawPath();
	      this.path.attr({ opacity: 1 }).attr(this.options.strokeAttrs).clipWith(mask);

	      mask.animate(animationOptions.strokeAnimationDuration).radius(this.strokePart.getLength()).after(animationOptions.onComplete);
	    }
	  }]);

	  return StrokePartRenderer;
	})(_PathRenderer3['default']);

	module.exports = StrokePartRenderer;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _Renderer2 = __webpack_require__(2);

	var _Renderer3 = _interopRequireDefault(_Renderer2);

	var PathRenderer = (function (_Renderer) {
	  _inherits(PathRenderer, _Renderer);

	  function PathRenderer() {
	    _classCallCheck(this, PathRenderer);

	    _get(Object.getPrototypeOf(PathRenderer.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(PathRenderer, [{
	    key: 'getPoints',
	    value: function getPoints() {}
	    // overwrite in children

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
	          if (!_iteratorNormalCompletion && _iterator['return']) {
	            _iterator['return']();
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
	      return this.drawPath();
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      _get(Object.getPrototypeOf(PathRenderer.prototype), 'destroy', this).call(this);
	      this.path.remove();
	    }
	  }]);

	  return PathRenderer;
	})(_Renderer3['default']);

	exports['default'] = PathRenderer;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.copyAndExtend = copyAndExtend;
	exports.inArray = inArray;
	exports.emptyFunc = emptyFunc;
	exports.arrayMax = arrayMax;
	exports.arrayMin = arrayMin;
	exports.getExtremes = getExtremes;
	exports.callIfExists = callIfExists;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _clone = __webpack_require__(7);

	var _clone2 = _interopRequireDefault(_clone);

	var _util = __webpack_require__(12);

	function copyAndExtend(original) {
	  var changes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var copy = (0, _clone2['default'])(original);
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
	      if (!_iteratorNormalCompletion && _iterator['return']) {
	        _iterator['return']();
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
	  if (callback) callback();
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var clone = (function () {
	  'use strict';

	  /**
	   * Clones (copies) an Object using deep copying.
	   *
	   * This function supports circular references by default, but if you are certain
	   * there are no circular references in your object, you can save some CPU time
	   * by calling clone(obj, false).
	   *
	   * Caution: if `circular` is false and `parent` contains circular references,
	   * your program may enter an infinite loop and crash.
	   *
	   * @param `parent` - the object to be cloned
	   * @param `circular` - set to true if the object to be cloned may contain
	   *    circular references. (optional - true by default)
	   * @param `depth` - set to a number if the object is only to be cloned to
	   *    a particular depth. (optional - defaults to Infinity)
	   * @param `prototype` - sets the prototype to be used when cloning an object.
	   *    (optional - defaults to parent prototype).
	  */
	  function clone(parent, circular, depth, prototype) {
	    var filter;
	    if (typeof circular === 'object') {
	      depth = circular.depth;
	      prototype = circular.prototype;
	      filter = circular.filter;
	      circular = circular.circular;
	    }
	    // maintain two arrays for circular references, where corresponding parents
	    // and children have the same index
	    var allParents = [];
	    var allChildren = [];

	    var useBuffer = typeof Buffer != 'undefined';

	    if (typeof circular == 'undefined') circular = true;

	    if (typeof depth == 'undefined') depth = Infinity;

	    // recurse this function so we don't reset allParents and allChildren
	    function _clone(parent, depth) {
	      // cloning null always returns null
	      if (parent === null) return null;

	      if (depth == 0) return parent;

	      var child;
	      var proto;
	      if (typeof parent != 'object') {
	        return parent;
	      }

	      if (clone.__isArray(parent)) {
	        child = [];
	      } else if (clone.__isRegExp(parent)) {
	        child = new RegExp(parent.source, __getRegExpFlags(parent));
	        if (parent.lastIndex) child.lastIndex = parent.lastIndex;
	      } else if (clone.__isDate(parent)) {
	        child = new Date(parent.getTime());
	      } else if (useBuffer && Buffer.isBuffer(parent)) {
	        child = new Buffer(parent.length);
	        parent.copy(child);
	        return child;
	      } else {
	        if (typeof prototype == 'undefined') {
	          proto = Object.getPrototypeOf(parent);
	          child = Object.create(proto);
	        } else {
	          child = Object.create(prototype);
	          proto = prototype;
	        }
	      }

	      if (circular) {
	        var index = allParents.indexOf(parent);

	        if (index != -1) {
	          return allChildren[index];
	        }
	        allParents.push(parent);
	        allChildren.push(child);
	      }

	      for (var i in parent) {
	        var attrs;
	        if (proto) {
	          attrs = Object.getOwnPropertyDescriptor(proto, i);
	        }

	        if (attrs && attrs.set == null) {
	          continue;
	        }
	        child[i] = _clone(parent[i], depth - 1);
	      }

	      return child;
	    }

	    return _clone(parent, depth);
	  }

	  /**
	   * Simple flat clone using prototype, accepts only objects, usefull for property
	   * override on FLAT configuration object (no nested props).
	   *
	   * USE WITH CAUTION! This may not behave as you wish if you do not know how this
	   * works.
	   */
	  clone.clonePrototype = function clonePrototype(parent) {
	    if (parent === null) return null;

	    var c = function c() {};
	    c.prototype = parent;
	    return new c();
	  };

	  // private utility functions

	  function __objToStr(o) {
	    return Object.prototype.toString.call(o);
	  };
	  clone.__objToStr = __objToStr;

	  function __isDate(o) {
	    return typeof o === 'object' && __objToStr(o) === '[object Date]';
	  };
	  clone.__isDate = __isDate;

	  function __isArray(o) {
	    return typeof o === 'object' && __objToStr(o) === '[object Array]';
	  };
	  clone.__isArray = __isArray;

	  function __isRegExp(o) {
	    return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
	  };
	  clone.__isRegExp = __isRegExp;

	  function __getRegExpFlags(re) {
	    var flags = '';
	    if (re.global) flags += 'g';
	    if (re.ignoreCase) flags += 'i';
	    if (re.multiline) flags += 'm';
	    return flags;
	  };
	  clone.__getRegExpFlags = __getRegExpFlags;

	  return clone;
	})();

	if (typeof module === 'object' && module.exports) {
	  module.exports = clone;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict';

	var base64 = __webpack_require__(9);
	var ieee754 = __webpack_require__(10);
	var isArray = __webpack_require__(11);

	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;
	Buffer.poolSize = 8192; // not used by this implementation

	var rootParent = {};

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : (function () {
	  function Bar() {}
	  try {
	    var arr = new Uint8Array(1);
	    arr.foo = function () {
	      return 42;
	    };
	    arr.constructor = Bar;
	    return arr.foo() === 42 && // typed array instances can be augmented
	    arr.constructor === Bar && // constructor can be set
	    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
	  } catch (e) {
	    return false;
	  }
	})();

	function kMaxLength() {
	  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer(arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1]);
	    return new Buffer(arg);
	  }

	  this.length = 0;
	  this.parent = undefined;

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg);
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8');
	  }

	  // Unusual.
	  return fromObject(this, arg);
	}

	function fromNumber(that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0;
	    }
	  }
	  return that;
	}

	function fromString(that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8';

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0;
	  that = allocate(that, length);

	  that.write(string, encoding);
	  return that;
	}

	function fromObject(that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object);

	  if (isArray(object)) return fromArray(that, object);

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string');
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object);
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object);
	    }
	  }

	  if (object.length) return fromArrayLike(that, object);

	  return fromJsonObject(that, object);
	}

	function fromBuffer(that, buffer) {
	  var length = checked(buffer.length) | 0;
	  that = allocate(that, length);
	  buffer.copy(that, 0, 0, length);
	  return that;
	}

	function fromArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	function fromArrayBuffer(that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength;
	    that = Buffer._augment(new Uint8Array(array));
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array));
	  }
	  return that;
	}

	function fromArrayLike(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject(that, object) {
	  var array;
	  var length = 0;

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data;
	    length = checked(array.length) | 0;
	  }
	  that = allocate(that, length);

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	}

	function allocate(that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length));
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length;
	    that._isBuffer = true;
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1;
	  if (fromPool) that.parent = rootParent;

	  return that;
	}

	function checked(length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
	  }
	  return length | 0;
	}

	function SlowBuffer(subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding);

	  var buf = new Buffer(subject, encoding);
	  delete buf.parent;
	  return buf;
	}

	Buffer.isBuffer = function isBuffer(b) {
	  return !!(b != null && b._isBuffer);
	};

	Buffer.compare = function compare(a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers');
	  }

	  if (a === b) return 0;

	  var x = a.length;
	  var y = b.length;

	  var i = 0;
	  var len = Math.min(x, y);
	  while (i < len) {
	    if (a[i] !== b[i]) break;

	    ++i;
	  }

	  if (i !== len) {
	    x = a[i];
	    y = b[i];
	  }

	  if (x < y) return -1;
	  if (y < x) return 1;
	  return 0;
	};

	Buffer.isEncoding = function isEncoding(encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true;
	    default:
	      return false;
	  }
	};

	Buffer.concat = function concat(list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.');

	  if (list.length === 0) {
	    return new Buffer(0);
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length;
	    }
	  }

	  var buf = new Buffer(length);
	  var pos = 0;
	  for (i = 0; i < list.length; i++) {
	    var item = list[i];
	    item.copy(buf, pos);
	    pos += item.length;
	  }
	  return buf;
	};

	function byteLength(string, encoding) {
	  if (typeof string !== 'string') string = '' + string;

	  var len = string.length;
	  if (len === 0) return 0;

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len;
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length;
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2;
	      case 'hex':
	        return len >>> 1;
	      case 'base64':
	        return base64ToBytes(string).length;
	      default:
	        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined;
	Buffer.prototype.parent = undefined;

	function slowToString(encoding, start, end) {
	  var loweredCase = false;

	  start = start | 0;
	  end = end === undefined || end === Infinity ? this.length : end | 0;

	  if (!encoding) encoding = 'utf8';
	  if (start < 0) start = 0;
	  if (end > this.length) end = this.length;
	  if (end <= start) return '';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end);

	      case 'ascii':
	        return asciiSlice(this, start, end);

	      case 'binary':
	        return binarySlice(this, start, end);

	      case 'base64':
	        return base64Slice(this, start, end);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	Buffer.prototype.toString = function toString() {
	  var length = this.length | 0;
	  if (length === 0) return '';
	  if (arguments.length === 0) return utf8Slice(this, 0, length);
	  return slowToString.apply(this, arguments);
	};

	Buffer.prototype.equals = function equals(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return true;
	  return Buffer.compare(this, b) === 0;
	};

	Buffer.prototype.inspect = function inspect() {
	  var str = '';
	  var max = exports.INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>';
	};

	Buffer.prototype.compare = function compare(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return 0;
	  return Buffer.compare(this, b);
	};

	Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;else if (byteOffset < -0x80000000) byteOffset = -0x80000000;
	  byteOffset >>= 0;

	  if (this.length === 0) return -1;
	  if (byteOffset >= this.length) return -1;

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0);

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1; // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset);
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset);
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset);
	    }
	    return arrayIndexOf(this, [val], byteOffset);
	  }

	  function arrayIndexOf(arr, val, byteOffset) {
	    var foundIndex = -1;
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex;
	      } else {
	        foundIndex = -1;
	      }
	    }
	    return -1;
	  }

	  throw new TypeError('val must be string, number or Buffer');
	};

	// `get` is deprecated
	Buffer.prototype.get = function get(offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.');
	  return this.readUInt8(offset);
	};

	// `set` is deprecated
	Buffer.prototype.set = function set(v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.');
	  return this.writeUInt8(v, offset);
	};

	function hexWrite(buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string');

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) throw new Error('Invalid hex string');
	    buf[offset + i] = parsed;
	  }
	  return i;
	}

	function utf8Write(buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
	}

	function asciiWrite(buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length);
	}

	function binaryWrite(buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length);
	}

	function base64Write(buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length);
	}

	function ucs2Write(buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
	}

	Buffer.prototype.write = function write(string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	    // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	      encoding = offset;
	      length = this.length;
	      offset = 0;
	      // Buffer#write(string, offset[, length][, encoding])
	    } else if (isFinite(offset)) {
	        offset = offset | 0;
	        if (isFinite(length)) {
	          length = length | 0;
	          if (encoding === undefined) encoding = 'utf8';
	        } else {
	          encoding = length;
	          length = undefined;
	        }
	        // legacy write(string, encoding, offset, length) - remove in v0.13
	      } else {
	          var swap = encoding;
	          encoding = offset;
	          offset = length | 0;
	          length = swap;
	        }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds');
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length);

	      case 'ascii':
	        return asciiWrite(this, string, offset, length);

	      case 'binary':
	        return binaryWrite(this, string, offset, length);

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON() {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  };
	};

	function base64Slice(buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf);
	  } else {
	    return base64.fromByteArray(buf.slice(start, end));
	  }
	}

	function utf8Slice(buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break;
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res);
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray(codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
	  }
	  return res;
	}

	function asciiSlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret;
	}

	function binarySlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret;
	}

	function hexSlice(buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i]);
	  }
	  return out;
	}

	function utf16leSlice(buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res;
	}

	Buffer.prototype.slice = function slice(start, end) {
	  var len = this.length;
	  start = ~ ~start;
	  end = end === undefined ? len : ~ ~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end));
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this;

	  return newBuf;
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset(offset, ext, length) {
	  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
	}

	Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset];
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | this[offset + 1] << 8;
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] << 8 | this[offset + 1];
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
	};

	Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return this[offset];
	  return (0xff - this[offset] + 1) * -1;
	};

	Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | this[offset + 1] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | this[offset] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
	};

	Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
	};

	Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, true, 23, 4);
	};

	Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, false, 23, 4);
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, true, 52, 8);
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, false, 52, 8);
	};

	function checkInt(buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance');
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = value;
	  return offset + 1;
	};

	function objectWriteUInt16(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	function objectWriteUInt32(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = value >>> 24;
	    this[offset + 2] = value >>> 16;
	    this[offset + 1] = value >>> 8;
	    this[offset] = value;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = value;
	  return offset + 1;
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value;
	    this[offset + 1] = value >>> 8;
	    this[offset + 2] = value >>> 16;
	    this[offset + 3] = value >>> 24;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	function checkIEEE754(buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	  if (offset < 0) throw new RangeError('index out of range');
	}

	function writeFloat(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4;
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert);
	};

	function writeDouble(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8;
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert);
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy(target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0;
	  if (target.length === 0 || this.length === 0) return 0;

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds');
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
	  if (end < 0) throw new RangeError('sourceEnd out of bounds');

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart);
	  }

	  return len;
	};

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill(value, start, end) {
	  if (!value) value = 0;
	  if (!start) start = 0;
	  if (!end) end = this.length;

	  if (end < start) throw new RangeError('end < start');

	  // Fill 0 bytes; we're done
	  if (end === start) return;
	  if (this.length === 0) return;

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds');
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds');

	  var i;
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value;
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString());
	    var len = bytes.length;
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len];
	    }
	  }

	  return this;
	};

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return new Buffer(this).buffer;
	    } else {
	      var buf = new Uint8Array(this.length);
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i];
	      }
	      return buf.buffer;
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser');
	  }
	};

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype;

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment(arr) {
	  arr.constructor = Buffer;
	  arr._isBuffer = true;

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set;

	  // deprecated
	  arr.get = BP.get;
	  arr.set = BP.set;

	  arr.write = BP.write;
	  arr.toString = BP.toString;
	  arr.toLocaleString = BP.toString;
	  arr.toJSON = BP.toJSON;
	  arr.equals = BP.equals;
	  arr.compare = BP.compare;
	  arr.indexOf = BP.indexOf;
	  arr.copy = BP.copy;
	  arr.slice = BP.slice;
	  arr.readUIntLE = BP.readUIntLE;
	  arr.readUIntBE = BP.readUIntBE;
	  arr.readUInt8 = BP.readUInt8;
	  arr.readUInt16LE = BP.readUInt16LE;
	  arr.readUInt16BE = BP.readUInt16BE;
	  arr.readUInt32LE = BP.readUInt32LE;
	  arr.readUInt32BE = BP.readUInt32BE;
	  arr.readIntLE = BP.readIntLE;
	  arr.readIntBE = BP.readIntBE;
	  arr.readInt8 = BP.readInt8;
	  arr.readInt16LE = BP.readInt16LE;
	  arr.readInt16BE = BP.readInt16BE;
	  arr.readInt32LE = BP.readInt32LE;
	  arr.readInt32BE = BP.readInt32BE;
	  arr.readFloatLE = BP.readFloatLE;
	  arr.readFloatBE = BP.readFloatBE;
	  arr.readDoubleLE = BP.readDoubleLE;
	  arr.readDoubleBE = BP.readDoubleBE;
	  arr.writeUInt8 = BP.writeUInt8;
	  arr.writeUIntLE = BP.writeUIntLE;
	  arr.writeUIntBE = BP.writeUIntBE;
	  arr.writeUInt16LE = BP.writeUInt16LE;
	  arr.writeUInt16BE = BP.writeUInt16BE;
	  arr.writeUInt32LE = BP.writeUInt32LE;
	  arr.writeUInt32BE = BP.writeUInt32BE;
	  arr.writeIntLE = BP.writeIntLE;
	  arr.writeIntBE = BP.writeIntBE;
	  arr.writeInt8 = BP.writeInt8;
	  arr.writeInt16LE = BP.writeInt16LE;
	  arr.writeInt16BE = BP.writeInt16BE;
	  arr.writeInt32LE = BP.writeInt32LE;
	  arr.writeInt32BE = BP.writeInt32BE;
	  arr.writeFloatLE = BP.writeFloatLE;
	  arr.writeFloatBE = BP.writeFloatBE;
	  arr.writeDoubleLE = BP.writeDoubleLE;
	  arr.writeDoubleBE = BP.writeDoubleBE;
	  arr.fill = BP.fill;
	  arr.inspect = BP.inspect;
	  arr.toArrayBuffer = BP.toArrayBuffer;

	  return arr;
	};

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean(str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return '';
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str;
	}

	function stringtrim(str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	}

	function toHex(n) {
	  if (n < 16) return '0' + n.toString(16);
	  return n.toString(16);
	}

	function utf8ToBytes(string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue;
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue;
	      }

	      // valid surrogate pair
	      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break;
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break;
	      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break;
	      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break;
	      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else {
	      throw new Error('Invalid code point');
	    }
	  }

	  return bytes;
	}

	function asciiToBytes(str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray;
	}

	function utf16leToBytes(str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break;

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray;
	}

	function base64ToBytes(str) {
	  return base64.toByteArray(base64clean(str));
	}

	function blitBuffer(src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if (i + offset >= dst.length || i >= src.length) break;
	    dst[i + offset] = src[i];
	  }
	  return i;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer, (function() { return this; }())))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

		var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

		var PLUS = '+'.charCodeAt(0);
		var SLASH = '/'.charCodeAt(0);
		var NUMBER = '0'.charCodeAt(0);
		var LOWER = 'a'.charCodeAt(0);
		var UPPER = 'A'.charCodeAt(0);
		var PLUS_URL_SAFE = '-'.charCodeAt(0);
		var SLASH_URL_SAFE = '_'.charCodeAt(0);

		function decode(elt) {
			var code = elt.charCodeAt(0);
			if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
			if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
			if (code < NUMBER) return -1; //no match
			if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
			if (code < UPPER + 26) return code - UPPER;
			if (code < LOWER + 26) return code - LOWER + 26;
		}

		function b64ToByteArray(b64) {
			var i, j, l, tmp, placeHolders, arr;

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4');
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length;
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders);

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length;

			var L = 0;

			function push(v) {
				arr[L++] = v;
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
				push((tmp & 0xFF0000) >> 16);
				push((tmp & 0xFF00) >> 8);
				push(tmp & 0xFF);
			}

			if (placeHolders === 2) {
				tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
				push(tmp & 0xFF);
			} else if (placeHolders === 1) {
				tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
				push(tmp >> 8 & 0xFF);
				push(tmp & 0xFF);
			}

			return arr;
		}

		function uint8ToBase64(uint8) {
			var i,
			    extraBytes = uint8.length % 3,
			    // if we have 1 byte left, pad 2 bytes
			output = "",
			    temp,
			    length;

			function encode(num) {
				return lookup.charAt(num);
			}

			function tripletToBase64(num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
				output += tripletToBase64(temp);
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1];
					output += encode(temp >> 2);
					output += encode(temp << 4 & 0x3F);
					output += '==';
					break;
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
					output += encode(temp >> 10);
					output += encode(temp >> 4 & 0x3F);
					output += encode(temp << 2 & 0x3F);
					output += '=';
					break;
			}

			return output;
		}

		exports.toByteArray = b64ToByteArray;
		exports.fromByteArray = uint8ToBase64;
	})( false ? undefined.base64js = {} : exports);

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? nBytes - 1 : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
	  var i = isLE ? 0 : nBytes - 1;
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	
	/**
	 * isArray
	 */

	'use strict';

	var isArray = Array.isArray;

	/**
	 * toString
	 */

	var str = Object.prototype.toString;

	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */

	module.exports = isArray || function (val) {
	  return !!val && '[object Array]' == str.call(val);
	};

/***/ },
/* 12 */
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

	'use strict';

	var formatRegExp = /%[sdj%]/g;
	exports.format = function (f) {
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
	  var str = String(f).replace(formatRegExp, function (x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s':
	        return String(args[i++]);
	      case '%d':
	        return Number(args[i++]);
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
	exports.deprecate = function (fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function () {
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
	exports.debuglog = function (set) {
	  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function () {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function () {};
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
	  'bold': [1, 22],
	  'italic': [3, 23],
	  'underline': [4, 24],
	  'inverse': [7, 27],
	  'white': [37, 39],
	  'grey': [90, 39],
	  'black': [30, 39],
	  'blue': [34, 39],
	  'cyan': [36, 39],
	  'green': [32, 39],
	  'magenta': [35, 39],
	  'red': [31, 39],
	  'yellow': [33, 39]
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
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}

	function stylizeNoColor(str, styleType) {
	  return str;
	}

	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function (val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}

	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect && value && isFunction(value.inspect) &&
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
	  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
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

	  var base = '',
	      array = false,
	      braces = ['{', '}'];

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
	    output = keys.map(function (key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}

	function formatPrimitive(ctx, value) {
	  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value)) return ctx.stylize('' + value, 'number');
	  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value)) return ctx.stylize('null', 'null');
	}

	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}

	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function (key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
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
	          str = str.split('\n').map(function (line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function (line) {
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
	      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}

	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function (prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
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
	  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
	  typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(14);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}

	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function () {
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
	exports.inherits = __webpack_require__(15);

	exports._extend = function (origin, add) {
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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(13)))

/***/ },
/* 13 */
/***/ function(module, exports) {

	// shim for using process in browser

	'use strict';

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
	    while (len) {
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

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
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
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _PathRenderer2 = __webpack_require__(5);

	var _PathRenderer3 = _interopRequireDefault(_PathRenderer2);

	var UserStrokeRenderer = (function (_PathRenderer) {
	  _inherits(UserStrokeRenderer, _PathRenderer);

	  function UserStrokeRenderer(userStroke) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, UserStrokeRenderer);

	    _get(Object.getPrototypeOf(UserStrokeRenderer.prototype), 'constructor', this).call(this);
	    this.options = options;
	    this.userStroke = userStroke;
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
	    key: 'animate',
	    value: function animate() {
	      var onComplete = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

	      onComplete();
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      return _get(Object.getPrototypeOf(UserStrokeRenderer.prototype), 'draw', this).call(this).attr(this.options.userStrokeAttrs);
	    }
	  }, {
	    key: 'fadeAndRemove',
	    value: function fadeAndRemove() {
	      var _this = this;

	      this.path.animate(this.options.userStrokeFadeDuration).attr({ opacity: 0 }).after(function () {
	        return _this.destroy();
	      });
	    }
	  }]);

	  return UserStrokeRenderer;
	})(_PathRenderer3['default']);

	exports['default'] = UserStrokeRenderer;
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _Renderer2 = __webpack_require__(2);

	var _Renderer3 = _interopRequireDefault(_Renderer2);

	var _modelsPoint = __webpack_require__(18);

	var _modelsPoint2 = _interopRequireDefault(_modelsPoint);

	var CharacterPositionerRenderer = (function (_Renderer) {
	  _inherits(CharacterPositionerRenderer, _Renderer);

	  function CharacterPositionerRenderer(characterRenderer) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, CharacterPositionerRenderer);

	    _get(Object.getPrototypeOf(CharacterPositionerRenderer.prototype), 'constructor', this).call(this);
	    this.characterRenderer = characterRenderer;
	    this.options = options;
	  }

	  _createClass(CharacterPositionerRenderer, [{
	    key: 'convertExternalPoints',
	    value: function convertExternalPoints(points) {
	      var _this = this;

	      return points.map(function (point) {
	        return _this.convertExternalPoint(point);
	      });
	    }
	  }, {
	    key: 'convertExternalPoint',
	    value: function convertExternalPoint(point) {
	      var x = (point.getX() - this.xOffset) / this.scale;
	      var y = (point.getY() - this.yOffset) / this.scale;
	      return new _modelsPoint2['default'](x, y);
	    }
	  }, {
	    key: 'getNestedCanvas',
	    value: function getNestedCanvas() {
	      this.calculateScaleAndOffset();
	      return this.canvas.group().move(this.xOffset, this.yOffset).transform({ scaleX: this.scale, scaleY: this.scale });
	    }
	  }, {
	    key: 'calculateScaleAndOffset',
	    value: function calculateScaleAndOffset() {
	      var bounds = this.characterRenderer.getBounds();
	      var preScaledWidth = bounds[1].getX() - bounds[0].getX();
	      var preScaledHeight = bounds[1].getY() - bounds[0].getY();
	      var effectiveWidth = this.options.width - 2 * this.options.padding;
	      var effectiveHeight = this.options.height - 2 * this.options.padding;
	      var scaleX = effectiveWidth / preScaledWidth;
	      var scaleY = effectiveHeight / preScaledHeight;

	      this.scale = Math.min(scaleX, scaleY);

	      var xCenteringBuffer = this.options.padding + (effectiveWidth - this.scale * preScaledWidth) / 2;
	      var yCenteringBuffer = this.options.padding + (effectiveHeight - this.scale * preScaledHeight) / 2;
	      this.xOffset = -1 * bounds[0].getX() * this.scale + xCenteringBuffer;
	      this.yOffset = -1 * bounds[0].getY() * this.scale + yCenteringBuffer;
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      this.characterRenderer.draw();
	    }
	  }, {
	    key: 'animate',
	    value: function animate(svg, options) {
	      this.characterRenderer.animate(options);
	    }
	  }, {
	    key: 'setCanvas',
	    value: function setCanvas(canvas) {
	      _get(Object.getPrototypeOf(CharacterPositionerRenderer.prototype), 'setCanvas', this).call(this, canvas);
	      this.characterRenderer.setCanvas(this.getNestedCanvas());
	    }
	  }]);

	  return CharacterPositionerRenderer;
	})(_Renderer3['default']);

	exports['default'] = CharacterPositionerRenderer;
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _utils = __webpack_require__(6);

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
	      if (!_iteratorNormalCompletion && _iterator['return']) {
	        _iterator['return']();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return Point.getBounds(bounds);
	};

	exports['default'] = Point;
	module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _Point = __webpack_require__(18);

	var _Point2 = _interopRequireDefault(_Point);

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
	      return _Point2['default'].getBounds(this._points);
	    }
	  }, {
	    key: 'appendPoint',
	    value: function appendPoint(point) {
	      this._points.push(point);
	    }
	  }]);

	  return UserStroke;
	})();

	exports['default'] = UserStroke;
	module.exports = exports['default'];

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var StrokeMatcher = (function () {
	  function StrokeMatcher(options) {
	    _classCallCheck(this, StrokeMatcher);

	    this.options = options;
	  }

	  _createClass(StrokeMatcher, [{
	    key: "getMatchingStroke",
	    value: function getMatchingStroke(points, strokes) {
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
	          if (!_iteratorNormalCompletion && _iterator["return"]) {
	            _iterator["return"]();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      if (bestAvgDist < this.options.matchDistanceThreshold) return closestStroke;
	    }
	  }]);

	  return StrokeMatcher;
	})();

	exports["default"] = StrokeMatcher;
	module.exports = exports["default"];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _modelsPoint = __webpack_require__(18);

	var _modelsPoint2 = _interopRequireDefault(_modelsPoint);

	var _modelsStroke = __webpack_require__(22);

	var _modelsStroke2 = _interopRequireDefault(_modelsStroke);

	var _modelsStrokePart = __webpack_require__(23);

	var _modelsStrokePart2 = _interopRequireDefault(_modelsStrokePart);

	var _modelsCharacter = __webpack_require__(24);

	var _modelsCharacter2 = _interopRequireDefault(_modelsCharacter);

	var ZdtStrokeParser = (function () {
	  function ZdtStrokeParser() {
	    _classCallCheck(this, ZdtStrokeParser);
	  }

	  _createClass(ZdtStrokeParser, [{
	    key: 'generateCharacter',
	    value: function generateCharacter(symbol, zdtPathStrings) {
	      var strokes = this.generateStrokes(zdtPathStrings);
	      return new _modelsCharacter2['default'](symbol, strokes);
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

	          var strokePart = new _modelsStrokePart2['default'](strokeType, points);
	          strokeParts.push(strokePart);
	          if (isComplete) {
	            strokes.push(new _modelsStroke2['default'](strokeParts, strokeNum));
	            strokeNum += 1;
	            strokeParts = [];
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator['return']) {
	            _iterator['return']();
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

	      return new _modelsPoint2['default'](x, y);
	    }
	  }]);

	  return ZdtStrokeParser;
	})();

	exports['default'] = ZdtStrokeParser;
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _Point = __webpack_require__(18);

	var _Point2 = _interopRequireDefault(_Point);

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
	    key: 'getStrokeNum',
	    value: function getStrokeNum() {
	      return this._strokeNum;
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds() {
	      return _Point2['default'].getOverallBounds(this.getStrokeParts());
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
	          if (!_iteratorNormalCompletion && _iterator['return']) {
	            _iterator['return']();
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

	exports['default'] = Stroke;
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _Point = __webpack_require__(18);

	var _Point2 = _interopRequireDefault(_Point);

	var _utils = __webpack_require__(6);

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
	      return _Point2['default'].getBounds(this._points);
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
	      return Math.sqrt(Math.pow(start.getX() - end.getX(), 2) + Math.pow(start.getY() - end.getY(), 2));
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

	      if (adjStrokeType === StrokePart.HORIZONTAL_STROKE) return new _Point2['default'](extremeXs[minIndex], extremeYs[midIndex]);
	      if (adjStrokeType === StrokePart.BACK_SLASH_STROKE) return new _Point2['default'](extremeXs[minIndex], extremeYs[minIndex]);
	      if (adjStrokeType === StrokePart.VERTICAL_STROKE) return new _Point2['default'](extremeXs[midIndex], extremeYs[minIndex]);
	      if (adjStrokeType === StrokePart.FORWARD_SLASH_STROKE) return new _Point2['default'](extremeXs[maxIndex], extremeYs[minIndex]);
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

	exports['default'] = StrokePart;
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _Point = __webpack_require__(18);

	var _Point2 = _interopRequireDefault(_Point);

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
	      return _Point2['default'].getOverallBounds(this.getStrokes());
	    }
	  }]);

	  return Character;
	})();

	exports['default'] = Character;
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* svg.js 1.1.0 - svg selector inventor polyfill regex default color array pointarray patharray number viewbox bbox rbox element parent container fx relative event defs group arrange mask clip gradient pattern doc shape symbol use rect ellipse line poly path image text textpath nested hyperlink marker sugar set data memory helpers - svgjs.com/license */'use strict';;(function(root,factory){if(true){!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));}else if(typeof exports === 'object'){module.exports = factory();}else {root.SVG = factory();}})(undefined,function(){var SVG=this.SVG = function(element){if(SVG.supported){element = new SVG.Doc(element);if(!SVG.parser)SVG.prepare(element);return element;}}; // Default namespaces
	SVG.ns = 'http://www.w3.org/2000/svg';SVG.xmlns = 'http://www.w3.org/2000/xmlns/';SVG.xlink = 'http://www.w3.org/1999/xlink'; // Element id sequence
	SVG.did = 1000; // Get next named element id
	SVG.eid = function(name){return 'Svgjs' + name.charAt(0).toUpperCase() + name.slice(1) + SVG.did++;}; // Method for element creation
	SVG.create = function(name){ /* create element */var element=document.createElementNS(this.ns,name); /* apply unique id */element.setAttribute('id',this.eid(name));return element;}; // Method for extending objects
	SVG.extend = function(){var modules,methods,key,i; /* get list of modules */modules = [].slice.call(arguments); /* get object with extensions */methods = modules.pop();for(i = modules.length - 1;i >= 0;i--) if(modules[i])for(key in methods) modules[i].prototype[key] = methods[key]; /* make sure SVG.Set inherits any newly added methods */if(SVG.Set && SVG.Set.inherit)SVG.Set.inherit();}; // Initialize parsing element
	SVG.prepare = function(element){ /* select document body and create invisible svg element */var body=document.getElementsByTagName('body')[0],draw=(body?new SVG.Doc(body):element.nested()).size(2,0),path=SVG.create('path'); /* insert parsers */draw.node.appendChild(path); /* create parser object */SVG.parser = {body:body || element.parent,draw:draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden'),poly:draw.polyline().node,path:path};}; // svg support test
	SVG.supported = (function(){return !!document.createElementNS && !!document.createElementNS(SVG.ns,'svg').createSVGRect;})();if(!SVG.supported)return false;SVG.get = function(id){var node=document.getElementById(idFromReference(id) || id);if(node)return node.instance;};SVG.invent = function(config){ /* create element initializer */var initializer=typeof config.create == 'function'?config.create:function(){this.constructor.call(this,SVG.create(config.create));}; /* inherit prototype */if(config.inherit)initializer.prototype = new config.inherit(); /* extend with methods */if(config.extend)SVG.extend(initializer,config.extend); /* attach construct method to parent */if(config.construct)SVG.extend(config.parent || SVG.Container,config.construct);return initializer;};if(typeof CustomEvent !== 'function'){ // Code from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
	var CustomEvent=function CustomEvent(event,options){options = options || {bubbles:false,cancelable:false,detail:undefined};var e=document.createEvent('CustomEvent');e.initCustomEvent(event,options.bubbles,options.cancelable,options.detail);return e;};CustomEvent.prototype = window.Event.prototype;window.CustomEvent = CustomEvent;} // requestAnimationFrame / cancelAnimationFrame Polyfill with fallback based on Paul Irish
	(function(w){var lastTime=0;var vendors=['moz','webkit'];for(var x=0;x < vendors.length && !window.requestAnimationFrame;++x) {w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame'] || w[vendors[x] + 'CancelRequestAnimationFrame'];}w.requestAnimationFrame = w.requestAnimationFrame || function(callback){var currTime=new Date().getTime();var timeToCall=Math.max(0,16 - (currTime - lastTime));var id=w.setTimeout(function(){callback(currTime + timeToCall);},timeToCall);lastTime = currTime + timeToCall;return id;};w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;})(window);SVG.regex = { /* parse unit value */unit:/^(-?[\d\.]+)([a-z%]{0,2})$/, /* parse hex value */hex:/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, /* parse rgb value */rgb:/rgb\((\d+),(\d+),(\d+)\)/, /* parse reference id */reference:/#([a-z0-9\-_]+)/i, /* test hex value */isHex:/^#[a-f0-9]{3,6}$/i, /* test rgb value */isRgb:/^rgb\(/, /* test css declaration */isCss:/[^:]+:[^;]+;?/, /* test for blank string */isBlank:/^(\s+)?$/, /* test for numeric string */isNumber:/^-?[\d\.]+$/, /* test for percent value */isPercent:/^-?[\d\.]+%$/, /* test for image url */isImage:/\.(jpg|jpeg|png|gif)(\?[^=]+.*)?/i, /* test for namespaced event */isEvent:/^[\w]+:[\w]+$/};SVG.defaults = { // Default matrix
	matrix:'1 0 0 1 0 0', // Default attribute values
	attrs:{ /* fill and stroke */'fill-opacity':1,'stroke-opacity':1,'stroke-width':0,'stroke-linejoin':'miter','stroke-linecap':'butt',fill:'#000000',stroke:'#000000',opacity:1, /* position */x:0,y:0,cx:0,cy:0, /* size */width:0,height:0, /* radius */r:0,rx:0,ry:0, /* gradient */offset:0,'stop-opacity':1,'stop-color':'#000000', /* text */'font-size':16,'font-family':'Helvetica, Arial, sans-serif','text-anchor':'start'}, // Default transformation values
	trans:function trans(){return { /* translate */x:0,y:0, /* scale */scaleX:1,scaleY:1, /* rotate */rotation:0, /* skew */skewX:0,skewY:0, /* matrix */matrix:this.matrix,a:1,b:0,c:0,d:1,e:0,f:0};}};SVG.Color = function(color){var match; /* initialize defaults */this.r = 0;this.g = 0;this.b = 0; /* parse color */if(typeof color === 'string'){if(SVG.regex.isRgb.test(color)){ /* get rgb values */match = SVG.regex.rgb.exec(color.replace(/\s/g,'')); /* parse numeric values */this.r = parseInt(match[1]);this.g = parseInt(match[2]);this.b = parseInt(match[3]);}else if(SVG.regex.isHex.test(color)){ /* get hex values */match = SVG.regex.hex.exec(fullHex(color)); /* parse numeric values */this.r = parseInt(match[1],16);this.g = parseInt(match[2],16);this.b = parseInt(match[3],16);}}else if(typeof color === 'object'){this.r = color.r;this.g = color.g;this.b = color.b;}};SVG.extend(SVG.Color,{ // Default to hex conversion
	toString:function toString(){return this.toHex();}, // Build hex value
	toHex:function toHex(){return '#' + compToHex(this.r) + compToHex(this.g) + compToHex(this.b);}, // Build rgb value
	toRgb:function toRgb(){return 'rgb(' + [this.r,this.g,this.b].join() + ')';}, // Calculate true brightness
	brightness:function brightness(){return this.r / 255 * 0.30 + this.g / 255 * 0.59 + this.b / 255 * 0.11;}, // Make color morphable
	morph:function morph(color){this.destination = new SVG.Color(color);return this;}, // Get morphed color at given position
	at:function at(pos){ /* make sure a destination is defined */if(!this.destination)return this; /* normalise pos */pos = pos < 0?0:pos > 1?1:pos; /* generate morphed color */return new SVG.Color({r:~ ~(this.r + (this.destination.r - this.r) * pos),g:~ ~(this.g + (this.destination.g - this.g) * pos),b:~ ~(this.b + (this.destination.b - this.b) * pos)});}}); // Testers
	// Test if given value is a color string
	SVG.Color.test = function(color){color += '';return SVG.regex.isHex.test(color) || SVG.regex.isRgb.test(color);}; // Test if given value is a rgb object
	SVG.Color.isRgb = function(color){return color && typeof color.r == 'number' && typeof color.g == 'number' && typeof color.b == 'number';}; // Test if given value is a color
	SVG.Color.isColor = function(color){return SVG.Color.isRgb(color) || SVG.Color.test(color);};SVG.Array = function(array,fallback){array = (array || []).valueOf(); /* if array is empty and fallback is provided, use fallback */if(array.length == 0 && fallback)array = fallback.valueOf(); /* parse array */this.value = this.parse(array);};SVG.extend(SVG.Array,{ // Make array morphable
	morph:function morph(array){this.destination = this.parse(array); /* normalize length of arrays */if(this.value.length != this.destination.length){var lastValue=this.value[this.value.length - 1],lastDestination=this.destination[this.destination.length - 1];while(this.value.length > this.destination.length) this.destination.push(lastDestination);while(this.value.length < this.destination.length) this.value.push(lastValue);}return this;}, // Clean up any duplicate points
	settle:function settle(){ /* find all unique values */for(var i=0,il=this.value.length,seen=[];i < il;i++) if(seen.indexOf(this.value[i]) == -1)seen.push(this.value[i]); /* set new value */return this.value = seen;}, // Get morphed array at given position
	at:function at(pos){ /* make sure a destination is defined */if(!this.destination)return this; /* generate morphed array */for(var i=0,il=this.value.length,array=[];i < il;i++) array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos);return new SVG.Array(array);}, // Convert array to string
	toString:function toString(){return this.value.join(' ');}, // Real value
	valueOf:function valueOf(){return this.value;}, // Parse whitespace separated string
	parse:function parse(array){array = array.valueOf(); /* if already is an array, no need to parse it */if(Array.isArray(array))return array;return this.split(array);}, // Strip unnecessary whitespace
	split:function split(string){return string.replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'').split(' ');}, // Reverse array
	reverse:function reverse(){this.value.reverse();return this;}});SVG.PointArray = function(){this.constructor.apply(this,arguments);}; // Inherit from SVG.Array
	SVG.PointArray.prototype = new SVG.Array();SVG.extend(SVG.PointArray,{ // Convert array to string
	toString:function toString(){ /* convert to a poly point string */for(var i=0,il=this.value.length,array=[];i < il;i++) array.push(this.value[i].join(','));return array.join(' ');}, // Get morphed array at given position
	at:function at(pos){ /* make sure a destination is defined */if(!this.destination)return this; /* generate morphed point string */for(var i=0,il=this.value.length,array=[];i < il;i++) array.push([this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos,this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos]);return new SVG.PointArray(array);}, // Parse point string
	parse:function parse(array){array = array.valueOf(); /* if already is an array, no need to parse it */if(Array.isArray(array))return array; /* split points */array = this.split(array); /* parse points */for(var i=0,il=array.length,p,points=[];i < il;i++) {p = array[i].split(',');points.push([parseFloat(p[0]),parseFloat(p[1])]);}return points;}, // Move point string
	move:function move(x,y){var box=this.bbox(); /* get relative offset */x -= box.x;y -= box.y; /* move every point */if(!isNaN(x) && !isNaN(y))for(var i=this.value.length - 1;i >= 0;i--) this.value[i] = [this.value[i][0] + x,this.value[i][1] + y];return this;}, // Resize poly string
	size:function size(width,height){var i,box=this.bbox(); /* recalculate position of all points according to new size */for(i = this.value.length - 1;i >= 0;i--) {this.value[i][0] = (this.value[i][0] - box.x) * width / box.width + box.x;this.value[i][1] = (this.value[i][1] - box.y) * height / box.height + box.y;}return this;}, // Get bounding box of points
	bbox:function bbox(){SVG.parser.poly.setAttribute('points',this.toString());return SVG.parser.poly.getBBox();}});SVG.PathArray = function(array,fallback){this.constructor.call(this,array,fallback);}; // Inherit from SVG.Array
	SVG.PathArray.prototype = new SVG.Array();SVG.extend(SVG.PathArray,{ // Convert array to string
	toString:function toString(){return arrayToString(this.value);}, // Move path string
	move:function move(x,y){ /* get bounding box of current situation */var box=this.bbox(); /* get relative offset */x -= box.x;y -= box.y;if(!isNaN(x) && !isNaN(y)){ /* move every point */for(var l,i=this.value.length - 1;i >= 0;i--) {l = this.value[i][0];if(l == 'M' || l == 'L' || l == 'T'){this.value[i][1] += x;this.value[i][2] += y;}else if(l == 'H'){this.value[i][1] += x;}else if(l == 'V'){this.value[i][1] += y;}else if(l == 'C' || l == 'S' || l == 'Q'){this.value[i][1] += x;this.value[i][2] += y;this.value[i][3] += x;this.value[i][4] += y;if(l == 'C'){this.value[i][5] += x;this.value[i][6] += y;}}else if(l == 'A'){this.value[i][6] += x;this.value[i][7] += y;}}}return this;}, // Resize path string
	size:function size(width,height){ /* get bounding box of current situation */var i,l,box=this.bbox(); /* recalculate position of all points according to new size */for(i = this.value.length - 1;i >= 0;i--) {l = this.value[i][0];if(l == 'M' || l == 'L' || l == 'T'){this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;this.value[i][2] = (this.value[i][2] - box.y) * height / box.height + box.y;}else if(l == 'H'){this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;}else if(l == 'V'){this.value[i][1] = (this.value[i][1] - box.y) * height / box.height + box.y;}else if(l == 'C' || l == 'S' || l == 'Q'){this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;this.value[i][2] = (this.value[i][2] - box.y) * height / box.height + box.y;this.value[i][3] = (this.value[i][3] - box.x) * width / box.width + box.x;this.value[i][4] = (this.value[i][4] - box.y) * height / box.height + box.y;if(l == 'C'){this.value[i][5] = (this.value[i][5] - box.x) * width / box.width + box.x;this.value[i][6] = (this.value[i][6] - box.y) * height / box.height + box.y;}}else if(l == 'A'){ /* resize radii */this.value[i][1] = this.value[i][1] * width / box.width;this.value[i][2] = this.value[i][2] * height / box.height; /* move position values */this.value[i][6] = (this.value[i][6] - box.x) * width / box.width + box.x;this.value[i][7] = (this.value[i][7] - box.y) * height / box.height + box.y;}}return this;}, // Absolutize and parse path to array
	parse:function parse(array){ /* if it's already is a patharray, no need to parse it */if(array instanceof SVG.PathArray)return array.valueOf(); /* prepare for parsing */var i,il,x0,y0,x1,y1,x2,y2,s,seg,segs,x=0,y=0; /* populate working path */SVG.parser.path.setAttribute('d',typeof array === 'string'?array:arrayToString(array)); /* get segments */segs = SVG.parser.path.pathSegList;for(i = 0,il = segs.numberOfItems;i < il;++i) {seg = segs.getItem(i);s = seg.pathSegTypeAsLetter; /* yes, this IS quite verbose but also about 30 times faster than .test() with a precompiled regex */if(s == 'M' || s == 'L' || s == 'H' || s == 'V' || s == 'C' || s == 'S' || s == 'Q' || s == 'T' || s == 'A'){if('x' in seg)x = seg.x;if('y' in seg)y = seg.y;}else {if('x1' in seg)x1 = x + seg.x1;if('x2' in seg)x2 = x + seg.x2;if('y1' in seg)y1 = y + seg.y1;if('y2' in seg)y2 = y + seg.y2;if('x' in seg)x += seg.x;if('y' in seg)y += seg.y;if(s == 'm')segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x,y),i);else if(s == 'l')segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x,y),i);else if(s == 'h')segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x),i);else if(s == 'v')segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y),i);else if(s == 'c')segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x,y,x1,y1,x2,y2),i);else if(s == 's')segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x,y,x2,y2),i);else if(s == 'q')segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x,y,x1,y1),i);else if(s == 't')segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x,y),i);else if(s == 'a')segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x,y,seg.r1,seg.r2,seg.angle,seg.largeArcFlag,seg.sweepFlag),i);else if(s == 'z' || s == 'Z'){x = x0;y = y0;}} /* record the start of a subpath */if(s == 'M' || s == 'm'){x0 = x;y0 = y;}} /* build internal representation */array = [];segs = SVG.parser.path.pathSegList;for(i = 0,il = segs.numberOfItems;i < il;++i) {seg = segs.getItem(i);s = seg.pathSegTypeAsLetter;x = [s];if(s == 'M' || s == 'L' || s == 'T')x.push(seg.x,seg.y);else if(s == 'H')x.push(seg.x);else if(s == 'V')x.push(seg.y);else if(s == 'C')x.push(seg.x1,seg.y1,seg.x2,seg.y2,seg.x,seg.y);else if(s == 'S')x.push(seg.x2,seg.y2,seg.x,seg.y);else if(s == 'Q')x.push(seg.x1,seg.y1,seg.x,seg.y);else if(s == 'A')x.push(seg.r1,seg.r2,seg.angle,seg.largeArcFlag | 0,seg.sweepFlag | 0,seg.x,seg.y); /* store segment */array.push(x);}return array;}, // Get bounding box of path
	bbox:function bbox(){SVG.parser.path.setAttribute('d',this.toString());return SVG.parser.path.getBBox();}});SVG.Number = function(value){ /* initialize defaults */this.value = 0;this.unit = ''; /* parse value */if(typeof value === 'number'){ /* ensure a valid numeric value */this.value = isNaN(value)?0:!isFinite(value)?value < 0?-3.4e+38:+3.4e+38:value;}else if(typeof value === 'string'){var match=value.match(SVG.regex.unit);if(match){ /* make value numeric */this.value = parseFloat(match[1]); /* normalize percent value */if(match[2] == '%')this.value /= 100;else if(match[2] == 's')this.value *= 1000; /* store unit */this.unit = match[2];}}else {if(value instanceof SVG.Number){this.value = value.value;this.unit = value.unit;}}};SVG.extend(SVG.Number,{ // Stringalize
	toString:function toString(){return (this.unit == '%'?~ ~(this.value * 1e8) / 1e6:this.unit == 's'?this.value / 1e3:this.value) + this.unit;}, // Convert to primitive
	valueOf:function valueOf(){return this.value;}, // Add number
	plus:function plus(number){this.value = this + new SVG.Number(number);return this;}, // Subtract number
	minus:function minus(number){return this.plus(-new SVG.Number(number));}, // Multiply number
	times:function times(number){this.value = this * new SVG.Number(number);return this;}, // Divide number
	divide:function divide(number){this.value = this / new SVG.Number(number);return this;}, // Convert to different unit
	to:function to(unit){if(typeof unit === 'string')this.unit = unit;return this;}, // Make number morphable
	morph:function morph(number){this.destination = new SVG.Number(number);return this;}, // Get morphed number at given position
	at:function at(pos){ /* make sure a destination is defined */if(!this.destination)return this; /* generate new morphed number */return new SVG.Number(this.destination).minus(this).times(pos).plus(this);}});SVG.ViewBox = function(element){var x,y,width,height,wm=1, /* width multiplier */hm=1, /* height multiplier */box=element.bbox(),view=(element.attr('viewBox') || '').match(/-?[\d\.]+/g),we=element,he=element; /* get dimensions of current node */width = new SVG.Number(element.width());height = new SVG.Number(element.height()); /* find nearest non-percentual dimensions */while(width.unit == '%') {wm *= width.value;width = new SVG.Number(we instanceof SVG.Doc?we.parent.offsetWidth:we.parent.width());we = we.parent;}while(height.unit == '%') {hm *= height.value;height = new SVG.Number(he instanceof SVG.Doc?he.parent.offsetHeight:he.parent.height());he = he.parent;} /* ensure defaults */this.x = box.x;this.y = box.y;this.width = width * wm;this.height = height * hm;this.zoom = 1;if(view){ /* get width and height from viewbox */x = parseFloat(view[0]);y = parseFloat(view[1]);width = parseFloat(view[2]);height = parseFloat(view[3]); /* calculate zoom accoring to viewbox */this.zoom = this.width / this.height > width / height?this.height / height:this.width / width; /* calculate real pixel dimensions on parent SVG.Doc element */this.x = x;this.y = y;this.width = width;this.height = height;}}; //
	SVG.extend(SVG.ViewBox,{ // Parse viewbox to string
	toString:function toString(){return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height;}});SVG.BBox = function(element){var box; /* initialize zero box */this.x = 0;this.y = 0;this.width = 0;this.height = 0; /* get values if element is given */if(element){try{ /* actual, native bounding box */box = element.node.getBBox();}catch(e) { /* fallback for some browsers */box = {x:element.node.clientLeft,y:element.node.clientTop,width:element.node.clientWidth,height:element.node.clientHeight};} /* include translations on x an y */this.x = box.x + element.trans.x;this.y = box.y + element.trans.y; /* plain width and height */this.width = box.width * element.trans.scaleX;this.height = box.height * element.trans.scaleY;} /* add center, right and bottom */boxProperties(this);}; //
	SVG.extend(SVG.BBox,{ // merge bounding box with another, return a new instance
	merge:function merge(box){var b=new SVG.BBox(); /* merge box */b.x = Math.min(this.x,box.x);b.y = Math.min(this.y,box.y);b.width = Math.max(this.x + this.width,box.x + box.width) - b.x;b.height = Math.max(this.y + this.height,box.y + box.height) - b.y; /* add center, right and bottom */boxProperties(b);return b;}});SVG.RBox = function(element){var e,zoom,box={}; /* initialize zero box */this.x = 0;this.y = 0;this.width = 0;this.height = 0;if(element){e = element.doc().parent;zoom = element.doc().viewbox().zoom; /* actual, native bounding box */box = element.node.getBoundingClientRect(); /* get screen offset */this.x = box.left;this.y = box.top; /* subtract parent offset */this.x -= e.offsetLeft;this.y -= e.offsetTop;while(e = e.offsetParent) {this.x -= e.offsetLeft;this.y -= e.offsetTop;} /* calculate cumulative zoom from svg documents */e = element;while(e = e.parent) {if(e.type == 'svg' && e.viewbox){zoom *= e.viewbox().zoom;this.x -= e.x() || 0;this.y -= e.y() || 0;}}} /* recalculate viewbox distortion */this.x /= zoom;this.y /= zoom;this.width = box.width /= zoom;this.height = box.height /= zoom; /* offset by window scroll position, because getBoundingClientRect changes when window is scrolled */this.x += typeof window.scrollX === 'number'?window.scrollX:window.pageXOffset;this.y += typeof window.scrollY === 'number'?window.scrollY:window.pageYOffset; /* add center, right and bottom */boxProperties(this);}; //
	SVG.extend(SVG.RBox,{ // merge rect box with another, return a new instance
	merge:function merge(box){var b=new SVG.RBox(); /* merge box */b.x = Math.min(this.x,box.x);b.y = Math.min(this.y,box.y);b.width = Math.max(this.x + this.width,box.x + box.width) - b.x;b.height = Math.max(this.y + this.height,box.y + box.height) - b.y; /* add center, right and bottom */boxProperties(b);return b;}});SVG.Element = SVG.invent({ // Initialize node
	create:function create(node){ /* make stroke value accessible dynamically */this._stroke = SVG.defaults.attrs.stroke; /* initialize transformation store with defaults */this.trans = SVG.defaults.trans(); /* create circular reference */if(this.node = node){this.type = node.nodeName;this.node.instance = this;}}, // Add class methods
	extend:{ // Move over x-axis
	x:function x(_x){if(_x != null){_x = new SVG.Number(_x);_x.value /= this.trans.scaleX;}return this.attr('x',_x);}, // Move over y-axis
	y:function y(_y){if(_y != null){_y = new SVG.Number(_y);_y.value /= this.trans.scaleY;}return this.attr('y',_y);}, // Move by center over x-axis
	cx:function cx(x){return x == null?this.x() + this.width() / 2:this.x(x - this.width() / 2);}, // Move by center over y-axis
	cy:function cy(y){return y == null?this.y() + this.height() / 2:this.y(y - this.height() / 2);}, // Move element to given x and y values
	move:function move(x,y){return this.x(x).y(y);}, // Move element by its center
	center:function center(x,y){return this.cx(x).cy(y);}, // Set width of element
	width:function width(_width){return this.attr('width',_width);}, // Set height of element
	height:function height(_height){return this.attr('height',_height);}, // Set element size to given width and height
	size:function size(width,height){var p=proportionalSize(this.bbox(),width,height);return this.width(new SVG.Number(p.width)).height(new SVG.Number(p.height));}, // Clone element
	clone:function clone(){var clone,attr,type=this.type; /* invoke shape method with shape-specific arguments */clone = type == 'rect' || type == 'ellipse'?this.parent[type](0,0):type == 'line'?this.parent[type](0,0,0,0):type == 'image'?this.parent[type](this.src):type == 'text'?this.parent[type](this.content):type == 'path'?this.parent[type](this.attr('d')):type == 'polyline' || type == 'polygon'?this.parent[type](this.attr('points')):type == 'g'?this.parent.group():this.parent[type](); /* apply attributes attributes */attr = this.attr();delete attr.id;clone.attr(attr); /* copy transformations */clone.trans = this.trans; /* apply attributes and translations */return clone.transform({});}, // Remove element
	remove:function remove(){if(this.parent)this.parent.removeElement(this);return this;}, // Replace element
	replace:function replace(element){this.after(element).remove();return element;}, // Add element to given container and return self
	addTo:function addTo(parent){return parent.put(this);}, // Add element to given container and return container
	putIn:function putIn(parent){return parent.add(this);}, // Get parent document
	doc:function doc(type){return this._parent(type || SVG.Doc);}, // Set svg element attribute
	attr:function attr(a,v,n){if(a == null){ /* get an object of attributes */a = {};v = this.node.attributes;for(n = v.length - 1;n >= 0;n--) a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue)?parseFloat(v[n].nodeValue):v[n].nodeValue;return a;}else if(typeof a == 'object'){ /* apply every attribute individually if an object is passed */for(v in a) this.attr(v,a[v]);}else if(v === null){ /* remove value */this.node.removeAttribute(a);}else if(v == null){ /* act as a getter if the first and only argument is not an object */v = this.node.attributes[a];return v == null?SVG.defaults.attrs[a]:SVG.regex.isNumber.test(v.nodeValue)?parseFloat(v.nodeValue):v.nodeValue;}else if(a == 'style'){ /* redirect to the style method */return this.style(v);}else { /* BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0 */if(a == 'stroke-width')this.attr('stroke',parseFloat(v) > 0?this._stroke:null);else if(a == 'stroke')this._stroke = v; /* convert image fill and stroke to patterns */if(a == 'fill' || a == 'stroke'){if(SVG.regex.isImage.test(v))v = this.doc().defs().image(v,0,0);if(v instanceof SVG.Image)v = this.doc().defs().pattern(0,0,function(){this.add(v);});} /* ensure correct numeric values (also accepts NaN and Infinity) */if(typeof v === 'number')v = new SVG.Number(v); /* ensure full hex color */else if(SVG.Color.isColor(v))v = new SVG.Color(v); /* parse array values */else if(Array.isArray(v))v = new SVG.Array(v); /* if the passed attribute is leading... */if(a == 'leading'){ /* ... call the leading method instead */if(this.leading)this.leading(v);}else { /* set given attribute on node */typeof n === 'string'?this.node.setAttributeNS(n,a,v.toString()):this.node.setAttribute(a,v.toString());} /* rebuild if required */if(this.rebuild && (a == 'font-size' || a == 'x'))this.rebuild(a,v);}return this;}, // Manage transformations
	transform:function transform(o,v){if(arguments.length == 0){ /* act as a getter if no argument is given */return this.trans;}else if(typeof o === 'string'){ /* act as a getter if only one string argument is given */if(arguments.length < 2)return this.trans[o]; /* apply transformations as object if key value arguments are given*/var transform={};transform[o] = v;return this.transform(transform);} /* ... otherwise continue as a setter */var transform=[]; /* parse matrix */o = parseMatrix(o); /* merge values */for(v in o) if(o[v] != null)this.trans[v] = o[v]; /* compile matrix */this.trans.matrix = this.trans.a + ' ' + this.trans.b + ' ' + this.trans.c + ' ' + this.trans.d + ' ' + this.trans.e + ' ' + this.trans.f; /* alias current transformations */o = this.trans; /* add matrix */if(o.matrix != SVG.defaults.matrix)transform.push('matrix(' + o.matrix + ')'); /* add rotation */if(o.rotation != 0)transform.push('rotate(' + o.rotation + ' ' + (o.cx == null?this.bbox().cx:o.cx) + ' ' + (o.cy == null?this.bbox().cy:o.cy) + ')'); /* add scale */if(o.scaleX != 1 || o.scaleY != 1)transform.push('scale(' + o.scaleX + ' ' + o.scaleY + ')'); /* add skew on x axis */if(o.skewX != 0)transform.push('skewX(' + o.skewX + ')'); /* add skew on y axis */if(o.skewY != 0)transform.push('skewY(' + o.skewY + ')'); /* add translation */if(o.x != 0 || o.y != 0)transform.push('translate(' + new SVG.Number(o.x / o.scaleX) + ' ' + new SVG.Number(o.y / o.scaleY) + ')'); /* update transformations, even if there are none */if(transform.length == 0)this.node.removeAttribute('transform');else this.node.setAttribute('transform',transform.join(' '));return this;}, // Dynamic style generator
	style:function style(s,v){if(arguments.length == 0){ /* get full style */return this.node.style.cssText || '';}else if(arguments.length < 2){ /* apply every style individually if an object is passed */if(typeof s == 'object'){for(v in s) this.style(v,s[v]);}else if(SVG.regex.isCss.test(s)){ /* parse css string */s = s.split(';'); /* apply every definition individually */for(var i=0;i < s.length;i++) {v = s[i].split(':');this.style(v[0].replace(/\s+/g,''),v[1]);}}else { /* act as a getter if the first and only argument is not an object */return this.node.style[camelCase(s)];}}else {this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v)?'':v;}return this;}, // Get / set id
	id:function id(_id){return this.attr('id',_id);}, // Get bounding box
	bbox:function bbox(){return new SVG.BBox(this);}, // Get rect box
	rbox:function rbox(){return new SVG.RBox(this);}, // Checks whether the given point inside the bounding box of the element
	inside:function inside(x,y){var box=this.bbox();return x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height;}, // Show element
	show:function show(){return this.style('display','');}, // Hide element
	hide:function hide(){return this.style('display','none');}, // Is element visible?
	visible:function visible(){return this.style('display') != 'none';}, // Return id on string conversion
	toString:function toString(){return this.attr('id');}, // Return array of classes on the node
	classes:function classes(){var classAttr=this.node.getAttribute('class');if(classAttr === null){return [];}else {return classAttr.trim().split(/\s+/);}}, // Return true if class exists on the node, false otherwise
	hasClass:function hasClass(className){return this.classes().indexOf(className) != -1;}, // Add class to the node
	addClass:function addClass(className){var classArray;if(!this.hasClass(className)){classArray = this.classes();classArray.push(className);this.node.setAttribute('class',classArray.join(' '));}return this;}, // Remove class from the node
	removeClass:function removeClass(className){var classArray;if(this.hasClass(className)){classArray = this.classes().filter(function(c){return c != className;});this.node.setAttribute('class',classArray.join(' '));}return this;}, // Toggle the presence of a class on the node
	toggleClass:function toggleClass(className){if(this.hasClass(className)){this.removeClass(className);}else {this.addClass(className);}return this;}, // Get referenced element form attribute value
	reference:function reference(attr){return SVG.get(this.attr()[attr]);}, // Private: find svg parent by instance
	_parent:function _parent(parent){var element=this;while(element != null && !(element instanceof parent)) element = element.parent;return element;}}});SVG.Parent = SVG.invent({ // Initialize node
	create:function create(element){this.constructor.call(this,element);}, // Inherit from
	inherit:SVG.Element, // Add class methods
	extend:{ // Returns all child elements
	children:function children(){return this._children || (this._children = []);}, // Add given element at a position
	add:function add(element,i){if(!this.has(element)){ /* define insertion index if none given */i = i == null?this.children().length:i; /* remove references from previous parent */if(element.parent)element.parent.children().splice(element.parent.index(element),1); /* add element references */this.children().splice(i,0,element);this.node.insertBefore(element.node,this.node.childNodes[i] || null);element.parent = this;} /* reposition defs */if(this._defs){this.node.removeChild(this._defs.node);this.node.appendChild(this._defs.node);}return this;}, // Basically does the same as `add()` but returns the added element instead
	put:function put(element,i){this.add(element,i);return element;}, // Checks if the given element is a child
	has:function has(element){return this.index(element) >= 0;}, // Gets index of given element
	index:function index(element){return this.children().indexOf(element);}, // Get a element at the given index
	get:function get(i){return this.children()[i];}, // Get first child, skipping the defs node
	first:function first(){return this.children()[0];}, // Get the last child
	last:function last(){return this.children()[this.children().length - 1];}, // Iterates over all children and invokes a given block
	each:function each(block,deep){var i,il,children=this.children();for(i = 0,il = children.length;i < il;i++) {if(children[i] instanceof SVG.Element)block.apply(children[i],[i,children]);if(deep && children[i] instanceof SVG.Container)children[i].each(block,deep);}return this;}, // Remove a child element at a position
	removeElement:function removeElement(element){this.children().splice(this.index(element),1);this.node.removeChild(element.node);element.parent = null;return this;}, // Remove all elements in this container
	clear:function clear(){ /* remove children */for(var i=this.children().length - 1;i >= 0;i--) this.removeElement(this.children()[i]); /* remove defs node */if(this._defs)this._defs.clear();return this;}, // Get defs
	defs:function defs(){return this.doc().defs();}}});SVG.Container = SVG.invent({ // Initialize node
	create:function create(element){this.constructor.call(this,element);}, // Inherit from
	inherit:SVG.Parent, // Add class methods
	extend:{ // Get the viewBox and calculate the zoom value
	viewbox:function viewbox(v){if(arguments.length == 0) /* act as a getter if there are no arguments */return new SVG.ViewBox(this); /* otherwise act as a setter */v = arguments.length == 1?[v.x,v.y,v.width,v.height]:[].slice.call(arguments);return this.attr('viewBox',v);}}});SVG.FX = SVG.invent({ // Initialize FX object
	create:function create(element){ /* store target element */this.target = element;}, // Add class methods
	extend:{ // Add animation parameters and start animation
	animate:function animate(d,ease,delay){var akeys,tkeys,skeys,key,element=this.target,fx=this; /* dissect object if one is passed */if(typeof d == 'object'){delay = d.delay;ease = d.ease;d = d.duration;} /* ensure default duration and easing */d = d == '='?d:d == null?1000:new SVG.Number(d).valueOf();ease = ease || '<>'; /* process values */fx.to = function(pos){var i; /* normalise pos */pos = pos < 0?0:pos > 1?1:pos; /* collect attribute keys */if(akeys == null){akeys = [];for(key in fx.attrs) akeys.push(key); /* make sure morphable elements are scaled, translated and morphed all together */if(element.morphArray && (fx._plot || akeys.indexOf('points') > -1)){ /* get destination */var box,p=new element.morphArray(fx._plot || fx.attrs.points || element.array); /* add size */if(fx._size)p.size(fx._size.width.to,fx._size.height.to); /* add movement */box = p.bbox();if(fx._x)p.move(fx._x.to,box.y);else if(fx._cx)p.move(fx._cx.to - box.width / 2,box.y);box = p.bbox();if(fx._y)p.move(box.x,fx._y.to);else if(fx._cy)p.move(box.x,fx._cy.to - box.height / 2); /* delete element oriented changes */delete fx._x;delete fx._y;delete fx._cx;delete fx._cy;delete fx._size;fx._plot = element.array.morph(p);}} /* collect transformation keys */if(tkeys == null){tkeys = [];for(key in fx.trans) tkeys.push(key);} /* collect style keys */if(skeys == null){skeys = [];for(key in fx.styles) skeys.push(key);} /* apply easing */pos = ease == '<>'?-Math.cos(pos * Math.PI) / 2 + 0.5:ease == '>'?Math.sin(pos * Math.PI / 2):ease == '<'?-Math.cos(pos * Math.PI / 2) + 1:ease == '-'?pos:typeof ease == 'function'?ease(pos):pos; /* run plot function */if(fx._plot){element.plot(fx._plot.at(pos));}else { /* run all x-position properties */if(fx._x)element.x(fx._x.at(pos));else if(fx._cx)element.cx(fx._cx.at(pos)); /* run all y-position properties */if(fx._y)element.y(fx._y.at(pos));else if(fx._cy)element.cy(fx._cy.at(pos)); /* run all size properties */if(fx._size)element.size(fx._size.width.at(pos),fx._size.height.at(pos));} /* run all viewbox properties */if(fx._viewbox)element.viewbox(fx._viewbox.x.at(pos),fx._viewbox.y.at(pos),fx._viewbox.width.at(pos),fx._viewbox.height.at(pos)); /* run leading property */if(fx._leading)element.leading(fx._leading.at(pos)); /* animate attributes */for(i = akeys.length - 1;i >= 0;i--) element.attr(akeys[i],at(fx.attrs[akeys[i]],pos)); /* animate transformations */for(i = tkeys.length - 1;i >= 0;i--) element.transform(tkeys[i],at(fx.trans[tkeys[i]],pos)); /* animate styles */for(i = skeys.length - 1;i >= 0;i--) element.style(skeys[i],at(fx.styles[skeys[i]],pos)); /* callback for each keyframe */if(fx._during)fx._during.call(element,pos,function(from,to){return at({from:from,to:to},pos);});};if(typeof d === 'number'){ /* delay animation */this.timeout = setTimeout(function(){var start=new Date().getTime(); /* initialize situation object */fx.situation = {interval:1000 / 60,start:start,play:true,finish:start + d,duration:d}; /* render function */fx.render = function(){if(fx.situation.play === true){ // This code was borrowed from the emile.js micro framework by Thomas Fuchs, aka MadRobby.
	var time=new Date().getTime(),pos=time > fx.situation.finish?1:(time - fx.situation.start) / d; /* process values */fx.to(pos); /* finish off animation */if(time > fx.situation.finish){if(fx._plot)element.plot(new SVG.PointArray(fx._plot.destination).settle());if(fx._loop === true || typeof fx._loop == 'number' && fx._loop > 1){if(typeof fx._loop == 'number')--fx._loop;fx.animate(d,ease,delay);}else {fx._after?fx._after.apply(element,[fx]):fx.stop();}}else {fx.animationFrame = requestAnimationFrame(fx.render);}}else {fx.animationFrame = requestAnimationFrame(fx.render);}}; /* start animation */fx.render();},new SVG.Number(delay).valueOf());}return this;}, // Get bounding box of target element
	bbox:function bbox(){return this.target.bbox();}, // Add animatable attributes
	attr:function attr(a,v){if(typeof a == 'object'){for(var key in a) this.attr(key,a[key]);}else {var from=this.target.attr(a);this.attrs[a] = SVG.Color.isColor(from)?new SVG.Color(from).morph(v):SVG.regex.unit.test(from)?new SVG.Number(from).morph(v):{from:from,to:v};}return this;}, // Add animatable transformations
	transform:function transform(o,v){if(arguments.length == 1){ /* parse matrix string */o = parseMatrix(o); /* dlete matrixstring from object */delete o.matrix; /* add rotation-center to transformations */this.target.trans.cx = o.cx || null;this.target.trans.cy = o.cy || null;delete o.cx;delete o.cy; /* store matrix values */for(v in o) this.trans[v] = {from:this.target.trans[v],to:o[v]};}else { /* apply transformations as object if key value arguments are given*/var transform={};transform[o] = v;this.transform(transform);}return this;}, // Add animatable styles
	style:function style(s,v){if(typeof s == 'object')for(var key in s) this.style(key,s[key]);else this.styles[s] = {from:this.target.style(s),to:v};return this;}, // Animatable x-axis
	x:function x(_x2){this._x = new SVG.Number(this.target.x()).morph(_x2);return this;}, // Animatable y-axis
	y:function y(_y2){this._y = new SVG.Number(this.target.y()).morph(_y2);return this;}, // Animatable center x-axis
	cx:function cx(x){this._cx = new SVG.Number(this.target.cx()).morph(x);return this;}, // Animatable center y-axis
	cy:function cy(y){this._cy = new SVG.Number(this.target.cy()).morph(y);return this;}, // Add animatable move
	move:function move(x,y){return this.x(x).y(y);}, // Add animatable center
	center:function center(x,y){return this.cx(x).cy(y);}, // Add animatable size
	size:function size(width,height){if(this.target instanceof SVG.Text){ /* animate font size for Text elements */this.attr('font-size',width);}else { /* animate bbox based size for all other elements */var box=this.target.bbox();this._size = {width:new SVG.Number(box.width).morph(width),height:new SVG.Number(box.height).morph(height)};}return this;}, // Add animatable plot
	plot:function plot(p){this._plot = p;return this;}, // Add leading method
	leading:function leading(value){if(this.target._leading)this._leading = new SVG.Number(this.target._leading).morph(value);return this;}, // Add animatable viewbox
	viewbox:function viewbox(x,y,width,height){if(this.target instanceof SVG.Container){var box=this.target.viewbox();this._viewbox = {x:new SVG.Number(box.x).morph(x),y:new SVG.Number(box.y).morph(y),width:new SVG.Number(box.width).morph(width),height:new SVG.Number(box.height).morph(height)};}return this;}, // Add animateable gradient update
	update:function update(o){if(this.target instanceof SVG.Stop){if(o.opacity != null)this.attr('stop-opacity',o.opacity);if(o.color != null)this.attr('stop-color',o.color);if(o.offset != null)this.attr('offset',new SVG.Number(o.offset));}return this;}, // Add callback for each keyframe
	during:function during(_during){this._during = _during;return this;}, // Callback after animation
	after:function after(_after){this._after = _after;return this;}, // Make loopable
	loop:function loop(times){this._loop = times || true;return this;}, // Stop running animation
	stop:function stop(fulfill){ /* fulfill animation */if(fulfill === true){this.animate(0);if(this._after)this._after.apply(this.target,[this]);}else { /* stop current animation */clearTimeout(this.timeout);cancelAnimationFrame(this.animationFrame); /* reset storage for properties that need animation */this.attrs = {};this.trans = {};this.styles = {};this.situation = {}; /* delete destinations */delete this._x;delete this._y;delete this._cx;delete this._cy;delete this._size;delete this._plot;delete this._loop;delete this._after;delete this._during;delete this._leading;delete this._viewbox;}return this;}, // Pause running animation
	pause:function pause(){if(this.situation.play === true){this.situation.play = false;this.situation.pause = new Date().getTime();}return this;}, // Play running animation
	play:function play(){if(this.situation.play === false){var pause=new Date().getTime() - this.situation.pause;this.situation.finish += pause;this.situation.start += pause;this.situation.play = true;}return this;}}, // Define parent class
	parent:SVG.Element, // Add method to parent elements
	construct:{ // Get fx module or create a new one, then animate with given duration and ease
	animate:function animate(d,ease,delay){return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d,ease,delay);}, // Stop current animation; this is an alias to the fx instance
	stop:function stop(fulfill){if(this.fx)this.fx.stop(fulfill);return this;}, // Pause current animation
	pause:function pause(){if(this.fx)this.fx.pause();return this;}, // Play paused current animation
	play:function play(){if(this.fx)this.fx.play();return this;}}});SVG.extend(SVG.Element,SVG.FX,{ // Relative move over x axis
	dx:function dx(x){return this.x((this.target || this).x() + x);}, // Relative move over y axis
	dy:function dy(y){return this.y((this.target || this).y() + y);}, // Relative move over x and y axes
	dmove:function dmove(x,y){return this.dx(x).dy(y);}});['click','dblclick','mousedown','mouseup','mouseover','mouseout','mousemove' // , 'mouseenter' -> not supported by IE
	// , 'mouseleave' -> not supported by IE
	,'touchstart','touchmove','touchleave','touchend','touchcancel'].forEach(function(event){ /* add event to SVG.Element */SVG.Element.prototype[event] = function(f){var self=this; /* bind event to element rather than element node */this.node['on' + event] = typeof f == 'function'?function(){return f.apply(self,arguments);}:null;return this;};}); // Initialize listeners stack
	SVG.listeners = [];SVG.handlerMap = []; // Only kept for consistency of API
	SVG.registerEvent = function(){}; // Add event binder in the SVG namespace
	SVG.on = function(node,event,listener){ // create listener, get object-index
	var l=listener.bind(node.instance || node),index=(SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1,ev=event.split('.')[0],ns=event.split('.')[1] || '*'; // ensure valid object
	SVG.listeners[index] = SVG.listeners[index] || {};SVG.listeners[index][ev] = SVG.listeners[index][ev] || {};SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {}; // reference listener
	SVG.listeners[index][ev][ns][listener] = l; // add listener
	node.addEventListener(ev,l,false);}; // Add event unbinder in the SVG namespace
	SVG.off = function(node,event,listener){var index=SVG.handlerMap.indexOf(node),ev=event && event.split('.')[0],ns=event && event.split('.')[1];if(index == -1)return;if(listener){ // remove listener reference
	if(SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']){ // remove listener
	node.removeEventListener(ev,SVG.listeners[index][ev][ns || '*'][listener],false);delete SVG.listeners[index][ev][ns || '*'][listener];}}else if(ns){ // remove all listeners for the namespaced event
	if(SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]){for(listener in SVG.listeners[index][ev][ns]) SVG.off(node,[ev,ns].join('.'),listener);delete SVG.listeners[index][ev][ns];}}else if(ev){ // remove all listeners for the event
	if(SVG.listeners[index][ev]){for(namespace in SVG.listeners[index][ev]) SVG.off(node,[ev,namespace].join('.'));delete SVG.listeners[index][ev];}}else { // remove all listeners on a given node
	for(event in SVG.listeners[index]) SVG.off(node,event);delete SVG.listeners[index];}}; //
	SVG.extend(SVG.Element,{ // Bind given event to listener
	on:function on(event,listener){SVG.on(this.node,event,listener);return this;}, // Unbind event from listener
	off:function off(event,listener){SVG.off(this.node,event,listener);return this;}, // Fire given event
	fire:function fire(event,data){ // Dispatch event
	this.node.dispatchEvent(new CustomEvent(event,{detail:data}));return this;}});SVG.Defs = SVG.invent({ // Initialize node
	create:'defs', // Inherit from
	inherit:SVG.Container});SVG.G = SVG.invent({ // Initialize node
	create:'g', // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Move over x-axis
	x:function x(_x3){return _x3 == null?this.trans.x:this.transform('x',_x3);}, // Move over y-axis
	y:function y(_y3){return _y3 == null?this.trans.y:this.transform('y',_y3);}, // Move by center over x-axis
	cx:function cx(x){return x == null?this.bbox().cx:this.x(x - this.bbox().width / 2);}, // Move by center over y-axis
	cy:function cy(y){return y == null?this.bbox().cy:this.y(y - this.bbox().height / 2);}}, // Add parent method
	construct:{ // Create a group element
	group:function group(){return this.put(new SVG.G());}}});SVG.extend(SVG.Element,{ // Get all siblings, including myself
	siblings:function siblings(){return this.parent.children();}, // Get the curent position siblings
	position:function position(){return this.parent.index(this);}, // Get the next element (will return null if there is none)
	next:function next(){return this.siblings()[this.position() + 1];}, // Get the next element (will return null if there is none)
	previous:function previous(){return this.siblings()[this.position() - 1];}, // Send given element one step forward
	forward:function forward(){var i=this.position();return this.parent.removeElement(this).put(this,i + 1);}, // Send given element one step backward
	backward:function backward(){var i=this.position();if(i > 0)this.parent.removeElement(this).add(this,i - 1);return this;}, // Send given element all the way to the front
	front:function front(){return this.parent.removeElement(this).put(this);}, // Send given element all the way to the back
	back:function back(){if(this.position() > 0)this.parent.removeElement(this).add(this,0);return this;}, // Inserts a given element before the targeted element
	before:function before(element){element.remove();var i=this.position();this.parent.add(element,i);return this;}, // Insters a given element after the targeted element
	after:function after(element){element.remove();var i=this.position();this.parent.add(element,i + 1);return this;}});SVG.Mask = SVG.invent({ // Initialize node
	create:function create(){this.constructor.call(this,SVG.create('mask')); /* keep references to masked elements */this.targets = [];}, // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Unmask all masked elements and remove itself
	remove:function remove(){ /* unmask all targets */for(var i=this.targets.length - 1;i >= 0;i--) if(this.targets[i])this.targets[i].unmask();delete this.targets; /* remove mask from parent */this.parent.removeElement(this);return this;}}, // Add parent method
	construct:{ // Create masking element
	mask:function mask(){return this.defs().put(new SVG.Mask());}}});SVG.extend(SVG.Element,{ // Distribute mask to svg element
	maskWith:function maskWith(element){ /* use given mask or create a new one */this.masker = element instanceof SVG.Mask?element:this.parent.mask().add(element); /* store reverence on self in mask */this.masker.targets.push(this); /* apply mask */return this.attr('mask','url("#' + this.masker.attr('id') + '")');}, // Unmask element
	unmask:function unmask(){delete this.masker;return this.attr('mask',null);}});SVG.Clip = SVG.invent({ // Initialize node
	create:function create(){this.constructor.call(this,SVG.create('clipPath')); /* keep references to clipped elements */this.targets = [];}, // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Unclip all clipped elements and remove itself
	remove:function remove(){ /* unclip all targets */for(var i=this.targets.length - 1;i >= 0;i--) if(this.targets[i])this.targets[i].unclip();delete this.targets; /* remove clipPath from parent */this.parent.removeElement(this);return this;}}, // Add parent method
	construct:{ // Create clipping element
	clip:function clip(){return this.defs().put(new SVG.Clip());}}}); //
	SVG.extend(SVG.Element,{ // Distribute clipPath to svg element
	clipWith:function clipWith(element){ /* use given clip or create a new one */this.clipper = element instanceof SVG.Clip?element:this.parent.clip().add(element); /* store reverence on self in mask */this.clipper.targets.push(this); /* apply mask */return this.attr('clip-path','url("#' + this.clipper.attr('id') + '")');}, // Unclip element
	unclip:function unclip(){delete this.clipper;return this.attr('clip-path',null);}});SVG.Gradient = SVG.invent({ // Initialize node
	create:function create(type){this.constructor.call(this,SVG.create(type + 'Gradient')); /* store type */this.type = type;}, // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // From position
	from:function from(x,y){return this.type == 'radial'?this.attr({fx:new SVG.Number(x),fy:new SVG.Number(y)}):this.attr({x1:new SVG.Number(x),y1:new SVG.Number(y)});}, // To position
	to:function to(x,y){return this.type == 'radial'?this.attr({cx:new SVG.Number(x),cy:new SVG.Number(y)}):this.attr({x2:new SVG.Number(x),y2:new SVG.Number(y)});}, // Radius for radial gradient
	radius:function radius(r){return this.type == 'radial'?this.attr({r:new SVG.Number(r)}):this;}, // Add a color stop
	at:function at(offset,color,opacity){return this.put(new SVG.Stop()).update(offset,color,opacity);}, // Update gradient
	update:function update(block){ /* remove all stops */this.clear(); /* invoke passed block */if(typeof block == 'function')block.call(this,this);return this;}, // Return the fill id
	fill:function fill(){return 'url(#' + this.id() + ')';}, // Alias string convertion to fill
	toString:function toString(){return this.fill();}}, // Add parent method
	construct:{ // Create gradient element in defs
	gradient:function gradient(type,block){return this.defs().gradient(type,block);}}});SVG.extend(SVG.Defs,{ // define gradient
	gradient:function gradient(type,block){return this.put(new SVG.Gradient(type)).update(block);}});SVG.Stop = SVG.invent({ // Initialize node
	create:'stop', // Inherit from
	inherit:SVG.Element, // Add class methods
	extend:{ // add color stops
	update:function update(o){if(typeof o == 'number' || o instanceof SVG.Number){o = {offset:arguments[0],color:arguments[1],opacity:arguments[2]};} /* set attributes */if(o.opacity != null)this.attr('stop-opacity',o.opacity);if(o.color != null)this.attr('stop-color',o.color);if(o.offset != null)this.attr('offset',new SVG.Number(o.offset));return this;}}});SVG.Pattern = SVG.invent({ // Initialize node
	create:'pattern', // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Return the fill id
	fill:function fill(){return 'url(#' + this.id() + ')';}, // Update pattern by rebuilding
	update:function update(block){ /* remove content */this.clear(); /* invoke passed block */if(typeof block == 'function')block.call(this,this);return this;}, // Alias string convertion to fill
	toString:function toString(){return this.fill();}}, // Add parent method
	construct:{ // Create pattern element in defs
	pattern:function pattern(width,height,block){return this.defs().pattern(width,height,block);}}});SVG.extend(SVG.Defs,{ // Define gradient
	pattern:function pattern(width,height,block){return this.put(new SVG.Pattern()).update(block).attr({x:0,y:0,width:width,height:height,patternUnits:'userSpaceOnUse'});}});SVG.Doc = SVG.invent({ // Initialize node
	create:function create(element){ /* ensure the presence of a html element */this.parent = typeof element == 'string'?document.getElementById(element):element; /* If the target is an svg element, use that element as the main wrapper.
	         This allows svg.js to work with svg documents as well. */this.constructor.call(this,this.parent.nodeName == 'svg'?this.parent:SVG.create('svg')); /* set svg element attributes */this.attr({xmlns:SVG.ns,version:'1.1',width:'100%',height:'100%'}).attr('xmlns:xlink',SVG.xlink,SVG.xmlns); /* create the <defs> node */this._defs = new SVG.Defs();this._defs.parent = this;this.node.appendChild(this._defs.node); /* turn off sub pixel offset by default */this.doSpof = false; /* ensure correct rendering */if(this.parent != this.node)this.stage();}, // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ /* enable drawing */stage:function stage(){var element=this; /* insert element */this.parent.appendChild(this.node); /* fix sub-pixel offset */element.spof(); /* make sure sub-pixel offset is fixed every time the window is resized */SVG.on(window,'resize',function(){element.spof();});return this;}, // Creates and returns defs element
	defs:function defs(){return this._defs;}, // Fix for possible sub-pixel offset. See:
	// https://bugzilla.mozilla.org/show_bug.cgi?id=608812
	spof:function spof(){if(this.doSpof){var pos=this.node.getScreenCTM();if(pos)this.style('left',-pos.e % 1 + 'px').style('top',-pos.f % 1 + 'px');}return this;}, // Enable sub-pixel offset
	fixSubPixelOffset:function fixSubPixelOffset(){this.doSpof = true;return this;}, // Removes the doc from the DOM
	remove:function remove(){if(this.parent){this.parent.removeChild(this.node);this.parent = null;}return this;}}});SVG.Shape = SVG.invent({ // Initialize node
	create:function create(element){this.constructor.call(this,element);}, // Inherit from
	inherit:SVG.Element});SVG.Symbol = SVG.invent({ // Initialize node
	create:'symbol', // Inherit from
	inherit:SVG.Container, // Add parent method
	construct:{ // Create a new symbol
	symbol:function symbol(){return this.defs().put(new SVG.Symbol());}}});SVG.Use = SVG.invent({ // Initialize node
	create:'use', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Use element as a reference
	element:function element(_element,file){ /* store target element */this.target = _element; /* set lined element */return this.attr('href',(file || '') + '#' + _element,SVG.xlink);}}, // Add parent method
	construct:{ // Create a use element
	use:function use(element,file){return this.put(new SVG.Use()).element(element,file);}}});SVG.Rect = SVG.invent({ // Initialize node
	create:'rect', // Inherit from
	inherit:SVG.Shape, // Add parent method
	construct:{ // Create a rect element
	rect:function rect(width,height){return this.put(new SVG.Rect().size(width,height));}}});SVG.Ellipse = SVG.invent({ // Initialize node
	create:'ellipse', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Move over x-axis
	x:function x(_x4){return _x4 == null?this.cx() - this.attr('rx'):this.cx(_x4 + this.attr('rx'));}, // Move over y-axis
	y:function y(_y4){return _y4 == null?this.cy() - this.attr('ry'):this.cy(_y4 + this.attr('ry'));}, // Move by center over x-axis
	cx:function cx(x){return x == null?this.attr('cx'):this.attr('cx',new SVG.Number(x).divide(this.trans.scaleX));}, // Move by center over y-axis
	cy:function cy(y){return y == null?this.attr('cy'):this.attr('cy',new SVG.Number(y).divide(this.trans.scaleY));}, // Set width of element
	width:function width(_width2){return _width2 == null?this.attr('rx') * 2:this.attr('rx',new SVG.Number(_width2).divide(2));}, // Set height of element
	height:function height(_height2){return _height2 == null?this.attr('ry') * 2:this.attr('ry',new SVG.Number(_height2).divide(2));}, // Custom size function
	size:function size(width,height){var p=proportionalSize(this.bbox(),width,height);return this.attr({rx:new SVG.Number(p.width).divide(2),ry:new SVG.Number(p.height).divide(2)});}}, // Add parent method
	construct:{ // Create circle element, based on ellipse
	circle:function circle(size){return this.ellipse(size,size);}, // Create an ellipse
	ellipse:function ellipse(width,height){return this.put(new SVG.Ellipse()).size(width,height).move(0,0);}}});SVG.Line = SVG.invent({ // Initialize node
	create:'line', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Move over x-axis
	x:function x(_x5){var b=this.bbox();return _x5 == null?b.x:this.attr({x1:this.attr('x1') - b.x + _x5,x2:this.attr('x2') - b.x + _x5});}, // Move over y-axis
	y:function y(_y5){var b=this.bbox();return _y5 == null?b.y:this.attr({y1:this.attr('y1') - b.y + _y5,y2:this.attr('y2') - b.y + _y5});}, // Move by center over x-axis
	cx:function cx(x){var half=this.bbox().width / 2;return x == null?this.x() + half:this.x(x - half);}, // Move by center over y-axis
	cy:function cy(y){var half=this.bbox().height / 2;return y == null?this.y() + half:this.y(y - half);}, // Set width of element
	width:function width(_width3){var b=this.bbox();return _width3 == null?b.width:this.attr(this.attr('x1') < this.attr('x2')?'x2':'x1',b.x + _width3);}, // Set height of element
	height:function height(_height3){var b=this.bbox();return _height3 == null?b.height:this.attr(this.attr('y1') < this.attr('y2')?'y2':'y1',b.y + _height3);}, // Set line size by width and height
	size:function size(width,height){var p=proportionalSize(this.bbox(),width,height);return this.width(p.width).height(p.height);}, // Set path data
	plot:function plot(x1,y1,x2,y2){return this.attr({x1:x1,y1:y1,x2:x2,y2:y2});}}, // Add parent method
	construct:{ // Create a line element
	line:function line(x1,y1,x2,y2){return this.put(new SVG.Line().plot(x1,y1,x2,y2));}}});SVG.Polyline = SVG.invent({ // Initialize node
	create:'polyline', // Inherit from
	inherit:SVG.Shape, // Add parent method
	construct:{ // Create a wrapped polyline element
	polyline:function polyline(p){return this.put(new SVG.Polyline()).plot(p);}}});SVG.Polygon = SVG.invent({ // Initialize node
	create:'polygon', // Inherit from
	inherit:SVG.Shape, // Add parent method
	construct:{ // Create a wrapped polygon element
	polygon:function polygon(p){return this.put(new SVG.Polygon()).plot(p);}}}); // Add polygon-specific functions
	SVG.extend(SVG.Polyline,SVG.Polygon,{ // Define morphable array
	morphArray:SVG.PointArray, // Plot new path
	plot:function plot(p){return this.attr('points',this.array = new SVG.PointArray(p,[[0,0]]));}, // Move by left top corner
	move:function move(x,y){return this.attr('points',this.array.move(x,y));}, // Move by left top corner over x-axis
	x:function x(_x6){return _x6 == null?this.bbox().x:this.move(_x6,this.bbox().y);}, // Move by left top corner over y-axis
	y:function y(_y6){return _y6 == null?this.bbox().y:this.move(this.bbox().x,_y6);}, // Set width of element
	width:function width(_width4){var b=this.bbox();return _width4 == null?b.width:this.size(_width4,b.height);}, // Set height of element
	height:function height(_height4){var b=this.bbox();return _height4 == null?b.height:this.size(b.width,_height4);}, // Set element size to given width and height
	size:function size(width,height){var p=proportionalSize(this.bbox(),width,height);return this.attr('points',this.array.size(p.width,p.height));}});SVG.Path = SVG.invent({ // Initialize node
	create:'path', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Plot new poly points
	plot:function plot(p){return this.attr('d',this.array = new SVG.PathArray(p,[['M',0,0]]));}, // Move by left top corner
	move:function move(x,y){return this.attr('d',this.array.move(x,y));}, // Move by left top corner over x-axis
	x:function x(_x7){return _x7 == null?this.bbox().x:this.move(_x7,this.bbox().y);}, // Move by left top corner over y-axis
	y:function y(_y7){return _y7 == null?this.bbox().y:this.move(this.bbox().x,_y7);}, // Set element size to given width and height
	size:function size(width,height){var p=proportionalSize(this.bbox(),width,height);return this.attr('d',this.array.size(p.width,p.height));}, // Set width of element
	width:function width(_width5){return _width5 == null?this.bbox().width:this.size(_width5,this.bbox().height);}, // Set height of element
	height:function height(_height5){return _height5 == null?this.bbox().height:this.size(this.bbox().width,_height5);}}, // Add parent method
	construct:{ // Create a wrapped path element
	path:function path(d){return this.put(new SVG.Path()).plot(d);}}});SVG.Image = SVG.invent({ // Initialize node
	create:'image', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // (re)load image
	load:function load(url){if(!url)return this;var self=this,img=document.createElement('img'); /* preload image */img.onload = function(){var p=self.doc(SVG.Pattern); /* ensure image size */if(self.width() == 0 && self.height() == 0)self.size(img.width,img.height); /* ensure pattern size if not set */if(p && p.width() == 0 && p.height() == 0)p.size(self.width(),self.height()); /* callback */if(typeof self._loaded === 'function')self._loaded.call(self,{width:img.width,height:img.height,ratio:img.width / img.height,url:url});};return this.attr('href',img.src = this.src = url,SVG.xlink);}, // Add loade callback
	loaded:function loaded(_loaded){this._loaded = _loaded;return this;}}, // Add parent method
	construct:{ // Create image element, load image and set its size
	image:function image(source,width,height){return this.put(new SVG.Image()).load(source).size(width || 0,height || width || 0);}}});SVG.Text = SVG.invent({ // Initialize node
	create:function create(){this.constructor.call(this,SVG.create('text'));this._leading = new SVG.Number(1.3); /* store leading value for rebuilding */this._rebuild = true; /* enable automatic updating of dy values */this._build = false; /* disable build mode for adding multiple lines */ /* set default font */this.attr('font-family',SVG.defaults.attrs['font-family']);}, // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Move over x-axis
	x:function x(_x8){ /* act as getter */if(_x8 == null)return this.attr('x'); /* move lines as well if no textPath is present */if(!this.textPath)this.lines.each(function(){if(this.newLined)this.x(_x8);});return this.attr('x',_x8);}, // Move over y-axis
	y:function y(_y8){var oy=this.attr('y'),o=typeof oy === 'number'?oy - this.bbox().y:0; /* act as getter */if(_y8 == null)return typeof oy === 'number'?oy - o:oy;return this.attr('y',typeof _y8 === 'number'?_y8 + o:_y8);}, // Move center over x-axis
	cx:function cx(x){return x == null?this.bbox().cx:this.x(x - this.bbox().width / 2);}, // Move center over y-axis
	cy:function cy(y){return y == null?this.bbox().cy:this.y(y - this.bbox().height / 2);}, // Set the text content
	text:function text(_text){ /* act as getter */if(typeof _text === 'undefined')return this.content; /* remove existing content */this.clear().build(true);if(typeof _text === 'function'){ /* call block */_text.call(this,this);}else { /* store text and make sure text is not blank */_text = (this.content = _text).split('\n'); /* build new lines */for(var i=0,il=_text.length;i < il;i++) this.tspan(_text[i]).newLine();} /* disable build mode and rebuild lines */return this.build(false).rebuild();}, // Set font size
	size:function size(_size){return this.attr('font-size',_size).rebuild();}, // Set / get leading
	leading:function leading(value){ /* act as getter */if(value == null)return this._leading; /* act as setter */this._leading = new SVG.Number(value);return this.rebuild();}, // Rebuild appearance type
	rebuild:function rebuild(_rebuild){ /* store new rebuild flag if given */if(typeof _rebuild == 'boolean')this._rebuild = _rebuild; /* define position of all lines */if(this._rebuild){var self=this;this.lines.each(function(){if(this.newLined){if(!this.textPath)this.attr('x',self.attr('x'));this.attr('dy',self._leading * new SVG.Number(self.attr('font-size')));}});this.fire('rebuild');}return this;}, // Enable / disable build mode
	build:function build(_build){this._build = !!_build;return this;}}, // Add parent method
	construct:{ // Create text element
	text:function text(_text2){return this.put(new SVG.Text()).text(_text2);}, // Create plain text element
	plain:function plain(text){return this.put(new SVG.Text()).plain(text);}}});SVG.TSpan = SVG.invent({ // Initialize node
	create:'tspan', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Set text content
	text:function text(_text3){typeof _text3 === 'function'?_text3.call(this,this):this.plain(_text3);return this;}, // Shortcut dx
	dx:function dx(_dx){return this.attr('dx',_dx);}, // Shortcut dy
	dy:function dy(_dy){return this.attr('dy',_dy);}, // Create new line
	newLine:function newLine(){ /* fetch text parent */var t=this.doc(SVG.Text); /* mark new line */this.newLined = true; /* apply new hy¡n */return this.dy(t._leading * t.attr('font-size')).attr('x',t.x());}}});SVG.extend(SVG.Text,SVG.TSpan,{ // Create plain text node
	plain:function plain(text){ /* clear if build mode is disabled */if(this._build === false)this.clear(); /* create text node */this.node.appendChild(document.createTextNode(this.content = text));return this;}, // Create a tspan
	tspan:function tspan(text){var node=(this.textPath || this).node,tspan=new SVG.TSpan(); /* clear if build mode is disabled */if(this._build === false)this.clear(); /* add new tspan and reference */node.appendChild(tspan.node);tspan.parent = this; /* only first level tspans are considered to be "lines" */if(this instanceof SVG.Text)this.lines.add(tspan);return tspan.text(text);}, // Clear all lines
	clear:function clear(){var node=(this.textPath || this).node; /* remove existing child nodes */while(node.hasChildNodes()) node.removeChild(node.lastChild); /* reset content references  */if(this instanceof SVG.Text){delete this.lines;this.lines = new SVG.Set();this.content = '';}return this;}, // Get length of text element
	length:function length(){return this.node.getComputedTextLength();}});SVG.TextPath = SVG.invent({ // Initialize node
	create:'textPath', // Inherit from
	inherit:SVG.Element, // Define parent class
	parent:SVG.Text, // Add parent method
	construct:{ // Create path for text to run on
	path:function path(d){ /* create textPath element */this.textPath = new SVG.TextPath(); /* move lines to textpath */while(this.node.hasChildNodes()) this.textPath.node.appendChild(this.node.firstChild); /* add textPath element as child node */this.node.appendChild(this.textPath.node); /* create path in defs */this.track = this.doc().defs().path(d); /* create circular reference */this.textPath.parent = this; /* link textPath to path and add content */this.textPath.attr('href','#' + this.track,SVG.xlink);return this;}, // Plot path if any
	plot:function plot(d){if(this.track)this.track.plot(d);return this;}}});SVG.Nested = SVG.invent({ // Initialize node
	create:function create(){this.constructor.call(this,SVG.create('svg'));this.style('overflow','visible');}, // Inherit from
	inherit:SVG.Container, // Add parent method
	construct:{ // Create nested svg document
	nested:function nested(){return this.put(new SVG.Nested());}}});SVG.A = SVG.invent({ // Initialize node
	create:'a', // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Link url
	to:function to(url){return this.attr('href',url,SVG.xlink);}, // Link show attribute
	show:function show(target){return this.attr('show',target,SVG.xlink);}, // Link target attribute
	target:function target(_target){return this.attr('target',_target);}}, // Add parent method
	construct:{ // Create a hyperlink element
	link:function link(url){return this.put(new SVG.A()).to(url);}}});SVG.extend(SVG.Element,{ // Create a hyperlink element
	linkTo:function linkTo(url){var link=new SVG.A();if(typeof url == 'function')url.call(link,link);else link.to(url);return this.parent.put(link).put(this);}});SVG.Marker = SVG.invent({ // Initialize node
	create:'marker', // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Set width of element
	width:function width(_width6){return this.attr('markerWidth',_width6);}, // Set height of element
	height:function height(_height6){return this.attr('markerHeight',_height6);}, // Set marker refX and refY
	ref:function ref(x,y){return this.attr('refX',x).attr('refY',y);}, // Update marker
	update:function update(block){ /* remove all content */this.clear(); /* invoke passed block */if(typeof block == 'function')block.call(this,this);return this;}, // Return the fill id
	toString:function toString(){return 'url(#' + this.id() + ')';}}, // Add parent method
	construct:{marker:function marker(width,height,block){ // Create marker element in defs
	return this.defs().marker(width,height,block);}}});SVG.extend(SVG.Defs,{ // Create marker
	marker:function marker(width,height,block){ // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
	return this.put(new SVG.Marker()).size(width,height).ref(width / 2,height / 2).viewbox(0,0,width,height).attr('orient','auto').update(block);}});SVG.extend(SVG.Line,SVG.Polyline,SVG.Polygon,SVG.Path,{ // Create and attach markers
	marker:function marker(_marker,width,height,block){var attr=['marker']; // Build attribute name
	if(_marker != 'all')attr.push(_marker);attr = attr.join('-'); // Set marker attribute
	_marker = arguments[1] instanceof SVG.Marker?arguments[1]:this.doc().marker(width,height,block);return this.attr(attr,_marker);}});var sugar={stroke:['color','width','opacity','linecap','linejoin','miterlimit','dasharray','dashoffset'],fill:['color','opacity','rule'],prefix:function prefix(t,a){return a == 'color'?t:t + '-' + a;}} /* Add sugar for fill and stroke */;['fill','stroke'].forEach(function(m){var i,extension={};extension[m] = function(o){if(typeof o == 'string' || SVG.Color.isRgb(o) || o && typeof o.fill === 'function')this.attr(m,o);else  /* set all attributes from sugar.fill and sugar.stroke list */for(i = sugar[m].length - 1;i >= 0;i--) if(o[sugar[m][i]] != null)this.attr(sugar.prefix(m,sugar[m][i]),o[sugar[m][i]]);return this;};SVG.extend(SVG.Element,SVG.FX,extension);});SVG.extend(SVG.Element,SVG.FX,{ // Rotation
	rotate:function rotate(deg,x,y){return this.transform({rotation:deg || 0,cx:x,cy:y});}, // Skew
	skew:function skew(x,y){return this.transform({skewX:x || 0,skewY:y || 0});}, // Scale
	scale:function scale(x,y){return this.transform({scaleX:x,scaleY:y == null?x:y});}, // Translate
	translate:function translate(x,y){return this.transform({x:x,y:y});}, // Matrix
	matrix:function matrix(m){return this.transform({matrix:m});}, // Opacity
	opacity:function opacity(value){return this.attr('opacity',value);}});SVG.extend(SVG.Rect,SVG.Ellipse,SVG.FX,{ // Add x and y radius
	radius:function radius(x,y){return this.attr({rx:x,ry:y || x});}});SVG.extend(SVG.Path,{ // Get path length
	length:function length(){return this.node.getTotalLength();}, // Get point at length
	pointAt:function pointAt(length){return this.node.getPointAtLength(length);}});SVG.extend(SVG.Parent,SVG.Text,SVG.FX,{ // Set font 
	font:function font(o){for(var k in o) k == 'leading'?this.leading(o[k]):k == 'anchor'?this.attr('text-anchor',o[k]):k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style'?this.attr('font-' + k,o[k]):this.attr(k,o[k]);return this;}});SVG.Set = SVG.invent({ // Initialize
	create:function create(){ /* set initial state */this.clear();}, // Add class methods
	extend:{ // Add element to set
	add:function add(){var i,il,elements=[].slice.call(arguments);for(i = 0,il = elements.length;i < il;i++) this.members.push(elements[i]);return this;}, // Remove element from set
	remove:function remove(element){var i=this.index(element); /* remove given child */if(i > -1)this.members.splice(i,1);return this;}, // Iterate over all members
	each:function each(block){for(var i=0,il=this.members.length;i < il;i++) block.apply(this.members[i],[i,this.members]);return this;}, // Restore to defaults
	clear:function clear(){ /* initialize store */this.members = [];return this;}, // Checks if a given element is present in set
	has:function has(element){return this.index(element) >= 0;}, // retuns index of given element in set
	index:function index(element){return this.members.indexOf(element);}, // Get member at given index
	get:function get(i){return this.members[i];}, // Get first member
	first:function first(){return this.get(0);}, // Get last member
	last:function last(){return this.get(this.members.length - 1);}, // Default value
	valueOf:function valueOf(){return this.members;}, // Get the bounding box of all members included or empty box if set has no items
	bbox:function bbox(){var box=new SVG.BBox(); /* return an empty box of there are no members */if(this.members.length == 0)return box; /* get the first rbox and update the target bbox */var rbox=this.members[0].rbox();box.x = rbox.x;box.y = rbox.y;box.width = rbox.width;box.height = rbox.height;this.each(function(){ /* user rbox for correct position and visual representation */box = box.merge(this.rbox());});return box;}}, // Add parent method
	construct:{ // Create a new set
	set:function set(){return new SVG.Set();}}});SVG.SetFX = SVG.invent({ // Initialize node
	create:function create(set){ /* store reference to set */this.set = set;}}); // Alias methods
	SVG.Set.inherit = function(){var m,methods=[]; /* gather shape methods */for(var m in SVG.Shape.prototype) if(typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')methods.push(m); /* apply shape aliasses */methods.forEach(function(method){SVG.Set.prototype[method] = function(){for(var i=0,il=this.members.length;i < il;i++) if(this.members[i] && typeof this.members[i][method] == 'function')this.members[i][method].apply(this.members[i],arguments);return method == 'animate'?this.fx || (this.fx = new SVG.SetFX(this)):this;};}); /* clear methods for the next round */methods = []; /* gather fx methods */for(var m in SVG.FX.prototype) if(typeof SVG.FX.prototype[m] == 'function' && typeof SVG.SetFX.prototype[m] != 'function')methods.push(m); /* apply fx aliasses */methods.forEach(function(method){SVG.SetFX.prototype[method] = function(){for(var i=0,il=this.set.members.length;i < il;i++) this.set.members[i].fx[method].apply(this.set.members[i].fx,arguments);return this;};});};SVG.extend(SVG.Element,{ // Store data values on svg nodes
	data:function data(a,v,r){if(typeof a == 'object'){for(v in a) this.data(v,a[v]);}else if(arguments.length < 2){try{return JSON.parse(this.attr('data-' + a));}catch(e) {return this.attr('data-' + a);}}else {this.attr('data-' + a,v === null?null:r === true || typeof v === 'string' || typeof v === 'number'?v:JSON.stringify(v));}return this;}});SVG.extend(SVG.Element,{ // Remember arbitrary data
	remember:function remember(k,v){ /* remember every item in an object individually */if(typeof arguments[0] == 'object')for(var v in k) this.remember(v,k[v]); /* retrieve memory */else if(arguments.length == 1)return this.memory()[k]; /* store memory */else this.memory()[k] = v;return this;}, // Erase a given memory
	forget:function forget(){if(arguments.length == 0)this._memory = {};else for(var i=arguments.length - 1;i >= 0;i--) delete this.memory()[arguments[i]];return this;}, // Initialize or return local memory object
	memory:function memory(){return this._memory || (this._memory = {});}});function camelCase(s){return s.toLowerCase().replace(/-(.)/g,function(m,g){return g.toUpperCase();});} // Ensure to six-based hex 
	function fullHex(hex){return hex.length == 4?['#',hex.substring(1,2),hex.substring(1,2),hex.substring(2,3),hex.substring(2,3),hex.substring(3,4),hex.substring(3,4)].join(''):hex;} // Component to hex value
	function compToHex(comp){var hex=comp.toString(16);return hex.length == 1?'0' + hex:hex;} // Calculate proportional width and height values when necessary
	function proportionalSize(box,width,height){if(width == null || height == null){if(height == null)height = box.height / box.width * width;else if(width == null)width = box.width / box.height * height;}return {width:width,height:height};} // Calculate position according to from and to
	function at(o,pos){ /* number recalculation (don't bother converting to SVG.Number for performance reasons) */return typeof o.from == 'number'?o.from + (o.to - o.from) * pos: /* instance recalculation */o instanceof SVG.Color || o instanceof SVG.Number?o.at(pos): /* for all other values wait until pos has reached 1 to return the final value */pos < 1?o.from:o.to;} // PathArray Helpers
	function arrayToString(a){for(var i=0,il=a.length,s='';i < il;i++) {s += a[i][0];if(a[i][1] != null){s += a[i][1];if(a[i][2] != null){s += ' ';s += a[i][2];if(a[i][3] != null){s += ' ';s += a[i][3];s += ' ';s += a[i][4];if(a[i][5] != null){s += ' ';s += a[i][5];s += ' ';s += a[i][6];if(a[i][7] != null){s += ' ';s += a[i][7];}}}}}}return s + ' ';} // Add more bounding box properties
	function boxProperties(b){b.x2 = b.x + b.width;b.y2 = b.y + b.height;b.cx = b.x + b.width / 2;b.cy = b.y + b.height / 2;} // Parse a matrix string
	function parseMatrix(o){if(o.matrix){ /* split matrix string */var m=o.matrix.replace(/\s/g,'').split(','); /* pasrse values */if(m.length == 6){o.a = parseFloat(m[0]);o.b = parseFloat(m[1]);o.c = parseFloat(m[2]);o.d = parseFloat(m[3]);o.e = parseFloat(m[4]);o.f = parseFloat(m[5]);}}return o;} // Get id from reference string
	function idFromReference(url){var m=url.toString().match(SVG.regex.reference);if(m)return m[1];}return SVG;});

/***/ }
/******/ ]);