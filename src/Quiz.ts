import strokeMatches, { StrokeMatchResultMeta } from './strokeMatches';
import UserStroke from './models/UserStroke';
import Positioner from './Positioner';
import { counter, colorStringToVals, fixIndex } from './utils';
import * as quizActions from './quizActions';
import * as geometry from './geometry';
import * as characterActions from './characterActions';
import Character from './models/Character';
import { 
  ParsedHanziWriterOptions, 
  Point, 
  StrokeData,
  StrokeScore,
  StructureScore,
  WritingScore,
  ScoreOptions,
} from './typings/types';
import RenderState from './RenderState';
import { GenericMutation } from './Mutation';
import {
  scoreStroke,
  calculateStructureScore,
  calculateOverallScore,
} from './scoring';

const getDrawnPath = (userStroke: UserStroke) => ({
  pathString: geometry.getPathString(userStroke.externalPoints),
  points: userStroke.points.map((point) => geometry.round(point)),
});

export type ExtendedStrokeData = StrokeData & {
  score?: StrokeScore;
};

export type QuizCompleteData = {
  character: string;
  totalMistakes: number;
  writingScore?: WritingScore;
};

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
  _userStrokesIds: Array<number> | undefined;

  _strokeScores: StrokeScore[] = [];
  _userStrokesData: { points: Point[] }[] = [];
  _lastUserStroke: UserStroke | undefined;

  constructor(character: Character, renderState: RenderState, positioner: Positioner) {
    this._character = character;
    this._renderState = renderState;
    this._isActive = false;
    this._positioner = positioner;
  }

  startQuiz(options: ParsedHanziWriterOptions) {
    if (this._userStrokesIds) {
      this._renderState.run(
        quizActions.removeAllUserStrokes( this._userStrokesIds ),
      );
    }
    this._userStrokesIds = [];
    this._strokeScores = [];
    this._userStrokesData = [];
    this._lastUserStroke = undefined;

    this._isActive = true;
    this._options = options;
    const startIndex = fixIndex(
      options.quizStartStrokeNum,
      this._character.strokes.length,
    );
    this._currentStrokeIndex = Math.min(startIndex, this._character.strokes.length - 1);
    this._mistakesOnStroke = 0;
    this._totalMistakes = 0;

    return this._renderState.run(
      quizActions.startQuiz(
        this._character,
        options.strokeFadeDuration,
        this._currentStrokeIndex,
      ),
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
    this._userStrokesIds?.push(strokeId)
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

  _calculateStrokeScore(
    userStroke: UserStroke,
    isBackwards: boolean
  ): StrokeScore | undefined {
    const options = this._options;
    if (!options || !options.scoreOptions?.enableScoring) {
      return undefined;
    }

    const currentStroke = this._getCurrentStroke();
    const scoreOptions = options.scoreOptions;

    const strokeScore = scoreStroke(
      userStroke,
      currentStroke,
      this._currentStrokeIndex,
      {
        leniency: options.leniency,
        weightShape: scoreOptions.weightShape,
        weightDirection: scoreOptions.weightDirection,
        weightPosition: scoreOptions.weightPosition,
      },
    );

    return strokeScore;
  }

  endUserStroke() {
    if (!this._userStroke) return;

    this._lastUserStroke = this._userStroke;

    this._renderState.run(
      quizActions.hideUserStroke(
        this._userStroke.id,
        this._options!.drawingFadeDuration ?? 300,
      ),
    );

    // skip single-point strokes
    if (this._userStroke.points.length === 1) {
      this._userStroke = undefined;
      return;
    }

    const { acceptBackwardsStrokes, markStrokeCorrectAfterMisses } = this._options!;

    const currentStroke = this._getCurrentStroke();
    const { isMatch, meta } = strokeMatches(
      this._userStroke,
      this._character,
      this._currentStrokeIndex,
      {
        isOutlineVisible: this._renderState.state.character.outline.opacity > 0,
        leniency: this._options!.leniency,
        averageDistanceThreshold: this._options!.averageDistanceThreshold,
      },
    );

    // if markStrokeCorrectAfterMisses is passed, just force the stroke to count as correct after n tries
    const isForceAccepted =
      markStrokeCorrectAfterMisses &&
      this._mistakesOnStroke + 1 >= markStrokeCorrectAfterMisses;

    const isAccepted =
      isMatch || isForceAccepted || (meta.isStrokeBackwards && acceptBackwardsStrokes);

    if (isAccepted) {
      this._userStrokesData.push({
        points: [...this._userStroke.points],
      });
      this._handleSuccess(meta);
    } else {
      this._handleFailure(meta);

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
    if (this._userStrokesIds) {
      this._renderState.run(
        quizActions.removeAllUserStrokes( this._userStrokesIds ),
      );
    }
  }

  _getExtendedStrokeData({
    isCorrect,
    meta,
    strokeScore,
  }: {
    isCorrect: boolean;
    meta: StrokeMatchResultMeta;
    strokeScore?: StrokeScore;
  }): ExtendedStrokeData {
    const baseData: StrokeData = {
      character: this._character.symbol,
      strokeNum: this._currentStrokeIndex,
      mistakesOnStroke: this._mistakesOnStroke,
      totalMistakes: this._totalMistakes,
      strokesRemaining:
        this._character.strokes.length - this._currentStrokeIndex - (isCorrect ? 1 : 0),
      drawnPath: this._userStroke ? getDrawnPath(this._userStroke) : { pathString: '', points: [] },
      isBackwards: meta.isStrokeBackwards,
    };

    return {
      ...baseData,
      score: strokeScore,
    };
  }

  calculateWritingScore(): WritingScore | undefined {
    const options = this._options;
    if (!options || !options.scoreOptions?.enableScoring) {
      return undefined;
    }

    const scoreOptions = options.scoreOptions;
    const structureScore = calculateStructureScore(
      this._character,
      this._strokeScores,
      this._userStrokesData,
    );

    const writingScore = calculateOverallScore(
      this._character,
      this._strokeScores,
      structureScore,
      scoreOptions,
    );

    return writingScore;
  }

  getCurrentScores(): {
    strokeScores: StrokeScore[];
    writingScore?: WritingScore;
  } {
    return {
      strokeScores: [...this._strokeScores],
      writingScore: this.calculateWritingScore(),
    };
  }

  nextStroke() {
    if (!this._options) return;

    const { strokes, symbol } = this._character;

    const {
      onComplete,
      onScoreUpdate,
      highlightOnComplete,
      strokeFadeDuration,
      highlightCompleteColor,
      highlightColor,
      strokeHighlightDuration,
      scoreOptions,
    } = this._options;

    let animation: GenericMutation[] = characterActions.showStroke(
      'main',
      this._currentStrokeIndex,
      strokeFadeDuration,
    );

    this._mistakesOnStroke = 0;
    this._currentStrokeIndex += 1;

    const isComplete = this._currentStrokeIndex === strokes.length;

    if (isComplete) {
      this._isActive = false;

      const writingScore = this.calculateWritingScore();

      if (onComplete) {
        const completeData: QuizCompleteData = {
          character: symbol,
          totalMistakes: this._totalMistakes,
          writingScore,
        };
        onComplete(completeData as any);
      }

      if (onScoreUpdate && writingScore) {
        onScoreUpdate(writingScore);
      }

      if (highlightOnComplete) {
        animation = animation.concat(
          quizActions.highlightCompleteChar(
            this._character,
            colorStringToVals(highlightCompleteColor || highlightColor),
            (strokeHighlightDuration || 0) * 2,
          ),
        );
      }
    }

    this._renderState.run(animation);
  }

  _handleSuccess(meta: StrokeMatchResultMeta) {
    if (!this._options) return;

    const { onCorrectStroke, onScoreUpdate, scoreOptions } = this._options;

    let strokeScore: StrokeScore | undefined;
    
    if (this._lastUserStroke && scoreOptions?.enableScoring) {
      strokeScore = this._calculateStrokeScore(this._lastUserStroke, meta.isStrokeBackwards);
      
      if (strokeScore) {
        this._strokeScores.push(strokeScore);

        if (onScoreUpdate) {
          const partialScore = calculateStructureScore(
            this._character,
            this._strokeScores,
            this._userStrokesData,
          );
        }
      }
    }

    onCorrectStroke?.({
      ...this._getExtendedStrokeData({ isCorrect: true, meta, strokeScore }),
    } as any);

    this.nextStroke();
  }

  _handleFailure(meta: StrokeMatchResultMeta) {
    this._mistakesOnStroke += 1;
    this._totalMistakes += 1;

    let strokeScore: StrokeScore | undefined;
    
    if (this._lastUserStroke && this._options?.scoreOptions?.enableScoring) {
      strokeScore = this._calculateStrokeScore(this._lastUserStroke, meta.isStrokeBackwards);
      
      if (strokeScore) {
        strokeScore.correct = false;
      }
    }

    this._options!.onMistake?.(
      this._getExtendedStrokeData({ isCorrect: false, meta, strokeScore }) as any
    );
  }

  _getCurrentStroke() {
    return this._character.strokes[this._currentStrokeIndex];
  }
}
