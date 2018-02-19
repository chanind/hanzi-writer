const Mutation = require('./Mutation');
const { objRepeat } = require('./utils');

const hideStrokes = (charName, character, duration) => {
  return [
    new Mutation(
      `character.${charName}.strokes`,
      objRepeat({ opacity: 0 }, character.strokes.length),
      { duration, force: true },
    ),
  ];
};

const showStrokes = (charName, character, duration) => {
  return [
    new Mutation(
      `character.${charName}.strokes`,
      objRepeat({ opacity: 1, displayPortion: 1 }, character.strokes.length),
      { duration, force: true },
    ),
  ];
};

const showCharacter = (charName, character, duration) => {
  return [
    new Mutation(`character.${charName}`, {
      opacity: 1,
      strokes: objRepeat({ opacity: 1, displayPortion: 1 }, character.strokes.length),
    }, { duration, force: true }),
  ];
};

const hideCharacter = (charName, character, duration) => {
  return [
    new Mutation(`character.${charName}.opacity`, 0, { duration, force: true }),
  ].concat(showStrokes(charName, character, 0));
};

const animateStroke = (charName, stroke, speed) => {
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
    new Mutation(`character.${charName}.strokes.${strokeNum}.displayPortion`, 1, { duration }),
  ];
};

const highlightStroke = (charName, stroke, speed) => {
  const strokeNum = stroke.strokeNum;
  const duration = (stroke.getLength() + 600) / (3 * speed);
  return [
    new Mutation(`character.${charName}`, {
      opacity: 1,
      strokes: {
        [strokeNum]: {
          displayPortion: 0,
          opacity: 0,
        },
      },
    }),
    new Mutation(`character.${charName}.strokes.${strokeNum}`, {
      displayPortion: 1,
      opacity: 1,
    }, { duration }),
    new Mutation(`character.${charName}.strokes.${strokeNum}.opacity`, 0, { duration }),
  ];
};

const showStroke = (charName, strokeNum, duration) => {
  return [
    new Mutation(`character.${charName}`, {
      opacity: 1,
      strokes: {
        [strokeNum]: {
          displayPortion: 1,
          opacity: 1,
        },
      },
    }, { duration }),
  ];
};

const animateCharacter = (charName, character, fadeDuration, speed, delayBetweenStrokes) => {
  let mutations = hideCharacter(charName, character, fadeDuration);
  mutations = mutations.concat(showStrokes(charName, character, 0));
  mutations.push(new Mutation(`character.${charName}`, {
    opacity: 1,
    strokes: objRepeat({ opacity: 0 }, character.strokes.length),
  }, { force: true }));
  character.strokes.forEach((stroke, i) => {
    if (i > 0) mutations.push(new Mutation.Pause(delayBetweenStrokes));
    mutations = mutations.concat(animateStroke(charName, stroke, speed));
  });
  return mutations;
};

const animateCharacterLoop = (charName, character, fadeDuration, speed, delayBetweenStrokes, delayBetweenLoops) => {
  const mutations = animateCharacter(charName, character, fadeDuration, speed, delayBetweenStrokes);
  mutations.push(new Mutation.Pause(delayBetweenLoops));
  return mutations;
};

module.exports = {
  showStrokes,
  hideStrokes,
  showCharacter,
  hideCharacter,
  animateCharacter,
  animateCharacterLoop,
  animateStroke,
  highlightStroke,
  showStroke,
};
