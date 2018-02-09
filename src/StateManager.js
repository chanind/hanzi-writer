const { copyAndMergeDeep } = require('./utils');

function StateManager(character, options, onStateChange) {
  this._onStateChange = onStateChange;
  this.state = {
    options: {
      usePolygonMasks: options.usePolygonMasks,
      drawingFadeDuration: options.drawingFadeDuration,
      drawingWidth: options.drawingWidth,
      strokeWidth: options.strokeWidth,
    },
    character: {
      main: {
        strokeColor: options.strokeColor,
        radicalColor: options.radicalColor,
        opacity: options.showCharacter ? 1 : 0,
        strokes: {},
      },
      outline: {
        strokeColor: options.outlineColor,
        opacity: options.showOutline ? 1 : 0,
        strokes: {},
      },
      highlight: {
        strokeColor: options.highlightColor,
        opacity: 1,
        strokes: {},
      },
    },
  };
  for (let i = 0; i < character.strokes.length; i += 1) {
    this.state.character.main.strokes[i] = {
      opacity: 1,
      displayPortion: 1,
    };
    this.state.character.outline.strokes[i] = {
      opacity: 1,
      displayPortion: 1,
    };
    this.state.character.highlight.strokes[i] = {
      opacity: 1,
      displayPortion: 1,
    };
  }
}

StateManager.prototype.updateState = function(stateChanges) {
  const nextState = copyAndMergeDeep(this.state, stateChanges);
  this._onStateChange(nextState, this.state);
  this.state = nextState;
};

module.exports = StateManager;
