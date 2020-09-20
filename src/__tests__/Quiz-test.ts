jest.mock("../strokeMatches");
jest.mock("../Positioner");

import ren from "hanzi-writer-data/人.json";
import Quiz from "../Quiz";
import parseCharData from "../parseCharData";
import RenderState, { RenderStateOptions } from "../RenderState";
import Positioner from "../Positioner";
import strokeMatches from "../strokeMatches";
import { CharacterJson, Point } from "../typings/types";
import defaultOptions from "../defaultOptions";
import { resolvePromises } from "../testUtils";

// @ts-ignore
Positioner.mockImplementation(() => ({
  convertExternalPoint: (point: Point) => ({
    x: point.x + 5,
    y: point.y + 5,
  }),
}));

beforeEach(() => {
  // @ts-ignore
  strokeMatches.mockClear();
  // @ts-ignore
  Positioner.mockClear();
});

const char = parseCharData("人", ren as CharacterJson);

const createRenderState = (optOverrides: Partial<RenderStateOptions> = {}) => {
  const options: RenderStateOptions = { ...defaultOptions, ...optOverrides };
  return new RenderState(char, options);
};

describe("Quiz", () => {
  describe("startQuiz", () => {
    it("resets the quiz and makes it active", async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      expect(quiz._isActive).toBe(false);

      await quiz.startQuiz({ ...defaultOptions });

      expect(quiz._isActive).toBe(true);

      expect(renderState.state.character.main.opacity).toBe(1);
      for (const strokeNum in renderState.state.character.main.strokes) {
        expect(renderState.state.character.main.strokes[strokeNum].opacity).toBe(0);
      }
    });

    it("sets all highlight stroke opacities to 0", async () => {
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
      await quiz.startQuiz({ ...defaultOptions });

      expect(renderState.state.character.highlight.opacity).toBe(1);
      for (const strokeNum in renderState.state.character.main.strokes) {
        expect(renderState.state.character.highlight.strokes[strokeNum].opacity).toBe(0);
      }
    });
  });

  describe("cancel", () => {
    it("makes the quiz inactive and removes the current stroke", async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      quiz.startQuiz({ ...defaultOptions });

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 12, y: 23 });

      const currentStrokeId = quiz._userStroke?.id || -1;

      await quiz.cancel();

      expect(quiz._isActive).toBe(false);

      expect(renderState.state.userStrokes?.[currentStrokeId]).toBe(undefined);
    });
  });

  describe("startUserStroke", () => {
    it("begins a stroke with the provided point", async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      await quiz.startQuiz({ ...defaultOptions });

      expect(renderState.state.userStrokes).toBe(null);
      expect(quiz._userStroke).toBe(undefined);

      await quiz.startUserStroke({ x: 10, y: 20 });

      const userStrokeIds = Object.keys(renderState.state.userStrokes!);
      expect(userStrokeIds.length).toBe(1);
      expect(quiz._userStroke!.id.toString()).toBe(userStrokeIds[0]);
      expect(renderState.state.userStrokes![userStrokeIds[0]]!.points).toEqual([
        { x: 15, y: 25 },
      ]);
      expect(quiz._userStroke!.points).toEqual([{ x: 15, y: 25 }]);
    });

    it("ends the current user stroke if one exists", async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      await quiz.startQuiz({ ...defaultOptions });

      expect(renderState.state.userStrokes).toBe(null);
      expect(quiz._userStroke).toBe(undefined);

      quiz.startUserStroke({ x: 10, y: 20 });
      await resolvePromises();

      const currentStrokeId = quiz._userStroke!.id;

      quiz.startUserStroke({ x: 100, y: 200 });

      const userStrokeIds = Object.keys(renderState.state.userStrokes!);
      expect(userStrokeIds.length).toBe(1);
      expect(quiz._userStroke).toBe(undefined);
      expect(renderState.state.userStrokes![currentStrokeId]!.points).toEqual([
        { x: 15, y: 25 },
      ]);

      clock.tick(1000);
      await resolvePromises();

      // should fade and disappear
      expect(renderState.state.userStrokes![currentStrokeId]).toBe(undefined);
    });
  });

  describe("continueUserStroke", () => {
    it("adds to the current user stroke", async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      await quiz.startQuiz({ ...defaultOptions });

      expect(renderState.state.userStrokes).toBe(null);
      expect(quiz._userStroke).toBe(undefined);

      await quiz.startUserStroke({ x: 10, y: 20 });

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

    it("does nothing if there is no current stroke", async () => {
      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      await quiz.startQuiz({ ...defaultOptions });

      expect(renderState.state.userStrokes).toBe(null);

      expect(quiz._userStroke).toBe(undefined);
      await quiz.continueUserStroke({ x: 100, y: 200 });

      expect(quiz._userStroke).toBe(undefined);
      expect(renderState.state.userStrokes).toBe(null);
    });
  });

  describe("endUserStroke", () => {
    it("finishes the stroke and moves on if it was correct", async () => {
      // @ts-ignore
      strokeMatches.mockImplementation(() => true);

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      await quiz.startQuiz({ ...defaultOptions, onCorrectStroke, onComplete, onMistake });

      await quiz.startUserStroke({ x: 10, y: 20 });
      await quiz.continueUserStroke({ x: 100, y: 200 });

      const currentStrokeId = quiz._userStroke!.id;
      expect(quiz._currentStrokeIndex).toBe(0);
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBe(undefined);
      expect(quiz._isActive).toBe(true);
      expect(quiz._currentStrokeIndex).toBe(1);
      expect(onCorrectStroke).toHaveBeenCalledTimes(1);
      expect(onCorrectStroke).toHaveBeenCalledWith({
        character: "人",
        mistakesOnStroke: 0,
        strokeNum: 0,
        strokesRemaining: 1,
        totalMistakes: 0,
        drawnPath: {
          pathString: "M 10 20 L 100 200",
          points: [
            { x: 15, y: 25 },
            { x: 105, y: 205 },
          ],
        },
      });
      expect(onMistake).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(1);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      expect(renderState.state.userStrokes![currentStrokeId]).toBe(undefined);
    });

    it("ignores single point strokes", async () => {
      // @ts-ignore
      strokeMatches.mockImplementation(() => false);

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      await quiz.startQuiz({ ...defaultOptions, onCorrectStroke, onComplete, onMistake });

      await resolvePromises();

      quiz.startUserStroke({ x: 10, y: 20 });
      const currentStrokeId = quiz._userStroke!.id;
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBe(undefined);
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
      expect(renderState.state.userStrokes![currentStrokeId]).toBe(undefined);
    });

    it("stays on the stroke if it was incorrect", async () => {
      // @ts-ignore
      strokeMatches.mockImplementation(() => false);

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      await quiz.startQuiz({ ...defaultOptions, onCorrectStroke, onComplete, onMistake });

      quiz.startUserStroke({ x: 10, y: 20 });
      quiz.continueUserStroke({ x: 100, y: 200 });

      const currentStrokeId = quiz._userStroke!.id;
      expect(quiz._currentStrokeIndex).toBe(0);
      quiz.endUserStroke();
      await resolvePromises();

      expect(quiz._userStroke).toBe(undefined);
      expect(quiz._isActive).toBe(true);
      expect(quiz._currentStrokeIndex).toBe(0);
      expect(onMistake).toHaveBeenCalledTimes(1);
      expect(onMistake).toHaveBeenCalledWith({
        character: "人",
        mistakesOnStroke: 1,
        strokeNum: 0,
        strokesRemaining: 2,
        totalMistakes: 1,
        drawnPath: {
          pathString: "M 10 20 L 100 200",
          points: [
            { x: 15, y: 25 },
            { x: 105, y: 205 },
          ],
        },
      });
      expect(onCorrectStroke).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);
      // should fade and disappear
      expect(renderState.state.userStrokes![currentStrokeId]).toBe(undefined);
    });

    it("highlights the stroke if the number of mistakes exceeds showHintAfterMisses", async () => {
      // @ts-ignore
      strokeMatches.mockImplementation(() => false);

      const renderState = createRenderState();
      // should reset this color before highlighting
      renderState.state.character.highlight.strokeColor = "#00F";
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz({
        ...defaultOptions,
        onCorrectStroke,
        onComplete,
        onMistake,
        showHintAfterMisses: 2,
      });
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

      expect(quiz._userStroke).toBe(undefined);
      expect(quiz._isActive).toBe(true);
      expect(quiz._currentStrokeIndex).toBe(0);
      expect(onMistake).toHaveBeenCalledTimes(2);
      expect(onMistake).toHaveBeenLastCalledWith({
        character: "人",
        mistakesOnStroke: 2,
        strokeNum: 0,
        strokesRemaining: 2,
        totalMistakes: 2,
        drawnPath: {
          pathString: "M 10 20 L 11 21",
          points: [
            { x: 15, y: 25 },
            { x: 16, y: 26 },
          ],
        },
      });
      expect(onCorrectStroke).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.main.strokes[0].opacity).toBe(0);
      expect(renderState.state.character.main.strokes[1].opacity).toBe(0);

      // should highlight the stroke now
      expect(renderState.state.character.highlight.strokeColor).toBe("#AAF");
      expect(renderState.state.character.highlight.strokes[0].opacity).toBe(1);
      clock.tick(1000);
      await resolvePromises();
      expect(renderState.state.character.highlight.strokes[0].opacity).toBe(0);
    });

    it("does not highlight strokes if showHintAfterMisses is set to false", async () => {
      // @ts-ignore
      strokeMatches.mockImplementation(() => false);

      const renderState = createRenderState();
      // should reset this color before highlighting
      renderState.state.character.highlight.strokeColor = "#00F";
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();
      quiz.startQuiz({
        ...defaultOptions,
        onCorrectStroke,
        onComplete,
        onMistake,
        showHintAfterMisses: false,
      });
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

    it("finishes the quiz when all strokes are successful", async () => {
      // @ts-ignore
      strokeMatches.mockImplementation(() => true);

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      const onMistake = jest.fn();
      const onComplete = jest.fn();

      await quiz.startQuiz({
        ...defaultOptions,
        onCorrectStroke,
        onComplete,
        onMistake,
        highlightOnComplete: true,
        highlightCompleteColor: "#0F0",
      });

      await quiz.startUserStroke({ x: 10, y: 20 });
      await quiz.continueUserStroke({ x: 11, y: 21 });
      await quiz.endUserStroke();

      expect(onCorrectStroke).toHaveBeenCalledTimes(1);

      await quiz.startUserStroke({ x: 10, y: 20 });
      await quiz.continueUserStroke({ x: 11, y: 21 });
      quiz.endUserStroke();

      expect(onCorrectStroke).toHaveBeenCalledTimes(2);
      expect(onCorrectStroke).toHaveBeenLastCalledWith({
        character: "人",
        mistakesOnStroke: 0,
        strokeNum: 1,
        strokesRemaining: 0,
        totalMistakes: 0,
        drawnPath: {
          pathString: "M 10 20 L 11 21",
          points: [
            { x: 15, y: 25 },
            { x: 16, y: 26 },
          ],
        },
      });

      // Quiz should now be inactive
      expect(quiz._userStroke).toBe(undefined);
      expect(quiz._isActive).toBe(false);

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenLastCalledWith({
        character: "人",
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
      expect(renderState.state.character.highlight.strokeColor).toBe("#0F0");
      expect(renderState.state.character.highlight.opacity).toBe(1);

      clock.tick(1000);
      await resolvePromises();

      expect(renderState.state.character.highlight.opacity).toBe(0);
    });

    it("rounds drawn path data", async () => {
      // @ts-ignore
      strokeMatches.mockImplementation(() => true);

      const renderState = createRenderState();
      const quiz = new Quiz(char, renderState, new Positioner());
      const onCorrectStroke = jest.fn();
      quiz.startQuiz({ ...defaultOptions, onCorrectStroke });
      clock.tick(1000);
      await resolvePromises();

      quiz.startUserStroke({ x: 10.93234, y: 20.4567978 });
      quiz.continueUserStroke({ x: 11.87, y: 23.4444 });
      quiz.endUserStroke();

      await resolvePromises();
      expect(onCorrectStroke).toHaveBeenCalledTimes(1);
      expect(onCorrectStroke).toHaveBeenLastCalledWith({
        character: "人",
        mistakesOnStroke: 0,
        strokeNum: 0,
        strokesRemaining: 1,
        totalMistakes: 0,
        drawnPath: {
          pathString: "M 10.9 20.5 L 11.9 23.4",
          points: [
            { x: 15.9, y: 25.5 },
            { x: 16.9, y: 28.4 },
          ],
        },
      });
    });
  });

  it("doesnt leave strokes partially drawn if the users finishes the quiz really fast", async () => {
    // @ts-ignore
    strokeMatches.mockImplementation(() => true);
    const renderState = createRenderState();
    const quiz = new Quiz(char, renderState, new Positioner());

    quiz.startQuiz({ ...defaultOptions });
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

  it("sets up character opacities correctly if the users starts drawing during char fading", async () => {
    // @ts-ignore
    strokeMatches.mockImplementation(() => true);
    const renderState = createRenderState();
    const quiz = new Quiz(
      char,
      renderState,
      new Positioner({
        padding: 20,
        width: 0,
        height: 0,
      }),
    );

    quiz.startQuiz({ ...defaultOptions });
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
