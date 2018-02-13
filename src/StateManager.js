const { copyAndMergeDeep } = require('./utils');

function StateManager(character, options, onStateChange) {
  this._onStateChange = onStateChange;
  this._scopedMutationChains = {};
  this.state = {
    options: {
      usePolygonMasks: options.usePolygonMasks,
      drawingFadeDuration: options.drawingFadeDuration,
      drawingWidth: options.drawingWidth,
      drawingColor: options.drawingColor,
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
    quiz: {
      userStrokes: null,
      currentStroke: 0,
      activeUserStrokeId: null,
      isActive: false,
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
      opacity: 0,
      displayPortion: 1,
    };
  }
}

StateManager.prototype.updateState = function(stateChanges) {
  const nextState = copyAndMergeDeep(this.state, stateChanges);
  this._onStateChange(nextState, this.state);
  this.state = nextState;
};

StateManager.prototype.runMutationChain = function(mutations, options = {}) {
  const scope = options.scope || 'character';
  this.cancelMutations(scope);
  return new Promise(resolve => {
    const mutationChain = {
      _isActive: true,
      _index: 0,
      _resolve: resolve,
      _mutations: mutations,
      _loop: options.loop,
      _scope: scope,
    };
    this._scopedMutationChains[scope] = mutationChain;
    this._runMutationChain(mutationChain);
  });
};

StateManager.prototype._runMutationChain = function(mutationChain) {
  if (!mutationChain._isActive) return;
  const mutations = mutationChain._mutations;
  if (mutationChain._index >= mutations.length) {
    if (mutationChain._loop) {
      mutationChain._index = 0; // eslint-disable-line no-param-reassign
    } else {
      mutationChain._isActive = false; // eslint-disable-line no-param-reassign
      delete this._scopedMutationChains[mutationChain._scope];
      // The chain is done - resolve the promise with true to signal it finished successfully
      mutationChain._resolve(true);
      return;
    }
  }

  const activeMutation = mutationChain._mutations[mutationChain._index];
  activeMutation.run(this).then(() => {
    if (mutationChain._isActive) {
      mutationChain._index += 1; // eslint-disable-line no-param-reassign
      this._runMutationChain(mutationChain);
    }
  });
};

StateManager.prototype.cancelMutations = function(scope = 'character') {
  Object.keys(this._scopedMutationChains).forEach(key => {
    if (key.indexOf(scope) >= 0) {
      this._cancelMutationChain(key);
    }
  });
};

StateManager.prototype._cancelMutationChain = function(key) {
  const mutationChain = this._scopedMutationChains[key];
  mutationChain._isActive = false;
  for (let i = mutationChain._index; i < mutationChain._mutations.length; i += 1) {
    mutationChain._mutations[i].cancel(this);
  }
  if (mutationChain._resolve) {
    // resolve with false to indicate the chain was canceled before completion
    mutationChain._resolve(false);
  }
  delete this._scopedMutationChains[key];
};

module.exports = StateManager;
