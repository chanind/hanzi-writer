jest.mock('../StrokeMatcher');
jest.mock('../Positioner');

const ren = require('hanzi-writer-data/人.json');
const Quiz = require('../Quiz');
const Point = require('../models/Point');
const CharDataParser = require('../CharDataParser');
const RenderState = require('../RenderState');
const Positioner = require('../Positioner');
const { resolvePromises } = require('../testUtils');
const StrokeMatcher = require('../StrokeMatcher');


Positioner.mockImplementation(() => ({
  convertExternalPoint: (point) => new Point(point.x + 5, point.y + 5),
}));


beforeEach(() => {
  StrokeMatcher.mockClear();
  Positioner.mockClear();
});


const char = new CharDataParser().generateCharacter('人', ren);
const opts = {
  onLoadCharDataError: null,
  onLoadCharDataSuccess: null,
  showOutline: true,
  showCharacter: true,

  // positioning options

  width: null,
  height: null,
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

  showHintAfterMisses: 3,
  highlightOnComplete: true,

  // undocumented obscure options

  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  outlineWidth: 2,
};

const createRenderState = () => new RenderState(char, opts, () => {});


describe('Quiz', () => {
  describe('startQuiz', () => {
    it('resets the quiz and makes it active', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      expect(quiz._isActive).toBe(false);

      quiz.startQuiz(Object.assign({}, opts));
      expect(quiz._isActive).toBe(true);

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.opacity).toBe(1);
      Object.keys(renderState.state.character.main.strokes).forEach(strokeNum => {
        expect(renderState.state.character.main.strokes[strokeNum].opacity).toBe(0);
      });
    });
  });

  describe('startUserStroke', () => {
    it('begins a stroke with the provided point', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      expect(renderState.state.userStrokes).toBe(null);
      expect(quiz._userStroke).toBe(undefined);

      quiz.startUserStroke(new Point(10, 20));
      await resolvePromises();

      const userStrokeIds = Object.keys(renderState.state.userStrokes);
      expect(userStrokeIds.length).toBe(1);
      expect(quiz._userStroke.id.toString()).toBe(userStrokeIds[0]);
      expect(renderState.state.userStrokes[userStrokeIds[0]].points).toEqual([new Point(15, 25)]);
      expect(quiz._userStroke.points).toEqual([new Point(15, 25)]);
    });

    it('ends the current user stroke if one exists', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      expect(renderState.state.userStrokes).toBe(null);
      expect(quiz._userStroke).toBe(undefined);

      quiz.startUserStroke(new Point(10, 20));
      await resolvePromises();

      const currentStrokeId = quiz._userStroke.id;

      quiz.startUserStroke(new Point(100, 200));

      const userStrokeIds = Object.keys(renderState.state.userStrokes);
      expect(userStrokeIds.length).toBe(1);
      expect(quiz._userStroke).toBe(null);
      expect(renderState.state.userStrokes[currentStrokeId].points).toEqual([new Point(15, 25)]);

      clock.tick(1000);
      await resolvePromises();

      // should fade and disappear
      expect(renderState.state.userStrokes[currentStrokeId]).toBe(null);
    });
  });

  describe('continueUserStroke', () => {
    it('adds to the current user stroke', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      expect(renderState.state.userStrokes).toBe(null);
      expect(quiz._userStroke).toBe(undefined);

      quiz.startUserStroke(new Point(10, 20));
      await resolvePromises();

      const currentStrokeId = quiz._userStroke.id;

      quiz.continueUserStroke(new Point(100, 200));

      const userStrokeIds = Object.keys(renderState.state.userStrokes);
      expect(userStrokeIds.length).toBe(1);
      expect(quiz._userStroke.id).toBe(currentStrokeId);
      expect(renderState.state.userStrokes[currentStrokeId].points).toEqual([
        new Point(15, 25),
        new Point(105, 205),
      ]);
      expect(quiz._userStroke.points).toEqual([
        new Point(15, 25),
        new Point(105, 205),
      ]);
      expect(quiz._userStroke.externalPoints).toEqual([
        new Point(10, 20),
        new Point(100, 200),
      ]);
    });

    it('does nothing if there is no current stroke', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      expect(renderState.state.userStrokes).toBe(null);
      await resolvePromises();

      expect(quiz._userStroke).toBe(undefined);
      quiz.continueUserStroke(new Point(100, 200));

      await resolvePromises();

      expect(quiz._userStroke).toBe(undefined);
      expect(renderState.state.userStrokes).toBe(null);
    });
  });

  describe('endUserStroke', () => {
    it('finishes the stroke and moves on if it was correct', async () => {
      StrokeMatcher.mockImplementationOnce(() => ({
        strokeMatches: () => true,
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake }));
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke(new Point(10, 20));
      quiz.continueUserStroke(new Point(100, 200));

      const currentStrokeId = quiz._userStroke.id;
      expect(quiz._currentStrokeIndex).toBe(0);
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBe(null);
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
          points: [{x: 15, y: 25}, {x: 105, y: 205}],
        },
      });
      expect(onMistake).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      expect(renderState.state.userStrokes[currentStrokeId]).toBe(null);
    });

    it('stays on the stroke if it was incorrect', async () => {
      StrokeMatcher.mockImplementationOnce(() => ({
        strokeMatches: () => false,
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake }));
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke(new Point(10, 20));
      quiz.continueUserStroke(new Point(100, 200));

      const currentStrokeId = quiz._userStroke.id;
      expect(quiz._currentStrokeIndex).toBe(0);
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBe(null);
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
          points: [{x: 15, y: 25}, {x: 105, y: 205}],
        },
      });
      expect(onCorrectStroke).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      expect(renderState.state.userStrokes[currentStrokeId]).toBe(null);
    });

    it('highlights the stroke if the number of mistakes exceeds showHintAfterMisses', async () => {
      StrokeMatcher.mockImplementationOnce(() => ({
        strokeMatches: () => false,
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake, showHintAfterMisses: 2 }));
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke(new Point(10, 20));
      quiz.endUserStroke();
      await resolvePromises();
      clock.tick(1000);
      await resolvePromises();

      // should not highlight the stroke yet
      expect(renderState.state.character.highlight.strokes[0].opacity).toBe(0);

      quiz.startUserStroke(new Point(10, 20));
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBe(null);
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
          pathString: 'M 10 20',
          points: [{x: 15, y: 25}],
        },
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

    it('finishes the quiz when all strokes are successful', async () => {
      StrokeMatcher.mockImplementationOnce(() => ({
        strokeMatches: () => true,
      }));

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake, highlightOnComplete: true }));
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke(new Point(10, 20));
      quiz.endUserStroke();
      await resolvePromises();
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke(new Point(10, 20));
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBe(null);
      expect(quiz._isActive).toBe(false);
      expect(onCorrectStroke).toHaveBeenCalledTimes(2);
      expect(onCorrectStroke).toHaveBeenLastCalledWith({
        character: '人',
        mistakesOnStroke: 0,
        strokeNum: 1,
        strokesRemaining: 0,
        totalMistakes: 0,
        drawnPath: {
          pathString: 'M 10 20',
          points: [{x: 15, y: 25}],
        },
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

      // highlights the character at the end
      expect(renderState.state.character.highlight.opacity).toBe(1);
      clock.tick(1000);
      await resolvePromises();
      expect(renderState.state.character.highlight.opacity).toBe(0);
    });
  });
});
