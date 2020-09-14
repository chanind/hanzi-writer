import strokeMatches from "./strokeMatches";
import UserStroke from "./models/UserStroke";
import Positioner from "./Positioner";
import { counter } from "./utils";
import * as quizActions from "./quizActions";
import * as geometry from "./geometry";
import * as characterActions from "./characterActions";
import Character from "./models/Character";
import { HanziWriterOptions, Point } from "./typings/types";
import RenderState from "./RenderState";

const getDrawnPath = (userStroke: UserStroke) => ({
  pathString: geometry.getPathString(userStroke.externalPoints),
  points: userStroke.points.map((point) => geometry.round(point)),
});

type StrokeData = {
  character: string;
  drawnPath: {
    pathString: string;
    points: Point[];
  };
  strokeNum: number;
  mistakesOnStroke: number;
  totalMistakes: number;
  strokesRemaining: number;
};

export type QuizOptions = {
  /** Default: 1. This can be set to make stroke grading more or less lenient. The closer this is to 0 the more strictly the quiz is graded. */
  leniency: number;
  /** Highlights the correct stroke after a set number of incorrect attempts. Setting `false` disables entirely. Default: 3 */
  showHintAfterMisses: number | false;
  /** After a quiz is completed successfully it will flash briefly. Default: true */
  highlightOnComplete: boolean;
  highlightCompleteColor: string | null;
  onMistake?: (strokeData: StrokeData) => void;
  onCorrectStroke?: (strokeData: StrokeData) => void;
  onComplete?: (summary: { character: string; totalMistakes: number }) => void;
};

export default class Quiz {
  _character: Character;
  _renderState: RenderState;
  _isActive: boolean;
  _positioner: Positioner;

  /** Set on startQuiz */
  _options: HanziWriterOptions | undefined;
  _currentStrokeIndex: number = 0;
  _numRecentMistakes: number = 0;
  _totalMistakes: number = 0;
  _userStroke: UserStroke | undefined;

  constructor(character: Character, renderState: RenderState, positioner: Positioner) {
    this._character = character;
    this._renderState = renderState;
    this._isActive = false;
    this._positioner = positioner;
  }

  get numRecentMistakes() {
    return this._numRecentMistakes || 0;
  }

  startQuiz(options: HanziWriterOptions) {
    this._isActive = true;
    this._options = options;
    this._currentStrokeIndex = 0;
    this._numRecentMistakes = 0;
    this._totalMistakes = 0;

    return this._renderState
      .run(quizActions.startQuiz(this._character, options.strokeFadeDuration))
      .then((res) => {});
  }

  startUserStroke(externalPoint: Point) {
    const point = this._positioner.convertExternalPoint(externalPoint);
    if (!this._isActive) {
      return null;
    }
    if (this._userStroke) {
      return this.endUserStroke();
    }
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

  endUserStroke() {
    if (!this._userStroke) {
      return Promise.resolve();
    }

    const promises = [
      this._renderState.run(
        quizActions.removeUserStroke(
          this._userStroke.id,
          this._options!.drawingFadeDuration ?? 300,
        ),
      ),
    ];

    // skip single-point strokes
    if (this._userStroke.points.length === 1) {
      this._userStroke = undefined;
      return Promise.all(promises);
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
      promises.push(this._handleSuccess());
    } else {
      this._handleFailure();
      if (
        this._options!.showHintAfterMisses !== false &&
        this.numRecentMistakes >= Number(this._options!.showHintAfterMisses)
      ) {
        promises.push(
          this._renderState.run(
            characterActions.highlightStroke(
              currentStroke,
              this._options!.highlightColor,
              this._options!.strokeHighlightSpeed,
            ),
          ),
        );
      }
    }

    this._userStroke = undefined;

    return Promise.all(promises);
  }

  cancel() {
    this._isActive = false;
    if (this._userStroke) {
      return this._renderState.run(
        quizActions.removeUserStroke(
          this._userStroke.id,
          this._options!.drawingFadeDuration,
        ),
      );
    }
    return Promise.resolve();
  }

  _handleSuccess() {
    this._options!.onCorrectStroke?.({
      character: this._character.symbol,
      strokeNum: this._currentStrokeIndex,
      mistakesOnStroke: this._numRecentMistakes,
      totalMistakes: this._totalMistakes,
      strokesRemaining: this._character.strokes.length - this._currentStrokeIndex! - 1,
      drawnPath: getDrawnPath(this._userStroke!),
    });
    let animation = characterActions.showStroke(
      "main",
      this._currentStrokeIndex,
      this._options!.strokeFadeDuration ?? 300,
    );
    this._currentStrokeIndex! += 1;
    this._numRecentMistakes = 0;

    if (this._currentStrokeIndex === this._character.strokes.length) {
      this._isActive = false;
      this._options!.onComplete?.({
        character: this._character.symbol,
        totalMistakes: this._totalMistakes,
      });
      if (this._options!.highlightOnComplete) {
        animation = [
          ...animation,
          ...quizActions.highlightCompleteChar(
            this._character,
            this._options!.highlightCompleteColor,
            (this._options!.strokeHighlightDuration || 0) * 2,
          ),
        ];
      }
    }
    return this._renderState.run(animation);
  }

  _handleFailure() {
    this._numRecentMistakes! += 1;
    this._totalMistakes! += 1;
    this._options!.onMistake?.({
      character: this._character.symbol,
      strokeNum: this._currentStrokeIndex,
      mistakesOnStroke: this._numRecentMistakes,
      totalMistakes: this._totalMistakes,
      strokesRemaining: this._character.strokes.length - this._currentStrokeIndex,
      drawnPath: getDrawnPath(this._userStroke!),
    });
  }

  _getCurrentStroke() {
    return this._character.strokes[this._currentStrokeIndex];
  }
}
