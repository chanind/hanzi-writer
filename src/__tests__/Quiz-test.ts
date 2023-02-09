jest.mock('../strokeMatches');
jest.mock('../Positioner');

import ren from 'hanzi-writer-data/人.json';
import Quiz from '../Quiz';
import parseCharData from '../parseCharData';
import RenderState from '../RenderState';
import Positioner from '../Positioner';
import { resolvePromises } from '../testUtils';
import strokeMatches from '../strokeMatches';
import { Point } from '../typings/types';
import { colorStringToVals } from '../utils';

(Positioner as any).mockImplementation(() => ({
  convertExternalPoint: (point: Point) => ({ x: point.x + 5, y: point.y + 5 }),
}));

beforeEach(() => {
  (strokeMatches as any).mockClear();
  (Positioner as any).mockClear();
});

const char = parseCharData('人', ren);
const opts: any = {
  onLoadCharDataError: null,
  onLoadCharDataSuccess: null,
  showOutline: true,
  showCharacter: true,

  // positioning options

  width: 200,
  height: 200,
  padding: 20,

  // animation options

  strokeAnimationSpeed: 1,
  strokeFadeDuration: 400,
  strokeHighlightDuration: 200,
  strokeHighlightSpeed: 2,
  delayBetweenStrokes: 1000,
  delayBetweenLoops: 2000,

  // colors

  strokeColor: '#555',
  radicalColor: null,
  highlightColor: '#AAF',
  outlineColor: '#DDD',
  drawingColor: '#333',

  // quiz options

  leniency: 1,
  showHintAfterMisses: 3,
  highlightOnComplete: true,
  highlightCompleteColor: null,
  quizStartStrokeNum: 0,

  // undocumented obscure options

  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  outlineWidth: 2,
};

const createRenderState = (optOverrides = {}) => {
  const options = Object.assign({}, opts, optOverrides);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new RenderState(char, options, () => {});
};

