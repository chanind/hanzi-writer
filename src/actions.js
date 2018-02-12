const Mutation = require('./Mutation');

const mapStrokes = (character, func) => {
  const strokes = {};
  character.strokes.forEach((stroke, i) => {
    strokes[i] = func(stroke, i);
  });
  return strokes;
};

const hideStrokes = (charName, character, duration) => {
  return [
    new Mutation({
      character: {
        [charName]: {
          strokes: mapStrokes(character, () => ({ opacity: 0 })),
        },
      },
    }, { duration, ensureComplete: true }),
  ];
};

const showStrokes = (charName, character, duration) => {
  return [
    new Mutation({
      character: {
        [charName]: {
          strokes: mapStrokes(character, () => ({ opacity: 1, displayPortion: 1 })),
        },
      },
    }, { duration, ensureComplete: true }),
  ];
};

const showCharacter = (charName, character, duration) => {
  return [
    new Mutation({
      character: {
        [charName]: {
          opacity: 1,
          strokes: mapStrokes(character, () => ({ opacity: 1, displayPortion: 1 })),
        },
      },
    }, { duration, ensureComplete: true }),
  ];
};

const hideCharacter = (charName, character, duration) => {
  return [
    new Mutation({
      character: {
        [charName]: {
          opacity: 0,
        },
      },
    }, { duration, ensureComplete: true }),
  ].concat(showStrokes(charName, character, 0));
};

const animateStroke = (charName, stroke, speed) => {
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
    }, { duration: 0 }),
    new Mutation({
      character: {
        [charName]: {
          strokes: {
            [strokeNum]: {
              displayPortion: 1,
            },
          },
        },
      },
    }, { duration }),
  ];
};

const animateCharacter = (charName, character, fadeDuration, speed, delayBetweenStrokes) => {
  let mutations = hideCharacter(charName, character, fadeDuration);
  mutations = mutations.concat(showStrokes(charName, character, 0));
  mutations.push(new Mutation({
    character: {
      [charName]: {
        opacity: 1,
        strokes: mapStrokes(character, () => ({ opacity: 0 })),
      },
    },
  }, { duration: 0, ensureComplete: true }));
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
};
