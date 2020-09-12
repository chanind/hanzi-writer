// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('../strokeMatches');
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
jest.mock('../Positioner');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ren'.
const ren = require('hanzi-writer-data/人.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Quiz'.
const Quiz = require('../Quiz');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseCharD... Remove this comment to see the full error message
const parseCharData = require('../parseCharData');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RenderStat... Remove this comment to see the full error message
const RenderState = require('../RenderState');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Positioner... Remove this comment to see the full error message
const Positioner = require('../Positioner');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'resolvePro... Remove this comment to see the full error message
const { resolvePromises } = require('../testUtils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'strokeMatc... Remove this comment to see the full error message
const strokeMatches = require('../strokeMatches');


Positioner.mockImplementation(() => ({
  convertExternalPoint: (point: any) => ({
    x: point.x + 5,
    y: point.y + 5
  }),
}));


// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
beforeEach(() => {
  strokeMatches.mockClear();
  Positioner.mockClear();
});


// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'char'.
const char = parseCharData('人', ren);
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'opts'.
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
  highlightCompleteColor: null,

  // undocumented obscure options

  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  outlineWidth: 2,
};

const createRenderState = (optOverrides = {}) => {
  const options = Object.assign({}, opts, optOverrides);
  return new RenderState(char, options, () => {});
};


// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Quiz', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('startQuiz', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('resets the quiz and makes it active', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._isActive).toBe(false);

      quiz.startQuiz(Object.assign({}, opts));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._isActive).toBe(true);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.opacity).toBe(1);
      Object.keys(renderState.state.character.main.strokes).forEach(strokeNum => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(renderState.state.character.main.strokes[strokeNum].opacity).toBe(0);
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz(Object.assign({}, opts));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.highlight.opacity).toBe(1);
      Object.keys(renderState.state.character.main.strokes).forEach(strokeNum => {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
        expect(renderState.state.character.highlight.strokes[strokeNum].opacity).toBe(0);
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('cancel', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('makes the quiz inactive and removes the current stroke', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz(Object.assign({}, opts));

      quiz.startUserStroke({x: 10, y: 20});
      quiz.continueUserStroke({x: 12, y: 23});
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(100);
      await resolvePromises();
      const currentStrokeId = quiz._userStroke.id;

      quiz.cancel();
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._isActive).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes[currentStrokeId]).toBe(null);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('startUserStroke', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('begins a stroke with the provided point', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes).toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(undefined);

      quiz.startUserStroke({x: 10, y: 20});
      await resolvePromises();

      const userStrokeIds = Object.keys(renderState.state.userStrokes);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(userStrokeIds.length).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke.id.toString()).toBe(userStrokeIds[0]);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes[userStrokeIds[0]].points).toEqual([{x: 15, y: 25}]);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke.points).toEqual([{x: 15, y: 25}]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ends the current user stroke if one exists', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes).toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(undefined);

      quiz.startUserStroke({x: 10, y: 20});
      await resolvePromises();

      const currentStrokeId = quiz._userStroke.id;

      quiz.startUserStroke({x: 100, y: 200});

      const userStrokeIds = Object.keys(renderState.state.userStrokes);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(userStrokeIds.length).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes[currentStrokeId].points).toEqual([{x: 15, y: 25}]);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // should fade and disappear
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes[currentStrokeId]).toBe(null);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('continueUserStroke', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('adds to the current user stroke', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes).toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(undefined);

      quiz.startUserStroke({x: 10, y: 20});
      await resolvePromises();

      const currentStrokeId = quiz._userStroke.id;

      quiz.continueUserStroke({x: 100, y: 200});

      const userStrokeIds = Object.keys(renderState.state.userStrokes);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(userStrokeIds.length).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke.id).toBe(currentStrokeId);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes[currentStrokeId].points).toEqual([
        {x: 15, y: 25},
        {x: 105, y: 205},
      ]);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke.points).toEqual([
        {x: 15, y: 25},
        {x: 105, y: 205},
      ]);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke.externalPoints).toEqual([
        {x: 10, y: 20},
        {x: 100, y: 200},
      ]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does nothing if there is no current stroke', async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz(Object.assign({}, opts));

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes).toBe(null);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(undefined);
      quiz.continueUserStroke({x: 100, y: 200});

      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(undefined);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes).toBe(null);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('endUserStroke', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('finishes the stroke and moves on if it was correct', async () => {
      strokeMatches.mockImplementation(() => true);

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onCorrectStroke = jest.fn();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onMistake = jest.fn();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake }));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({x: 10, y: 20});
      quiz.continueUserStroke({x: 100, y: 200});

      const currentStrokeId = quiz._userStroke.id;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._currentStrokeIndex).toBe(0);
      quiz.endUserStroke();
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._isActive).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._currentStrokeIndex).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCorrectStroke).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
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
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onMistake).not.toHaveBeenCalled();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).not.toHaveBeenCalled();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes[currentStrokeId]).toBe(null);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores single point strokes', async () => {
      strokeMatches.mockImplementation(() => false);

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onCorrectStroke = jest.fn();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onMistake = jest.fn();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake }));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({x: 10, y: 20});
      const currentStrokeId = quiz._userStroke.id;
      quiz.endUserStroke();
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._isActive).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._currentStrokeIndex).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onMistake).not.toHaveBeenCalled();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCorrectStroke).not.toHaveBeenCalled();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).not.toHaveBeenCalled();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes[currentStrokeId]).toBe(null);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('stays on the stroke if it was incorrect', async () => {
      strokeMatches.mockImplementation(() => false);

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onCorrectStroke = jest.fn();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onMistake = jest.fn();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake }));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({x: 10, y: 20});
      quiz.continueUserStroke({x: 100, y: 200});

      const currentStrokeId = quiz._userStroke.id;
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._currentStrokeIndex).toBe(0);
      quiz.endUserStroke();
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._isActive).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._currentStrokeIndex).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onMistake).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
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
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCorrectStroke).not.toHaveBeenCalled();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).not.toHaveBeenCalled();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.userStrokes[currentStrokeId]).toBe(null);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('highlights the stroke if the number of mistakes exceeds showHintAfterMisses', async () => {
      strokeMatches.mockImplementation(() => false);

      const renderState = createRenderState();
      // should reset this color before highlighting
      renderState.state.character.highlight.strokeColor = '#00F';
      const quiz = new Quiz(char, renderState, new Positioner());
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onCorrectStroke = jest.fn();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onMistake = jest.fn();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke, onComplete, onMistake, showHintAfterMisses: 2 }));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({x: 10, y: 20});
      quiz.continueUserStroke({x: 11, y: 21});
      quiz.endUserStroke();
      await resolvePromises();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // should not highlight the stroke yet
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.highlight.strokes[0].opacity).toBe(0);

      quiz.startUserStroke({x: 10, y: 20});
      quiz.continueUserStroke({x: 11, y: 21});
      quiz.endUserStroke();
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._isActive).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._currentStrokeIndex).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onMistake).toHaveBeenCalledTimes(2);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onMistake).toHaveBeenLastCalledWith({
        character: '人',
        mistakesOnStroke: 2,
        strokeNum: 0,
        strokesRemaining: 2,
        totalMistakes: 2,
        drawnPath: {
          pathString: 'M 10 20 L 11 21',
          points: [{x: 15, y: 25}, {x: 16, y: 26}],
        },
      });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCorrectStroke).not.toHaveBeenCalled();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).not.toHaveBeenCalled();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);

      // should highlight the stroke now
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.highlight.strokeColor).toBe('#AAF');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.highlight.strokes[0].opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.highlight.strokes[0].opacity).toBe(0);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('finishes the quiz when all strokes are successful', async () => {
      strokeMatches.mockImplementation(() => true);

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onCorrectStroke = jest.fn();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onMistake = jest.fn();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onComplete = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, {
        onCorrectStroke,
        onComplete,
        onMistake,
        highlightOnComplete: true,
        highlightCompleteColor: '#0F0',
      }));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({x: 10, y: 20});
      quiz.continueUserStroke({x: 11, y: 21});
      quiz.endUserStroke();
      await resolvePromises();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({x: 10, y: 20});
      quiz.continueUserStroke({x: 11, y: 21});
      quiz.endUserStroke();
      await resolvePromises();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._userStroke).toBe(null);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(quiz._isActive).toBe(false);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCorrectStroke).toHaveBeenCalledTimes(2);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCorrectStroke).toHaveBeenLastCalledWith({
        character: '人',
        mistakesOnStroke: 0,
        strokeNum: 1,
        strokesRemaining: 0,
        totalMistakes: 0,
        drawnPath: {
          pathString: 'M 10 20 L 11 21',
          points: [{x: 15, y: 25}, {x: 16, y: 26}],
        },
      });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onComplete).toHaveBeenLastCalledWith({
        character: '人',
        totalMistakes: 0,
      });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onMistake).not.toHaveBeenCalled();

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();


      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.main.strokes[1].opacity).toBe(1);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      // highlights the character at the end
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.highlight.strokeColor).toBe('#0F0');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.highlight.opacity).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(renderState.state.character.highlight.opacity).toBe(0);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('rounds drawn path data', async () => {
      strokeMatches.mockImplementation(() => true);

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onCorrectStroke = jest.fn();
      quiz.startQuiz(Object.assign({}, opts, { onCorrectStroke }));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({x: 10.93234, y: 20.4567978});
      quiz.continueUserStroke({x: 11.87, y: 23.4444});
      quiz.endUserStroke();

      await resolvePromises();
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCorrectStroke).toHaveBeenCalledTimes(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onCorrectStroke).toHaveBeenLastCalledWith({
        character: '人',
        mistakesOnStroke: 0,
        strokeNum: 0,
        strokesRemaining: 1,
        totalMistakes: 0,
        drawnPath: {
          pathString: 'M 10.9 20.5 L 11.9 23.4',
          points: [{x: 15.9, y: 25.5}, {x: 16.9, y: 28.4}],
        },
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('doesnt leave strokes partially drawn if the users finishes the quiz really fast', async () => {
    strokeMatches.mockImplementation(() => true);
    const renderState = createRenderState();
    const quiz = new Quiz(char, renderState, new Positioner());

    quiz.startQuiz(Object.assign({}, opts));
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(1000);
    await resolvePromises();

    quiz.startUserStroke({x: 10, y: 20});
    quiz.continueUserStroke({x: 11, y: 23});
    quiz.endUserStroke();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(100);
    await resolvePromises();

    quiz.startUserStroke({x: 10, y: 20});
    quiz.continueUserStroke({x: 11, y: 23});
    quiz.endUserStroke();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(100);
    await resolvePromises();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(1000);
    await resolvePromises();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.state.character.main.opacity).toBe(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.state.character.main.strokes[1].opacity).toBe(1);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('sets up character opacities correctly if the users starts drawing during char fading', async () => {
    strokeMatches.mockImplementation(() => true);
    const renderState = createRenderState();
    const quiz = new Quiz(char, renderState, new Positioner());

    quiz.startQuiz(Object.assign({}, opts));
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(20);
    await resolvePromises();

    quiz.startUserStroke({x: 10, y: 20});
    quiz.continueUserStroke({x: 12, y: 23});
    quiz.endUserStroke();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(100);
    await resolvePromises();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(1000);
    await resolvePromises();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.state.character.main.opacity).toBe(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.state.character.main.strokes[1].opacity).toBe(0);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.state.character.highlight.opacity).toBe(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.state.character.highlight.strokes[0].opacity).toBe(0);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.state.character.highlight.strokes[1].opacity).toBe(0);
  });
});
