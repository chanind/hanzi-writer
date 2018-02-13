const StrokeMatcher = require('./StrokeMatcher');
const {callIfExists} = require('./utils');
const quizActions = require('./quizActions');
const characterActions = require('./characterActions');


let userStrokeIdCounter = 1;


function QuizManager(character, stateManager) {
  this._character = character;
  this._stateManager = stateManager;
  this._strokeMatcher = new StrokeMatcher();
}

QuizManager.prototype.startQuiz = function(options) {
  this._options = options;
  this.cancelQuiz();
  this._stateManager.runMutationChain(
    quizActions.startQuiz(this._character, options.strokeFadeDuration),
    { scope: 'quiz' },
  );
};

QuizManager.prototype.cancelQuiz = function() {
  this._stateManager.cancelMutations('character.highlight');
  this._stateManager.cancelMutations('character.main');
  this._stateManager.runMutationChain(
    quizActions.cancelQuiz(),
    { scope: 'quiz' },
  );
};

QuizManager.prototype.startUserStroke = function(point) {
  if (!this._stateManager.state.quiz.isActive) return null;
  if (this._stateManager.state.quiz.activeUserStrokeId) return this.endUserStroke();
  userStrokeIdCounter += 1;
  const userStrokeId = userStrokeIdCounter;
  this._stateManager.runMutationChain(
    quizActions.startUserStroke(userStrokeId, point),
    { scope: `quiz.userStrokes.${userStrokeId}` },
  );
};

QuizManager.prototype.continueUserStroke = function(point) {
  const activeUserStrokeId = this._stateManager.state.quiz.activeUserStrokeId;
  if (!activeUserStrokeId) return;
  const updatedUserStrokePoints = this._stateManager.state.quiz.userStrokes[activeUserStrokeId].points.slice(0);
  updatedUserStrokePoints.push(point);
  this._stateManager.runMutationChain(
    quizActions.updateUserStroke(activeUserStrokeId, updatedUserStrokePoints),
    { scope: `quiz.userStrokes.${activeUserStrokeId}` },
  );
};

QuizManager.prototype.endUserStroke = function() {
  const activeUserStrokeId = this._stateManager.state.quiz.activeUserStrokeId;
  if (!activeUserStrokeId) return;

  const stroke = this._character.getStroke(this._stateManager.state.quiz.currentStroke);
  const userStrokePoints = this._stateManager.state.quiz.userStrokes[activeUserStrokeId].points;
  const isMatch = this._strokeMatcher.strokeMatches(userStrokePoints, stroke);

  if (isMatch) {
    this._handleSuccess();
  } else {
    this._handleFailure(stroke);
  }
};

QuizManager.prototype.cancel = function() {
  this._isActive = false;
};

QuizManager.prototype._handleSuccess = function() {
  const strokeNum = this._stateManager.state.quiz.currentStroke;
  callIfExists(this._options.onCorrectStroke, {
    character: this._character.symbol,
    strokeNum,
    mistakesOnStroke: this._stateManager.state.quiz.strokes[strokeNum].mistakes,
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

  this._stateManager.runMutationChain(
    quizActions.nextStroke(strokeNum + 1, isDone),
    { scope: 'quiz' },
  );
  this._stateManager.runMutationChain(animation, {
    scope: `character.main.strokes.${strokeNum}`,
    ensureComplete: true,
  });
};

QuizManager.prototype._handleFailure = function(stroke) {
  const strokeNum = this._stateManager.state.quiz.currentStroke;
  const numMistakes = this._stateManager.state.quiz.strokes[strokeNum].mistakes + 1;
  this._stateManager.runMutationChain(
    quizActions.strokeMistake(strokeNum, numMistakes),
    { scope: 'quiz' },
  );
  callIfExists(this._options.onMistake, {
    character: this._character.symbol,
    strokeNum,
    mistakesOnStroke: numMistakes,
    totalMistakes: this._getTotalMistakes(),
    strokesRemaining: this._character.getNumStrokes() - strokeNum,
  });

  if (numMistakes >= this._options.showHintAfterMisses) {
    this._stateManager.runMutationChain(
      characterActions.highlightStroke('highlight', stroke, this._options.strokeHighlightSpeed),
      { scope: `character.highlight.strokes.${strokeNum}`, ensureComplete: true },
    );
  }
};

QuizManager.prototype._getTotalMistakes = function() {
  let total = 0;
  Object.keys(this._stateManager.state.quiz.strokes).forEach(key => {
    total += this._stateManager.state.quiz.strokes[key].mistakes;
  });
  return total;
};

// hide the caracter
QuizManager.prototype._setupCharacter = function() {
  this._animator.animate(animation => this._characterRenderer.hide(animation));
};

module.exports = QuizManager;
