import Mutation from "./Mutation";
import * as characterActions from "./characterActions";
import { colorStringToVals, objRepeat } from "./utils";
import { Point } from "./typings/types";
import Character from "./models/Character";
import RenderState from "RenderState";

export const startQuiz = (character: Character, fadeDuration: number) => {
  return [
    ...characterActions.hideCharacter("main", character, fadeDuration),
    new Mutation<RenderState>(
      {
        character: {
          highlight: {
            opacity: 1,
            strokes: objRepeat({ opacity: 0 }, character.strokes.length),
          },
        },
      },
      { force: true },
    ),
    new Mutation<RenderState>(
      {
        character: {
          main: {
            opacity: 1,
            strokes: objRepeat({ opacity: 0 }, character.strokes.length),
          },
        },
      },
      { force: true },
    ),
  ];
};

export const startUserStroke = (id: number, point: Point) => {
  return [
    new Mutation<RenderState>(
      {
        userStrokes: {
          [id]: {
            points: [point],
            opacity: 1,
          },
        },
      },
      { force: true },
    ),
  ];
};

export const updateUserStroke = (userStrokeId: number, points: Point[]) => {
  return [
    new Mutation<RenderState>(
      {
        userStrokes: {
          [userStrokeId]: {
            points,
          },
        },
      },
      {
        force: true,
      },
    ),
  ];
};

export const removeUserStroke = (userStrokeId: number, duration: number) => {
  return [
    new Mutation<RenderState>(
      {
        userStrokes: {
          [userStrokeId]: {
            opacity: 0,
          },
        },
      },
      {
        duration,
      },
    ),
    new Mutation<RenderState>(
      {
        userStrokes: {
          [userStrokeId]: undefined,
        },
      },
      {
        force: true,
      },
    ),
  ];
};

export const highlightCompleteChar = (
  character: Character,
  color: string | null,
  duration: number,
) => {
  return [
    new Mutation<RenderState>({
      options: {
        highlightColor: colorStringToVals(color),
      },
    }),
    ...characterActions.hideCharacter("highlight", character),
    ...characterActions.showCharacter("highlight", character, duration / 2),
    ...characterActions.hideCharacter("highlight", character, duration / 2),
  ];
};
