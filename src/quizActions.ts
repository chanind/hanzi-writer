import Mutation, { GenericMutation } from './Mutation';
import * as characterActions from './characterActions';
import { objRepeat, objRepeatCb } from './utils';
import Character from './models/Character';
import { ColorObject, Point } from './typings/types';

export const startQuiz = (
  character: Character,
  fadeDuration: number,
  startStrokeNum: number,
): GenericMutation[] => {
  return [
    ...characterActions.hideCharacter('main', character, fadeDuration),
    new Mutation(
      'character.highlight',
      {
        opacity: 1,
        strokes: objRepeat({ opacity: 0 }, character.strokes.length),
      },
      { force: true },
    ),
    new Mutation(
      'character.main',
      {
        opacity: 1,
        strokes: objRepeatCb(character.strokes.length, (i) => ({
          opacity: i < startStrokeNum ? 1 : 0,
        })),
      },
      { force: true },
    ),
  ];
};

export const startUserStroke = (id: string | number, point: Point): GenericMutation[] => {
  return [
    new Mutation('quiz.activeUserStrokeId', id, { force: true }),
    new Mutation(
      `userStrokes.${id}`,
      {
        points: [point],
        opacity: 1,
      },
      { force: true },
    ),
  ];
};

export const updateUserStroke = (
  userStrokeId: string | number,
  points: Point[],
): GenericMutation[] => {
  return [new Mutation(`userStrokes.${userStrokeId}.points`, points, { force: true })];
};

export const removeUserStroke = (
  userStrokeId: string | number,
  duration: number,
): GenericMutation[] => {
  return [
    new Mutation(`userStrokes.${userStrokeId}.opacity`, 0, { duration }),
    new Mutation(`userStrokes.${userStrokeId}`, null, { force: true }),
  ];
};

export const highlightCompleteChar = (
  character: Character,
  color: ColorObject | null,
  duration: number,
): GenericMutation[] => {
  return [
    new Mutation('options.highlightColor', color),
    ...characterActions.hideCharacter('highlight', character),
    ...characterActions.showCharacter('highlight', character, duration / 2),
    ...characterActions.hideCharacter('highlight', character, duration / 2),
  ];
};

export const highlightStroke = characterActions.highlightStroke;
