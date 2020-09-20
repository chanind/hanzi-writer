import Mutation, { GenericMutation } from "./Mutation";
import { objRepeat } from "./utils";
import Stroke from "./models/Stroke";
import { ColorObject, ColorOptions } from "./typings/types";
import Character from "./models/Character";
import RenderState, { CharacterRenderState, RenderStateObject } from "./RenderState";

type CharacterName = keyof RenderStateObject["character"];

export const showStrokes = (
  charName: CharacterName,
  character: Character,
  duration: number,
) => {
  return [
    new Mutation(
      {
        character: {
          [charName]: {
            strokes: objRepeat(
              { opacity: 1, displayPortion: 1 },
              character.strokes.length,
            ),
          },
        },
      },
      {
        duration,
        force: true,
      },
    ),
  ];
};

export const showCharacter = (
  charName: CharacterName,
  character: Character,
  duration: number,
) => {
  return [
    new Mutation(
      {
        character: {
          [charName]: {
            opacity: 1,
            strokes: objRepeat(
              { opacity: 1, displayPortion: 1 },
              character.strokes.length,
            ),
          },
        },
      },
      {
        duration,
        force: true,
      },
    ),
  ];
};

export const hideCharacter = (
  charName: CharacterName,
  character: Character,
  duration = 0,
) => {
  return [
    new Mutation(
      {
        character: {
          [charName]: {
            opacity: 0,
          },
        },
      },
      {
        duration,
        force: true,
      },
    ),
    ...showStrokes(charName, character, 0),
  ];
};

export const updateColor = (
  colorName: keyof ColorOptions,
  colorVal: ColorObject | null,
  duration: number,
) => {
  return new Mutation<RenderState>(
    {
      options: {
        [colorName]: colorVal!,
      },
    },
    {
      duration,
    },
  );
};

export const highlightStroke = (stroke: Stroke, color: string | null, speed: number) => {
  const strokeNum = stroke.strokeNum;
  const duration = (stroke.getLength() + 600) / (3 * speed);
  return [
    new Mutation({
      character: {
        highlight: {
          strokeColor: color!,
        },
      },
    }),

    new Mutation({
      character: {
        highlight: {
          opacity: 1,
          strokes: {
            [strokeNum]: {
              displayPortion: 0,
              opacity: 0,
            },
          },
        },
      },
    }),

    new Mutation(
      {
        character: {
          highlight: {
            strokes: {
              [strokeNum]: {
                displayPortion: 1,
                opacity: 1,
              },
            },
          },
        },
      },
      {
        duration,
      },
    ),

    new Mutation(
      {
        character: {
          highlight: {
            strokes: {
              [strokeNum]: {
                opacity: 0,
              },
            },
          },
        },
      },
      {
        duration,
      },
    ),
  ] as Mutation<RenderState>[];
};

export const animateStroke = (charName: CharacterName, stroke: Stroke, speed: number) => {
  const strokeNum = stroke.strokeNum;
  const duration = (stroke.getLength() + 600) / (3 * speed);
  return [
    new Mutation({
      character: {
        [charName]: {
          opacity: 1,
          strokes: {
            [strokeNum]: {
              displayPortion: 0,
              opacity: 1,
            },
          },
        },
      },
    }),

    new Mutation(
      {
        character: {
          [charName]: {
            strokes: {
              [strokeNum]: {
                displayPortion: 1,
              },
            },
          },
        },
      },
      {
        duration,
      },
    ),
  ];
};

export const animateSingleStroke = (
  charName: CharacterName,
  character: Character,
  strokeNum: number,
  speed: number,
) => {
  return [
    new Mutation((state) => {
      const curCharState = state.character[charName];
      const mutationState: CharacterRenderState = {
        opacity: 1,
        strokes: {},
      };
      for (let i = 0; i < character.strokes.length; i++) {
        mutationState.strokes[i] = {
          ...mutationState.strokes[i],
          opacity: curCharState.opacity * curCharState.strokes[i].opacity,
        };
      }
      return {
        character: {
          [charName]: mutationState,
        },
      };
    }),
    ...animateStroke(charName, character.strokes[strokeNum], speed),
  ];
};

export const showStroke = (
  charName: CharacterName,
  strokeNum: number,
  duration: number,
) => {
  return new Mutation(
    {
      character: {
        [charName]: {
          strokes: {
            [strokeNum]: {
              displayPortion: 1,
              opacity: 1,
            },
          },
        },
      },
    },
    {
      duration,
      force: true,
    },
  );
};

export const animateCharacter = (
  charName: CharacterName,
  character: Character,
  fadeDuration: number,
  speed: number,
  delayBetweenStrokes: number,
) => {
  const mutations: GenericMutation[] = [
    ...hideCharacter(charName, character, fadeDuration),
    // ...showStrokes(charName, character, 0),
    new Mutation(
      {
        character: {
          [charName]: {
            opacity: 1,
            strokes: objRepeat({ opacity: 0 }, character.strokes.length),
          },
        },
      },
      {
        force: true,
      },
    ),
  ];

  character.strokes.forEach((stroke, i) => {
    if (i > 0) {
      mutations.push(new Mutation.Delay(delayBetweenStrokes));
    }
    mutations.push(...animateStroke(charName, stroke, speed));
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
) => {
  return [
    ...animateCharacter(charName, character, fadeDuration, speed, delayBetweenStrokes),
    new Mutation.Delay(delayBetweenLoops),
  ];
};
