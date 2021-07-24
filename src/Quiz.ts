import strokeMatches from './strokeMatches';
import UserStroke from './models/UserStroke';
import Positioner from './Positioner';
import { counter, colorStringToVals } from './utils';
import * as quizActions from './quizActions';
import * as geometry from './geometry';
import * as characterActions from './characterActions';
import Character from './models/Character';
import { ParsedHanziWriterOptions, Point, StrokeData } from './typings/types';
import RenderState from './RenderState';
import { MutationChain } from './Mutation';

const getDrawnPath = (userStroke: UserStroke) => ({
  pathString: geometry.getPathString(userStroke.externalPoints),
  points: userStroke.points.map((point) => geometry.round(point)),
});

export default class Quiz {
  _character: Character;
  _renderState: RenderState;
  _isActive: boolean;
  _positioner: Positioner;

  /** Set on startQuiz */
  _options: ParsedHanziWriterOptions | undefined;
  _currentStrokeIndex = 0;
  _mistakesOnStroke = 0;
  _totalMistakes = 0;
  _userStroke: UserStroke | undefined;

  constructor(character: Character, renderState: RenderState, positioner: Positioner) {
    this._character = character;
    this._renderState = renderState;
    this._isActive = false;
    this._positioner = positioner;
  }

  startQuiz(options: ParsedHanziWriterOptions) {
    this._isActive = true;
    this._options = options;
    this._currentStrokeIndex = 0;
    this._mistakesOnStroke = 0;
    this._totalMistakes = 0;

    return this._renderState.run(
      quizActions.startQuiz(this._character, options.strokeFadeDuration),
    );
  }

  startUserStroke(externalPoint: Point) {
    if (!this._isActive) {
      return null;
    }
    if (this._userStroke) {
      return this.endUserStroke();
    }
    const point = this._positioner.convertExternalPoint(externalPoint);
    const strokeId = counter();
    this._userStroke = new UserStroke(strokeId, point, externalPoint);
    return this._renderState.run(quizActions.startUserStroke(strokeId, point));
  }

  continueUserStroke(externalPoint: Point) {
    if (!this._userStroke) {
      return Promise.resolve();
    }
    const point = this._positioner.convertExternalPoint(externalPoint);
    this._userStroke.appendPoint(point, externalPoint);
    const nextPoints = this._userStroke.points.slice(0);
    return this._renderState.run(
      quizActions.updateUserStroke(this._userStroke.id, nextPoints),
    );
  }

  setPositioner(positioner: Positioner) {
    this._positioner = positioner;
  }

  endUserStroke() {
    if (!this._userStroke) return;

    this._renderState.run(
      quizActions.removeUserStroke(
        this._userStroke.id,
        this._options!.drawingFadeDuration ?? 300,
      ),
    );

    // skip single-point strokes
    if (this._userStroke.points.length === 1) {
      this._userStroke = undefined;
      return;
    }

    const currentStroke = this._getCurrentStroke();
    const isMatch = strokeMatches(
      this._userStroke,
      this._character,
      this._currentStrokeIndex,
      {
        isOutlineVisible: this._renderState.state.character.outline.opacity > 0,
        leniency: this._options!.leniency,
      },
    );

    if (isMatch) {
      this._handleSuccess();
    } else {
      this._handleFailure();

      const {
        showHintAfterMisses,
        highlightColor,
        strokeHighlightSpeed,
      } = this._options!;

      if (
        showHintAfterMisses !== false &&
        this._mistakesOnStroke >= showHintAfterMisses
      ) {
        this._renderState.run(
          characterActions.highlightStroke(
            currentStroke,
            colorStringToVals(highlightColor),
            strokeHighlightSpeed,
          ),
        );
      }
    }

    this._userStroke = undefined;
  }

  cancel() {
    this._isActive = false;
    if (this._userStroke) {
      this._renderState.run(
        quizActions.removeUserStroke(
          this._userStroke.id,
          this._options!.drawingFadeDuration,
        ),
      );
    }
  }

  _getStrokeData(isCorrect = false): StrokeData {
    return {
      character: this._character.symbol,
      strokeNum: this._currentStrokeIndex,
      mistakesOnStroke: this._mistakesOnStroke,
      totalMistakes: this._totalMistakes,
      strokesRemaining:
        this._character.strokes.length - this._currentStrokeIndex - (isCorrect ? 1 : 0),
      drawnPath: getDrawnPath(this._userStroke!),
    };
  }

  _handleSuccess() {
    if (!this._options) return;

    const { strokes, symbol } = this._character;

    const {
      onCorrectStroke,
      onComplete,
      highlightOnComplete,
      strokeFadeDuration,
      strokeHighlightDuration,
    } = this._options;

    onCorrectStroke?.(this._getStrokeData(true));

    let animation: MutationChain = characterActions.showStroke(
      'main',
      this._currentStrokeIndex,
      strokeFadeDuration,
    );

    this._mistakesOnStroke = 0;
    this._currentStrokeIndex += 1;

    const isComplete = this._currentStrokeIndex === strokes.length;

    if (isComplete) {
      this._isActive = false;
      onComplete?.({
        character: symbol,
        totalMistakes: this._totalMistakes,
      });
      if (highlightOnComplete) {
        animation = animation.concat(
          quizActions.highlightCompleteChar(
            this._character,
            (strokeHighlightDuration || 0) * 2,
          ),
        );
      }
    }

    this._renderState.run(animation);
  }

  _handleFailure() {
    this._mistakesOnStroke += 1;
    this._totalMistakes += 1;
    this._options!.onMistake?.(this._getStrokeData());
  }

  _getCurrentStroke() {
    return this._character.strokes[this._currentStrokeIndex];
  }
}
