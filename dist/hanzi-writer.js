(function() {
  var Stroke;

  window.HanziWriter = (function() {
    HanziWriter.prototype.options = {
      charDataLoader: function(char) {
        return hanziData[char];
      },
      strokeAttrs: {
        fill: '#EEE'
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
      this.animate();
    }

    HanziWriter.prototype.setCharacter = function(char) {
      var pathString, pathStrings;
      pathStrings = this.options.charDataLoader(char);
      return this.strokes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pathStrings.length; _i < _len; _i++) {
          pathString = pathStrings[_i];
          _results.push(new Stroke(pathString, this.options.strokeAttrs));
        }
        return _results;
      }).call(this);
    };

    HanziWriter.prototype.draw = function() {
      var stroke, _i, _len, _ref, _results;
      _ref = this.strokes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stroke = _ref[_i];
        _results.push(stroke.draw(this.svg));
      }
      return _results;
    };

    HanziWriter.prototype.animate = function() {
      return this.animateStroke(0);
    };

    HanziWriter.prototype.animateStroke = function(strokeNum) {
      var stroke;
      stroke = this.strokes[strokeNum];
      return stroke.animate(this.svg, (function(_this) {
        return function() {
          if (strokeNum < _this.strokes.length - 1) {
            return _this.animateStroke(strokeNum + 1);
          }
        };
      })(this));
    };

    return HanziWriter;

  })();

  Stroke = (function() {
    Stroke.HORIZONTAL_STROKE = 1;

    Stroke.BACK_SLASH_STROKE = 2;

    Stroke.VERTICAL_STROKE = 3;

    Stroke.FORWARD_SLASH_STROKE = 4;

    function Stroke(zdtPathData, attrs) {
      var metadataString, pathString, pointString, _ref;
      this.attrs = attrs != null ? attrs : {};
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
    }

    Stroke.prototype.getPathString = function() {
      var pathString, point, remainingPoints, start, _i, _len;
      start = this.points[0];
      remainingPoints = this.points.slice(1);
      pathString = "M " + start[0] + " " + start[1];
      for (_i = 0, _len = remainingPoints.length; _i < _len; _i++) {
        point = remainingPoints[_i];
        pathString += " L " + point[0] + " " + point[1];
      }
      pathString += " z";
      return pathString;
    };

    Stroke.prototype.parsePoint = function(pointString) {
      var point, _i, _len, _ref, _results;
      _ref = pointString.split(',');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        _results.push(parseInt(point));
      }
      return _results;
    };

    Stroke.prototype.drawPath = function(svg) {
      return svg.path(this.getPathString(), this.attrs);
    };

    Stroke.prototype.getStrokeAnimationStartingPoint = function() {
      var maxX, maxY, midX, midY, minX, minY, _ref, _ref1;
      _ref = this.getExtremes(this.getAllYs()), maxY = _ref[0], midY = _ref[1], minY = _ref[2];
      _ref1 = this.getExtremes(this.getAllXs()), maxX = _ref1[0], midX = _ref1[1], minX = _ref1[2];
      switch (this.strokeType) {
        case Stroke.HORIZONTAL_STROKE:
          return [minX, midY];
        case Stroke.BACK_SLASH_STROKE:
          return [minX, minY];
        case Stroke.VERTICAL_STROKE:
          return [midX, minY];
        case Stroke.FORWARD_SLASH_STROKE:
          return [maxX, minY];
      }
    };

    Stroke.prototype.getStrokeAnimationEndingPoint = function() {
      var maxX, maxY, midX, midY, minX, minY, _ref, _ref1;
      _ref = this.getExtremes(this.getAllYs()), maxY = _ref[0], midY = _ref[1], minY = _ref[2];
      _ref1 = this.getExtremes(this.getAllXs()), maxX = _ref1[0], midX = _ref1[1], minX = _ref1[2];
      switch (this.strokeType) {
        case Stroke.HORIZONTAL_STROKE:
          return [maxX, midY];
        case Stroke.BACK_SLASH_STROKE:
          return [maxX, maxY];
        case Stroke.VERTICAL_STROKE:
          return [midX, maxY];
        case Stroke.FORWARD_SLASH_STROKE:
          return [minX, maxY];
      }
    };

    Stroke.prototype.getExtremes = function(numArray) {
      var max, mid, min;
      max = Math.max.apply(null, numArray);
      min = Math.min.apply(null, numArray);
      mid = (max + min) / 2;
      return [max, mid, min];
    };

    Stroke.prototype.getAllXs = function() {
      var point, _i, _len, _ref, _results;
      _ref = this.points;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        _results.push(point[0]);
      }
      return _results;
    };

    Stroke.prototype.getAllYs = function() {
      var point, _i, _len, _ref, _results;
      _ref = this.points;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        _results.push(point[1]);
      }
      return _results;
    };

    Stroke.prototype.getStrokeAnimationDistance = function() {
      var end, start;
      start = this.getStrokeAnimationStartingPoint();
      end = this.getStrokeAnimationEndingPoint();
      return Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
    };

    Stroke.prototype.draw = function(svg) {
      return this.drawPath(svg);
    };

    Stroke.prototype.animate = function(svg, onComplete) {
      var mask, start, stroke;
      if (onComplete == null) {
        onComplete = function() {};
      }
      start = this.getStrokeAnimationStartingPoint();
      mask = svg.circle(0).center(start[0], start[1]);
      stroke = this.drawPath(svg).clipWith(mask);
      return mask.animate().radius(this.getStrokeAnimationDistance()).center(start[0], start[1]).after(onComplete);
    };

    return Stroke;

  })();

}).call(this);
