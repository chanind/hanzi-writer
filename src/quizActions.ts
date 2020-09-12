const Mutation = require('./Mutation');
const characterActions = require('./characterActions');
const { objRepeat } = require('./utils');

const startQuiz = (character, fadeDuration) => {
  return characterActions.hideCharacter('main', character, fadeDuration)
    .concat([
      new Mutation('character.highlight', {
        opacity: 1,
        strokes: objRepeat({ opacity: 0 }, character.strokes.length),
      }, { force: true }),
      new Mutation('character.main', {
        opacity: 1,
        strokes: objRepeat({ opacity: 0 }, character.strokes.length),
      }, { force: true }),
    ]);
};

const startUserStroke = (id, point) => {
  return [
    new Mutation('quiz.activeUserStrokeId', id, { force: true }),
    new Mutation(`userStrokes.${id}`, {
      points: [point],
      opacity: 1,
    }, { force: true }),
  ];
};

const updateUserStroke = (userStrokeId, points) => {
  return [
    new Mutation(`userStrokes.${userStrokeId}.points`, points, { force: true }),
  ];
};

const removeUserStroke = (userStrokeId, duration) => {
  return [
    new Mutation(`userStrokes.${userStrokeId}.opacity`, 0, { duration }),
    new Mutation(`userStrokes.${userStrokeId}`, null, { force: true }),
  ];
};

const highlightCompleteChar = (character, color, duration) => {
  return [
    new Mutation('character.highlight.strokeColor', color),
  ]
    .concat(characterActions.hideCharacter('highlight', character))
    .concat(characterActions.showCharacter('highlight', character, duration / 2))
    .concat(characterActions.hideCharacter('highlight', character, duration / 2));
};

module.exports = {
  highlightCompleteChar,
  highlightStroke: characterActions.highlightStroke,
  startQuiz,
  startUserStroke,
  updateUserStroke,
  removeUserStroke,
};
