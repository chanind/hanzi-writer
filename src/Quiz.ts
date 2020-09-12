// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'strokeMatc... Remove this comment to see the full error message
const strokeMatches = require('./strokeMatches');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserStroke... Remove this comment to see the full error message
const UserStroke = require('./models/UserStroke');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callIfExis... Remove this comment to see the full error message
const {callIfExists, counter} = require('./utils');
const quizActions = require('./quizActions');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'geometry'.
const geometry = require('./geometry');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'characterA... Remove this comment to see the full error message
const characterActions = require('./characterActions');


const getDrawnPath = (userStroke: any) => ({
  pathString: geometry.getPathString(userStroke.externalPoints),
  points: userStroke.points.map((point: any) => geometry.round(point))
});


// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Quiz'.
function Quiz(character: any, renderState: any, positioner: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._character = character;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._renderState = renderState;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._isActive = false;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._positioner = positioner;
}

Quiz.prototype.startQuiz = function(options: any) {
  this._isActive = true;
  this._options = options;
  this._currentStrokeIndex = 0;
  this._numRecentMistakes = 0;
  this._totalMistakes = 0;
  this._drawnStrokes = [];
  this._renderState.run(quizActions.startQuiz(this._character, options.strokeFadeDuration));
};

Quiz.prototype.startUserStroke = function(externalPoint: any) {
  const point = this._positioner.convertExternalPoint(externalPoint);
  if (!this._isActive) return null;
  if (this._userStroke) return this.endUserStroke();
  const strokeId = counter();
  this._userStroke = new UserStroke(strokeId, point, externalPoint);
  this._renderState.run(
    quizActions.startUserStroke(strokeId, point),
  );
};

Quiz.prototype.continueUserStroke = function(externalPoint: any) {
  if (!this._userStroke) return;
  const point = this._positioner.convertExternalPoint(externalPoint);
  this._userStroke.appendPoint(point, externalPoint);
  const nextPoints = this._userStroke.points.slice(0);
  this._renderState.run(quizActions.updateUserStroke(this._userStroke.id, nextPoints));
};

Quiz.prototype.endUserStroke = function() {
  if (!this._userStroke) return;

  this._renderState.run(quizActions.removeUserStroke(this._userStroke.id, this._options.drawingFadeDuration));
  // skip single-point strokes
  if (this._userStroke.points.length === 1) {
    this._userStroke = null;
    return;
  }

  const currentStroke = this._getCurrentStroke();
  const isOutlineVisible = this._renderState.state.character.outline.opacity > 0;
  const isMatch = strokeMatches(this._userStroke, this._character, this._currentStrokeIndex, {
    isOutlineVisible,
    leniency: this._options.leniency,
  });

  if (isMatch) {
    this._handleSuccess(currentStroke);
  } else {
    this._handleFailure();
    if (this._numRecentMistakes >= this._options.showHintAfterMisses) {
      this._renderState.run(
        quizActions.highlightStroke(currentStroke, this._options.highlightColor, this._options.strokeHighlightSpeed),
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

Quiz.prototype._handleSuccess = function(stroke: any) {
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
      animation = animation.concat(quizActions.highlightCompleteChar(
        this._character,
        this._options.highlightCompleteColor,
        this._options.strokeHighlightDuration * 2,
      ));
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
