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

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _Character = __webpack_require__(1);

	var _Character2 = _interopRequireDefault(_Character);

	var _UserStroke = __webpack_require__(6);

	var _UserStroke2 = _interopRequireDefault(_UserStroke);

	var _CharacterPositioner = __webpack_require__(7);

	var _CharacterPositioner2 = _interopRequireDefault(_CharacterPositioner);

	var _utils = __webpack_require__(8);

	var _utils2 = _interopRequireDefault(_utils);

	var _svgJs = __webpack_require__(9);

	var _svgJs2 = _interopRequireDefault(_svgJs);

	var _util = __webpack_require__(10);

	var defaultOptions = {
		charDataLoader: function charDataLoader(char) {
			return hanziData[char];
		},
		width: null,
		height: null,
		padding: 20,
		strokeAnimationDuration: 300,
		strokeHighlightDuration: 500,
		strokeHighlightColor: '#AAF',
		userStrokeFadeDuration: 300,
		delayBetweenStrokes: 1000,
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

	// todo: better clone
	var clone = function clone(obj) {
		return (0, _util._extend)({}, obj);
	};

	var HanziWriter = (function () {
		function HanziWriter(element, character) {
			var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			_classCallCheck(this, HanziWriter);

			this.svg = (0, _svgJs2['default'])(element);
			this.options = (0, _util._extend)(clone(defaultOptions), options);
			this.setCharacter(character);
			this.setupListeners();
			this.hint.draw();
			this.character.draw();
		}

		_createClass(HanziWriter, [{
			key: 'showCharacter',
			value: function showCharacter() {
				var animationOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				this.character.show(animationOptions);
			}
		}, {
			key: 'hideCharacter',
			value: function hideCharacter() {
				var animationOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				this.character.hide(animationOptions);
			}
		}, {
			key: 'animateCharacter',
			value: function animateCharacter() {
				var animationOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				this.character.animate();
			}
		}, {
			key: 'showHint',
			value: function showHint() {
				var animationOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				this.hint.show(animationOptions);
			}
		}, {
			key: 'hideHint',
			value: function hideHint() {
				var animationOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				this.hint.hide(animationOptions);
			}
		}, {
			key: 'quiz',
			value: function quiz() {
				var quizOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				this.isQuizzing = true;
				this.hideCharacter(quizOptions);
				quizOptions.showHint ? this.showHint() : this.hideHint();
				this.enforceStrokeOrder = quizOptions.enforceStrokeOrder;
				this.currentStrokeIndex = 0;
				this.numRecentMistakes = 0;
				this.drawnStrokes = [];
			}
		}, {
			key: 'setCharacter',
			value: function setCharacter(char) {
				var pathStrings = this.options.charDataLoader(char);
				this.character = new _Character2['default'](pathStrings, this.options);
				this.hint = new _Character2['default'](pathStrings, this.getHintOptions());
				this.positioner = new _CharacterPositioner2['default'](this.character, this.options);
				this.hintPositioner = new _CharacterPositioner2['default'](this.hint, this.options);
				this.hintPositioner.setCanvas(this.svg);
				this.positioner.setCanvas(this.svg);
			}
		}, {
			key: 'setupListeners',
			value: function setupListeners() {
				var _this = this;

				this.svg.node.addEventListener('mousedown', function (e) {
					e.preventDefault();
					_this.startUserStroke(_this.getMousePoint(e));
				});
				this.svg.node.addEventListener('touchstart', function (e) {
					e.preventDefault();
					_this.startUserStroke(_this.getTouchPoint(e));
				});
				this.svg.node.addEventListener('mousemove', function (e) {
					e.preventDefault();
					_this.continueUserStroke(_this.getMousePoint(e));
				});
				this.svg.node.addEventListener('touchmove', function (e) {
					e.preventDefault();
					_this.continueUserStroke(_this.getTouchPoint(e));
				});
				document.addEventListener('mouseup', function (e) {
					return _this.endUserStroke();
				});
				document.addEventListener('touchend', function (e) {
					return _this.endUserStroke();
				});
			}
		}, {
			key: 'startUserStroke',
			value: function startUserStroke(point) {
				this.point = point;
				if (this.userStroke) return this.endUserStroke();
				this.userStroke = new _UserStroke2['default'](point, this.options);
				this.userStroke.setCanvas(this.svg);
				window.lastUserStroke = this.userStroke;
				this.userStroke.draw();
			}
		}, {
			key: 'continueUserStroke',
			value: function continueUserStroke(point) {
				if (this.userStroke) this.userStroke.appendPoint(point);
			}
		}, {
			key: 'endUserStroke',
			value: function endUserStroke() {
				if (!this.userStroke) return;
				var translatedPoints = this.positioner.convertExternalPoints(this.userStroke.getPoints());
				var matchingStroke = this.character.getMatchingStroke(translatedPoints);
				this.userStroke.fadeAndRemove();
				this.userStroke = null;
				if (!this.isQuizzing) return;
				var isValidStroke = matchingStroke && !(0, _utils2['default'])(matchingStroke, this.drawnStrokes);
				if (isValidStroke && (!this.enforceStrokeOrder || matchingStroke === this.character.getStroke(this.currentStrokeIndex))) {
					this.drawnStrokes.push(matchingStroke);
					this.currentStrokeIndex += 1;
					this.numRecentMistakes = 0;
					matchingStroke.show();
					if (this.drawnStrokes.length === this.character.getNumStrokes()) this.isQuizzing = false;
				} else {
					this.numRecentMistakes += 1;
					if (this.numRecentMistakes > 3) this.character.getStroke(this.currentStrokeIndex).highlight();
				}
			}
		}, {
			key: 'getMousePoint',
			value: function getMousePoint(evt) {
				return {
					x: evt.offsetX,
					y: evt.offsetY
				};
			}
		}, {
			key: 'getTouchPoint',
			value: function getTouchPoint(evt) {
				return {
					x: evt.touches[0].pageX - this.svg.node.offsetLeft,
					y: evt.touches[0].pageY - this.svg.node.offsetTop
				};
			}
		}, {
			key: 'getHintOptions',
			value: function getHintOptions() {
				var hintOptions = (0, _util._extend)({}, this.options);
				hintOptions.strokeAttrs = this.options.hintAttrs;
				return hintOptions;
			}
		}]);

		return HanziWriter;
	})();

	;

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
	exports['default'] = HanziWriter;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _Stroke = __webpack_require__(2);

	var _Stroke2 = _interopRequireDefault(_Stroke);

	var _ComboStroke = __webpack_require__(5);

	var _ComboStroke2 = _interopRequireDefault(_ComboStroke);

	var _Drawable2 = __webpack_require__(4);

	var _Drawable3 = _interopRequireDefault(_Drawable2);

	var Character = (function (_Drawable) {
		_inherits(Character, _Drawable);

		function Character(pathStrings) {
			var _this = this;

			var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			_classCallCheck(this, Character);

			_get(Object.getPrototypeOf(Character.prototype), 'constructor', this).call(this);
			this.options = options;
			this.strokes = [];
			var rawStrokes = pathStrings.map(function (pathString) {
				return new _Stroke2['default'](pathString, _this.options);
			});
			var comboStrokeBuffer = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = rawStrokes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var stroke = _step.value;

					if (stroke.isComplete && comboStrokeBuffer.length == 0) {
						this.strokes.push(stroke);
					} else if (stroke.isComplete) {
						comboStrokeBuffer.push(stroke);
						this.strokes.push(new _ComboStroke2['default'](comboStrokeBuffer, this.options));
						comboStrokeBuffer = [];
					} else {
						comboStrokeBuffer.push(stroke);
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
		}

		_createClass(Character, [{
			key: 'getBounds',
			value: function getBounds() {
				var strokeBoundingPoints = this.getAllStrokeBounds();

				var _getExtremes = this.getExtremes(this.getAllYs(strokeBoundingPoints));

				var _getExtremes2 = _slicedToArray(_getExtremes, 3);

				var maxY = _getExtremes2[0];
				var midY = _getExtremes2[1];
				var minY = _getExtremes2[2];

				var _getExtremes3 = this.getExtremes(this.getAllXs(strokeBoundingPoints));

				var _getExtremes32 = _slicedToArray(_getExtremes3, 3);

				var maxX = _getExtremes32[0];
				var midX = _getExtremes32[1];
				var minX = _getExtremes32[2];

				return [{ x: minX, y: minY }, { x: maxX, y: maxY }];
			}
		}, {
			key: 'getAllStrokeBounds',
			value: function getAllStrokeBounds() {
				var bounds = [];
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this.strokes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var stroke = _step2.value;

						var strokeBounds = stroke.getBounds();
						bounds.push(strokeBounds[0]);
						bounds.push(strokeBounds[1]);
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

				return bounds;
			}
		}, {
			key: 'getMatchingStroke',
			value: function getMatchingStroke(points) {
				var closestStroke = null;
				var bestAvgDist = 0;
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = this.strokes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var stroke = _step3.value;

						var avgDist = stroke.getAverageDistance(points);
						if (avgDist < bestAvgDist || !closestStroke) {
							closestStroke = stroke;
							bestAvgDist = avgDist;
						}
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

				if (bestAvgDist < Character.DISTANCE_THRESHOLD) return closestStroke;
			}
		}, {
			key: 'show',
			value: function show() {
				var animationOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = this.strokes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var stroke = _step4.value;

						stroke.show(animationOptions);
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
			key: 'hide',
			value: function hide() {
				var animationOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = this.strokes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var stroke = _step5.value;

						stroke.hide(animationOptions);
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
			key: 'showStroke',
			value: function showStroke(strokeNum) {
				var animationOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

				this.getStroke(strokeNum).show(animationOptions);
			}
		}, {
			key: 'getStroke',
			value: function getStroke(strokeNum) {
				return this.strokes[strokeNum];
			}
		}, {
			key: 'getNumStrokes',
			value: function getNumStrokes() {
				return this.strokes.length;
			}
		}, {
			key: 'draw',
			value: function draw() {
				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					for (var _iterator6 = this.strokes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var stroke = _step6.value;

						stroke.draw();
					}
				} catch (err) {
					_didIteratorError6 = true;
					_iteratorError6 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion6 && _iterator6['return']) {
							_iterator6['return']();
						}
					} finally {
						if (_didIteratorError6) {
							throw _iteratorError6;
						}
					}
				}
			}
		}, {
			key: 'animate',
			value: function animate() {
				var _this2 = this;

				var _onComplete = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

				this.hide({ onComplete: function onComplete() {
						return _this2.animateStroke(_onComplete, 0);
					} });
			}
		}, {
			key: 'setCanvas',
			value: function setCanvas(canvas) {
				_get(Object.getPrototypeOf(Character.prototype), 'setCanvas', this).call(this, canvas);
				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {
					for (var _iterator7 = this.strokes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var stroke = _step7.value;

						stroke.setCanvas(canvas);
					}
				} catch (err) {
					_didIteratorError7 = true;
					_iteratorError7 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion7 && _iterator7['return']) {
							_iterator7['return']();
						}
					} finally {
						if (_didIteratorError7) {
							throw _iteratorError7;
						}
					}
				}
			}
		}, {
			key: 'animateStroke',
			value: function animateStroke(onComplete, strokeNum) {
				var _this3 = this;

				var stroke = this.strokes[strokeNum];
				stroke.animate(function () {
					if (strokeNum < _this3.strokes.length - 1) {
						var nextStroke = function nextStroke() {
							return _this3.animateStroke(onComplete, strokeNum + 1);
						};
						setTimeout(nextStroke, _this3.options.delayBetweenStrokes);
					} else {
						onComplete();
					}
				});
			}
		}]);

		return Character;
	})(_Drawable3['default']);

	Character.DISTANCE_THRESHOLD = 30;

	exports['default'] = Character;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Path, Stroke,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Path = __webpack_require__(3);

	Stroke = (function(_super) {
	  __extends(Stroke, _super);

	  Stroke.HORIZONTAL_STROKE = 1;

	  Stroke.BACK_SLASH_STROKE = 2;

	  Stroke.VERTICAL_STROKE = 3;

	  Stroke.FORWARD_SLASH_STROKE = 4;

	  Stroke.REVERSE_HORIZONTAL_STROKE = 5;

	  Stroke.REVERSE_BACK_SLASH_STROKE = 6;

	  Stroke.REVERSE_VERTICAL_STROKE = 7;

	  Stroke.REVERSE_FORWARD_SLASH_STROKE = 8;

	  function Stroke(zdtPathData, options) {
	    var metadataString, pathString, pointString, _ref;
	    this.options = options != null ? options : {};
	    _ref = zdtPathData.split(':'), metadataString = _ref[0], pathString = _ref[1];
	    pathString = pathString.replace(/;?\s*$/, '');
	    this.points = (function() {
	      var _i, _len, _ref1, _results;
	      _ref1 = pathString.split(';');
	      _results = [];
	      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	        pointString = _ref1[_i];
	        _results.push(this.parsePoint(pointString));
	      }
	      return _results;
	    }).call(this);
	    this.isComplete = metadataString[2] === 'P';
	    this.strokeType = parseInt(metadataString[1]);
	    this.animationSpeedupRatio = 1;
	  }

	  Stroke.prototype.getPathString = function() {
	    return Stroke.__super__.getPathString.apply(this, arguments) + ' z';
	  };

	  Stroke.prototype.parsePoint = function(pointString) {
	    var pointArr;
	    pointArr = pointString.split(',');
	    return {
	      x: pointArr[0],
	      y: pointArr[1]
	    };
	  };

	  Stroke.prototype.setAnimationSpeedupRatio = function(animationSpeedupRatio) {
	    this.animationSpeedupRatio = animationSpeedupRatio;
	  };

	  Stroke.prototype.getDistance = function(point) {
	    var dx, dy, end, length, start;
	    start = this.getStrokeAnimationStartingPoint();
	    end = this.getStrokeAnimationEndingPoint();
	    dx = end.x - start.x;
	    dy = end.y - start.y;
	    length = this.getStrokeAnimationDistance();
	    return Math.abs(dy * point.x - dx * point.y - start.x * end.y + start.y * end.x) / length;
	  };

	  Stroke.prototype.getAverageDistance = function(points) {
	    var point, totalDist, _i, _len;
	    totalDist = 0;
	    for (_i = 0, _len = points.length; _i < _len; _i++) {
	      point = points[_i];
	      totalDist += this.getDistance(point);
	    }
	    return totalDist / points.length;
	  };

	  Stroke.prototype.getStrokeAnimationStartingPoint = function() {
	    return this.getStrokeAnimationExtremePoint(this.strokeType, false);
	  };

	  Stroke.prototype.getStrokeAnimationEndingPoint = function() {
	    return this.getStrokeAnimationExtremePoint(this.strokeType, true);
	  };

	  Stroke.prototype.getStrokeAnimationExtremePoint = function(strokeType, isReverse) {
	    var extremeXs, extremeYs, maxIndex, midIndex, minIndex;
	    extremeYs = this.getExtremes(this.getAllYs(this.points));
	    extremeXs = this.getExtremes(this.getAllXs(this.points));
	    if (strokeType > Stroke.FORWARD_SLASH_STROKE) {
	      strokeType = strokeType - Stroke.FORWARD_SLASH_STROKE;
	      isReverse = !isReverse;
	    }
	    minIndex = isReverse ? 0 : 2;
	    maxIndex = isReverse ? 2 : 0;
	    midIndex = 1;
	    switch (strokeType) {
	      case Stroke.HORIZONTAL_STROKE:
	        return {
	          x: extremeXs[minIndex],
	          y: extremeYs[midIndex]
	        };
	      case Stroke.BACK_SLASH_STROKE:
	        return {
	          x: extremeXs[minIndex],
	          y: extremeYs[minIndex]
	        };
	      case Stroke.VERTICAL_STROKE:
	        return {
	          x: extremeXs[midIndex],
	          y: extremeYs[minIndex]
	        };
	      case Stroke.FORWARD_SLASH_STROKE:
	        return {
	          x: extremeXs[maxIndex],
	          y: extremeYs[minIndex]
	        };
	    }
	  };

	  Stroke.prototype.getStrokeAnimationDistance = function() {
	    var end, start;
	    start = this.getStrokeAnimationStartingPoint();
	    end = this.getStrokeAnimationEndingPoint();
	    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
	  };

	  Stroke.prototype.markAnimationPoints = function() {
	    var end, start;
	    start = this.getStrokeAnimationStartingPoint();
	    end = this.getStrokeAnimationEndingPoint();
	    this.canvas.circle(10).attr({
	      fill: '#9F9'
	    }).move(start.x, start.y);
	    return this.canvas.circle(10).attr({
	      fill: '#9F9'
	    }).move(end.x, end.y);
	  };

	  Stroke.prototype.highlight = function() {
	    return this.path.animate(this.options.strokeHighlightDuration).attr({
	      fill: this.options.strokeHighlightColor,
	      stroke: this.options.strokeHighlightColor,
	      opacity: 1
	    }).after((function(_this) {
	      return function() {
	        return _this.path.animate(_this.options.strokeHighlightDuration).attr({
	          opacity: 0
	        }).after(function() {
	          return _this.path.attr(_this.options.strokeAttrs);
	        });
	      };
	    })(this));
	  };

	  Stroke.prototype.draw = function() {
	    return Stroke.__super__.draw.apply(this, arguments).attr(this.options.strokeAttrs).attr({
	      opacity: 0
	    });
	  };

	  Stroke.prototype.show = function(animationOptions) {
	    if (animationOptions == null) {
	      animationOptions = {};
	    }
	    return this.path.animate(animationOptions.duration || 300).opacity(1).after(animationOptions.onComplete || function() {});
	  };

	  Stroke.prototype.hide = function(animationOptions) {
	    if (animationOptions == null) {
	      animationOptions = {};
	    }
	    return this.path.animate(animationOptions.duration || 300).opacity(0).after(animationOptions.onComplete || function() {});
	  };

	  Stroke.prototype.animate = function(onComplete) {
	    var mask, start;
	    if (onComplete == null) {
	      onComplete = function() {};
	    }
	    start = this.getStrokeAnimationStartingPoint();
	    mask = this.canvas.circle(0).center(start.x, start.y);
	    if (!this.path) {
	      this.drawPath();
	    }
	    this.path.attr({
	      opacity: 1
	    }).attr(this.options.strokeAttrs).clipWith(mask);
	    return mask.animate(this.options.strokeAnimationDuration / this.animationSpeedupRatio).radius(this.getStrokeAnimationDistance()).after(onComplete);
	  };

	  return Stroke;

	})(Path);

	module.exports = Stroke;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Drawable, Path,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Drawable = __webpack_require__(4);

	Path = (function(_super) {
	  __extends(Path, _super);

	  function Path() {
	    return Path.__super__.constructor.apply(this, arguments);
	  }

	  Path.prototype.getPathString = function() {
	    var pathString, point, remainingPoints, start, _i, _len;
	    start = this.points[0];
	    remainingPoints = this.points.slice(1);
	    pathString = "M " + start.x + " " + start.y;
	    for (_i = 0, _len = remainingPoints.length; _i < _len; _i++) {
	      point = remainingPoints[_i];
	      pathString += " L " + point.x + " " + point.y;
	    }
	    return pathString;
	  };

	  Path.prototype.drawPath = function() {
	    return this.path = this.canvas.path(this.getPathString());
	  };

	  Path.prototype.getPoints = function() {
	    return this.points;
	  };

	  Path.prototype.getBounds = function() {
	    var maxX, maxY, midX, midY, minX, minY, _ref, _ref1;
	    _ref = this.getExtremes(this.getAllYs(this.points)), maxY = _ref[0], midY = _ref[1], minY = _ref[2];
	    _ref1 = this.getExtremes(this.getAllXs(this.points)), maxX = _ref1[0], midX = _ref1[1], minX = _ref1[2];
	    return [
	      {
	        x: minX,
	        y: minY
	      }, {
	        x: maxX,
	        y: maxY
	      }
	    ];
	  };

	  Path.prototype.draw = function() {
	    return this.drawPath();
	  };

	  return Path;

	})(Drawable);

	module.exports = Path;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Drawable;

	Drawable = (function() {
	  function Drawable() {}

	  Drawable.prototype.draw = function() {};

	  Drawable.prototype.animate = function(onComplete) {
	    if (onComplete == null) {
	      onComplete = function() {};
	    }
	  };

	  Drawable.prototype.getBounds = function() {};

	  Drawable.prototype.setCanvas = function(canvas) {
	    this.canvas = canvas;
	  };


	  /* convenience methods for children */

	  Drawable.prototype.getExtremes = function(numArray) {
	    var max, mid, min;
	    max = Math.max.apply(null, numArray);
	    min = Math.min.apply(null, numArray);
	    mid = (max + min) / 2;
	    return [max, mid, min];
	  };

	  Drawable.prototype.getAllXs = function(points) {
	    var point, _i, _len, _results;
	    _results = [];
	    for (_i = 0, _len = points.length; _i < _len; _i++) {
	      point = points[_i];
	      _results.push(point.x);
	    }
	    return _results;
	  };

	  Drawable.prototype.getAllYs = function(points) {
	    var point, _i, _len, _results;
	    _results = [];
	    for (_i = 0, _len = points.length; _i < _len; _i++) {
	      point = points[_i];
	      _results.push(point.y);
	    }
	    return _results;
	  };

	  return Drawable;

	})();

	module.exports = Drawable;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var ComboStroke, Drawable,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Drawable = __webpack_require__(4);

	ComboStroke = (function(_super) {
	  __extends(ComboStroke, _super);

	  function ComboStroke(strokes, options) {
	    var stroke, _i, _len, _ref;
	    this.strokes = strokes;
	    this.options = options != null ? options : {};
	    _ref = this.strokes;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      stroke = _ref[_i];
	      stroke.setAnimationSpeedupRatio(this.strokes.length);
	    }
	  }

	  ComboStroke.prototype.show = function(animationOptions) {
	    var stroke, _i, _len, _ref, _results;
	    if (animationOptions == null) {
	      animationOptions = {};
	    }
	    _ref = this.strokes;
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      stroke = _ref[_i];
	      _results.push(stroke.show(animationOptions));
	    }
	    return _results;
	  };

	  ComboStroke.prototype.hide = function(animationOptions) {
	    var stroke, _i, _len, _ref, _results;
	    if (animationOptions == null) {
	      animationOptions = {};
	    }
	    _ref = this.strokes;
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      stroke = _ref[_i];
	      _results.push(stroke.hide(animationOptions));
	    }
	    return _results;
	  };

	  ComboStroke.prototype.draw = function() {
	    var stroke, _i, _len, _ref, _results;
	    _ref = this.strokes;
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      stroke = _ref[_i];
	      _results.push(stroke.draw(this.canvas));
	    }
	    return _results;
	  };

	  ComboStroke.prototype.animate = function(onComplete) {
	    if (onComplete == null) {
	      onComplete = function() {};
	    }
	    return this.animateStroke(onComplete, 0);
	  };

	  ComboStroke.prototype.getDistance = function(point) {
	    var distances, stroke;
	    distances = (function() {
	      var _i, _len, _ref, _results;
	      _ref = this.strokes;
	      _results = [];
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        stroke = _ref[_i];
	        _results.push(stroke.getDistance(point));
	      }
	      return _results;
	    }).call(this);
	    return Math.min.apply(Math, distances);
	  };

	  ComboStroke.prototype.getAverageDistance = function(points) {
	    var point, totalDist, _i, _len;
	    totalDist = 0;
	    for (_i = 0, _len = points.length; _i < _len; _i++) {
	      point = points[_i];
	      totalDist += this.getDistance(point);
	    }
	    return totalDist / points.length;
	  };

	  ComboStroke.prototype.getBounds = function() {
	    var maxX, maxY, midX, midY, minX, minY, strokeBoundingPoints, _ref, _ref1;
	    strokeBoundingPoints = this.getAllStrokeBounds();
	    _ref = this.getExtremes(this.getAllYs(strokeBoundingPoints)), maxY = _ref[0], midY = _ref[1], minY = _ref[2];
	    _ref1 = this.getExtremes(this.getAllXs(strokeBoundingPoints)), maxX = _ref1[0], midX = _ref1[1], minX = _ref1[2];
	    return [
	      {
	        x: minX,
	        y: minY
	      }, {
	        x: maxX,
	        y: maxY
	      }
	    ];
	  };

	  ComboStroke.prototype.getAllStrokeBounds = function() {
	    var bounds, stroke, strokeBounds, _i, _len, _ref;
	    bounds = [];
	    _ref = this.strokes;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      stroke = _ref[_i];
	      strokeBounds = stroke.getBounds();
	      bounds.push(strokeBounds[0]);
	      bounds.push(strokeBounds[1]);
	    }
	    return bounds;
	  };

	  ComboStroke.prototype.setCanvas = function(canvas) {
	    var stroke, _i, _len, _ref, _results;
	    ComboStroke.__super__.setCanvas.apply(this, arguments);
	    _ref = this.strokes;
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      stroke = _ref[_i];
	      _results.push(stroke.setCanvas(canvas));
	    }
	    return _results;
	  };

	  ComboStroke.prototype.highlight = function() {
	    var stroke, _i, _len, _ref, _results;
	    _ref = this.strokes;
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      stroke = _ref[_i];
	      _results.push(stroke.highlight());
	    }
	    return _results;
	  };

	  ComboStroke.prototype.animateStroke = function(onComplete, strokeNum) {
	    var stroke;
	    stroke = this.strokes[strokeNum];
	    return stroke.animate((function(_this) {
	      return function() {
	        if (strokeNum < _this.strokes.length - 1) {
	          return _this.animateStroke(onComplete, strokeNum + 1);
	        } else {
	          return onComplete();
	        }
	      };
	    })(this));
	  };

	  return ComboStroke;

	})(Drawable);

	module.exports = ComboStroke;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Path, UserStroke,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Path = __webpack_require__(3);

	UserStroke = (function(_super) {
	  __extends(UserStroke, _super);

	  function UserStroke(startingPoint, options) {
	    this.options = options != null ? options : {};
	    this.points = [startingPoint];
	  }

	  UserStroke.prototype.appendPoint = function(point) {
	    this.points.push(point);
	    return this.path.plot(this.getPathString());
	  };

	  UserStroke.prototype.animate = function(onComplete) {
	    if (onComplete == null) {
	      onComplete = function() {};
	    }
	    return onComplete();
	  };

	  UserStroke.prototype.draw = function() {
	    return UserStroke.__super__.draw.apply(this, arguments).attr(this.options.userStrokeAttrs);
	  };

	  UserStroke.prototype.fadeAndRemove = function() {
	    return this.path.animate(this.options.userStrokeFadeDuration).attr({
	      opacity: 0
	    }).after((function(_this) {
	      return function() {
	        return _this.path.remove();
	      };
	    })(this));
	  };

	  return UserStroke;

	})(Path);

	module.exports = UserStroke;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var CharacterPositioner, Drawable,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Drawable = __webpack_require__(4);

	CharacterPositioner = (function(_super) {
	  __extends(CharacterPositioner, _super);

	  function CharacterPositioner(character, options) {
	    this.character = character;
	    this.options = options != null ? options : {};
	  }

	  CharacterPositioner.prototype.getBounds = function() {
	    return this.character.getBounds();
	  };

	  CharacterPositioner.prototype.convertExternalPoints = function(points) {
	    var point, _i, _len, _results;
	    _results = [];
	    for (_i = 0, _len = points.length; _i < _len; _i++) {
	      point = points[_i];
	      _results.push(this.convertExternalPoint(point));
	    }
	    return _results;
	  };

	  CharacterPositioner.prototype.convertExternalPoint = function(point) {
	    return {
	      x: (point.x - this.xOffset) / this.scale,
	      y: (point.y - this.yOffset) / this.scale
	    };
	  };

	  CharacterPositioner.prototype.getNestedCanvas = function() {
	    this.calculateScaleAndOffset();
	    return this.canvas.group().move(this.xOffset, this.yOffset).transform({
	      scaleX: this.scale,
	      scaleY: this.scale
	    });
	  };

	  CharacterPositioner.prototype.calculateScaleAndOffset = function() {
	    var bounds, effectiveHeight, effectiveWidth, preScaledHeight, preScaledWidth, scaleX, scaleY, xCenteringBuffer, yCenteringBuffer;
	    bounds = this.getBounds();
	    preScaledWidth = bounds[1].x - bounds[0].x;
	    preScaledHeight = bounds[1].y - bounds[0].y;
	    effectiveWidth = this.options.width - 2 * this.options.padding;
	    effectiveHeight = this.options.height - 2 * this.options.padding;
	    scaleX = effectiveWidth / preScaledWidth;
	    scaleY = effectiveHeight / preScaledHeight;
	    this.scale = Math.min(scaleX, scaleY);
	    xCenteringBuffer = this.options.padding + (effectiveWidth - this.scale * preScaledWidth) / 2;
	    yCenteringBuffer = this.options.padding + (effectiveHeight - this.scale * preScaledHeight) / 2;
	    this.xOffset = -1 * bounds[0].x * this.scale + xCenteringBuffer;
	    return this.yOffset = -1 * bounds[0].y * this.scale + yCenteringBuffer;
	  };

	  CharacterPositioner.prototype.draw = function() {
	    return this.character.draw();
	  };

	  CharacterPositioner.prototype.animate = function(svg, onComplete) {
	    if (onComplete == null) {
	      onComplete = function() {};
	    }
	    return this.character.animate(onComplete);
	  };

	  CharacterPositioner.prototype.setCanvas = function(canvas) {
	    CharacterPositioner.__super__.setCanvas.apply(this, arguments);
	    return this.character.setCanvas(this.getNestedCanvas());
	  };

	  return CharacterPositioner;

	})(Drawable);

	module.exports = CharacterPositioner;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.inArray = inArray;

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
	            if (!_iteratorNormalCompletion && _iterator["return"]) {
	                _iterator["return"]();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }

	    return false;
	}

	;

/***/ },
/* 9 */
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

/***/ },
/* 10 */
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

	exports.isBuffer = __webpack_require__(12);

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
	exports.inherits = __webpack_require__(13);

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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(11)))

/***/ },
/* 11 */
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
/* 12 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
	};

/***/ },
/* 13 */
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

/***/ }
/******/ ]);