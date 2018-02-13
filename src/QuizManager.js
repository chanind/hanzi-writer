const StrokeMatcher = require('./StrokeMatcher');
const {callIfExists, counter} = require('./utils');
const quizActions = require('./quizActions');
const characterActions = require('./characterActions');


function QuizManager(character, stateManager) {
  this._character = character;
  this._stateManager = stateManager;
  this._strokeMatcher = new StrokeMatcher();
}

QuizManager.prototype.startQuiz = function(options) {
  this._options = options;
  this.cancelQuiz();
  this._stateManager.run(quizActions.startQuiz(this._character, options.strokeFadeDuration));
};

QuizManager.prototype._getState = function() {
  return this._stateManager.state;
};

QuizManager.prototype.cancelQuiz = function() {
  this._stateManager.cancelMutations(['character.highlight']);
  this._stateManager.cancelMutations(['character.main']);
  this._stateManager.run(quizActions.cancelQuiz());
};

QuizManager.prototype.startUserStroke = function(point) {
  if (!this._getState().quiz.isActive) return null;
  if (this._getState().quiz.activeUserStrokeId) return this.endUserStroke();
  const userStrokeId = counter();
  this._stateManager.run(
    quizActions.startUserStroke(userStrokeId, point),
  );
};

QuizManager.prototype.continueUserStroke = function(point) {
  const activeUserStrokeId = this._getState().quiz.activeUserStrokeId;
  if (!activeUserStrokeId) return;
  const updatedUserStrokePoints = this._getState().userStrokes[activeUserStrokeId].points.slice(0);
  updatedUserStrokePoints.push(point);
  this._stateManager.run(
    quizActions.updateUserStroke(activeUserStrokeId, updatedUserStrokePoints),
  );
};

QuizManager.prototype.endUserStroke = function() {
  const activeUserStrokeId = this._getState().quiz.activeUserStrokeId;
  if (!activeUserStrokeId) return;

  const stroke = this._character.getStroke(this._getState().quiz.currentStroke);
  const userStrokePoints = this._getState().userStrokes[activeUserStrokeId].points;
  const isMatch = this._strokeMatcher.strokeMatches(userStrokePoints, stroke);

  if (isMatch) {
    this._handleSuccess();
  } else {
    this._handleFailure(stroke);
  }

  this._stateManager.run(
    quizActions.removeUserStroke(activeUserStrokeId, this._options.drawingFadeDuration),
  );
};

QuizManager.prototype._handleSuccess = function() {
  const strokeNum = this._getState().quiz.currentStroke;
  callIfExists(this._options.onCorrectStroke, {
    character: this._character.symbol,
    strokeNum,
    mistakesOnStroke: this._getState().quiz.strokes[strokeNum].mistakes,
    totalMistakes: this._getTotalMistakes(),
    strokesRemaining: this._character.getNumStrokes() - strokeNum - 1,
  });


  let animation = characterActions.showStroke('main', strokeNum, this._options.strokeFadeDuration);
  const isDone = strokeNum === this._character.getNumStrokes() - 1;

  if (isDone) {
    callIfExists(this._options.onComplete, {
      character: this._character.symbol,
      totalMistakes: this._getTotalMistakes(),
    });

    if (this._options.highlightOnComplete) {
      animation = animation
        .concat(characterActions.hideCharacter('highlight', this._character))
        .concat(characterActions.showCharacter('highlight', this._character, this._options.strokeHighlightDuration))
        .concat(characterActions.hideCharacter('highlight', this._character, this._options.strokeHighlightDuration));
    }
  }

  this._stateManager.run(quizActions.nextStroke(strokeNum + 1, isDone));
  this._stateManager.run(animation, { force: true });
};

QuizManager.prototype._handleFailure = function(stroke) {
  const strokeNum = this._getState().quiz.currentStroke;
  const numMistakes = this._getState().quiz.strokes[strokeNum].mistakes + 1;
  this._stateManager.run(quizActions.strokeMistake(strokeNum, numMistakes));
  callIfExists(this._options.onMistake, {
    character: this._character.symbol,
    strokeNum,
    mistakesOnStroke: numMistakes,
    totalMistakes: this._getTotalMistakes(),
    strokesRemaining: this._character.getNumStrokes() - strokeNum,
  });

  if (numMistakes >= this._options.showHintAfterMisses) {
    this._stateManager.run(
      characterActions.highlightStroke('highlight', stroke, this._options.strokeHighlightSpeed),
      { force: true },
    );
  }
};

QuizManager.prototype._getTotalMistakes = function() {
  let total = 0;
  Object.keys(this._getState().quiz.strokes).forEach(key => {
    total += this._getState().quiz.strokes[key].mistakes;
  });
  return total;
};

// hide the caracter
QuizManager.prototype._setupCharacter = function() {
  this._animator.animate(animation => this._characterRenderer.hide(animation));
};

module.exports = QuizManager;
