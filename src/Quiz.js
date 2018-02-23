const strokeMatches = require('./strokeMatches');
const UserStroke = require('./models/UserStroke');
const {callIfExists, counter} = require('./utils');
const quizActions = require('./quizActions');
const svg = require('./svg');
const characterActions = require('./characterActions');


const getDrawnPath = (userStroke) => ({
  pathString: svg.getPathString(userStroke.externalPoints),
  points: userStroke.points,
});


function Quiz(character, renderState, positioner) {
  this._character = character;
  this._renderState = renderState;
  this._isActive = false;
  this._positioner = positioner;
}

Quiz.prototype.startQuiz = function(options) {
  this._isActive = true;
  this._options = options;
  this._currentStrokeIndex = 0;
  this._numRecentMistakes = 0;
  this._totalMistakes = 0;
  this._drawnStrokes = [];
  this._renderState.run(quizActions.startQuiz(this._character, options.strokeFadeDuration));
};

Quiz.prototype.startUserStroke = function(externalPoint) {
  const point = this._positioner.convertExternalPoint(externalPoint);
  if (!this._isActive) return null;
  if (this._userStroke) return this.endUserStroke();
  const strokeId = counter();
  this._userStroke = new UserStroke(strokeId, point, externalPoint);
  this._renderState.run(
    quizActions.startUserStroke(strokeId, point),
  );
};

Quiz.prototype.continueUserStroke = function(externalPoint) {
  if (!this._userStroke) return;
  const point = this._positioner.convertExternalPoint(externalPoint);
  this._userStroke.appendPoint(point, externalPoint);
  const nextPoints = this._userStroke.points.slice(0);
  this._renderState.run(quizActions.updateUserStroke(this._userStroke.id, nextPoints));
};

Quiz.prototype.endUserStroke = function() {
  if (!this._userStroke) return;

  this._renderState.run(quizActions.removeUserStroke(this._userStroke.id, this._options.drawingFadeDuration));

  const currentStroke = this._getCurrentStroke();
  const isMatch = strokeMatches(this._userStroke, currentStroke);

  if (isMatch) {
    this._handleSuccess(currentStroke);
  } else {
    this._handleFailure();
    if (this._numRecentMistakes >= this._options.showHintAfterMisses) {
      this._renderState.run(
        characterActions.highlightStroke('highlight', currentStroke, this._options.strokeHighlightSpeed),
      );
    }
  }
  this._userStroke = null;
};

Quiz.prototype.cancel = function() {
  this._isActive = false;
  if (this._userStroke) {
    this._renderState.run(quizActions.removeUserStroke(this._userStroke.id, this._options.drawingFadeDuration));
  }
};

Quiz.prototype._handleSuccess = function(stroke) {
  callIfExists(this._options.onCorrectStroke, {
    character: this._character.symbol,
    strokeNum: this._currentStrokeIndex,
    mistakesOnStroke: this._numRecentMistakes,
    totalMistakes: this._totalMistakes,
    strokesRemaining: this._character.strokes.length - this._currentStrokeIndex - 1,
    drawnPath: getDrawnPath(this._userStroke),
  });
  let animation = characterActions.showStroke('main', this._currentStrokeIndex, this._options.strokeFadeDuration);
  this._currentStrokeIndex += 1;
  this._numRecentMistakes = 0;

  if (this._currentStrokeIndex === this._character.strokes.length) {
    this._isActive = false;
    callIfExists(this._options.onComplete, {
      character: this._character.symbol,
      totalMistakes: this._totalMistakes,
    });
    if (this._options.highlightOnComplete) {
      animation = animation
        .concat(characterActions.hideCharacter('highlight', this._character))
        .concat(characterActions.showCharacter('highlight', this._character, this._options.strokeHighlightDuration))
        .concat(characterActions.hideCharacter('highlight', this._character, this._options.strokeHighlightDuration));
    }
  }
  this._renderState.run(animation);
};

Quiz.prototype._handleFailure = function() {
  this._numRecentMistakes += 1;
  this._totalMistakes += 1;
  callIfExists(this._options.onMistake, {
    character: this._character.symbol,
    strokeNum: this._currentStrokeIndex,
    mistakesOnStroke: this._numRecentMistakes,
    totalMistakes: this._totalMistakes,
    strokesRemaining: this._character.strokes.length - this._currentStrokeIndex,
    drawnPath: getDrawnPath(this._userStroke),
  });
};

Quiz.prototype._getCurrentStroke = function() {
  return this._character.strokes[this._currentStrokeIndex];
};

module.exports = Quiz;
