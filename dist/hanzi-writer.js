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

	var Character, CharacterPositioner, HanziWriter, SVG, UserStroke, extend, previousHanziWriter,
	  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	Character = __webpack_require__(1);

	UserStroke = __webpack_require__(6);

	CharacterPositioner = __webpack_require__(7);

	SVG = __webpack_require__(8);

	extend = __webpack_require__(9)._extend;

	HanziWriter = (function() {
	  HanziWriter.prototype.options = {
	    charDataLoader: function(char) {
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

	  function HanziWriter(element, character, options) {
	    var key, value;
	    if (options == null) {
	      options = {};
	    }
	    this.svg = SVG(element);
	    for (key in options) {
	      value = options[key];
	      this.options[key] = value;
	    }
	    this.setCharacter(character);
	    this.setupListeners();
	    this.hint.draw();
	    this.character.draw();
	  }

	  HanziWriter.prototype.showCharacter = function(animationOptions) {
	    if (animationOptions == null) {
	      animationOptions = {};
	    }
	    return this.character.show(animationOptions);
	  };

	  HanziWriter.prototype.hideCharacter = function(animationOptions) {
	    if (animationOptions == null) {
	      animationOptions = {};
	    }
	    return this.character.hide(animationOptions);
	  };

	  HanziWriter.prototype.animateCharacter = function(animationOptions) {
	    if (animationOptions == null) {
	      animationOptions = {};
	    }
	    return this.character.animate();
	  };

	  HanziWriter.prototype.showHint = function(animationOptions) {
	    if (animationOptions == null) {
	      animationOptions = {};
	    }
	    return this.hint.show(animationOptions);
	  };

	  HanziWriter.prototype.hideHint = function(animationOptions) {
	    if (animationOptions == null) {
	      animationOptions = {};
	    }
	    return this.hint.hide(animationOptions);
	  };

	  HanziWriter.prototype.quiz = function(quizOptions) {
	    if (quizOptions == null) {
	      quizOptions = {};
	    }
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
	    return this.drawnStrokes = [];
	  };

	  HanziWriter.prototype.setCharacter = function(char) {
	    var pathStrings;
	    pathStrings = this.options.charDataLoader(char);
	    this.character = new Character(pathStrings, this.options);
	    this.hint = new Character(pathStrings, this.getHintOptions());
	    this.positioner = new CharacterPositioner(this.character, this.options);
	    this.hintPositioner = new CharacterPositioner(this.hint, this.options);
	    this.hintPositioner.setCanvas(this.svg);
	    return this.positioner.setCanvas(this.svg);
	  };

	  HanziWriter.prototype.setupListeners = function() {
	    this.svg.node.addEventListener('mousedown', (function(_this) {
	      return function(e) {
	        e.preventDefault();
	        return _this.startUserStroke(_this.getMousePoint(e));
	      };
	    })(this));
	    this.svg.node.addEventListener('touchstart', (function(_this) {
	      return function(e) {
	        e.preventDefault();
	        return _this.startUserStroke(_this.getTouchPoint(e));
	      };
	    })(this));
	    this.svg.node.addEventListener('mousemove', (function(_this) {
	      return function(e) {
	        e.preventDefault();
	        return _this.continueUserStroke(_this.getMousePoint(e));
	      };
	    })(this));
	    this.svg.node.addEventListener('touchmove', (function(_this) {
	      return function(e) {
	        e.preventDefault();
	        return _this.continueUserStroke(_this.getTouchPoint(e));
	      };
	    })(this));
	    document.addEventListener('mouseup', (function(_this) {
	      return function(e) {
	        return _this.endUserStroke();
	      };
	    })(this));
	    return document.addEventListener('touchend', (function(_this) {
	      return function(e) {
	        return _this.endUserStroke();
	      };
	    })(this));
	  };

	  HanziWriter.prototype.startUserStroke = function(point) {
	    this.point = point;
	    if (this.userStroke) {
	      return this.endUserStroke();
	    }
	    this.userStroke = new UserStroke(point, this.options);
	    this.userStroke.setCanvas(this.svg);
	    window.lastUserStroke = this.userStroke;
	    return this.userStroke.draw();
	  };

	  HanziWriter.prototype.continueUserStroke = function(point) {
	    if (this.userStroke) {
	      return this.userStroke.appendPoint(point);
	    }
	  };

	  HanziWriter.prototype.endUserStroke = function() {
	    var isValidStroke, matchingStroke, translatedPoints;
	    if (!this.userStroke) {
	      return;
	    }
	    translatedPoints = this.positioner.convertExternalPoints(this.userStroke.getPoints());
	    matchingStroke = this.character.getMatchingStroke(translatedPoints);
	    this.userStroke.fadeAndRemove();
	    this.userStroke = null;
	    if (!this.isQuizzing) {
	      return;
	    }
	    isValidStroke = matchingStroke && __indexOf.call(this.drawnStrokes, matchingStroke) < 0;
	    if (isValidStroke && (!this.enforceStrokeOrder || matchingStroke === this.character.getStroke(this.currentStrokeIndex))) {
	      this.drawnStrokes.push(matchingStroke);
	      this.currentStrokeIndex += 1;
	      this.numRecentMistakes = 0;
	      matchingStroke.show();
	      if (this.drawnStrokes.length === this.character.getNumStrokes()) {
	        return this.isQuizzing = false;
	      }
	    } else {
	      this.numRecentMistakes += 1;
	      if (this.numRecentMistakes > 3) {
	        return this.character.getStroke(this.currentStrokeIndex).highlight();
	      }
	    }
	  };

	  HanziWriter.prototype.getMousePoint = function(evt) {
	    return {
	      x: evt.offsetX,
	      y: evt.offsetY
	    };
	  };

	  HanziWriter.prototype.getTouchPoint = function(evt) {
	    return {
	      x: evt.touches[0].pageX - this.svg.node.offsetLeft,
	      y: evt.touches[0].pageY - this.svg.node.offsetTop
	    };
	  };

	  HanziWriter.prototype.getHintOptions = function() {
	    var hintOptions;
	    hintOptions = extend({}, this.options);
	    hintOptions.strokeAttrs = this.options.hintAttrs;
	    return hintOptions;
	  };

	  return HanziWriter;

	})();

	if (typeof window !== 'undefined') {
	  previousHanziWriter = window.HanziWriter;
	  HanziWriter.noConflict = function() {
	    window.HanziWriter = previousHanziWriter;
	    return HanziWriter;
	  };
	  window.HanziWriter = HanziWriter;
	}

	if (typeof module !== 'undefined' && module.exports) {
	  module.exports = HanziWriter;
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Character, ComboStroke, Drawable, Stroke,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Stroke = __webpack_require__(2);

	ComboStroke = __webpack_require__(5);

	Drawable = __webpack_require__(4);

	Character = (function(_super) {
	  __extends(Character, _super);

	  Character.DISTANCE_THRESHOLD = 30;

	  function Character(pathStrings, options) {
	    var comboStrokeBuffer, pathString, rawStrokes, stroke, _i, _len;
	    this.options = options != null ? options : {};
	    this.strokes = [];
	    rawStrokes = (function() {
	      var _i, _len, _results;
	      _results = [];
	      for (_i = 0, _len = pathStrings.length; _i < _len; _i++) {
	        pathString = pathStrings[_i];
	        _results.push(new Stroke(pathString, this.options));
	      }
	      return _results;
	    }).call(this);
	    comboStrokeBuffer = [];
	    for (_i = 0, _len = rawStrokes.length; _i < _len; _i++) {
	      stroke = rawStrokes[_i];
	      if (stroke.isComplete && comboStrokeBuffer.length === 0) {
	        this.strokes.push(stroke);
	      } else if (stroke.isComplete) {
	        comboStrokeBuffer.push(stroke);
	        this.strokes.push(new ComboStroke(comboStrokeBuffer, this.options));
	        comboStrokeBuffer = [];
	      } else {
	        comboStrokeBuffer.push(stroke);
	      }
	    }
	  }

	  Character.prototype.getBounds = function() {
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

	  Character.prototype.getAllStrokeBounds = function() {
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

	  Character.prototype.getMatchingStroke = function(points) {
	    var avgDist, bestAvgDist, closestStroke, stroke, _i, _len, _ref;
	    closestStroke = null;
	    bestAvgDist = 0;
	    _ref = this.strokes;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      stroke = _ref[_i];
	      avgDist = stroke.getAverageDistance(points);
	      if (avgDist < bestAvgDist || !closestStroke) {
	        closestStroke = stroke;
	        bestAvgDist = avgDist;
	      }
	    }
	    if (bestAvgDist < Character.DISTANCE_THRESHOLD) {
	      return closestStroke;
	    }
	  };

	  Character.prototype.show = function(animationOptions) {
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

	  Character.prototype.hide = function(animationOptions) {
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

	  Character.prototype.showStroke = function(strokeNum, animationOptions) {
	    if (animationOptions == null) {
	      animationOptions = {};
	    }
	    return this.getStroke(strokeNum).show(animationOptions);
	  };

	  Character.prototype.getStroke = function(strokeNum) {
	    return this.strokes[strokeNum];
	  };

	  Character.prototype.getNumStrokes = function() {
	    return this.strokes.length;
	  };

	  Character.prototype.draw = function() {
	    var stroke, _i, _len, _ref, _results;
	    _ref = this.strokes;
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      stroke = _ref[_i];
	      _results.push(stroke.draw());
	    }
	    return _results;
	  };

	  Character.prototype.animate = function(onComplete) {
	    if (onComplete == null) {
	      onComplete = function() {};
	    }
	    return this.hide({
	      onComplete: (function(_this) {
	        return function() {
	          return _this.animateStroke(onComplete, 0);
	        };
	      })(this)
	    });
	  };

	  Character.prototype.setCanvas = function(canvas) {
	    var stroke, _i, _len, _ref, _results;
	    Character.__super__.setCanvas.apply(this, arguments);
	    _ref = this.strokes;
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      stroke = _ref[_i];
	      _results.push(stroke.setCanvas(canvas));
	    }
	    return _results;
	  };

	  Character.prototype.animateStroke = function(onComplete, strokeNum) {
	    var stroke;
	    stroke = this.strokes[strokeNum];
	    return stroke.animate((function(_this) {
	      return function() {
	        var nextStroke;
	        if (strokeNum < _this.strokes.length - 1) {
	          nextStroke = function() {
	            return _this.animateStroke(onComplete, strokeNum + 1);
	          };
	          return setTimeout(nextStroke, _this.options.delayBetweenStrokes);
	        } else {
	          return onComplete();
	        }
	      };
	    })(this));
	  };

	  return Character;

	})(Drawable);

	module.exports = Character;


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
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	* svg.js - A lightweight library for manipulating and animating SVG.
	* @version 2.0.5
	* http://www.svgjs.com
	*
	* @copyright Wout Fierens <wout@impinc.co.uk>
	* @license MIT
	*
	* BUILT: Sun Jul 05 2015 01:42:48 GMT+0200 (Mitteleuropäische Sommerzeit)
	*/'use strict';;(function(root,factory){if(true){!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));}else if(typeof exports === 'object'){module.exports = factory(require,exports,module);}else {root.SVG = factory();}})(undefined,function(require,exports,module){ // The main wrapping element
	var SVG=this.SVG = function(element){if(SVG.supported){element = new SVG.Doc(element);if(!SVG.parser)SVG.prepare(element);return element;}}; // Default namespaces
	SVG.ns = 'http://www.w3.org/2000/svg';SVG.xmlns = 'http://www.w3.org/2000/xmlns/';SVG.xlink = 'http://www.w3.org/1999/xlink'; // Svg support test
	SVG.supported = (function(){return !!document.createElementNS && !!document.createElementNS(SVG.ns,'svg').createSVGRect;})(); // Don't bother to continue if SVG is not supported 
	if(!SVG.supported)return false; // Element id sequence
	SVG.did = 1000; // Get next named element id
	SVG.eid = function(name){return 'Svgjs' + capitalize(name) + SVG.did++;}; // Method for element creation
	SVG.create = function(name){ // create element
	var element=document.createElementNS(this.ns,name); // apply unique id
	element.setAttribute('id',this.eid(name));return element;}; // Method for extending objects
	SVG.extend = function(){var modules,methods,key,i; // Get list of modules
	modules = [].slice.call(arguments); // Get object with extensions
	methods = modules.pop();for(i = modules.length - 1;i >= 0;i--) if(modules[i])for(key in methods) modules[i].prototype[key] = methods[key]; // Make sure SVG.Set inherits any newly added methods
	if(SVG.Set && SVG.Set.inherit)SVG.Set.inherit();}; // Invent new element
	SVG.invent = function(config){ // Create element initializer
	var initializer=typeof config.create == 'function'?config.create:function(){this.constructor.call(this,SVG.create(config.create));}; // Inherit prototype
	if(config.inherit)initializer.prototype = new config.inherit(); // Extend with methods
	if(config.extend)SVG.extend(initializer,config.extend); // Attach construct method to parent
	if(config.construct)SVG.extend(config.parent || SVG.Container,config.construct);return initializer;}; // Adopt existing svg elements
	SVG.adopt = function(node){ // make sure a node isn't already adopted
	if(node.instance)return node.instance; // initialize variables
	var element; // adopt with element-specific settings
	if(node.nodeName == 'svg')element = node.parentNode instanceof SVGElement?new SVG.Nested():new SVG.Doc();else if(node.nodeName == 'lineairGradient') // lineair?
	element = new SVG.Gradient('lineair');else if(node.nodeName == 'radialGradient')element = new SVG.Gradient('radial');else if(SVG[capitalize(node.nodeName)])element = new (SVG[capitalize(node.nodeName)])();else element = new SVG.Element(node); // ensure references
	element.type = node.nodeName;element.node = node;node.instance = element; // SVG.Class specific preparations
	if(element instanceof SVG.Doc)element.namespace().defs();return element;}; // Initialize parsing element
	SVG.prepare = function(element){ // Select document body and create invisible svg element
	var body=document.getElementsByTagName('body')[0],draw=(body?new SVG.Doc(body):element.nested()).size(2,0),path=SVG.create('path'); // Insert parsers
	draw.node.appendChild(path); // Create parser object
	SVG.parser = {body:body || element.parent(),draw:draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden'),poly:draw.polyline().node,path:path};}; // Storage for regular expressions
	SVG.regex = { // Parse unit value
	unit:/^(-?[\d\.]+)([a-z%]{0,2})$/, // Parse hex value
	hex:/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, // Parse rgb value
	rgb:/rgb\((\d+),(\d+),(\d+)\)/, // Parse reference id
	reference:/#([a-z0-9\-_]+)/i, // Parse matrix wrapper
	matrix:/matrix\(|\)/g, // Whitespace
	whitespace:/\s/g, // Test hex value
	isHex:/^#[a-f0-9]{3,6}$/i, // Test rgb value
	isRgb:/^rgb\(/, // Test css declaration
	isCss:/[^:]+:[^;]+;?/, // Test for blank string
	isBlank:/^(\s+)?$/, // Test for numeric string
	isNumber:/^-?[\d\.]+$/, // Test for percent value
	isPercent:/^-?[\d\.]+%$/, // Test for image url
	isImage:/\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i};SVG.utils = { // Map function
	map:function map(array,block){var i,il=array.length,result=[];for(i = 0;i < il;i++) result.push(block(array[i]));return result;}, // Degrees to radians
	radians:function radians(d){return d % 360 * Math.PI / 180;}, // Radians to degrees
	degrees:function degrees(r){return r * 180 / Math.PI % 360;},filterSVGElements:function filterSVGElements(p){return [].filter.call(p,function(el){return el instanceof SVGElement;});}};SVG.defaults = { // Default attribute values
	attrs:{ /* fill and stroke */'fill-opacity':1,'stroke-opacity':1,'stroke-width':0,'stroke-linejoin':'miter','stroke-linecap':'butt',fill:'#000000',stroke:'#000000',opacity:1, /* position */x:0,y:0,cx:0,cy:0, /* size */width:0,height:0, /* radius */r:0,rx:0,ry:0, /* gradient */offset:0,'stop-opacity':1,'stop-color':'#000000', /* text */'font-size':16,'font-family':'Helvetica, Arial, sans-serif','text-anchor':'start'}}; // Module for color convertions
	SVG.Color = function(color){var match; /* initialize defaults */this.r = 0;this.g = 0;this.b = 0; /* parse color */if(typeof color === 'string'){if(SVG.regex.isRgb.test(color)){ /* get rgb values */match = SVG.regex.rgb.exec(color.replace(/\s/g,'')); /* parse numeric values */this.r = parseInt(match[1]);this.g = parseInt(match[2]);this.b = parseInt(match[3]);}else if(SVG.regex.isHex.test(color)){ /* get hex values */match = SVG.regex.hex.exec(fullHex(color)); /* parse numeric values */this.r = parseInt(match[1],16);this.g = parseInt(match[2],16);this.b = parseInt(match[3],16);}}else if(typeof color === 'object'){this.r = color.r;this.g = color.g;this.b = color.b;}};SVG.extend(SVG.Color,{ // Default to hex conversion
	toString:function toString(){return this.toHex();}, // Build hex value
	toHex:function toHex(){return '#' + compToHex(this.r) + compToHex(this.g) + compToHex(this.b);}, // Build rgb value
	toRgb:function toRgb(){return 'rgb(' + [this.r,this.g,this.b].join() + ')';}, // Calculate true brightness
	brightness:function brightness(){return this.r / 255 * 0.30 + this.g / 255 * 0.59 + this.b / 255 * 0.11;}, // Make color morphable
	morph:function morph(color){this.destination = new SVG.Color(color);return this;}, // Get morphed color at given position
	at:function at(pos){ /* make sure a destination is defined */if(!this.destination)return this; /* normalise pos */pos = pos < 0?0:pos > 1?1:pos; /* generate morphed color */return new SVG.Color({r:~ ~(this.r + (this.destination.r - this.r) * pos),g:~ ~(this.g + (this.destination.g - this.g) * pos),b:~ ~(this.b + (this.destination.b - this.b) * pos)});}}); // Testers
	// Test if given value is a color string
	SVG.Color.test = function(color){color += '';return SVG.regex.isHex.test(color) || SVG.regex.isRgb.test(color);}; // Test if given value is a rgb object
	SVG.Color.isRgb = function(color){return color && typeof color.r == 'number' && typeof color.g == 'number' && typeof color.b == 'number';}; // Test if given value is a color
	SVG.Color.isColor = function(color){return SVG.Color.isRgb(color) || SVG.Color.test(color);}; // Module for array conversion
	SVG.Array = function(array,fallback){array = (array || []).valueOf(); /* if array is empty and fallback is provided, use fallback */if(array.length == 0 && fallback)array = fallback.valueOf(); /* parse array */this.value = this.parse(array);};SVG.extend(SVG.Array,{ // Make array morphable
	morph:function morph(array){this.destination = this.parse(array); /* normalize length of arrays */if(this.value.length != this.destination.length){var lastValue=this.value[this.value.length - 1],lastDestination=this.destination[this.destination.length - 1];while(this.value.length > this.destination.length) this.destination.push(lastDestination);while(this.value.length < this.destination.length) this.value.push(lastValue);}return this;}, // Clean up any duplicate points
	settle:function settle(){ /* find all unique values */for(var i=0,il=this.value.length,seen=[];i < il;i++) if(seen.indexOf(this.value[i]) == -1)seen.push(this.value[i]); /* set new value */return this.value = seen;}, // Get morphed array at given position
	at:function at(pos){ /* make sure a destination is defined */if(!this.destination)return this; /* generate morphed array */for(var i=0,il=this.value.length,array=[];i < il;i++) array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos);return new SVG.Array(array);}, // Convert array to string
	toString:function toString(){return this.value.join(' ');}, // Real value
	valueOf:function valueOf(){return this.value;}, // Parse whitespace separated string
	parse:function parse(array){array = array.valueOf(); /* if already is an array, no need to parse it */if(Array.isArray(array))return array;return this.split(array);}, // Strip unnecessary whitespace
	split:function split(string){return string.trim().split(/\s+/);}, // Reverse array
	reverse:function reverse(){this.value.reverse();return this;}}); // Poly points array
	SVG.PointArray = function(array,fallback){this.constructor.call(this,array,fallback || [[0,0]]);}; // Inherit from SVG.Array
	SVG.PointArray.prototype = new SVG.Array();SVG.extend(SVG.PointArray,{ // Convert array to string
	toString:function toString(){ /* convert to a poly point string */for(var i=0,il=this.value.length,array=[];i < il;i++) array.push(this.value[i].join(','));return array.join(' ');}, // Convert array to line object
	toLine:function toLine(){return {x1:this.value[0][0],y1:this.value[0][1],x2:this.value[1][0],y2:this.value[1][1]};}, // Get morphed array at given position
	at:function at(pos){ /* make sure a destination is defined */if(!this.destination)return this; /* generate morphed point string */for(var i=0,il=this.value.length,array=[];i < il;i++) array.push([this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos,this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos]);return new SVG.PointArray(array);}, // Parse point string
	parse:function parse(array){array = array.valueOf(); /* if already is an array, no need to parse it */if(Array.isArray(array))return array; /* split points */array = this.split(array); /* parse points */for(var i=0,il=array.length,p,points=[];i < il;i++) {p = array[i].split(',');points.push([parseFloat(p[0]),parseFloat(p[1])]);}return points;}, // Move point string
	move:function move(x,y){var box=this.bbox(); /* get relative offset */x -= box.x;y -= box.y; /* move every point */if(!isNaN(x) && !isNaN(y))for(var i=this.value.length - 1;i >= 0;i--) this.value[i] = [this.value[i][0] + x,this.value[i][1] + y];return this;}, // Resize poly string
	size:function size(width,height){var i,box=this.bbox(); /* recalculate position of all points according to new size */for(i = this.value.length - 1;i >= 0;i--) {this.value[i][0] = (this.value[i][0] - box.x) * width / box.width + box.x;this.value[i][1] = (this.value[i][1] - box.y) * height / box.height + box.y;}return this;}, // Get bounding box of points
	bbox:function bbox(){SVG.parser.poly.setAttribute('points',this.toString());return SVG.parser.poly.getBBox();}}); // Path points array
	SVG.PathArray = function(array,fallback){this.constructor.call(this,array,fallback || [['M',0,0]]);}; // Inherit from SVG.Array
	SVG.PathArray.prototype = new SVG.Array();SVG.extend(SVG.PathArray,{ // Convert array to string
	toString:function toString(){return arrayToString(this.value);}, // Move path string
	move:function move(x,y){ /* get bounding box of current situation */var box=this.bbox(); /* get relative offset */x -= box.x;y -= box.y;if(!isNaN(x) && !isNaN(y)){ /* move every point */for(var l,i=this.value.length - 1;i >= 0;i--) {l = this.value[i][0];if(l == 'M' || l == 'L' || l == 'T'){this.value[i][1] += x;this.value[i][2] += y;}else if(l == 'H'){this.value[i][1] += x;}else if(l == 'V'){this.value[i][1] += y;}else if(l == 'C' || l == 'S' || l == 'Q'){this.value[i][1] += x;this.value[i][2] += y;this.value[i][3] += x;this.value[i][4] += y;if(l == 'C'){this.value[i][5] += x;this.value[i][6] += y;}}else if(l == 'A'){this.value[i][6] += x;this.value[i][7] += y;}}}return this;}, // Resize path string
	size:function size(width,height){ /* get bounding box of current situation */var i,l,box=this.bbox(); /* recalculate position of all points according to new size */for(i = this.value.length - 1;i >= 0;i--) {l = this.value[i][0];if(l == 'M' || l == 'L' || l == 'T'){this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;this.value[i][2] = (this.value[i][2] - box.y) * height / box.height + box.y;}else if(l == 'H'){this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;}else if(l == 'V'){this.value[i][1] = (this.value[i][1] - box.y) * height / box.height + box.y;}else if(l == 'C' || l == 'S' || l == 'Q'){this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;this.value[i][2] = (this.value[i][2] - box.y) * height / box.height + box.y;this.value[i][3] = (this.value[i][3] - box.x) * width / box.width + box.x;this.value[i][4] = (this.value[i][4] - box.y) * height / box.height + box.y;if(l == 'C'){this.value[i][5] = (this.value[i][5] - box.x) * width / box.width + box.x;this.value[i][6] = (this.value[i][6] - box.y) * height / box.height + box.y;}}else if(l == 'A'){ /* resize radii */this.value[i][1] = this.value[i][1] * width / box.width;this.value[i][2] = this.value[i][2] * height / box.height; /* move position values */this.value[i][6] = (this.value[i][6] - box.x) * width / box.width + box.x;this.value[i][7] = (this.value[i][7] - box.y) * height / box.height + box.y;}}return this;}, // Absolutize and parse path to array
	parse:function parse(array){ /* if it's already is a patharray, no need to parse it */if(array instanceof SVG.PathArray)return array.valueOf(); /* prepare for parsing */var i,il,x0,y0,x1,y1,x2,y2,s,seg,segs,x=0,y=0; /* populate working path */SVG.parser.path.setAttribute('d',typeof array === 'string'?array:arrayToString(array)); /* get segments */segs = SVG.parser.path.pathSegList;for(i = 0,il = segs.numberOfItems;i < il;++i) {seg = segs.getItem(i);s = seg.pathSegTypeAsLetter; /* yes, this IS quite verbose but also about 30 times faster than .test() with a precompiled regex */if(s == 'M' || s == 'L' || s == 'H' || s == 'V' || s == 'C' || s == 'S' || s == 'Q' || s == 'T' || s == 'A'){if('x' in seg)x = seg.x;if('y' in seg)y = seg.y;}else {if('x1' in seg)x1 = x + seg.x1;if('x2' in seg)x2 = x + seg.x2;if('y1' in seg)y1 = y + seg.y1;if('y2' in seg)y2 = y + seg.y2;if('x' in seg)x += seg.x;if('y' in seg)y += seg.y;if(s == 'm')segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x,y),i);else if(s == 'l')segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x,y),i);else if(s == 'h')segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x),i);else if(s == 'v')segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y),i);else if(s == 'c')segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x,y,x1,y1,x2,y2),i);else if(s == 's')segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x,y,x2,y2),i);else if(s == 'q')segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x,y,x1,y1),i);else if(s == 't')segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x,y),i);else if(s == 'a')segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x,y,seg.r1,seg.r2,seg.angle,seg.largeArcFlag,seg.sweepFlag),i);else if(s == 'z' || s == 'Z'){x = x0;y = y0;}} /* record the start of a subpath */if(s == 'M' || s == 'm'){x0 = x;y0 = y;}} /* build internal representation */array = [];segs = SVG.parser.path.pathSegList;for(i = 0,il = segs.numberOfItems;i < il;++i) {seg = segs.getItem(i);s = seg.pathSegTypeAsLetter;x = [s];if(s == 'M' || s == 'L' || s == 'T')x.push(seg.x,seg.y);else if(s == 'H')x.push(seg.x);else if(s == 'V')x.push(seg.y);else if(s == 'C')x.push(seg.x1,seg.y1,seg.x2,seg.y2,seg.x,seg.y);else if(s == 'S')x.push(seg.x2,seg.y2,seg.x,seg.y);else if(s == 'Q')x.push(seg.x1,seg.y1,seg.x,seg.y);else if(s == 'A')x.push(seg.r1,seg.r2,seg.angle,seg.largeArcFlag | 0,seg.sweepFlag | 0,seg.x,seg.y); /* store segment */array.push(x);}return array;}, // Get bounding box of path
	bbox:function bbox(){SVG.parser.path.setAttribute('d',this.toString());return SVG.parser.path.getBBox();}}); // Module for unit convertions
	SVG.Number = SVG.invent({ // Initialize
	create:function create(value,unit){ // initialize defaults
	this.value = 0;this.unit = unit || ''; // parse value
	if(typeof value === 'number'){ // ensure a valid numeric value
	this.value = isNaN(value)?0:!isFinite(value)?value < 0?-3.4e+38:+3.4e+38:value;}else if(typeof value === 'string'){unit = value.match(SVG.regex.unit);if(unit){ // make value numeric
	this.value = parseFloat(unit[1]); // normalize
	if(unit[2] == '%')this.value /= 100;else if(unit[2] == 's')this.value *= 1000; // store unit
	this.unit = unit[2];}}else {if(value instanceof SVG.Number){this.value = value.valueOf();this.unit = value.unit;}}}, // Add methods
	extend:{ // Stringalize
	toString:function toString(){return (this.unit == '%'?~ ~(this.value * 1e8) / 1e6:this.unit == 's'?this.value / 1e3:this.value) + this.unit;}, // Convert to primitive
	valueOf:function valueOf(){return this.value;}, // Add number
	plus:function plus(number){return new SVG.Number(this + new SVG.Number(number),this.unit);}, // Subtract number
	minus:function minus(number){return this.plus(-new SVG.Number(number));}, // Multiply number
	times:function times(number){return new SVG.Number(this * new SVG.Number(number),this.unit);}, // Divide number
	divide:function divide(number){return new SVG.Number(this / new SVG.Number(number),this.unit);}, // Convert to different unit
	to:function to(unit){var number=new SVG.Number(this);if(typeof unit === 'string')number.unit = unit;return number;}, // Make number morphable
	morph:function morph(number){this.destination = new SVG.Number(number);return this;}, // Get morphed number at given position
	at:function at(pos){ // Make sure a destination is defined
	if(!this.destination)return this; // Generate new morphed number
	return new SVG.Number(this.destination).minus(this).times(pos).plus(this);}}});SVG.ViewBox = function(element){var x,y,width,height,wm=1, /* width multiplier */hm=1, /* height multiplier */box=element.bbox(),view=(element.attr('viewBox') || '').match(/-?[\d\.]+/g),we=element,he=element; /* get dimensions of current node */width = new SVG.Number(element.width());height = new SVG.Number(element.height()); /* find nearest non-percentual dimensions */while(width.unit == '%') {wm *= width.value;width = new SVG.Number(we instanceof SVG.Doc?we.parent().offsetWidth:we.parent().width());we = we.parent();}while(height.unit == '%') {hm *= height.value;height = new SVG.Number(he instanceof SVG.Doc?he.parent().offsetHeight:he.parent().height());he = he.parent();} /* ensure defaults */this.x = box.x;this.y = box.y;this.width = width * wm;this.height = height * hm;this.zoom = 1;if(view){ /* get width and height from viewbox */x = parseFloat(view[0]);y = parseFloat(view[1]);width = parseFloat(view[2]);height = parseFloat(view[3]); /* calculate zoom accoring to viewbox */this.zoom = this.width / this.height > width / height?this.height / height:this.width / width; /* calculate real pixel dimensions on parent SVG.Doc element */this.x = x;this.y = y;this.width = width;this.height = height;}}; //
	SVG.extend(SVG.ViewBox,{ // Parse viewbox to string
	toString:function toString(){return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height;}});SVG.Element = SVG.invent({ // Initialize node
	create:function create(node){ // make stroke value accessible dynamically
	this._stroke = SVG.defaults.attrs.stroke; // create circular reference
	if(this.node = node){this.type = node.nodeName;this.node.instance = this; // store current attribute value
	this._stroke = node.getAttribute('stroke') || this._stroke;}}, // Add class methods
	extend:{ // Move over x-axis
	x:function x(_x){return this.attr('x',_x);}, // Move over y-axis
	y:function y(_y){return this.attr('y',_y);}, // Move by center over x-axis
	cx:function cx(x){return x == null?this.x() + this.width() / 2:this.x(x - this.width() / 2);}, // Move by center over y-axis
	cy:function cy(y){return y == null?this.y() + this.height() / 2:this.y(y - this.height() / 2);}, // Move element to given x and y values
	move:function move(x,y){return this.x(x).y(y);}, // Move element by its center
	center:function center(x,y){return this.cx(x).cy(y);}, // Set width of element
	width:function width(_width){return this.attr('width',_width);}, // Set height of element
	height:function height(_height){return this.attr('height',_height);}, // Set element size to given width and height
	size:function size(width,height){var p=proportionalSize(this.bbox(),width,height);return this.width(new SVG.Number(p.width)).height(new SVG.Number(p.height));}, // Clone element
	clone:function clone(){ // clone element and assign new id
	var clone=assignNewId(this.node.cloneNode(true)); // insert the clone after myself
	this.after(clone);return clone;}, // Remove element
	remove:function remove(){if(this.parent())this.parent().removeElement(this);return this;}, // Replace element
	replace:function replace(element){this.after(element).remove();return element;}, // Add element to given container and return self
	addTo:function addTo(parent){return parent.put(this);}, // Add element to given container and return container
	putIn:function putIn(parent){return parent.add(this);}, // Get / set id
	id:function id(_id){return this.attr('id',_id);}, // Checks whether the given point inside the bounding box of the element
	inside:function inside(x,y){var box=this.bbox();return x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height;}, // Show element
	show:function show(){return this.style('display','');}, // Hide element
	hide:function hide(){return this.style('display','none');}, // Is element visible?
	visible:function visible(){return this.style('display') != 'none';}, // Return id on string conversion
	toString:function toString(){return this.attr('id');}, // Return array of classes on the node
	classes:function classes(){var attr=this.attr('class');return attr == null?[]:attr.trim().split(/\s+/);}, // Return true if class exists on the node, false otherwise
	hasClass:function hasClass(name){return this.classes().indexOf(name) != -1;}, // Add class to the node
	addClass:function addClass(name){if(!this.hasClass(name)){var array=this.classes();array.push(name);this.attr('class',array.join(' '));}return this;}, // Remove class from the node
	removeClass:function removeClass(name){if(this.hasClass(name)){this.attr('class',this.classes().filter(function(c){return c != name;}).join(' '));}return this;}, // Toggle the presence of a class on the node
	toggleClass:function toggleClass(name){return this.hasClass(name)?this.removeClass(name):this.addClass(name);}, // Get referenced element form attribute value
	reference:function reference(attr){return SVG.get(this.attr(attr));}, // Returns the parent element instance
	parent:function parent(type){if(this.node.parentNode){ // get parent element
	var parent=SVG.adopt(this.node.parentNode); // if a specific type is given, find a parent with that class
	if(type)while(!(parent instanceof type) && parent.node.parentNode instanceof SVGElement) parent = SVG.adopt(parent.node.parentNode);return parent;}}, // Get parent document
	doc:function doc(type){return this instanceof SVG.Doc?this:this.parent(SVG.Doc);}, // Returns the svg node to call native svg methods on it
	native:function native(){return this.node;}, // Import raw svg
	svg:function svg(_svg){ // create temporary holder
	var well=document.createElement('svg'); // act as a setter if svg is given
	if(_svg && this instanceof SVG.Parent){ // dump raw svg
	well.innerHTML = '<svg>' + _svg.replace(/\n/,'').replace(/<(\w+)([^<]+?)\/>/g,'<$1$2></$1>') + '</svg>'; // transplant nodes
	for(var i=0,il=well.firstChild.childNodes.length;i < il;i++) this.node.appendChild(well.firstChild.firstChild); // otherwise act as a getter
	}else { // create a wrapping svg element in case of partial content
	well.appendChild(_svg = document.createElement('svg')); // insert a copy of this node
	_svg.appendChild(this.node.cloneNode(true)); // return target element
	return well.innerHTML.replace(/^<svg>/,'').replace(/<\/svg>$/,'');}return this;}}});SVG.FX = SVG.invent({ // Initialize FX object
	create:function create(element){ // store target element
	this.target = element;}, // Add class methods
	extend:{ // Add animation parameters and start animation
	animate:function animate(d,ease,delay){var akeys,skeys,key,element=this.target,fx=this; // dissect object if one is passed
	if(typeof d == 'object'){delay = d.delay;ease = d.ease;d = d.duration;} // ensure default duration and easing
	d = d == '='?d:d == null?1000:new SVG.Number(d).valueOf();ease = ease || '<>'; // process values
	fx.at = function(pos){var i; // normalise pos
	pos = pos < 0?0:pos > 1?1:pos; // collect attribute keys
	if(akeys == null){akeys = [];for(key in fx.attrs) akeys.push(key); // make sure morphable elements are scaled, translated and morphed all together
	if(element.morphArray && (fx.destination.plot || akeys.indexOf('points') > -1)){ // get destination
	var box,p=new element.morphArray(fx.destination.plot || fx.attrs.points || element.array()); // add size
	if(fx.destination.size)p.size(fx.destination.size.width.to,fx.destination.size.height.to); // add movement
	box = p.bbox();if(fx.destination.x)p.move(fx.destination.x.to,box.y);else if(fx.destination.cx)p.move(fx.destination.cx.to - box.width / 2,box.y);box = p.bbox();if(fx.destination.y)p.move(box.x,fx.destination.y.to);else if(fx.destination.cy)p.move(box.x,fx.destination.cy.to - box.height / 2); // reset destination values
	fx.destination = {plot:element.array().morph(p)};}} // collect style keys
	if(skeys == null){skeys = [];for(key in fx.styles) skeys.push(key);} // apply easing
	pos = ease == '<>'?-Math.cos(pos * Math.PI) / 2 + 0.5:ease == '>'?Math.sin(pos * Math.PI / 2):ease == '<'?-Math.cos(pos * Math.PI / 2) + 1:ease == '-'?pos:typeof ease == 'function'?ease(pos):pos; // run plot function
	if(fx.destination.plot){element.plot(fx.destination.plot.at(pos));}else { // run all x-position properties
	if(fx.destination.x)element.x(fx.destination.x.at(pos));else if(fx.destination.cx)element.cx(fx.destination.cx.at(pos)); // run all y-position properties
	if(fx.destination.y)element.y(fx.destination.y.at(pos));else if(fx.destination.cy)element.cy(fx.destination.cy.at(pos)); // run all size properties
	if(fx.destination.size)element.size(fx.destination.size.width.at(pos),fx.destination.size.height.at(pos));} // run all viewbox properties
	if(fx.destination.viewbox)element.viewbox(fx.destination.viewbox.x.at(pos),fx.destination.viewbox.y.at(pos),fx.destination.viewbox.width.at(pos),fx.destination.viewbox.height.at(pos)); // run leading property
	if(fx.destination.leading)element.leading(fx.destination.leading.at(pos)); // animate attributes
	for(i = akeys.length - 1;i >= 0;i--) element.attr(akeys[i],at(fx.attrs[akeys[i]],pos)); // animate styles
	for(i = skeys.length - 1;i >= 0;i--) element.style(skeys[i],at(fx.styles[skeys[i]],pos)); // callback for each keyframe
	if(fx.situation.during)fx.situation.during.call(element,pos,function(from,to){return at({from:from,to:to},pos);});};if(typeof d === 'number'){ // delay animation
	this.timeout = setTimeout(function(){var start=new Date().getTime(); // initialize situation object
	fx.situation.start = start;fx.situation.play = true;fx.situation.finish = start + d;fx.situation.duration = d;fx.situation.ease = ease; // render function
	fx.render = function(){if(fx.situation.play === true){ // calculate pos
	var time=new Date().getTime(),pos=time > fx.situation.finish?1:(time - fx.situation.start) / d; // reverse pos if animation is reversed
	if(fx.situation.reversing)pos = -pos + 1; // process values
	fx.at(pos); // finish off animation
	if(time > fx.situation.finish){if(fx.destination.plot)element.plot(new SVG.PointArray(fx.destination.plot.destination).settle());if(fx.situation.loop === true || typeof fx.situation.loop == 'number' && fx.situation.loop > 0){ // register reverse
	if(fx.situation.reverse)fx.situation.reversing = !fx.situation.reversing;if(typeof fx.situation.loop == 'number'){ // reduce loop count
	if(!fx.situation.reverse || fx.situation.reversing)--fx.situation.loop; // remove last loop if reverse is disabled
	if(!fx.situation.reverse && fx.situation.loop == 1)--fx.situation.loop;}fx.animate(d,ease,delay);}else {fx.situation.after?fx.situation.after.apply(element,[fx]):fx.stop();}}else {fx.animationFrame = requestAnimationFrame(fx.render);}}else {fx.animationFrame = requestAnimationFrame(fx.render);}}; // start animation
	fx.render();},new SVG.Number(delay).valueOf());}return this;}, // Get bounding box of target element
	bbox:function bbox(){return this.target.bbox();}, // Add animatable attributes
	attr:function attr(a,v){ // apply attributes individually
	if(typeof a == 'object'){for(var key in a) this.attr(key,a[key]);}else { // get the current state
	var from=this.target.attr(a); // detect format
	if(a == 'transform'){ // merge given transformation with an existing one
	if(this.attrs[a])v = this.attrs[a].destination.multiply(v); // prepare matrix for morphing
	this.attrs[a] = this.target.ctm().morph(v); // add parametric rotation values
	if(this.param){ // get initial rotation
	v = this.target.transform('rotation'); // add param
	this.attrs[a].param = {from:this.target.param || {rotation:v,cx:this.param.cx,cy:this.param.cy},to:this.param};}}else {this.attrs[a] = SVG.Color.isColor(v)? // prepare color for morphing
	new SVG.Color(from).morph(v):SVG.regex.unit.test(v)? // prepare number for morphing
	new SVG.Number(from).morph(v): // prepare for plain morphing
	{from:from,to:v};}}return this;}, // Add animatable styles
	style:function style(s,v){if(typeof s == 'object')for(var key in s) this.style(key,s[key]);else this.styles[s] = {from:this.target.style(s),to:v};return this;}, // Animatable x-axis
	x:function x(_x2){this.destination.x = new SVG.Number(this.target.x()).morph(_x2);return this;}, // Animatable y-axis
	y:function y(_y2){this.destination.y = new SVG.Number(this.target.y()).morph(_y2);return this;}, // Animatable center x-axis
	cx:function cx(x){this.destination.cx = new SVG.Number(this.target.cx()).morph(x);return this;}, // Animatable center y-axis
	cy:function cy(y){this.destination.cy = new SVG.Number(this.target.cy()).morph(y);return this;}, // Add animatable move
	move:function move(x,y){return this.x(x).y(y);}, // Add animatable center
	center:function center(x,y){return this.cx(x).cy(y);}, // Add animatable size
	size:function size(width,height){if(this.target instanceof SVG.Text){ // animate font size for Text elements
	this.attr('font-size',width);}else { // animate bbox based size for all other elements
	var box=this.target.bbox();this.destination.size = {width:new SVG.Number(box.width).morph(width),height:new SVG.Number(box.height).morph(height)};}return this;}, // Add animatable plot
	plot:function plot(p){this.destination.plot = p;return this;}, // Add leading method
	leading:function leading(value){if(this.target.destination.leading)this.destination.leading = new SVG.Number(this.target.destination.leading).morph(value);return this;}, // Add animatable viewbox
	viewbox:function viewbox(x,y,width,height){if(this.target instanceof SVG.Container){var box=this.target.viewbox();this.destination.viewbox = {x:new SVG.Number(box.x).morph(x),y:new SVG.Number(box.y).morph(y),width:new SVG.Number(box.width).morph(width),height:new SVG.Number(box.height).morph(height)};}return this;}, // Add animateable gradient update
	update:function update(o){if(this.target instanceof SVG.Stop){if(o.opacity != null)this.attr('stop-opacity',o.opacity);if(o.color != null)this.attr('stop-color',o.color);if(o.offset != null)this.attr('offset',new SVG.Number(o.offset));}return this;}, // Add callback for each keyframe
	during:function during(_during){this.situation.during = _during;return this;}, // Callback after animation
	after:function after(_after){this.situation.after = _after;return this;}, // Make loopable
	loop:function loop(times,reverse){ // store current loop and total loops
	this.situation.loop = this.situation.loops = times || true; // make reversable
	this.situation.reverse = !!reverse;return this;}, // Stop running animation
	stop:function stop(fulfill){ // fulfill animation
	if(fulfill === true){this.animate(0);if(this.situation.after)this.situation.after.apply(this.target,[this]);}else { // stop current animation
	clearTimeout(this.timeout);cancelAnimationFrame(this.animationFrame); // reset storage for properties
	this.attrs = {};this.styles = {};this.situation = {};this.destination = {};}return this;}, // Pause running animation
	pause:function pause(){if(this.situation.play === true){this.situation.play = false;this.situation.pause = new Date().getTime();}return this;}, // Play running animation
	play:function play(){if(this.situation.play === false){var pause=new Date().getTime() - this.situation.pause;this.situation.finish += pause;this.situation.start += pause;this.situation.play = true;}return this;}}, // Define parent class
	parent:SVG.Element, // Add method to parent elements
	construct:{ // Get fx module or create a new one, then animate with given duration and ease
	animate:function animate(d,ease,delay){return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d,ease,delay);}, // Stop current animation; this is an alias to the fx instance
	stop:function stop(fulfill){if(this.fx)this.fx.stop(fulfill);return this;}, // Pause current animation
	pause:function pause(){if(this.fx)this.fx.pause();return this;}, // Play paused current animation
	play:function play(){if(this.fx)this.fx.play();return this;}}});SVG.BBox = SVG.invent({ // Initialize
	create:function create(element){ // get values if element is given
	if(element){var box; // yes this is ugly, but Firefox can be a bitch when it comes to elements that are not yet rendered
	try{ // find native bbox
	box = element.node.getBBox();}catch(e) { // mimic bbox
	box = {x:element.node.clientLeft,y:element.node.clientTop,width:element.node.clientWidth,height:element.node.clientHeight};} // plain x and y
	this.x = box.x;this.y = box.y; // plain width and height
	this.width = box.width;this.height = box.height;} // add center, right and bottom
	fullBox(this);}, // Define Parent
	parent:SVG.Element, // Constructor
	construct:{ // Get bounding box
	bbox:function bbox(){return new SVG.BBox(this);}}});SVG.TBox = SVG.invent({ // Initialize
	create:function create(element){ // get values if element is given
	if(element){var t=element.ctm().extract(),box=element.bbox(); // width and height including transformations
	this.width = box.width * t.scaleX;this.height = box.height * t.scaleY; // x and y including transformations
	this.x = box.x + t.x;this.y = box.y + t.y;} // add center, right and bottom
	fullBox(this);}, // Define Parent
	parent:SVG.Element, // Constructor
	construct:{ // Get transformed bounding box
	tbox:function tbox(){return new SVG.TBox(this);}}});SVG.RBox = SVG.invent({ // Initialize
	create:function create(element){if(element){var e=element.doc().parent(),box=element.node.getBoundingClientRect(),zoom=1; // get screen offset
	this.x = box.left;this.y = box.top; // subtract parent offset
	this.x -= e.offsetLeft;this.y -= e.offsetTop;while(e = e.offsetParent) {this.x -= e.offsetLeft;this.y -= e.offsetTop;} // calculate cumulative zoom from svg documents
	e = element;while(e.parent && (e = e.parent())) {if(e.viewbox){zoom *= e.viewbox().zoom;this.x -= e.x() || 0;this.y -= e.y() || 0;}} // recalculate viewbox distortion
	this.width = box.width /= zoom;this.height = box.height /= zoom;} // add center, right and bottom
	fullBox(this); // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
	this.x += window.scrollX;this.y += window.scrollY;}, // define Parent
	parent:SVG.Element, // Constructor
	construct:{ // Get rect box
	rbox:function rbox(){return new SVG.RBox(this);}}}); // Add universal merge method
	[SVG.BBox,SVG.TBox,SVG.RBox].forEach(function(c){SVG.extend(c,{ // Merge rect box with another, return a new instance
	merge:function merge(box){var b=new c(); // merge boxes
	b.x = Math.min(this.x,box.x);b.y = Math.min(this.y,box.y);b.width = Math.max(this.x + this.width,box.x + box.width) - b.x;b.height = Math.max(this.y + this.height,box.y + box.height) - b.y;return fullBox(b);}});});SVG.Matrix = SVG.invent({ // Initialize
	create:function create(source){var i,base=arrayToMatrix([1,0,0,1,0,0]); // ensure source as object
	source = source instanceof SVG.Element?source.matrixify():typeof source === 'string'?stringToMatrix(source):arguments.length == 6?arrayToMatrix([].slice.call(arguments)):typeof source === 'object'?source:base; // merge source
	for(i = abcdef.length - 1;i >= 0;i--) this[abcdef[i]] = source && typeof source[abcdef[i]] === 'number'?source[abcdef[i]]:base[abcdef[i]];}, // Add methods
	extend:{ // Extract individual transformations
	extract:function extract(){ // find delta transform points
	var px=deltaTransformPoint(this,0,1),py=deltaTransformPoint(this,1,0),skewX=180 / Math.PI * Math.atan2(px.y,px.x) - 90;return { // translation
	x:this.e,y:this.f, // skew
	skewX:-skewX,skewY:180 / Math.PI * Math.atan2(py.y,py.x), // scale
	scaleX:Math.sqrt(this.a * this.a + this.b * this.b),scaleY:Math.sqrt(this.c * this.c + this.d * this.d), // rotation
	rotation:skewX};}, // Clone matrix
	clone:function clone(){return new SVG.Matrix(this);}, // Morph one matrix into another
	morph:function morph(matrix){ // store new destination
	this.destination = new SVG.Matrix(matrix);return this;}, // Get morphed matrix at a given position
	at:function at(pos){ // make sure a destination is defined
	if(!this.destination)return this; // calculate morphed matrix at a given position
	var matrix=new SVG.Matrix({a:this.a + (this.destination.a - this.a) * pos,b:this.b + (this.destination.b - this.b) * pos,c:this.c + (this.destination.c - this.c) * pos,d:this.d + (this.destination.d - this.d) * pos,e:this.e + (this.destination.e - this.e) * pos,f:this.f + (this.destination.f - this.f) * pos}); // process parametric rotation if present
	if(this.param && this.param.to){ // calculate current parametric position
	var param={rotation:this.param.from.rotation + (this.param.to.rotation - this.param.from.rotation) * pos,cx:this.param.from.cx,cy:this.param.from.cy}; // rotate matrix
	matrix = matrix.rotate((this.param.to.rotation - this.param.from.rotation * 2) * pos,param.cx,param.cy); // store current parametric values
	matrix.param = param;}return matrix;}, // Multiplies by given matrix
	multiply:function multiply(matrix){return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()));}, // Inverses matrix
	inverse:function inverse(){return new SVG.Matrix(this.native().inverse());}, // Translate matrix
	translate:function translate(x,y){return new SVG.Matrix(this.native().translate(x || 0,y || 0));}, // Scale matrix
	scale:function scale(x,y,cx,cy){ // support universal scale
	if(arguments.length == 1 || arguments.length == 3)y = x;if(arguments.length == 3){cy = cx;cx = y;}return this.around(cx,cy,new SVG.Matrix(x,0,0,y,0,0));}, // Rotate matrix
	rotate:function rotate(r,cx,cy){ // convert degrees to radians
	r = SVG.utils.radians(r);return this.around(cx,cy,new SVG.Matrix(Math.cos(r),Math.sin(r),-Math.sin(r),Math.cos(r),0,0));}, // Flip matrix on x or y, at a given offset
	flip:function flip(a,o){return a == 'x'?this.scale(-1,1,o,0):this.scale(1,-1,0,o);}, // Skew
	skew:function skew(x,y,cx,cy){return this.around(cx,cy,this.native().skewX(x || 0).skewY(y || 0));}, // Transform around a center point
	around:function around(cx,cy,matrix){return this.multiply(new SVG.Matrix(1,0,0,1,cx || 0,cy || 0)).multiply(matrix).multiply(new SVG.Matrix(1,0,0,1,-cx || 0,-cy || 0));}, // Convert to native SVGMatrix
	native:function native(){ // create new matrix
	var matrix=SVG.parser.draw.node.createSVGMatrix(); // update with current values
	for(var i=abcdef.length - 1;i >= 0;i--) matrix[abcdef[i]] = this[abcdef[i]];return matrix;}, // Convert matrix to string
	toString:function toString(){return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')';}}, // Define parent
	parent:SVG.Element, // Add parent method
	construct:{ // Get current matrix
	ctm:function ctm(){return new SVG.Matrix(this.node.getCTM());}}});SVG.extend(SVG.Element,{ // Set svg element attribute
	attr:function attr(a,v,n){ // act as full getter
	if(a == null){ // get an object of attributes
	a = {};v = this.node.attributes;for(n = v.length - 1;n >= 0;n--) a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue)?parseFloat(v[n].nodeValue):v[n].nodeValue;return a;}else if(typeof a == 'object'){ // apply every attribute individually if an object is passed
	for(v in a) this.attr(v,a[v]);}else if(v === null){ // remove value
	this.node.removeAttribute(a);}else if(v == null){ // act as a getter if the first and only argument is not an object
	v = this.node.getAttribute(a);return v == null?SVG.defaults.attrs[a]:SVG.regex.isNumber.test(v)?parseFloat(v):v;}else { // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
	if(a == 'stroke-width')this.attr('stroke',parseFloat(v) > 0?this._stroke:null);else if(a == 'stroke')this._stroke = v; // convert image fill and stroke to patterns
	if(a == 'fill' || a == 'stroke'){if(SVG.regex.isImage.test(v))v = this.doc().defs().image(v,0,0);if(v instanceof SVG.Image)v = this.doc().defs().pattern(0,0,function(){this.add(v);});} // ensure correct numeric values (also accepts NaN and Infinity)
	if(typeof v === 'number')v = new SVG.Number(v); // ensure full hex color
	else if(SVG.Color.isColor(v))v = new SVG.Color(v); // parse array values
	else if(Array.isArray(v))v = new SVG.Array(v); // store parametric transformation values locally
	else if(v instanceof SVG.Matrix && v.param)this.param = v.param; // if the passed attribute is leading...
	if(a == 'leading'){ // ... call the leading method instead
	if(this.leading)this.leading(v);}else { // set given attribute on node
	typeof n === 'string'?this.node.setAttributeNS(n,a,v.toString()):this.node.setAttribute(a,v.toString());} // rebuild if required
	if(this.rebuild && (a == 'font-size' || a == 'x'))this.rebuild(a,v);}return this;}});SVG.extend(SVG.Element,SVG.FX,{ // Add transformations
	transform:function transform(o,relative){ // get target in case of the fx module, otherwise reference this
	var target=this.target || this,matrix; // act as a getter
	if(typeof o !== 'object'){ // get current matrix
	matrix = new SVG.Matrix(target).extract(); // add parametric rotation
	if(typeof this.param === 'object'){matrix.rotation = this.param.rotation;matrix.cx = this.param.cx;matrix.cy = this.param.cy;}return typeof o === 'string'?matrix[o]:matrix;} // get current matrix
	matrix = this instanceof SVG.FX && this.attrs.transform?this.attrs.transform:new SVG.Matrix(target); // ensure relative flag
	relative = !!relative || !!o.relative; // act on matrix
	if(o.a != null){matrix = relative? // relative
	matrix.multiply(new SVG.Matrix(o)): // absolute
	new SVG.Matrix(o); // act on rotation
	}else if(o.rotation != null){ // ensure centre point
	ensureCentre(o,target); // relativize rotation value
	if(relative){o.rotation += this.param && this.param.rotation != null?this.param.rotation:matrix.extract().rotation;} // store parametric values
	this.param = o; // apply transformation
	if(this instanceof SVG.Element){matrix = relative? // relative
	matrix.rotate(o.rotation,o.cx,o.cy): // absolute
	matrix.rotate(o.rotation - matrix.extract().rotation,o.cx,o.cy);} // act on scale
	}else if(o.scale != null || o.scaleX != null || o.scaleY != null){ // ensure centre point
	ensureCentre(o,target); // ensure scale values on both axes
	o.scaleX = o.scale != null?o.scale:o.scaleX != null?o.scaleX:1;o.scaleY = o.scale != null?o.scale:o.scaleY != null?o.scaleY:1;if(!relative){ // absolute; multiply inversed values
	var e=matrix.extract();o.scaleX = o.scaleX * 1 / e.scaleX;o.scaleY = o.scaleY * 1 / e.scaleY;}matrix = matrix.scale(o.scaleX,o.scaleY,o.cx,o.cy); // act on skew
	}else if(o.skewX != null || o.skewY != null){ // ensure centre point
	ensureCentre(o,target); // ensure skew values on both axes
	o.skewX = o.skewX != null?o.skewX:0;o.skewY = o.skewY != null?o.skewY:0;if(!relative){ // absolute; reset skew values
	var e=matrix.extract();matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX,e.skewY,o.cx,o.cy).inverse());}matrix = matrix.skew(o.skewX,o.skewY,o.cx,o.cy); // act on flip
	}else if(o.flip){matrix = matrix.flip(o.flip,o.offset == null?target.bbox()['c' + o.flip]:o.offset); // act on translate
	}else if(o.x != null || o.y != null){if(relative){ // relative
	matrix = matrix.translate(o.x,o.y);}else { // absolute
	if(o.x != null)matrix.e = o.x;if(o.y != null)matrix.f = o.y;}}return this.attr('transform',matrix);}});SVG.extend(SVG.Element,{ // Reset all transformations
	untransform:function untransform(){return this.attr('transform',null);},matrixify:function matrixify(){var matrix=(this.attr('transform') || ''). // split transformations
	split(/\)\s*/).slice(0,-1).map(function(str){ // generate key => value pairs
	var kv=str.trim().split('(');return [kv[0],kv[1].split(',').map(function(str){return parseFloat(str);})];}) // calculate every transformation into one matrix
	.reduce(function(matrix,transform){if(transform[0] == 'matrix')return matrix.multiply(arrayToMatrix(transform[1]));return matrix[transform[0]].apply(matrix,transform[1]);},new SVG.Matrix()); // apply calculated matrix to element
	this.attr('transform',matrix);return matrix;}});SVG.extend(SVG.Element,{ // Dynamic style generator
	style:function style(s,v){if(arguments.length == 0){ /* get full style */return this.node.style.cssText || '';}else if(arguments.length < 2){ /* apply every style individually if an object is passed */if(typeof s == 'object'){for(v in s) this.style(v,s[v]);}else if(SVG.regex.isCss.test(s)){ /* parse css string */s = s.split(';'); /* apply every definition individually */for(var i=0;i < s.length;i++) {v = s[i].split(':');this.style(v[0].replace(/\s+/g,''),v[1]);}}else { /* act as a getter if the first and only argument is not an object */return this.node.style[camelCase(s)];}}else {this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v)?'':v;}return this;}});SVG.Parent = SVG.invent({ // Initialize node
	create:function create(element){this.constructor.call(this,element);}, // Inherit from
	inherit:SVG.Element, // Add class methods
	extend:{ // Returns all child elements
	children:function children(){return SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes),function(node){return SVG.adopt(node);});}, // Add given element at a position
	add:function add(element,i){if(!this.has(element)){ // define insertion index if none given
	i = i == null?this.children().length:i; // add element references
	this.node.insertBefore(element.node,this.node.childNodes[i] || null);}return this;}, // Basically does the same as `add()` but returns the added element instead
	put:function put(element,i){this.add(element,i);return element;}, // Checks if the given element is a child
	has:function has(element){return this.index(element) >= 0;}, // Gets index of given element
	index:function index(element){return this.children().indexOf(element);}, // Get a element at the given index
	get:function get(i){return this.children()[i];}, // Get first child, skipping the defs node
	first:function first(){return this.children()[0];}, // Get the last child
	last:function last(){return this.children()[this.children().length - 1];}, // Iterates over all children and invokes a given block
	each:function each(block,deep){var i,il,children=this.children();for(i = 0,il = children.length;i < il;i++) {if(children[i] instanceof SVG.Element)block.apply(children[i],[i,children]);if(deep && children[i] instanceof SVG.Container)children[i].each(block,deep);}return this;}, // Remove a given child
	removeElement:function removeElement(element){this.node.removeChild(element.node);return this;}, // Remove all elements in this container
	clear:function clear(){ // remove children
	while(this.node.hasChildNodes()) this.node.removeChild(this.node.lastChild); // remove defs reference
	delete this._defs;return this;}, // Get defs
	defs:function defs(){return this.doc().defs();}}});SVG.Container = SVG.invent({ // Initialize node
	create:function create(element){this.constructor.call(this,element);}, // Inherit from
	inherit:SVG.Parent, // Add class methods
	extend:{ // Get the viewBox and calculate the zoom value
	viewbox:function viewbox(v){if(arguments.length == 0) /* act as a getter if there are no arguments */return new SVG.ViewBox(this); /* otherwise act as a setter */v = arguments.length == 1?[v.x,v.y,v.width,v.height]:[].slice.call(arguments);return this.attr('viewBox',v);}}}); // Add events to elements
	['click','dblclick','mousedown','mouseup','mouseover','mouseout','mousemove' // , 'mouseenter' -> not supported by IE
	// , 'mouseleave' -> not supported by IE
	,'touchstart','touchmove','touchleave','touchend','touchcancel'].forEach(function(event){ /* add event to SVG.Element */SVG.Element.prototype[event] = function(f){var self=this; /* bind event to element rather than element node */this.node['on' + event] = typeof f == 'function'?function(){return f.apply(self,arguments);}:null;return this;};}); // Initialize listeners stack
	SVG.listeners = [];SVG.handlerMap = []; // Add event binder in the SVG namespace
	SVG.on = function(node,event,listener){ // create listener, get object-index
	var l=listener.bind(node.instance || node),index=(SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1,ev=event.split('.')[0],ns=event.split('.')[1] || '*'; // ensure valid object
	SVG.listeners[index] = SVG.listeners[index] || {};SVG.listeners[index][ev] = SVG.listeners[index][ev] || {};SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {}; // reference listener
	SVG.listeners[index][ev][ns][listener] = l; // add listener
	node.addEventListener(ev,l,false);}; // Add event unbinder in the SVG namespace
	SVG.off = function(node,event,listener){var index=SVG.handlerMap.indexOf(node),ev=event && event.split('.')[0],ns=event && event.split('.')[1];if(index == -1)return;if(listener){ // remove listener reference
	if(SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']){ // remove listener
	node.removeEventListener(ev,SVG.listeners[index][ev][ns || '*'][listener],false);delete SVG.listeners[index][ev][ns || '*'][listener];}}else if(ns && ev){ // remove all listeners for a namespaced event
	if(SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]){for(listener in SVG.listeners[index][ev][ns]) SVG.off(node,[ev,ns].join('.'),listener);delete SVG.listeners[index][ev][ns];}}else if(ns){ // remove all listeners for a specific namespace
	for(event in SVG.listeners[index]) {for(namespace in SVG.listeners[index][event]) {if(ns === namespace){SVG.off(node,[event,ns].join('.'));}}}}else if(ev){ // remove all listeners for the event
	if(SVG.listeners[index][ev]){for(namespace in SVG.listeners[index][ev]) SVG.off(node,[ev,namespace].join('.'));delete SVG.listeners[index][ev];}}else { // remove all listeners on a given node
	for(event in SVG.listeners[index]) SVG.off(node,event);delete SVG.listeners[index];}}; //
	SVG.extend(SVG.Element,{ // Bind given event to listener
	on:function on(event,listener){SVG.on(this.node,event,listener);return this;}, // Unbind event from listener
	off:function off(event,listener){SVG.off(this.node,event,listener);return this;}, // Fire given event
	fire:function fire(event,data){ // Dispatch event
	if(event instanceof Event){this.node.dispatchEvent(event);}else {this.node.dispatchEvent(new CustomEvent(event,{detail:data}));}return this;}});SVG.Defs = SVG.invent({ // Initialize node
	create:'defs', // Inherit from
	inherit:SVG.Container});SVG.G = SVG.invent({ // Initialize node
	create:'g', // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Move over x-axis
	x:function x(_x3){return _x3 == null?this.transform('x'):this.transform({x:-this.x() + _x3},true);}, // Move over y-axis
	y:function y(_y3){return _y3 == null?this.transform('y'):this.transform({y:-this.y() + _y3},true);}, // Move by center over x-axis
	cx:function cx(x){return x == null?this.tbox().cx:this.x(x - this.tbox().width / 2);}, // Move by center over y-axis
	cy:function cy(y){return y == null?this.tbox().cy:this.y(y - this.tbox().height / 2);}}, // Add parent method
	construct:{ // Create a group element
	group:function group(){return this.put(new SVG.G());}}}); // ### This module adds backward / forward functionality to elements.
	//
	SVG.extend(SVG.Element,{ // Get all siblings, including myself
	siblings:function siblings(){return this.parent().children();}, // Get the curent position siblings
	position:function position(){return this.parent().index(this);}, // Get the next element (will return null if there is none)
	next:function next(){return this.siblings()[this.position() + 1];}, // Get the next element (will return null if there is none)
	previous:function previous(){return this.siblings()[this.position() - 1];}, // Send given element one step forward
	forward:function forward(){var i=this.position() + 1,p=this.parent(); // move node one step forward
	p.removeElement(this).add(this,i); // make sure defs node is always at the top
	if(p instanceof SVG.Doc)p.node.appendChild(p.defs().node);return this;}, // Send given element one step backward
	backward:function backward(){var i=this.position();if(i > 0)this.parent().removeElement(this).add(this,i - 1);return this;}, // Send given element all the way to the front
	front:function front(){var p=this.parent(); // Move node forward
	p.node.appendChild(this.node); // Make sure defs node is always at the top
	if(p instanceof SVG.Doc)p.node.appendChild(p.defs().node);return this;}, // Send given element all the way to the back
	back:function back(){if(this.position() > 0)this.parent().removeElement(this).add(this,0);return this;}, // Inserts a given element before the targeted element
	before:function before(element){element.remove();var i=this.position();this.parent().add(element,i);return this;}, // Insters a given element after the targeted element
	after:function after(element){element.remove();var i=this.position();this.parent().add(element,i + 1);return this;}});SVG.Mask = SVG.invent({ // Initialize node
	create:function create(){this.constructor.call(this,SVG.create('mask')); /* keep references to masked elements */this.targets = [];}, // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Unmask all masked elements and remove itself
	remove:function remove(){ /* unmask all targets */for(var i=this.targets.length - 1;i >= 0;i--) if(this.targets[i])this.targets[i].unmask();delete this.targets; /* remove mask from parent */this.parent().removeElement(this);return this;}}, // Add parent method
	construct:{ // Create masking element
	mask:function mask(){return this.defs().put(new SVG.Mask());}}});SVG.extend(SVG.Element,{ // Distribute mask to svg element
	maskWith:function maskWith(element){ /* use given mask or create a new one */this.masker = element instanceof SVG.Mask?element:this.parent().mask().add(element); /* store reverence on self in mask */this.masker.targets.push(this); /* apply mask */return this.attr('mask','url("#' + this.masker.attr('id') + '")');}, // Unmask element
	unmask:function unmask(){delete this.masker;return this.attr('mask',null);}});SVG.ClipPath = SVG.invent({ // Initialize node
	create:function create(){this.constructor.call(this,SVG.create('clipPath')); /* keep references to clipped elements */this.targets = [];}, // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Unclip all clipped elements and remove itself
	remove:function remove(){ /* unclip all targets */for(var i=this.targets.length - 1;i >= 0;i--) if(this.targets[i])this.targets[i].unclip();delete this.targets; /* remove clipPath from parent */this.parent().removeElement(this);return this;}}, // Add parent method
	construct:{ // Create clipping element
	clip:function clip(){return this.defs().put(new SVG.ClipPath());}}}); //
	SVG.extend(SVG.Element,{ // Distribute clipPath to svg element
	clipWith:function clipWith(element){ /* use given clip or create a new one */this.clipper = element instanceof SVG.ClipPath?element:this.parent().clip().add(element); /* store reverence on self in mask */this.clipper.targets.push(this); /* apply mask */return this.attr('clip-path','url("#' + this.clipper.attr('id') + '")');}, // Unclip element
	unclip:function unclip(){delete this.clipper;return this.attr('clip-path',null);}});SVG.Gradient = SVG.invent({ // Initialize node
	create:function create(type){this.constructor.call(this,SVG.create(type + 'Gradient')); /* store type */this.type = type;}, // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Add a color stop
	at:function at(offset,color,opacity){return this.put(new SVG.Stop()).update(offset,color,opacity);}, // Update gradient
	update:function update(block){ /* remove all stops */this.clear(); /* invoke passed block */if(typeof block == 'function')block.call(this,this);return this;}, // Return the fill id
	fill:function fill(){return 'url(#' + this.id() + ')';}, // Alias string convertion to fill
	toString:function toString(){return this.fill();}}, // Add parent method
	construct:{ // Create gradient element in defs
	gradient:function gradient(type,block){return this.defs().gradient(type,block);}}}); // Add animatable methods to both gradient and fx module
	SVG.extend(SVG.Gradient,SVG.FX,{ // From position
	from:function from(x,y){return (this.target || this).type == 'radial'?this.attr({fx:new SVG.Number(x),fy:new SVG.Number(y)}):this.attr({x1:new SVG.Number(x),y1:new SVG.Number(y)});}, // To position
	to:function to(x,y){return (this.target || this).type == 'radial'?this.attr({cx:new SVG.Number(x),cy:new SVG.Number(y)}):this.attr({x2:new SVG.Number(x),y2:new SVG.Number(y)});}}); // Base gradient generation
	SVG.extend(SVG.Defs,{ // define gradient
	gradient:function gradient(type,block){return this.put(new SVG.Gradient(type)).update(block);}});SVG.Stop = SVG.invent({ // Initialize node
	create:'stop', // Inherit from
	inherit:SVG.Element, // Add class methods
	extend:{ // add color stops
	update:function update(o){if(typeof o == 'number' || o instanceof SVG.Number){o = {offset:arguments[0],color:arguments[1],opacity:arguments[2]};} /* set attributes */if(o.opacity != null)this.attr('stop-opacity',o.opacity);if(o.color != null)this.attr('stop-color',o.color);if(o.offset != null)this.attr('offset',new SVG.Number(o.offset));return this;}}});SVG.Pattern = SVG.invent({ // Initialize node
	create:'pattern', // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Return the fill id
	fill:function fill(){return 'url(#' + this.id() + ')';}, // Update pattern by rebuilding
	update:function update(block){ // remove content
	this.clear(); // invoke passed block
	if(typeof block == 'function')block.call(this,this);return this;}, // Alias string convertion to fill
	toString:function toString(){return this.fill();}}, // Add parent method
	construct:{ // Create pattern element in defs
	pattern:function pattern(width,height,block){return this.defs().pattern(width,height,block);}}});SVG.extend(SVG.Defs,{ // Define gradient
	pattern:function pattern(width,height,block){return this.put(new SVG.Pattern()).update(block).attr({x:0,y:0,width:width,height:height,patternUnits:'userSpaceOnUse'});}});SVG.Doc = SVG.invent({ // Initialize node
	create:function create(element){if(element){ /* ensure the presence of a dom element */element = typeof element == 'string'?document.getElementById(element):element; /* If the target is an svg element, use that element as the main wrapper.
	         This allows svg.js to work with svg documents as well. */if(element.nodeName == 'svg'){this.constructor.call(this,element);}else {this.constructor.call(this,SVG.create('svg'));element.appendChild(this.node);} /* set svg element attributes and ensure defs node */this.namespace().size('100%','100%').defs();}}, // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Add namespaces
	namespace:function namespace(){return this.attr({xmlns:SVG.ns,version:'1.1'}).attr('xmlns:xlink',SVG.xlink,SVG.xmlns);}, // Creates and returns defs element
	defs:function defs(){if(!this._defs){var defs; // Find or create a defs element in this instance
	if(defs = this.node.getElementsByTagName('defs')[0])this._defs = SVG.adopt(defs);else this._defs = new SVG.Defs(); // Make sure the defs node is at the end of the stack
	this.node.appendChild(this._defs.node);}return this._defs;}, // custom parent method
	parent:function parent(){return this.node.parentNode.nodeName == '#document'?null:this.node.parentNode;}, // Fix for possible sub-pixel offset. See:
	// https://bugzilla.mozilla.org/show_bug.cgi?id=608812
	spof:function spof(_spof){var pos=this.node.getScreenCTM();if(pos)this.style('left',-pos.e % 1 + 'px').style('top',-pos.f % 1 + 'px');return this;}, // Removes the doc from the DOM
	remove:function remove(){if(this.parent()){this.parent().removeChild(this.node);}return this;}}});SVG.Shape = SVG.invent({ // Initialize node
	create:function create(element){this.constructor.call(this,element);}, // Inherit from
	inherit:SVG.Element});SVG.Bare = SVG.invent({ // Initialize
	create:function create(element,inherit){ // construct element
	this.constructor.call(this,SVG.create(element)); // inherit custom methods
	if(inherit)for(var method in inherit.prototype) if(typeof inherit.prototype[method] === 'function')this[method] = inherit.prototype[method];}, // Inherit from
	inherit:SVG.Element, // Add methods
	extend:{ // Insert some plain text
	words:function words(text){ // remove contents
	while(this.node.hasChildNodes()) this.node.removeChild(this.node.lastChild); // create text node
	this.node.appendChild(document.createTextNode(text));return this;}}});SVG.extend(SVG.Parent,{ // Create an element that is not described by SVG.js
	element:function element(_element,inherit){return this.put(new SVG.Bare(_element,inherit));}, // Add symbol element
	symbol:function symbol(){return this.defs().element('symbol',SVG.Container);}});SVG.Use = SVG.invent({ // Initialize node
	create:'use', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Use element as a reference
	element:function element(_element2,file){ /* Set lined element */return this.attr('href',(file || '') + '#' + _element2,SVG.xlink);}}, // Add parent method
	construct:{ // Create a use element
	use:function use(element,file){return this.put(new SVG.Use()).element(element,file);}}});SVG.Rect = SVG.invent({ // Initialize node
	create:'rect', // Inherit from
	inherit:SVG.Shape, // Add parent method
	construct:{ // Create a rect element
	rect:function rect(width,height){return this.put(new SVG.Rect().size(width,height));}}});SVG.Circle = SVG.invent({ // Initialize node
	create:'circle', // Inherit from
	inherit:SVG.Shape, // Add parent method
	construct:{ // Create circle element, based on ellipse
	circle:function circle(size){return this.put(new SVG.Circle()).rx(new SVG.Number(size).divide(2)).move(0,0);}}});SVG.extend(SVG.Circle,SVG.FX,{ // Radius x value
	rx:function rx(_rx){return this.attr('r',_rx);}, // Alias radius x value
	ry:function ry(_ry){return this.rx(_ry);}});SVG.Ellipse = SVG.invent({ // Initialize node
	create:'ellipse', // Inherit from
	inherit:SVG.Shape, // Add parent method
	construct:{ // Create an ellipse
	ellipse:function ellipse(width,height){return this.put(new SVG.Ellipse()).size(width,height).move(0,0);}}});SVG.extend(SVG.Ellipse,SVG.Rect,SVG.FX,{ // Radius x value
	rx:function rx(_rx2){return this.attr('rx',_rx2);}, // Radius y value
	ry:function ry(_ry2){return this.attr('ry',_ry2);}}); // Add common method
	SVG.extend(SVG.Circle,SVG.Ellipse,{ // Move over x-axis
	x:function x(_x4){return _x4 == null?this.cx() - this.rx():this.cx(_x4 + this.rx());}, // Move over y-axis
	y:function y(_y4){return _y4 == null?this.cy() - this.ry():this.cy(_y4 + this.ry());}, // Move by center over x-axis
	cx:function cx(x){return x == null?this.attr('cx'):this.attr('cx',x);}, // Move by center over y-axis
	cy:function cy(y){return y == null?this.attr('cy'):this.attr('cy',y);}, // Set width of element
	width:function width(_width2){return _width2 == null?this.rx() * 2:this.rx(new SVG.Number(_width2).divide(2));}, // Set height of element
	height:function height(_height2){return _height2 == null?this.ry() * 2:this.ry(new SVG.Number(_height2).divide(2));}, // Custom size function
	size:function size(width,height){var p=proportionalSize(this.bbox(),width,height);return this.rx(new SVG.Number(p.width).divide(2)).ry(new SVG.Number(p.height).divide(2));}});SVG.Line = SVG.invent({ // Initialize node
	create:'line', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Get array
	array:function array(){return new SVG.PointArray([[this.attr('x1'),this.attr('y1')],[this.attr('x2'),this.attr('y2')]]);}, // Overwrite native plot() method
	plot:function plot(x1,y1,x2,y2){if(arguments.length == 4)x1 = {x1:x1,y1:y1,x2:x2,y2:y2};else x1 = new SVG.PointArray(x1).toLine();return this.attr(x1);}, // Move by left top corner
	move:function move(x,y){return this.attr(this.array().move(x,y).toLine());}, // Set element size to given width and height
	size:function size(width,height){var p=proportionalSize(this.bbox(),width,height);return this.attr(this.array().size(p.width,p.height).toLine());}}, // Add parent method
	construct:{ // Create a line element
	line:function line(x1,y1,x2,y2){return this.put(new SVG.Line()).plot(x1,y1,x2,y2);}}});SVG.Polyline = SVG.invent({ // Initialize node
	create:'polyline', // Inherit from
	inherit:SVG.Shape, // Add parent method
	construct:{ // Create a wrapped polyline element
	polyline:function polyline(p){return this.put(new SVG.Polyline()).plot(p);}}});SVG.Polygon = SVG.invent({ // Initialize node
	create:'polygon', // Inherit from
	inherit:SVG.Shape, // Add parent method
	construct:{ // Create a wrapped polygon element
	polygon:function polygon(p){return this.put(new SVG.Polygon()).plot(p);}}}); // Add polygon-specific functions
	SVG.extend(SVG.Polyline,SVG.Polygon,{ // Get array
	array:function array(){return this._array || (this._array = new SVG.PointArray(this.attr('points')));}, // Plot new path
	plot:function plot(p){return this.attr('points',this._array = new SVG.PointArray(p));}, // Move by left top corner
	move:function move(x,y){return this.attr('points',this.array().move(x,y));}, // Set element size to given width and height
	size:function size(width,height){var p=proportionalSize(this.bbox(),width,height);return this.attr('points',this.array().size(p.width,p.height));}}); // unify all point to point elements
	SVG.extend(SVG.Line,SVG.Polyline,SVG.Polygon,{ // Define morphable array
	morphArray:SVG.PointArray, // Move by left top corner over x-axis
	x:function x(_x5){return _x5 == null?this.bbox().x:this.move(_x5,this.bbox().y);}, // Move by left top corner over y-axis
	y:function y(_y5){return _y5 == null?this.bbox().y:this.move(this.bbox().x,_y5);}, // Set width of element
	width:function width(_width3){var b=this.bbox();return _width3 == null?b.width:this.size(_width3,b.height);}, // Set height of element
	height:function height(_height3){var b=this.bbox();return _height3 == null?b.height:this.size(b.width,_height3);}});SVG.Path = SVG.invent({ // Initialize node
	create:'path', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Define morphable array
	morphArray:SVG.PathArray, // Get array
	array:function array(){return this._array || (this._array = new SVG.PathArray(this.attr('d')));}, // Plot new poly points
	plot:function plot(p){return this.attr('d',this._array = new SVG.PathArray(p));}, // Move by left top corner
	move:function move(x,y){return this.attr('d',this.array().move(x,y));}, // Move by left top corner over x-axis
	x:function x(_x6){return _x6 == null?this.bbox().x:this.move(_x6,this.bbox().y);}, // Move by left top corner over y-axis
	y:function y(_y6){return _y6 == null?this.bbox().y:this.move(this.bbox().x,_y6);}, // Set element size to given width and height
	size:function size(width,height){var p=proportionalSize(this.bbox(),width,height);return this.attr('d',this.array().size(p.width,p.height));}, // Set width of element
	width:function width(_width4){return _width4 == null?this.bbox().width:this.size(_width4,this.bbox().height);}, // Set height of element
	height:function height(_height4){return _height4 == null?this.bbox().height:this.size(this.bbox().width,_height4);}}, // Add parent method
	construct:{ // Create a wrapped path element
	path:function path(d){return this.put(new SVG.Path()).plot(d);}}});SVG.Image = SVG.invent({ // Initialize node
	create:'image', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // (re)load image
	load:function load(url){if(!url)return this;var self=this,img=document.createElement('img'); // preload image
	img.onload = function(){var p=self.parent(SVG.Pattern); // ensure image size
	if(self.width() == 0 && self.height() == 0)self.size(img.width,img.height); // ensure pattern size if not set
	if(p && p.width() == 0 && p.height() == 0)p.size(self.width(),self.height()); // callback
	if(typeof self._loaded === 'function')self._loaded.call(self,{width:img.width,height:img.height,ratio:img.width / img.height,url:url});};return this.attr('href',img.src = this.src = url,SVG.xlink);}, // Add loaded callback
	loaded:function loaded(_loaded){this._loaded = _loaded;return this;}}, // Add parent method
	construct:{ // create image element, load image and set its size
	image:function image(source,width,height){return this.put(new SVG.Image()).load(source).size(width || 0,height || width || 0);}}});SVG.Text = SVG.invent({ // Initialize node
	create:function create(){this.constructor.call(this,SVG.create('text'));this._leading = new SVG.Number(1.3); // store leading value for rebuilding
	this._rebuild = true; // enable automatic updating of dy values
	this._build = false; // disable build mode for adding multiple lines
	// set default font
	this.attr('font-family',SVG.defaults.attrs['font-family']);}, // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Move over x-axis
	x:function x(_x7){ // act as getter
	if(_x7 == null)return this.attr('x'); // move lines as well if no textPath is present
	if(!this.textPath)this.lines().each(function(){if(this.newLined)this.x(_x7);});return this.attr('x',_x7);}, // Move over y-axis
	y:function y(_y7){var oy=this.attr('y'),o=typeof oy === 'number'?oy - this.bbox().y:0; // act as getter
	if(_y7 == null)return typeof oy === 'number'?oy - o:oy;return this.attr('y',typeof _y7 === 'number'?_y7 + o:_y7);}, // Move center over x-axis
	cx:function cx(x){return x == null?this.bbox().cx:this.x(x - this.bbox().width / 2);}, // Move center over y-axis
	cy:function cy(y){return y == null?this.bbox().cy:this.y(y - this.bbox().height / 2);}, // Set the text content
	text:function text(_text){ // act as getter
	if(typeof _text === 'undefined')return this.content; // remove existing content
	this.clear().build(true);if(typeof _text === 'function'){ // call block
	_text.call(this,this);}else { // store text and make sure text is not blank
	_text = (this.content = _text).split('\n'); // build new lines
	for(var i=0,il=_text.length;i < il;i++) this.tspan(_text[i]).newLine();} // disable build mode and rebuild lines
	return this.build(false).rebuild();}, // Set font size
	size:function size(_size){return this.attr('font-size',_size).rebuild();}, // Set / get leading
	leading:function leading(value){ // act as getter
	if(value == null)return this._leading; // act as setter
	this._leading = new SVG.Number(value);return this.rebuild();}, // Get all the first level lines
	lines:function lines(){ // filter tspans and map them to SVG.js instances
	var lines=SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes),function(el){return SVG.adopt(el);}); // return an instance of SVG.set
	return new SVG.Set(lines);}, // Rebuild appearance type
	rebuild:function rebuild(_rebuild){ // store new rebuild flag if given
	if(typeof _rebuild == 'boolean')this._rebuild = _rebuild; // define position of all lines
	if(this._rebuild){var self=this;this.lines().each(function(){if(this.newLined){if(!this.textPath)this.attr('x',self.attr('x'));this.attr('dy',self._leading * new SVG.Number(self.attr('font-size')));}});this.fire('rebuild');}return this;}, // Enable / disable build mode
	build:function build(_build){this._build = !!_build;return this;}}, // Add parent method
	construct:{ // Create text element
	text:function text(_text2){return this.put(new SVG.Text()).text(_text2);}, // Create plain text element
	plain:function plain(text){return this.put(new SVG.Text()).plain(text);}}});SVG.Tspan = SVG.invent({ // Initialize node
	create:'tspan', // Inherit from
	inherit:SVG.Shape, // Add class methods
	extend:{ // Set text content
	text:function text(_text3){typeof _text3 === 'function'?_text3.call(this,this):this.plain(_text3);return this;}, // Shortcut dx
	dx:function dx(_dx){return this.attr('dx',_dx);}, // Shortcut dy
	dy:function dy(_dy){return this.attr('dy',_dy);}, // Create new line
	newLine:function newLine(){ // fetch text parent
	var t=this.parent(SVG.Text); // mark new line
	this.newLined = true; // apply new hy¡n
	return this.dy(t._leading * t.attr('font-size')).attr('x',t.x());}}});SVG.extend(SVG.Text,SVG.Tspan,{ // Create plain text node
	plain:function plain(text){ // clear if build mode is disabled
	if(this._build === false)this.clear(); // create text node
	this.node.appendChild(document.createTextNode(this.content = text));return this;}, // Create a tspan
	tspan:function tspan(text){var node=(this.textPath() || this).node,tspan=new SVG.Tspan(); // clear if build mode is disabled
	if(this._build === false)this.clear(); // add new tspan
	node.appendChild(tspan.node);return tspan.text(text);}, // Clear all lines
	clear:function clear(){var node=(this.textPath() || this).node; // remove existing child nodes
	while(node.hasChildNodes()) node.removeChild(node.lastChild); // reset content references 
	if(this instanceof SVG.Text)this.content = '';return this;}, // Get length of text element
	length:function length(){return this.node.getComputedTextLength();}});SVG.TextPath = SVG.invent({ // Initialize node
	create:'textPath', // Inherit from
	inherit:SVG.Element, // Define parent class
	parent:SVG.Text, // Add parent method
	construct:{ // Create path for text to run on
	path:function path(d){ // create textPath element
	var path=new SVG.TextPath(),track=this.doc().defs().path(d); // move lines to textpath
	while(this.node.hasChildNodes()) path.node.appendChild(this.node.firstChild); // add textPath element as child node
	this.node.appendChild(path.node); // link textPath to path and add content
	path.attr('href','#' + track,SVG.xlink);return this;}, // Plot path if any
	plot:function plot(d){var track=this.track();if(track)track.plot(d);return this;}, // Get the path track element
	track:function track(){var path=this.textPath();if(path)return path.reference('href');}, // Get the textPath child
	textPath:function textPath(){if(this.node.firstChild && this.node.firstChild.nodeName == 'textPath')return SVG.adopt(this.node.firstChild);}}});SVG.Nested = SVG.invent({ // Initialize node
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
	linkTo:function linkTo(url){var link=new SVG.A();if(typeof url == 'function')url.call(link,link);else link.to(url);return this.parent().put(link).put(this);}});SVG.Marker = SVG.invent({ // Initialize node
	create:'marker', // Inherit from
	inherit:SVG.Container, // Add class methods
	extend:{ // Set width of element
	width:function width(_width5){return this.attr('markerWidth',_width5);}, // Set height of element
	height:function height(_height5){return this.attr('markerHeight',_height5);}, // Set marker refX and refY
	ref:function ref(x,y){return this.attr('refX',x).attr('refY',y);}, // Update marker
	update:function update(block){ /* remove all content */this.clear(); /* invoke passed block */if(typeof block == 'function')block.call(this,this);return this;}, // Return the fill id
	toString:function toString(){return 'url(#' + this.id() + ')';}}, // Add parent method
	construct:{marker:function marker(width,height,block){ // Create marker element in defs
	return this.defs().marker(width,height,block);}}});SVG.extend(SVG.Defs,{ // Create marker
	marker:function marker(width,height,block){ // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
	return this.put(new SVG.Marker()).size(width,height).ref(width / 2,height / 2).viewbox(0,0,width,height).attr('orient','auto').update(block);}});SVG.extend(SVG.Line,SVG.Polyline,SVG.Polygon,SVG.Path,{ // Create and attach markers
	marker:function marker(_marker,width,height,block){var attr=['marker']; // Build attribute name
	if(_marker != 'all')attr.push(_marker);attr = attr.join('-'); // Set marker attribute
	_marker = arguments[1] instanceof SVG.Marker?arguments[1]:this.doc().marker(width,height,block);return this.attr(attr,_marker);}}); // Define list of available attributes for stroke and fill
	var sugar={stroke:['color','width','opacity','linecap','linejoin','miterlimit','dasharray','dashoffset'],fill:['color','opacity','rule'],prefix:function prefix(t,a){return a == 'color'?t:t + '-' + a;}} /* Add sugar for fill and stroke */;['fill','stroke'].forEach(function(m){var i,extension={};extension[m] = function(o){if(typeof o == 'string' || SVG.Color.isRgb(o) || o && typeof o.fill === 'function')this.attr(m,o);else  /* set all attributes from sugar.fill and sugar.stroke list */for(i = sugar[m].length - 1;i >= 0;i--) if(o[sugar[m][i]] != null)this.attr(sugar.prefix(m,sugar[m][i]),o[sugar[m][i]]);return this;};SVG.extend(SVG.Element,SVG.FX,extension);});SVG.extend(SVG.Element,SVG.FX,{ // Map rotation to transform
	rotate:function rotate(d,cx,cy){return this.transform({rotation:d,cx:cx,cy:cy});}, // Map skew to transform
	skew:function skew(x,y,cx,cy){return this.transform({skewX:x,skewY:y,cx:cx,cy:cy});}, // Map scale to transform
	scale:function scale(x,y,cx,cy){return arguments.length == 1 || arguments.length == 3?this.transform({scale:x,cx:y,cy:cx}):this.transform({scaleX:x,scaleY:y,cx:cx,cy:cy});}, // Map translate to transform
	translate:function translate(x,y){return this.transform({x:x,y:y});}, // Map flip to transform
	flip:function flip(a,o){return this.transform({flip:a,offset:o});}, // Map matrix to transform
	matrix:function matrix(m){return this.attr('transform',new SVG.Matrix(m));}, // Opacity
	opacity:function opacity(value){return this.attr('opacity',value);}, // Relative move over x axis
	dx:function dx(x){return this.x((this.target || this).x() + x);}, // Relative move over y axis
	dy:function dy(y){return this.y((this.target || this).y() + y);}, // Relative move over x and y axes
	dmove:function dmove(x,y){return this.dx(x).dy(y);}});SVG.extend(SVG.Rect,SVG.Ellipse,SVG.Circle,SVG.Gradient,SVG.FX,{ // Add x and y radius
	radius:function radius(x,y){return (this.target || this).type == 'radial'?this.attr({r:new SVG.Number(x)}):this.rx(x).ry(y == null?x:y);}});SVG.extend(SVG.Path,{ // Get path length
	length:function length(){return this.node.getTotalLength();}, // Get point at length
	pointAt:function pointAt(length){return this.node.getPointAtLength(length);}});SVG.extend(SVG.Parent,SVG.Text,SVG.FX,{ // Set font 
	font:function font(o){for(var k in o) k == 'leading'?this.leading(o[k]):k == 'anchor'?this.attr('text-anchor',o[k]):k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style'?this.attr('font-' + k,o[k]):this.attr(k,o[k]);return this;}});SVG.Set = SVG.invent({ // Initialize
	create:function create(members){ // Set initial state
	Array.isArray(members)?this.members = members:this.clear();}, // Add class methods
	extend:{ // Add element to set
	add:function add(){var i,il,elements=[].slice.call(arguments);for(i = 0,il = elements.length;i < il;i++) this.members.push(elements[i]);return this;}, // Remove element from set
	remove:function remove(element){var i=this.index(element); // remove given child
	if(i > -1)this.members.splice(i,1);return this;}, // Iterate over all members
	each:function each(block){for(var i=0,il=this.members.length;i < il;i++) block.apply(this.members[i],[i,this.members]);return this;}, // Restore to defaults
	clear:function clear(){ // initialize store
	this.members = [];return this;}, // Get the length of a set
	length:function length(){return this.members.length;}, // Checks if a given element is present in set
	has:function has(element){return this.index(element) >= 0;}, // retuns index of given element in set
	index:function index(element){return this.members.indexOf(element);}, // Get member at given index
	get:function get(i){return this.members[i];}, // Get first member
	first:function first(){return this.get(0);}, // Get last member
	last:function last(){return this.get(this.members.length - 1);}, // Default value
	valueOf:function valueOf(){return this.members;}, // Get the bounding box of all members included or empty box if set has no items
	bbox:function bbox(){var box=new SVG.BBox(); // return an empty box of there are no members
	if(this.members.length == 0)return box; // get the first rbox and update the target bbox
	var rbox=this.members[0].rbox();box.x = rbox.x;box.y = rbox.y;box.width = rbox.width;box.height = rbox.height;this.each(function(){ // user rbox for correct position and visual representation
	box = box.merge(this.rbox());});return box;}}, // Add parent method
	construct:{ // Create a new set
	set:function set(members){return new SVG.Set(members);}}});SVG.FX.Set = SVG.invent({ // Initialize node
	create:function create(set){ // store reference to set
	this.set = set;}}); // Alias methods
	SVG.Set.inherit = function(){var m,methods=[]; // gather shape methods
	for(var m in SVG.Shape.prototype) if(typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')methods.push(m); // apply shape aliasses
	methods.forEach(function(method){SVG.Set.prototype[method] = function(){for(var i=0,il=this.members.length;i < il;i++) if(this.members[i] && typeof this.members[i][method] == 'function')this.members[i][method].apply(this.members[i],arguments);return method == 'animate'?this.fx || (this.fx = new SVG.FX.Set(this)):this;};}); // clear methods for the next round
	methods = []; // gather fx methods
	for(var m in SVG.FX.prototype) if(typeof SVG.FX.prototype[m] == 'function' && typeof SVG.FX.Set.prototype[m] != 'function')methods.push(m); // apply fx aliasses
	methods.forEach(function(method){SVG.FX.Set.prototype[method] = function(){for(var i=0,il=this.set.members.length;i < il;i++) this.set.members[i].fx[method].apply(this.set.members[i].fx,arguments);return this;};});}; //
	SVG.extend(SVG.Element,{ // Store data values on svg nodes
	data:function data(a,v,r){if(typeof a == 'object'){for(v in a) this.data(v,a[v]);}else if(arguments.length < 2){try{return JSON.parse(this.attr('data-' + a));}catch(e) {return this.attr('data-' + a);}}else {this.attr('data-' + a,v === null?null:r === true || typeof v === 'string' || typeof v === 'number'?v:JSON.stringify(v));}return this;}});SVG.extend(SVG.Element,{ // Remember arbitrary data
	remember:function remember(k,v){ /* remember every item in an object individually */if(typeof arguments[0] == 'object')for(var v in k) this.remember(v,k[v]); /* retrieve memory */else if(arguments.length == 1)return this.memory()[k]; /* store memory */else this.memory()[k] = v;return this;}, // Erase a given memory
	forget:function forget(){if(arguments.length == 0)this._memory = {};else for(var i=arguments.length - 1;i >= 0;i--) delete this.memory()[arguments[i]];return this;}, // Initialize or return local memory object
	memory:function memory(){return this._memory || (this._memory = {});}}); // Method for getting an element by id
	SVG.get = function(id){var node=document.getElementById(idFromReference(id) || id);if(node)return SVG.adopt(node);}; // Select elements by query string
	SVG.select = function(query,parent){return new SVG.Set(SVG.utils.map((parent || document).querySelectorAll(query),function(node){return SVG.adopt(node);}));};SVG.extend(SVG.Parent,{ // Scoped select method
	select:function select(query){return SVG.select(query,this.node);}}); // Convert dash-separated-string to camelCase
	function camelCase(s){return s.toLowerCase().replace(/-(.)/g,function(m,g){return g.toUpperCase();});} // Capitalize first letter of a string
	function capitalize(s){return s.charAt(0).toUpperCase() + s.slice(1);} // Ensure to six-based hex 
	function fullHex(hex){return hex.length == 4?['#',hex.substring(1,2),hex.substring(1,2),hex.substring(2,3),hex.substring(2,3),hex.substring(3,4),hex.substring(3,4)].join(''):hex;} // Component to hex value
	function compToHex(comp){var hex=comp.toString(16);return hex.length == 1?'0' + hex:hex;} // Calculate proportional width and height values when necessary
	function proportionalSize(box,width,height){if(height == null)height = box.height / box.width * width;else if(width == null)width = box.width / box.height * height;return {width:width,height:height};} // Delta transform point
	function deltaTransformPoint(matrix,x,y){return {x:x * matrix.a + y * matrix.c + 0,y:x * matrix.b + y * matrix.d + 0};} // Map matrix array to object
	function arrayToMatrix(a){return {a:a[0],b:a[1],c:a[2],d:a[3],e:a[4],f:a[5]};} // Parse matrix if required
	function parseMatrix(matrix){if(!(matrix instanceof SVG.Matrix))matrix = new SVG.Matrix(matrix);return matrix;} // Add centre point to transform object
	function ensureCentre(o,target){o.cx = o.cx == null?target.bbox().cx:o.cx;o.cy = o.cy == null?target.bbox().cy:o.cy;} // Convert string to matrix
	function stringToMatrix(source){ // remove matrix wrapper and split to individual numbers
	source = source.replace(SVG.regex.whitespace,'').replace(SVG.regex.matrix,'').split(','); // convert string values to floats and convert to a matrix-formatted object
	return arrayToMatrix(SVG.utils.map(source,function(n){return parseFloat(n);}));} // Calculate position according to from and to
	function at(o,pos){ // number recalculation (don't bother converting to SVG.Number for performance reasons)
	return typeof o.from == 'number'?o.from + (o.to - o.from) * pos: // instance recalculation
	o instanceof SVG.Color || o instanceof SVG.Number || o instanceof SVG.Matrix?o.at(pos): // for all other values wait until pos has reached 1 to return the final value
	pos < 1?o.from:o.to;} // PathArray Helpers
	function arrayToString(a){for(var i=0,il=a.length,s='';i < il;i++) {s += a[i][0];if(a[i][1] != null){s += a[i][1];if(a[i][2] != null){s += ' ';s += a[i][2];if(a[i][3] != null){s += ' ';s += a[i][3];s += ' ';s += a[i][4];if(a[i][5] != null){s += ' ';s += a[i][5];s += ' ';s += a[i][6];if(a[i][7] != null){s += ' ';s += a[i][7];}}}}}}return s + ' ';} // Deep new id assignment
	function assignNewId(node){ // do the same for SVG child nodes as well
	for(var i=node.childNodes.length - 1;i >= 0;i--) if(node.childNodes[i] instanceof SVGElement)assignNewId(node.childNodes[i]);return SVG.adopt(node).id(SVG.eid(node.nodeName));} // Add more bounding box properties
	function fullBox(b){if(b.x == null){b.x = 0;b.y = 0;b.width = 0;b.height = 0;}b.w = b.width;b.h = b.height;b.x2 = b.x + b.width;b.y2 = b.y + b.height;b.cx = b.x + b.width / 2;b.cy = b.y + b.height / 2;return b;} // Get id from reference string
	function idFromReference(url){var m=url.toString().match(SVG.regex.reference);if(m)return m[1];} // Create matrix array for looping
	var abcdef='abcdef'.split(''); // Add CustomEvent to IE9 and IE10 
	if(typeof CustomEvent !== 'function'){ // Code from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
	var CustomEvent=function CustomEvent(event,options){options = options || {bubbles:false,cancelable:false,detail:undefined};var e=document.createEvent('CustomEvent');e.initCustomEvent(event,options.bubbles,options.cancelable,options.detail);return e;};CustomEvent.prototype = window.Event.prototype;window.CustomEvent = CustomEvent;} // requestAnimationFrame / cancelAnimationFrame Polyfill with fallback based on Paul Irish
	(function(w){var lastTime=0;var vendors=['moz','webkit'];for(var x=0;x < vendors.length && !window.requestAnimationFrame;++x) {w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame'] || w[vendors[x] + 'CancelRequestAnimationFrame'];}w.requestAnimationFrame = w.requestAnimationFrame || function(callback){var currTime=new Date().getTime();var timeToCall=Math.max(0,16 - (currTime - lastTime));var id=w.setTimeout(function(){callback(currTime + timeToCall);},timeToCall);lastTime = currTime + timeToCall;return id;};w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;})(window);return SVG;});

/***/ },
/* 9 */
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

	exports.isBuffer = __webpack_require__(11);

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
	exports.inherits = __webpack_require__(12);

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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(10)))

/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
	};

/***/ },
/* 12 */
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