const Mutation = require('./Mutation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'characterA... Remove this comment to see the full error message
const characterActions = require('./characterActions');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'objRepeat'... Remove this comment to see the full error message
const { objRepeat } = require('./utils');

const startQuiz = (character: any, fadeDuration: any) => {
  return characterActions.hideCharacter('main', character, fadeDuration)
    .concat([
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      new Mutation('character.highlight', {
        opacity: 1,
        strokes: objRepeat({ opacity: 0 }, character.strokes.length),
      }, { force: true }),
      // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      new Mutation('character.main', {
        opacity: 1,
        strokes: objRepeat({ opacity: 0 }, character.strokes.length),
      }, { force: true }),
    ]);
};

const startUserStroke = (id: any, point: any) => {
  return [
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation('quiz.activeUserStrokeId', id, { force: true }),
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`userStrokes.${id}`, {
      points: [point],
      opacity: 1,
    }, { force: true }),
  ];
};

const updateUserStroke = (userStrokeId: any, points: any) => {
  return [
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`userStrokes.${userStrokeId}.points`, points, { force: true }),
  ];
};

const removeUserStroke = (userStrokeId: any, duration: any) => {
  return [
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`userStrokes.${userStrokeId}.opacity`, 0, { duration }),
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    new Mutation(`userStrokes.${userStrokeId}`, null, { force: true }),
  ];
};

const highlightCompleteChar = (character: any, color: any, duration: any) => {
  return [
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
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
