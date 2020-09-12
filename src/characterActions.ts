const Mutation = require('./Mutation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'objRepeat'... Remove this comment to see the full error message
const { objRepeat } = require('./utils');

const showStrokes = (charName: any, character: any, duration: any) => {
  return [
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(
      `character.${charName}.strokes`,
      objRepeat({ opacity: 1, displayPortion: 1 }, character.strokes.length),
      { duration, force: true },
    ),
  ];
};

const showCharacter = (charName: any, character: any, duration: any) => {
  return [
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`character.${charName}`, {
      opacity: 1,
      strokes: objRepeat({ opacity: 1, displayPortion: 1 }, character.strokes.length),
    }, { duration, force: true }),
  ];
};

const hideCharacter = (charName: any, character: any, duration: any) => {
  return [
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`character.${charName}.opacity`, 0, { duration, force: true }),
  ].concat(showStrokes(charName, character, 0));
};

const updateColor = (colorName: any, colorVal: any, duration: any) => {
  // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  return [new Mutation(`options.${colorName}`, colorVal, { duration })];
};

const highlightStroke = (stroke: any, color: any, speed: any) => {
  const strokeNum = stroke.strokeNum;
  const duration = (stroke.getLength() + 600) / (3 * speed);
  return [
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation('character.highlight.strokeColor', color),
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation('character.highlight', {
      opacity: 1,
      strokes: {
        [strokeNum]: {
          displayPortion: 0,
          opacity: 0,
        },
      },
    }),
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`character.highlight.strokes.${strokeNum}`, {
      displayPortion: 1,
      opacity: 1,
    }, { duration }),
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`character.highlight.strokes.${strokeNum}.opacity`, 0, { duration }),
  ];
};

const animateStroke = (charName: any, stroke: any, speed: any) => {
  const strokeNum = stroke.strokeNum;
  const duration = (stroke.getLength() + 600) / (3 * speed);
  return [
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`character.${charName}`, {
      opacity: 1,
      strokes: {
        [strokeNum]: {
          displayPortion: 0,
          opacity: 1,
        },
      },
    }),
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`character.${charName}.strokes.${strokeNum}.displayPortion`, 1, { duration }),
  ];
};

const animateSingleStroke = (charName: any, character: any, strokeNum: any, speed: any) => {
  const mutationStateFunc = (state: any) => {
    const curCharState = state.character[charName];
    const mutationState = {
      opacity: 1,
      strokes: {},
    };
    for (let i = 0; i < character.strokes.length; i++) {
      // @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'numbe... Remove this comment to see the full error message
      mutationState.strokes[i] = {
        opacity: curCharState.opacity * curCharState.strokes[i].opacity,
      };
    }
    return mutationState;
  };
  // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  return [new Mutation(`character.${charName}`, mutationStateFunc)].concat(
    animateStroke(charName, character.strokes[strokeNum], speed),
  );
};

const showStroke = (charName: any, strokeNum: any, duration: any) => {
  return [
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`character.${charName}.strokes.${strokeNum}`, {
      displayPortion: 1,
      opacity: 1,
    }, { duration, force: true }),
  ];
};

const animateCharacter = (charName: any, character: any, fadeDuration: any, speed: any, delayBetweenStrokes: any) => {
  let mutations = hideCharacter(charName, character, fadeDuration);
  mutations = mutations.concat(showStrokes(charName, character, 0));
  // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  mutations.push(new Mutation(`character.${charName}`, {
    opacity: 1,
    strokes: objRepeat({ opacity: 0 }, character.strokes.length),
  }, { force: true }));
  character.strokes.forEach((stroke: any, i: any) => {
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    if (i > 0) mutations.push(new Mutation.Delay(delayBetweenStrokes));
    mutations = mutations.concat(animateStroke(charName, stroke, speed));
  });
  return mutations;
};

const animateCharacterLoop = (charName: any, character: any, fadeDuration: any, speed: any, delayBetweenStrokes: any, delayBetweenLoops: any) => {
  const mutations = animateCharacter(charName, character, fadeDuration, speed, delayBetweenStrokes);
  // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  mutations.push(new Mutation.Delay(delayBetweenLoops));
  return mutations;
};

module.exports = {
  showStrokes,
  showCharacter,
  hideCharacter,
  highlightStroke,
  animateCharacter,
  animateCharacterLoop,
  animateStroke,
  animateSingleStroke,
  showStroke,
  updateColor,
};