describe('Quiz', () => {
  describe('startQuiz', () => {
    it('resets the quiz and makes it active', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      expect(quiz._isActive).toBe(false);

      quiz.startQuiz(Object.assign({}, opts));
      expect(quiz._isActive).toBe(true);

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.opacity).toBe(1);
      Object.keys(renderState.state.character.main.strokes).forEach((strokeNum) => {
        expect(renderState.state.character.main.strokes[strokeNum].opacity).toBe(0);
      });
    });

    it('sets all highlight stroke opacities to 0', async () => {
      const renderState = createRenderState();
      renderState.updateState({
        character: {
          highlight: {
            opacity: 0,
            strokes: {
              0: { opacity: 1 },
              1: { opacity: 1 },
            },
          },
        },
      });

      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      quiz.startQuiz(Object.assign({}, opts));
      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.highlight.opacity).toBe(1);
      Object.keys(renderState.state.character.main.strokes).forEach((strokeNum) => {
        expect(renderState.state.character.highlight.strokes[strokeNum].opacity).toBe(0);
      });
    });

    it('starts at the stroke set by quizStartStrokeNum', async () => {
      const renderState = createRenderState();
      renderState.updateState({
        character: {
          highlight: {
            opacity: 0,
            strokes: {
              0: { opacity: 1 },
              1: { opacity: 1 },
            },
          },
        },
      });

      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      quiz.startQuiz(Object.assign({}, opts, { quizStartStrokeNum: 1 }));
      expect(quiz._currentStrokeIndex).toBe(1);
      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.opacity).toBe(1);
      expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
    });

    it('respects negative numbers passed to quizStartStrokeNum', async () => {
      const renderState = createRenderState();
      renderState.updateState({
        character: {
          highlight: {
            opacity: 0,
            strokes: {
              0: { opacity: 1 },
              1: { opacity: 1 },
            },
          },
        },
      });

      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      quiz.startQuiz(Object.assign({}, opts, { quizStartStrokeNum: -1 }));
      expect(quiz._currentStrokeIndex).toBe(1);
      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.opacity).toBe(1);
      expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
    });
  });

  describe('cancel', () => {
    it('makes the quiz inactive and removes the current stroke', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      quiz.startQuiz(Object.assign({}, opts));

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 12, y: 23 });
      clock.tick(100);
      await resolvePromises();
      const currentStrokeId = quiz._userStroke!.id;

      quiz.cancel();
      await resolvePromises();

      expect(quiz._isActive).toBe(false);
      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.userStrokes![currentStrokeId]).toBe(null);
    });
  });

  describe('startUserStroke', () => {
    it('begins a stroke with the provided point', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      expect(renderState.state.userStrokes).toBe(null);
      expect(quiz._userStroke).toBe(undefined);

      quiz.startUserStroke({ x: 10, y: 20 });
      await resolvePromises();

      const userStrokeIds = Object.keys(renderState.state.userStrokes!);
      expect(userStrokeIds.length).toBe(1);
      expect(quiz._userStroke!.id.toString()).toBe(userStrokeIds[0]);
      expect(renderState.state.userStrokes![userStrokeIds[0]]!.points).toEqual([
        { x: 15, y: 25 },
      ]);
      expect(quiz._userStroke!.points).toEqual([{ x: 15, y: 25 }]);
    });

    it('ends the current user stroke if one exists', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      expect(renderState.state.userStrokes).toBe(null);
      expect(quiz._userStroke).toBe(undefined);

      quiz.startUserStroke({ x: 10, y: 20 });
      await resolvePromises();

      const currentStrokeId = quiz._userStroke!.id;

      quiz.startUserStroke({ x: 100, y: 200 });

      const userStrokeIds = Object.keys(renderState.state.userStrokes!);
      expect(userStrokeIds.length).toBe(1);
      expect(quiz._userStroke).toBeUndefined();
      expect(renderState.state.userStrokes![currentStrokeId]!.points).toEqual([
        { x: 15, y: 25 },
      ]);

      clock.tick(1000);
      await resolvePromises();

      // should fade and disappear
      expect(renderState.state.userStrokes![currentStrokeId]).toBe(null);
    });
  });

  describe('continueUserStroke', () => {
    it('adds to the current user stroke', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      expect(renderState.state.userStrokes).toBe(null);
      expect(quiz._userStroke).toBe(undefined);

      quiz.startUserStroke({ x: 10, y: 20 });
      await resolvePromises();

      const currentStrokeId = quiz._userStroke!.id;

      quiz.continueUserStroke({ x: 100, y: 200 });

      const userStrokeIds = Object.keys(renderState.state.userStrokes!);
      expect(userStrokeIds.length).toBe(1);
      expect(quiz._userStroke!.id).toBe(currentStrokeId);
      expect(renderState.state.userStrokes![currentStrokeId]!.points).toEqual([
        { x: 15, y: 25 },
        { x: 105, y: 205 },
      ]);
      expect(quiz._userStroke!.points).toEqual([
        { x: 15, y: 25 },
        { x: 105, y: 205 },
      ]);
      expect(quiz._userStroke!.externalPoints).toEqual([
        { x: 10, y: 20 },
        { x: 100, y: 200 },
      ]);
    });

    it('does nothing if there is no current stroke', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      expect(renderState.state.userStrokes).toBe(null);
      await resolvePromises();

      expect(quiz._userStroke).toBe(undefined);
      quiz.continueUserStroke({ x: 100, y: 200 });

      await resolvePromises();

      expect(quiz._userStroke).toBe(undefined);
      expect(renderState.state.userStrokes).toBe(null);
    });
  });

  describe('endUserStroke', () => {
    it('finishes the stroke and moves on if it was correct', async () => {
      (strokeMatches as any).mockImplementation(() => ({
        isMatch: true,
        meta: { isStrokeBackwards: false },
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake }));
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 100, y: 200 });

      const currentStrokeId = quiz._userStroke!.id;
      expect(quiz._currentStrokeIndex).toBe(0);
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBeUndefined();
      expect(quiz._isActive).toBe(true);
      expect(quiz._currentStrokeIndex).toBe(1);
      expect(onCorrectStroke).toHaveBeenCalledTimes(1);
      expect(onCorrectStroke).toHaveBeenCalledWith({
        character: '人',
        mistakesOnStroke: 0,
        strokeNum: 0,
        strokesRemaining: 1,
        totalMistakes: 0,
        drawnPath: {
          pathString: 'M 10 20 L 100 200',
          points: [
            { x: 15, y: 25 },
            { x: 105, y: 205 },
          ],
        },
        isBackwards: false,
      });
      expect(onMistake).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      expect(renderState.state.userStrokes![currentStrokeId]).toBe(null);
    });

    it('accepts backwards stroke when allowed', async () => {
      (strokeMatches as any).mockImplementation(() => ({
        isMatch: false,
        meta: { isStrokeBackwards: true },
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(
        Object.assign({}, opts, {
          onCorrectStroke,
          onComplete,
          onMistake,
          acceptBackwardsStrokes: true,
        }),
      );
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 100, y: 200 });
      quiz.continueUserStroke({ x: 10, y: 20 });

      const currentStrokeId = quiz._userStroke!.id;
      expect(quiz._currentStrokeIndex).toBe(0);
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBeUndefined();
      expect(quiz._isActive).toBe(true);
      expect(quiz._currentStrokeIndex).toBe(1);
      expect(onCorrectStroke).toHaveBeenCalledTimes(1);
      expect(onCorrectStroke).toHaveBeenCalledWith({
        character: '人',
        mistakesOnStroke: 0,
        strokeNum: 0,
        strokesRemaining: 1,
        totalMistakes: 0,
        drawnPath: {
          pathString: 'M 100 200 L 10 20',
          points: [
            { x: 105, y: 205 },
            { x: 15, y: 25 },
          ],
        },
        isBackwards: true,
      });
      expect(onMistake).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      expect(renderState.state.userStrokes![currentStrokeId]).toBe(null);
    });

    it('notes backwards stroke when checking', async () => {
      (strokeMatches as any).mockImplementation(() => ({
        isMatch: false,
        meta: { isStrokeBackwards: true },
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(
        Object.assign({}, opts, {
          onCorrectStroke,
          onComplete,
          onMistake,
          acceptBackwardsStrokes: false,
        }),
      );
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 100, y: 200 });
      quiz.continueUserStroke({ x: 10, y: 20 });

      const currentStrokeId = quiz._userStroke!.id;
      expect(quiz._currentStrokeIndex).toBe(0);
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBeUndefined();
      expect(quiz._isActive).toBe(true);
      expect(quiz._currentStrokeIndex).toBe(0);
      expect(onMistake).toHaveBeenCalledTimes(1);
      expect(onMistake).toHaveBeenCalledWith({
        character: '人',
        mistakesOnStroke: 1,
        strokeNum: 0,
        strokesRemaining: 2,
        totalMistakes: 1,
        drawnPath: {
          pathString: 'M 100 200 L 10 20',
          points: [
            { x: 105, y: 205 },
            { x: 15, y: 25 },
          ],
        },
        isBackwards: true,
      });
      expect(onCorrectStroke).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      expect(renderState.state.userStrokes![currentStrokeId]).toBe(null);
    });

    it('ignores single point strokes', async () => {
      (strokeMatches as any).mockImplementation(() => ({
        isMatch: false,
        meta: { isStrokeBackwards: false },
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake }));
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 10, y: 20 });
      const currentStrokeId = quiz._userStroke!.id;
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBeUndefined();
      expect(quiz._isActive).toBe(true);
      expect(quiz._currentStrokeIndex).toBe(0);
      expect(onMistake).not.toHaveBeenCalled();
      expect(onCorrectStroke).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      expect(renderState.state.userStrokes![currentStrokeId]).toBe(null);
    });

    it('stays on the stroke if it was incorrect', async () => {
      (strokeMatches as any).mockImplementation(() => ({
        isMatch: false,
        meta: { isStrokeBackwards: false },
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake }));
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 100, y: 200 });

      const currentStrokeId = quiz._userStroke!.id;
      expect(quiz._currentStrokeIndex).toBe(0);
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBeUndefined();
      expect(quiz._isActive).toBe(true);
      expect(quiz._currentStrokeIndex).toBe(0);
      expect(onMistake).toHaveBeenCalledTimes(1);
      expect(onMistake).toHaveBeenCalledWith({
        character: '人',
        mistakesOnStroke: 1,
        strokeNum: 0,
        strokesRemaining: 2,
        totalMistakes: 1,
        drawnPath: {
          pathString: 'M 10 20 L 100 200',
          points: [
            { x: 15, y: 25 },
            { x: 105, y: 205 },
          ],
        },
        isBackwards: false,
      });
      expect(onCorrectStroke).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      expect(renderState.state.userStrokes![currentStrokeId]).toBe(null);
    });

    it('highlights the stroke if the number of mistakes exceeds showHintAfterMisses', async () => {
      (strokeMatches as any).mockImplementation(() => ({
        isMatch: false,
        meta: { isStrokeBackwards: false },
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(
        Object.assign({}, opts, {
          onCorrectStroke,
          onComplete,
          onMistake,
          showHintAfterMisses: 2,
        }),
      );
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 11, y: 21 });
      quiz.endUserStroke();
      await resolvePromises();
      clock.tick(1000);
      await resolvePromises();

      // should not highlight the stroke yet
      expect(renderState.state.character.highlight.strokes[0].opacity).toBe(0);

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 11, y: 21 });
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBeUndefined();
      expect(quiz._isActive).toBe(true);
      expect(quiz._currentStrokeIndex).toBe(0);
      expect(onMistake).toHaveBeenCalledTimes(2);
      expect(onMistake).toHaveBeenLastCalledWith({
        character: '人',
        mistakesOnStroke: 2,
        strokeNum: 0,
        strokesRemaining: 2,
        totalMistakes: 2,
        drawnPath: {
          pathString: 'M 10 20 L 11 21',
          points: [
            { x: 15, y: 25 },
            { x: 16, y: 26 },
          ],
        },
        isBackwards: false,
      });
      expect(onCorrectStroke).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);

      // should highlight the stroke now
      expect(renderState.state.character.highlight.strokes[0].opacity).toBe(1);
      clock.tick(1000);
      await resolvePromises();
      expect(renderState.state.character.highlight.strokes[0].opacity).toBe(0);
    });

    it('marks the stroke as correct if the number of mistakes exceeds markStrokeCorrectAfterMisses', async () => {
      (strokeMatches as any).mockImplementation(() => ({
        isMatch: false,
        meta: { isStrokeBackwards: false },
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(
        Object.assign({}, opts, {
          onCorrectStroke,
          onComplete,
          onMistake,
          markStrokeCorrectAfterMisses: 2,
        }),
      );
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 11, y: 21 });
      quiz.endUserStroke();
      await resolvePromises();
      clock.tick(1000);
      await resolvePromises();

      // should not draw the stroke yet
      expect(quiz._currentStrokeIndex).toBe(0);
      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 11, y: 21 });
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBeUndefined();
      expect(quiz._isActive).toBe(true);
      expect(quiz._currentStrokeIndex).toBe(1);
      expect(onMistake).toHaveBeenCalledTimes(1);
      expect(onMistake).toHaveBeenLastCalledWith({
        character: '人',
        mistakesOnStroke: 1,
        strokeNum: 0,
        strokesRemaining: 2,
        totalMistakes: 1,
        drawnPath: {
          pathString: 'M 10 20 L 11 21',
          points: [
            { x: 15, y: 25 },
            { x: 16, y: 26 },
          ],
        },
        isBackwards: false,
      });
      expect(onCorrectStroke).toHaveBeenCalledTimes(1);
      expect(onCorrectStroke).toHaveBeenLastCalledWith({
        character: '人',
        mistakesOnStroke: 1,
        strokeNum: 0,
        strokesRemaining: 1,
        totalMistakes: 1,
        drawnPath: {
          pathString: 'M 10 20 L 11 21',
          points: [
            { x: 15, y: 25 },
            { x: 16, y: 26 },
          ],
        },
        isBackwards: false,
      });

      clock.tick(1000);
      await resolvePromises();

      // should draw the stroke now
      clock.tick(1000);
      await resolvePromises();
      expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
    });

    it('does not highlight strokes if showHintAfterMisses is set to false', async () => {
      (strokeMatches as any).mockImplementation(() => ({
        isMatch: false,
        meta: { isStrokeBackwards: false },
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(
        Object.assign({}, opts, {
          onCorrectStroke,
          onComplete,
          onMistake,
          showHintAfterMisses: false,
        }),
      );
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 11, y: 21 });
      quiz.endUserStroke();
      await resolvePromises();
      clock.tick(1000);
      await resolvePromises();
      // Stroke shouldn't be highlighted
      expect(renderState.state.character.highlight.strokes[0].opacity).toBe(0);
    });

    it('finishes the quiz when all strokes are successful', async () => {
      (strokeMatches as any).mockImplementation(() => ({
        isMatch: true,
        meta: { isStrokeBackwards: false },
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(
        Object.assign({}, opts, {
          onCorrectStroke,
          onComplete,
          onMistake,
          highlightOnComplete: true,
          highlightCompleteColor: '#0F0',
        }),
      );
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 11, y: 21 });
      quiz.endUserStroke();
      await resolvePromises();
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 11, y: 21 });
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBeUndefined();
      expect(quiz._isActive).toBe(false);
      expect(onCorrectStroke).toHaveBeenCalledTimes(2);
      expect(onCorrectStroke).toHaveBeenLastCalledWith({
        character: '人',
        mistakesOnStroke: 0,
        strokeNum: 1,
        strokesRemaining: 0,
        totalMistakes: 0,
        drawnPath: {
          pathString: 'M 10 20 L 11 21',
          points: [
            { x: 15, y: 25 },
            { x: 16, y: 26 },
          ],
        },
        isBackwards: false,
      });
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenLastCalledWith({
        character: '人',
        totalMistakes: 0,
      });
      expect(onMistake).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(1);

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.options.highlightColor).toEqual(colorStringToVals('#0F0'));
      expect(renderState.state.character.highlight.opacity).toBe(1);
      clock.tick(1000);
      await resolvePromises();
      expect(renderState.state.character.highlight.opacity).toBe(0);
    });

    it('rounds drawn path data', async () => {
      (strokeMatches as any).mockImplementation(() => ({
        isMatch: true,
        meta: { isStrokeBackwards: false },
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(
        char,
        renderState,
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const onCorrectStroke = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke }));
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 10.93234, y: 20.4567978 });
      quiz.continueUserStroke({ x: 11.87, y: 23.4444 });
      quiz.endUserStroke();

      await resolvePromises();
      expect(onCorrectStroke).toHaveBeenCalledTimes(1);
      expect(onCorrectStroke).toHaveBeenLastCalledWith({
        character: '人',
        mistakesOnStroke: 0,
        strokeNum: 0,
        strokesRemaining: 1,
        totalMistakes: 0,
        drawnPath: {
          pathString: 'M 10.9 20.5 L 11.9 23.4',
          points: [
            { x: 15.9, y: 25.5 },
            { x: 16.9, y: 28.4 },
          ],
        },
        isBackwards: false,
      });
    });
  });

  describe('setPositioner', () => {
    it('replaces the internal positioner', () => {
      const quiz = new Quiz(
        char,
        createRenderState(),
        new Positioner({ padding: 20, width: 200, height: 200 }),
      );
      const newPositoner = new Positioner({ padding: 30, width: 300, height: 300 });
      quiz.setPositioner(newPositoner);
      expect(quiz._positioner).toBe(newPositoner);
    });
  });

  it('doesnt leave strokes partially drawn if the users finishes the quiz really fast', async () => {
    (strokeMatches as any).mockImplementation(() => ({
      isMatch: true,
      meta: { isStrokeBackwards: false },
    }));
    const renderState = createRenderState();
    const quiz = new Quiz(
      char,
      renderState,
      new Positioner({ padding: 20, width: 200, height: 200 }),
    );

    quiz.startQuiz(Object.assign({}, opts));
    clock.tick(1000);
    await resolvePromises();

    quiz.startUserStroke({ x: 10, y: 20 });
    quiz.continueUserStroke({ x: 11, y: 23 });
    quiz.endUserStroke();
    clock.tick(100);
    await resolvePromises();

    quiz.startUserStroke({ x: 10, y: 20 });
    quiz.continueUserStroke({ x: 11, y: 23 });
    quiz.endUserStroke();
    clock.tick(100);
    await resolvePromises();

    clock.tick(1000);
    await resolvePromises();

    expect(renderState.state.character.main.opacity).toBe(1);
    expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
    expect(renderState.state.character.main.strokes[1].opacity).toBe(1);
  });

  it('sets up character opacities correctly if the users starts drawing during char fading', async () => {
    (strokeMatches as any).mockImplementation(() => ({
      isMatch: true,
      meta: { isStrokeBackwards: false },
    }));
    const renderState = createRenderState();
    const quiz = new Quiz(
      char,
      renderState,
      new Positioner({ padding: 20, width: 200, height: 200 }),
    );

    quiz.startQuiz(Object.assign({}, opts));
    clock.tick(20);
    await resolvePromises();

    quiz.startUserStroke({ x: 10, y: 20 });
    quiz.continueUserStroke({ x: 12, y: 23 });
    quiz.endUserStroke();
    clock.tick(100);
    await resolvePromises();
    clock.tick(1000);
    await resolvePromises();

    expect(renderState.state.character.main.opacity).toBe(1);
    expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
    expect(renderState.state.character.main.strokes[1].opacity).toBe(0);

    expect(renderState.state.character.highlight.opacity).toBe(1);
    expect(renderState.state.character.highlight.strokes[0].opacity).toBe(0);
    expect(renderState.state.character.highlight.strokes[1].opacity).toBe(0);
  });
});
