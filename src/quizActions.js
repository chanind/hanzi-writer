const Mutation = require('./Mutation');
const characterActions = require('./characterActions');
const { objRepeat } = require('./utils');

const startQuiz = (character, fadeDuration) => {
  return [
    new Mutation('quiz', {
      isActive: true,
      currentStroke: 0,
      userStrokes: null,
      activeUserStrokeId: null,
      strokes: objRepeat({ mistakes: 0 }, character.strokes.length),
    }),
  ].concat(
    characterActions.hideCharacter('main', character, fadeDuration),
  ).concat([
    new Mutation('character.main', {
      opacity: 1,
      strokes: objRepeat({ opacity: 0 }, character.strokes.length),
    }),
  ]);
};

const cancelQuiz = () => {
  return [
    new Mutation('quiz', { isActive: false }),
  ];
};

const startUserStroke = (id, point) => {
  return [
    new Mutation('quiz.activeUserStrokeId', id),
    new Mutation(`userStrokes.${id}`, {
      points: [point],
      opacity: 1,
    }),
  ];
};

const updateUserStroke = (activeUserStrokeId, points) => {
  return [
    new Mutation(`userStrokes.${activeUserStrokeId}.points`, points),
  ];
};

const removeUserStroke = (userStrokeId, duration) => {
  return [
    new Mutation(`userStrokes.${userStrokeId}.opacity`, 0, { duration, force: true }),
    new Mutation(`userStrokes.${userStrokeId}`, null),
  ];
};

const nextStroke = (nextStrokeNum, isDone) => {
  return [
    new Mutation('quiz', {
      activeUserStrokeId: null,
      isActive: !isDone,
      currentStroke: nextStrokeNum,
    }),
  ];
};

const strokeMistake = (strokeNum, mistakes) => {
  return [
    new Mutation('quiz', {
      activeUserStrokeId: null,
      strokes: {
        [strokeNum]: {
          mistakes,
        },
      },
    }),
  ];
};

module.exports = {
  nextStroke,
  startQuiz,
  startUserStroke,
  strokeMistake,
  cancelQuiz,
  updateUserStroke,
  removeUserStroke,
};
