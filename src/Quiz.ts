import strokeMatches, { StrokeMatchResultMeta } from './strokeMatches';
import UserStroke from './models/UserStroke';
import Positioner from './Positioner';
import { counter, colorStringToVals, fixIndex } from './utils';
import * as quizActions from './quizActions';
import * as geometry from './geometry';
import * as characterActions from './characterActions';
import Character from './models/Character';
import { ParsedHanziWriterOptions, Point, StrokeData } from './typings/types';
import RenderState from './RenderState';
import { GenericMutation } from './Mutation';

const getDrawnPath = (userStroke: UserStroke) => ({
  pathString: geometry.getPathString(userStroke.externalPoints),
  points: userStroke.points.map((point) => geometry.round(point)),
});

export default class Quiz {
  // Armazena o resultado de cada traço desenhado
  _strokeResults: Array<{ match: boolean; isBackwards: boolean; averageDistance: number | null }> = [];
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
    this._userStrokesIds = []

    this._strokeResults = [];

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

  endUserStroke() {
    if (!this._userStroke) return;

    // Se keepUserStrokesVisible estiver ativado, não ocultar o traço do usuário
    if (!this._options?.keepUserStrokesVisible) {
      this._renderState.run(
        quizActions.hideUserStroke(
          this._userStroke.id,
          this._options!.drawingFadeDuration ?? 300,
        ),
      );
    }

    // skip single-point strokes
    if (this._userStroke.points.length === 1) {
      this._userStroke = undefined;
      return;
    }

    const { acceptBackwardsStrokes, markStrokeCorrectAfterMisses } = this._options!;

    const currentStroke = this._getCurrentStroke();
    const matchResult = strokeMatches(
      this._userStroke,
      this._character,
      this._currentStrokeIndex,
      {
        isOutlineVisible: this._renderState.state.character.outline.opacity > 0,
        leniency: this._options!.leniency,
        averageDistanceThreshold: this._options!.averageDistanceThreshold,
      },
    );
    const { isMatch, meta, avgDist } = matchResult as any;

    // Armazena resultado do traço
    this._strokeResults[this._currentStrokeIndex] = {
      match: isMatch,
      isBackwards: meta.isStrokeBackwards,
      averageDistance: typeof avgDist === 'number' ? avgDist : null,
    };

    // if markStrokeCorrectAfterMisses is passed, just force the stroke to count as correct after n tries
    const isForceAccepted =
      markStrokeCorrectAfterMisses &&
      this._mistakesOnStroke + 1 >= markStrokeCorrectAfterMisses;

    const isAccepted =
      isMatch || isForceAccepted || (meta.isStrokeBackwards && acceptBackwardsStrokes);

    if (isAccepted) {
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
    // Se keepUserStrokesVisible estiver ativado, não remover os traços do usuário
    if (this._userStrokesIds && !this._options?.keepUserStrokesVisible) {
      this._renderState.run(
        quizActions.removeAllUserStrokes( this._userStrokesIds ),
      );
    }
  }

  _getStrokeData({
    isCorrect,
    meta,
  }: {
    isCorrect: boolean;
    meta: StrokeMatchResultMeta;
  }): StrokeData {
    return {
      character: this._character.symbol,
      strokeNum: this._currentStrokeIndex,
      mistakesOnStroke: this._mistakesOnStroke,
      totalMistakes: this._totalMistakes,
      strokesRemaining:
        this._character.strokes.length - this._currentStrokeIndex - (isCorrect ? 1 : 0),
      drawnPath: getDrawnPath(this._userStroke!),
      isBackwards: meta.isStrokeBackwards,
    };
  }

  nextStroke() {
    if (!this._options) return;

    const { strokes, symbol } = this._character;

    const {
      onComplete,
      highlightOnComplete,
      strokeFadeDuration,
      highlightCompleteColor,
      highlightColor,
      strokeHighlightDuration,
      keepUserStrokesVisible,
    } = this._options;

    let animation: GenericMutation[] = [];
    // Se keepUserStrokesVisible, não mostrar traço padrão durante o quiz
    if (!keepUserStrokesVisible) {
      animation = characterActions.showStroke(
        'main',
        this._currentStrokeIndex,
        strokeFadeDuration,
      );
    }

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
            colorStringToVals(highlightCompleteColor || highlightColor),
            (strokeHighlightDuration || 0) * 2,
          ),
        );
      }
      // Se keepUserStrokesVisible, garantir que todos os traços do usuário fiquem visíveis e mudar a cor
      if (keepUserStrokesVisible && this._userStrokesIds) {
        // Não alterar cor ou opacidade dos traços do usuário ao finalizar. Só mostrar tudo quando apertar o botão.
        // Não mostrar os traços corretos padrão automaticamente. Só pelo botão.
      }
    }

    this._renderState.run(animation);
  }

  // Método público para mostrar traços corretos e calcular nota
  showCorrectStrokesAndScore() {
    // Mostrar traços corretos padrão
    this._renderState.run(
      characterActions.showCharacter('main', this._character, this._options?.strokeFadeDuration || 400)
    );

    // Calcular nota
    const totalStrokes = this._character.strokes.length;
    let sumPercent = 0;
    for (let i = 0; i < totalStrokes; i++) {
      const result = this._strokeResults[i];
      if (!result) {
        // traço não desenhado
        sumPercent += 0;
        continue;
      }
      if (result.isBackwards || !result.match) {
        sumPercent += 0;
        continue;
      }
      // Se acertou, calcula proximidade (quanto menor a distância, maior o percentual)
      let percent = 100;
      if (result.averageDistance !== null && this._options?.averageDistanceThreshold) {
        percent = Math.max(0, 100 - (result.averageDistance / this._options.averageDistanceThreshold) * 100);
      }
      sumPercent += percent;
    }
    const finalScore = Math.round(sumPercent / totalStrokes);

    // Exibir nota dentro da div 'target', no canto inferior direito
    const scoreDivId = 'hanzi-writer-score';
    const targetDiv = document.getElementById('target');
    if (!targetDiv) return;
    let scoreDiv = targetDiv.querySelector('#' + scoreDivId) as HTMLElement | null;
    if (!scoreDiv) {
      scoreDiv = document.createElement('div') as HTMLElement;
      scoreDiv.id = scoreDivId;
      scoreDiv.style.position = 'absolute';
      scoreDiv.style.right = '8px';
      scoreDiv.style.bottom = '8px';
      scoreDiv.style.background = 'rgba(0,0,0,0.5)';
      scoreDiv.style.color = '#fff';
      scoreDiv.style.padding = '4px 10px';
      scoreDiv.style.borderRadius = '6px';
      scoreDiv.style.fontSize = '14px';
      scoreDiv.style.zIndex = '10';
      scoreDiv.style.pointerEvents = 'none';
      scoreDiv.style.opacity = '0.85';
      scoreDiv.style.userSelect = 'none';
      targetDiv.style.position = 'relative';
      targetDiv.appendChild(scoreDiv);
    }
    scoreDiv.textContent = `${finalScore}%`;
  }

  _handleSuccess(meta: StrokeMatchResultMeta) {
    if (!this._options) return;

    const { onCorrectStroke } = this._options;

    onCorrectStroke?.({
      ...this._getStrokeData({ isCorrect: true, meta }),
    });

    this.nextStroke();
  }

  _handleFailure(meta: StrokeMatchResultMeta) {
    this._mistakesOnStroke += 1;
    this._totalMistakes += 1;
    this._options!.onMistake?.(this._getStrokeData({ isCorrect: false, meta }));
  }

  _getCurrentStroke() {
    return this._character.strokes[this._currentStrokeIndex];
  }
}
