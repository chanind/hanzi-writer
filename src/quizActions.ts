import Mutation, { MutationChain } from './Mutation';
import * as characterActions from './characterActions';
import { objRepeat } from './utils';
import Character from './models/Character';
import { Point } from 'typings/types';

export const startQuiz = (character: Character, fadeDuration: number): MutationChain => {
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
        strokes: objRepeat({ opacity: 0 }, character.strokes.length),
      },
      { force: true },
    ),
  ];
};

export const startUserStroke = (id: string | number, point: Point): MutationChain => {
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
): MutationChain => {
  return [new Mutation(`userStrokes.${userStrokeId}.points`, points, { force: true })];
};

export const removeUserStroke = (
  userStrokeId: string | number,
  duration: number,
): MutationChain => {
  return [
    new Mutation(`userStrokes.${userStrokeId}.opacity`, 0, { duration }),
    new Mutation(`userStrokes.${userStrokeId}`, null, { force: true }),
  ];
};

export const highlightCompleteChar = (
  character: Character,
  duration: number,
): MutationChain => {
  return [
    ...characterActions.hideCharacter('highlight', character),
    ...characterActions.showCharacter('highlight', character, duration / 2),
    ...characterActions.hideCharacter('highlight', character, duration / 2),
  ];
};

export const highlightStroke = characterActions.highlightStroke;
