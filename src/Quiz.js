const StrokeMatcher = require('./StrokeMatcher');
const UserStroke = require('./models/UserStroke');
const UserStrokeRenderer = require('./renderers/UserStrokeRenderer');
const {callIfExists} = require('./utils');


// TODO: too many dependencies... do something about this
function Quiz({canvas, animator, character, characterRenderer, highlightRenderer, quizOptions, userStrokeOptions}) {
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

Quiz.prototype.startUserStroke = function(point) {
  if (!this._isActive) return null;
  if (this._userStroke) return this.endUserStroke();
  this._userStroke = new UserStroke(point);
  this._userStrokeRenderer = new UserStrokeRenderer(this._userStroke, this._userStrokeOptions);
  this._userStrokeRenderer.setCanvas(this._canvas).draw();
};

Quiz.prototype.continueUserStroke = function(point) {
  if (!this._userStroke) return;
  this._userStroke.appendPoint(point);
  this._userStrokeRenderer.updatePath();
};

Quiz.prototype.endUserStroke = function() {
  if (!this._userStroke) return Promise.resolve();

  this._animator.animate((animation) => {
    if (!this._isActive) return Promise.resolve();
    const promises = [];
    const nextStroke = this._getNextStroke();
    const isMatch = this._strokeMatcher.strokeMatches(this._userStroke, nextStroke);
    promises.push(this._userStrokeRenderer.fadeAndRemove(animation));
    this._userStroke = null;
    this._userStrokeRenderer = null;

    if (isMatch) {
      promises.push(this._handleSuccess(nextStroke, animation));
    } else {
      this._handleFailure();
      if (this._numRecentMistakes >= this._quizOptions.showHintAfterMisses) {
        promises.push(this._highlightCorrectStroke(animation));
      }
    }
    return Promise.all(promises);
  });
};

Quiz.prototype.cancel = function() {
  this._isActive = false;
};

Quiz.prototype._handleSuccess = function(stroke, animation) {
  callIfExists(this._quizOptions.onCorrectStroke, {
    character: this._character.symbol,
    strokeNum: this._currentStrokeIndex,
    mistakesOnStroke: this._numRecentMistakes,
    totalMistakes: this._totalMistakes,
    strokesRemaining: this._character.getNumStrokes() - this._currentStrokeIndex - 1,
  });
  this._currentStrokeIndex += 1;
  this._numRecentMistakes = 0;
  let promise = this._drawMatchingStroke(stroke, animation);
  if (this._currentStrokeIndex === this._character.getNumStrokes()) {
    this._isActive = false;
    callIfExists(this._quizOptions.onComplete, {
      character: this._character.symbol,
      totalMistakes: this._totalMistakes,
    });
    if (this._quizOptions.highlightOnComplete) {
      promise = promise.then(() => this._highlightRenderer.flash(animation));
    }
  }
  return promise;
};

Quiz.prototype._handleFailure = function() {
  this._numRecentMistakes += 1;
  this._totalMistakes += 1;
  callIfExists(this._quizOptions.onMistake, {
    character: this._character.symbol,
    strokeNum: this._currentStrokeIndex,
    mistakesOnStroke: this._numRecentMistakes,
    totalMistakes: this._totalMistakes,
    strokesRemaining: this._character.getNumStrokes() - this._currentStrokeIndex,
  });
};

Quiz.prototype._highlightCorrectStroke = function(animation) {
  const strokeHintRenderer = this._highlightRenderer.getStrokeRenderer(this._currentStrokeIndex);
  return strokeHintRenderer.highlight(animation);
};

Quiz.prototype._drawMatchingStroke = function(stroke, animation) {
  this._drawnStrokes.push(stroke);
  return this._characterRenderer.showStroke(stroke.strokeNum, animation);
};

Quiz.prototype._getNextStroke = function() {
  return this._character.getStroke(this._currentStrokeIndex);
};

// hide the caracter
Quiz.prototype._setupCharacter = function() {
  this._animator.animate(animation => this._characterRenderer.hide(animation));
};

module.exports = Quiz;
