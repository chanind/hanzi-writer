// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'copyAndMer... Remove this comment to see the full error message
const { copyAndMergeDeep, colorStringToVals } = require('./utils');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RenderStat... Remove this comment to see the full error message
function RenderState(character: any, options: any, onStateChange: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._onStateChange = onStateChange;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._mutationChains = [];
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    this.state.character.main.strokes[i] = {
      opacity: 1,
      displayPortion: 1,
    };
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    this.state.character.outline.strokes[i] = {
      opacity: 1,
      displayPortion: 1,
    };
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    this.state.character.highlight.strokes[i] = {
      opacity: 0,
      displayPortion: 1,
    };
  }
}

RenderState.prototype.updateState = function(stateChanges: any) {
  const nextState = copyAndMergeDeep(this.state, stateChanges);
  this._onStateChange(nextState, this.state);
  this.state = nextState;
};

RenderState.prototype.run = function(mutations: any, options = {}) {
  const scopes = mutations.map((mut: any) => mut.scope).filter((x: any) => x);
  this.cancelMutations(scopes);
  return new Promise(resolve => {
    const mutationChain = {
      _isActive: true,
      _index: 0,
      _resolve: resolve,
      _mutations: mutations,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'loop' does not exist on type '{}'.
      _loop: options.loop,
      _scopes: scopes,
    };
    this._mutationChains.push(mutationChain);
    this._run(mutationChain);
  });
};

RenderState.prototype._run = function(mutationChain: any) {
  if (!mutationChain._isActive) return;
  const mutations = mutationChain._mutations;
  if (mutationChain._index >= mutations.length) {
    if (mutationChain._loop) {
      mutationChain._index = 0; // eslint-disable-line no-param-reassign
    } else {
      mutationChain._isActive = false; // eslint-disable-line no-param-reassign
      this._mutationChains = this._mutationChains.filter((chain: any) => chain !== mutationChain);
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

RenderState.prototype._getActiveMutations = function() {
  return this._mutationChains.map((chain: any) => {
    return chain._mutations[chain._index];
  });
};

RenderState.prototype.pauseAll = function() {
  this._getActiveMutations().forEach((mutation: any) => mutation.pause());
};

RenderState.prototype.resumeAll = function() {
  this._getActiveMutations().forEach((mutation: any) => mutation.resume());
};

RenderState.prototype.cancelMutations = function(scopes: any) {
  this._mutationChains.forEach((chain: any) => {
    chain._scopes.forEach((chainScope: any) => {
      scopes.forEach((scope: any) => {
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

RenderState.prototype._cancelMutationChain = function(mutationChain: any) {
  mutationChain._isActive = false; // eslint-disable-line no-param-reassign
  for (let i = mutationChain._index; i < mutationChain._mutations.length; i++) {
    mutationChain._mutations[i].cancel(this);
  }
  if (mutationChain._resolve) {
    mutationChain._resolve({ canceled: true });
  }
  this._mutationChains = this._mutationChains.filter((chain: any) => chain !== mutationChain);
};

module.exports = RenderState;
