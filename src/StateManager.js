const { copyAndMergeDeep } = require('./utils');

function StateManager(character, options, onStateChange) {
  this._onStateChange = onStateChange;
  this._mutationChains = [];
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
    userStrokes: null,
    quiz: {
      currentStroke: 0,
      activeUserStrokeId: null,
      isActive: false,
    },
  };
  for (let i = 0; i < character.strokes.length; i++) {
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

StateManager.prototype.run = function(mutations, options = {}) {
  const scopes = mutations.map(mut => mut.scope).filter(x => x);
  this.cancelMutations(scopes);
  return new Promise(resolve => {
    const mutationChain = {
      _isActive: true,
      _index: 0,
      _resolve: resolve,
      _mutations: mutations,
      _loop: options.loop,
      _scopes: scopes,
    };
    this._mutationChains.push(mutationChain);
    this._run(mutationChain);
  });
};

StateManager.prototype._run = function(mutationChain) {
  if (!mutationChain._isActive) return;
  const mutations = mutationChain._mutations;
  if (mutationChain._index >= mutations.length) {
    if (mutationChain._loop) {
      mutationChain._index = 0; // eslint-disable-line no-param-reassign
    } else {
      mutationChain._isActive = false; // eslint-disable-line no-param-reassign
      this._mutationChains = this._mutationChains.filter(chain => chain !== mutationChain);
      // The chain is done - resolve the promise with true to signal it finished successfully
      mutationChain._resolve(true);
      return;
    }
  }

  const activeMutation = mutationChain._mutations[mutationChain._index];
  activeMutation.run(this).then(() => {
    if (mutationChain._isActive) {
      mutationChain._index++; // eslint-disable-line no-param-reassign
      this._run(mutationChain);
    }
  });
};

StateManager.prototype.cancelMutations = function(scopes) {
  this._mutationChains.forEach(chain => {
    chain._scopes.forEach(chainScope => {
      scopes.forEach(scope => {
        if (chainScope.indexOf(scope) >= 0) {
          this._cancelMutationChain(chain);
        }
      });
    });
  });
};

StateManager.prototype._cancelMutationChain = function(mutationChain) {
  mutationChain._isActive = false; // eslint-disable-line no-param-reassign
  for (let i = mutationChain._index; i < mutationChain._mutations.length; i++) {
    mutationChain._mutations[i].cancel(this);
  }
  if (mutationChain._resolve) {
    // resolve with false to indicate the chain was canceled before completion
    mutationChain._resolve(false);
  }
  this._mutationChains = this._mutationChains.filter(chain => chain !== mutationChain);
};

module.exports = StateManager;
