import Character from './models/Character';
import { GenericMutation } from './Mutation';
import {
  ColorObject,
  OnCompleteFunction,
  Point,
  RecursivePartial,
} from './typings/types';
import { copyAndMergeDeep, colorStringToVals, noop } from './utils';

export type StrokeRenderState = {
  opacity: number;
  displayPortion: number;
};

export type CharacterRenderState = {
  opacity: number;
  strokes: Record<number | string, StrokeRenderState>;
};

export type RenderStateObject = {
  options: {
    drawingFadeDuration: number;
    drawingWidth: number;
    drawingColor: ColorObject;
    strokeColor: ColorObject;
    outlineColor: ColorObject;
    radicalColor: ColorObject;
    highlightColor: ColorObject;
  };
  character: {
    main: CharacterRenderState;
    outline: CharacterRenderState;
    highlight: CharacterRenderState;
  };
  userStrokes: Record<
    string,
    | {
        points: Point[];
        opacity: number;
      }
    | undefined
  > | null;
};

export type CharacterName = keyof RenderStateObject['character'];

type OnStateChangeCallback = (
  nextState: RenderStateObject,
  currentState: RenderStateObject,
) => void;

type MutationChain = {
  _isActive: boolean;
  _index: number;
  _resolve: OnCompleteFunction;
  _mutations: GenericMutation[];
  _loop: boolean | undefined;
  _scopes: string[];
};

export type RenderStateOptions = {
  strokeColor: string;
  radicalColor: string | null;
  highlightColor: string;
  outlineColor: string;
  drawingColor: string;
  drawingFadeDuration: number;
  drawingWidth: number;
  outlineWidth: number;
  showCharacter: boolean;
  showOutline: boolean;
};

export default class RenderState {
  _mutationChains: MutationChain[] = [];
  _onStateChange: OnStateChangeCallback;

  state: RenderStateObject;

  constructor(
    character: Character,
    options: RenderStateOptions,
    onStateChange: OnStateChangeCallback = noop,
  ) {
    this._onStateChange = onStateChange;

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

  overwriteOnStateChange(onStateChange: OnStateChangeCallback) {
    this._onStateChange = onStateChange;
  }

  updateState(stateChanges: RecursivePartial<RenderStateObject>) {
    const nextState = copyAndMergeDeep(this.state, stateChanges);
    this._onStateChange(nextState, this.state);
    this.state = nextState;
  }

  run(
    mutations: GenericMutation[],
    options: {
      loop?: boolean;
    } = {},
  ) {
    const scopes = mutations.map((mut) => mut.scope);

    this.cancelMutations(scopes);

    return new Promise((resolve: OnCompleteFunction) => {
      const mutationChain: MutationChain = {
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
  }

  _run(mutationChain: MutationChain) {
    if (!mutationChain._isActive) {
      return;
    }

    const mutations = mutationChain._mutations;
    if (mutationChain._index >= mutations.length) {
      if (mutationChain._loop) {
        mutationChain._index = 0; // eslint-disable-line no-param-reassign
      } else {
        mutationChain._isActive = false; // eslint-disable-line no-param-reassign
        this._mutationChains = this._mutationChains.filter(
          (chain) => chain !== mutationChain,
        );
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
  }

  _getActiveMutations() {
    return this._mutationChains.map((chain) => chain._mutations[chain._index]);
  }

  pauseAll() {
    this._getActiveMutations().forEach((mutation) => mutation.pause());
  }

  resumeAll() {
    this._getActiveMutations().forEach((mutation) => mutation.resume());
  }

  cancelMutations(scopesToCancel: string[]) {
    for (const chain of this._mutationChains) {
      for (const chainId of chain._scopes) {
        for (const scopeToCancel of scopesToCancel) {
          if (chainId.startsWith(scopeToCancel) || scopeToCancel.startsWith(chainId)) {
            this._cancelMutationChain(chain);
          }
        }
      }
    }
  }

  cancelAll() {
    this.cancelMutations(['']);
  }

  _cancelMutationChain(mutationChain: MutationChain) {
    mutationChain._isActive = false;
    for (let i = mutationChain._index; i < mutationChain._mutations.length; i++) {
      mutationChain._mutations[i].cancel(this);
    }

    mutationChain._resolve?.({ canceled: true });

    this._mutationChains = this._mutationChains.filter(
      (chain) => chain !== mutationChain,
    );
  }
}
