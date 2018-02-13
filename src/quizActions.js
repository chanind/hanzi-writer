const Mutation = require('./Mutation');
const characterActions = require('./characterActions');
const { mapStrokes } = require('./utils');

const startQuiz = (character, fadeDuration) => {
  return [
    new Mutation({
      quiz: {
        isActive: true,
        currentStroke: 0,
        userStrokes: null,
        activeUserStrokeId: null,
        strokes: mapStrokes(character, () => ({ mistakes: 0 })),
      },
    }),
  ].concat(
    characterActions.hideCharacter('main', character, fadeDuration),
  ).concat([
    new Mutation({
      character: {
        main: {
          opacity: 1,
          strokes: mapStrokes(character, () => ({ opacity: 0 })),
        },
      },
    }),
  ]);
};

const cancelQuiz = () => {
  return [
    new Mutation({
      quiz: {
        isActive: false,
      },
    }),
  ];
};

const startUserStroke = (id, point) => {
  return [
    new Mutation({
      quiz: {
        activeUserStrokeId: id,
        userStrokes: {
          [id]: {
            points: [point],
            opacity: 1,
          },
        },
      },
    }),
  ];
};

const updateUserStroke = (activeUserStrokeId, points) => {
  return [
    new Mutation({
      quiz: {
        userStrokes: {
          [activeUserStrokeId]: {
            points,
          },
        },
      },
    }),
  ];
};

const removeUserStroke = (userStrokeId, duration) => {
  return [
    new Mutation({
      quiz: {
        userStrokes: {
          [userStrokeId]: {
            opacity: 0,
          },
        },
      },
    }, { duration }),
    new Mutation({
      quiz: {
        userStrokes: {
          [userStrokeId]: null,
        },
      },
    }),
  ];
};

const nextStroke = (nextStrokeNum, isDone) => {
  return [
    new Mutation({
      quiz: {
        activeUserStrokeId: null,
        isActive: !isDone,
        currentStroke: nextStrokeNum,
      },
    }),
  ];
};

const strokeMistake = (strokeNum, mistakes) => {
  return [
    new Mutation({
      quiz: {
        activeUserStrokeId: null,
        strokes: {
          [strokeNum]: {
            mistakes,
          },
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
