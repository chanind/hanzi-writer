import Stroke from './models/Stroke';
import { ColorObject, RecursivePartial } from './typings/types';
import Character from './models/Character';
import Mutation, { GenericMutation } from './Mutation';
import { objRepeat } from './utils';
import { CharacterName, CharacterRenderState, RenderStateObject } from './RenderState';

export const showStrokes = (
  charName: CharacterName,
  character: Character,
  duration: number,
): GenericMutation[] => {
  return [
    new Mutation(
      `character.${charName}.strokes`,
      objRepeat(
        { opacity: 1, displayPortion: 1 },
        character.strokes.length,
      ) as CharacterRenderState['strokes'],
      { duration, force: true },
    ),
  ];
};

export const showCharacter = (
  charName: CharacterName,
  character: Character,
  duration: number,
): GenericMutation[] => {
  return [
    new Mutation(
      `character.${charName}`,
      {
        opacity: 1,
        strokes: objRepeat({ opacity: 1, displayPortion: 1 }, character.strokes.length),
      },
      { duration, force: true },
    ),
  ];
};

export const hideCharacter = (
  charName: CharacterName,
  character: Character,
  duration?: number,
): GenericMutation[] => {
  return [
    new Mutation(`character.${charName}.opacity`, 0, { duration, force: true }),
    ...showStrokes(charName, character, 0),
  ];
};

export const updateColor = (
  colorName: string,
  colorVal: ColorObject | null,
  duration: number,
) => {
  return [new Mutation(`options.${colorName}`, colorVal, { duration })];
};

export const highlightStroke = (
  stroke: Stroke,
  color: ColorObject | null,
  speed: number,
): GenericMutation[] => {
  const strokeNum = stroke.strokeNum;
  const duration = (stroke.getLength() + 600) / (3 * speed);
  return [
    new Mutation('options.highlightColor', color),
    new Mutation('character.highlight', {
      opacity: 1,
      strokes: {
        [strokeNum]: {
          displayPortion: 0,
          opacity: 0,
        },
      },
    }),
    new Mutation(
      `character.highlight.strokes.${strokeNum}`,
      {
        displayPortion: 1,
        opacity: 1,
      },
      { duration },
    ),
    new Mutation(`character.highlight.strokes.${strokeNum}.opacity`, 0, {
      duration,
      force: true,
    }),
  ];
};

export const animateStroke = (
  charName: CharacterName,
  stroke: Stroke,
  speed: number,
): GenericMutation[] => {
  const strokeNum = stroke.strokeNum;
  const duration = (stroke.getLength() + 600) / (3 * speed);
  return [
    new Mutation(`character.${charName}`, {
      opacity: 1,
      strokes: {
        [strokeNum]: {
          displayPortion: 0,
          opacity: 1,
        },
      },
    }),
    new Mutation(`character.${charName}.strokes.${strokeNum}.displayPortion`, 1, {
      duration,
    }),
  ];
};

export const animateSingleStroke = (
  charName: CharacterName,
  character: Character,
  strokeNum: number,
  speed: number,
): GenericMutation[] => {
  const mutationStateFunc = (state: RenderStateObject) => {
    const curCharState = state.character[charName];
    const mutationState: RecursivePartial<CharacterRenderState> = {
      opacity: 1,
      strokes: {},
    };
    for (let i = 0; i < character.strokes.length; i++) {
      mutationState.strokes![i] = {
        opacity: curCharState.opacity * curCharState.strokes[i].opacity,
      };
    }
    return mutationState;
  };
  const stroke = character.strokes[strokeNum];
  return [
    new Mutation(`character.${charName}`, mutationStateFunc),
    ...animateStroke(charName, stroke, speed),
  ];
};

export const showStroke = (
  charName: CharacterName,
  strokeNum: number,
  duration: number,
): GenericMutation[] => {
  return [
    new Mutation(
      `character.${charName}.strokes.${strokeNum}`,
      {
        displayPortion: 1,
        opacity: 1,
      },
      { duration, force: true },
    ),
  ];
};

export const animateCharacter = (
  charName: CharacterName,
  character: Character,
  fadeDuration: number,
  speed: number,
  delayBetweenStrokes: number,
): GenericMutation[] => {
  let mutations: GenericMutation[] = hideCharacter(charName, character, fadeDuration);
  mutations = mutations.concat(showStrokes(charName, character, 0));
  mutations.push(
    new Mutation(
      `character.${charName}`,
      {
        opacity: 1,
        strokes: objRepeat({ opacity: 0 }, character.strokes.length),
      },
      { force: true },
    ),
  );
  character.strokes.forEach((stroke, i) => {
    if (i > 0) mutations.push(new Mutation.Delay(delayBetweenStrokes));
    mutations = mutations.concat(animateStroke(charName, stroke, speed));
  });
  return mutations;
};

export const animateCharacterLoop = (
  charName: CharacterName,
  character: Character,
  fadeDuration: number,
  speed: number,
  delayBetweenStrokes: number,
  delayBetweenLoops: number,
): GenericMutation[] => {
  const mutations = animateCharacter(
    charName,
    character,
    fadeDuration,
    speed,
    delayBetweenStrokes,
  );
  mutations.push(new Mutation.Delay(delayBetweenLoops));
  return mutations;
};
