const { copyAndMergeDeep, colorStringToVals } = require('./utils');

function RenderState(character, options, onStateChange) {
  this._onStateChange = onStateChange;
  this._mutationChains = [];
  this.state = {
    options: {
      drawingFadeDuration: options.drawingFadeDuration,
      drawingWidth: options.drawingWidth,
      drawingColor: colorStringToVals(options.drawingColor),
      strokeColor: colorStringToVals(options.strokeColor),
      outlineColor: colorStringToVals(options.outlineColor),
      radicalColor: colorStringToVals(options.radicalColor || options.strokeColor),
      highlightColor: colorStringToVals(options.highlightColor),
    },
    character: {
      main: {
        opacity: options.showCharacter ? 1 : 0,
        strokes: {},
      },
      outline: {
        opacity: options.showOutline ? 1 : 0,
        strokes: {},
      },
      highlight: {
        opacity: 1,
        strokes: {},
      },
    },
    userStrokes: null,
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

RenderState.prototype.updateState = function(stateChanges) {
  const nextState = copyAndMergeDeep(this.state, stateChanges);
  this._onStateChange(nextState, this.state);
  this.state = nextState;
};

RenderState.prototype.run = function(mutations, options = {}) {
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

RenderState.prototype._run = function(mutationChain) {
  if (!mutationChain._isActive) return;
  const mutations = mutationChain._mutations;
  if (mutationChain._index >= mutations.length) {
    if (mutationChain._loop) {
      mutationChain._index = 0; // eslint-disable-line no-param-reassign
    } else {
      mutationChain._isActive = false; // eslint-disable-line no-param-reassign
      this._mutationChains = this._mutationChains.filter(chain => chain !== mutationChain);
      // The chain is done - resolve the promise to signal it finished successfully
      mutationChain._resolve({ canceled: false });
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

RenderState.prototype.cancelMutations = function(scopes) {
  this._mutationChains.forEach(chain => {
    chain._scopes.forEach(chainScope => {
      scopes.forEach(scope => {
        if (chainScope.indexOf(scope) >= 0 || scope.indexOf(chainScope) >= 0) {
          this._cancelMutationChain(chain);
        }
      });
    });
  });
};

RenderState.prototype.cancelAll = function() {
  this.cancelMutations(['']);
};

RenderState.prototype._cancelMutationChain = function(mutationChain) {
  mutationChain._isActive = false; // eslint-disable-line no-param-reassign
  for (let i = mutationChain._index; i < mutationChain._mutations.length; i++) {
    mutationChain._mutations[i].cancel(this);
  }
  if (mutationChain._resolve) {
    mutationChain._resolve({ canceled: true });
  }
  this._mutationChains = this._mutationChains.filter(chain => chain !== mutationChain);
};

module.exports = RenderState;
