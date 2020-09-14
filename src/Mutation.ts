import { inflate, cancelAnimationFrame } from "./utils";
import RenderState, { RenderStateObject } from "./RenderState";

// ------ Mutation class --------

const getPartialValues = (
  startValues: RenderStateObject,
  endValues: any,
  progress: number,
) => {
  const target = {};
  for (const key in endValues) {
    const endValue = endValues[key];
    // @ts-ignore
    const startValue = startValues[key];
    if (endValue >= 0) {
      // @ts-ignore
      target[key] = progress * (endValue - startValue) + startValue;
    } else {
      // @ts-ignore
      target[key] = getPartialValues(startValue, endValue, progress);
    }
  }
  return target;
};

const isAlreadyAtEnd = function (startValues: any, endValues: any) {
  for (const key in endValues) {
    if (endValues.hasOwnProperty(key)) {
      const endValue = endValues[key];
      const startValue = startValues[key];
      if (endValue >= 0) {
        if (endValue !== startValue) return false;
      } else if (!isAlreadyAtEnd(startValue, endValue)) {
        return false;
      }
    }
  }
  return true;
};

// from https://github.com/maxwellito/vivus
const ease = (x: number) => -Math.cos(x * Math.PI) / 2 + 0.5;

/** Used by `Mutation` & `Delay` */
export interface GenericMutation {
  scope: string;
  run(renderState: RenderState): Promise<void>;
  pause(): void;
  resume(): void;
  cancel(renderState: RenderState): void;
}

class Delay implements GenericMutation {
  _duration: number;
  _startTime: number | null;
  _paused: boolean;
  _timeout: NodeJS.Timeout | undefined;
  _resolve: (() => void) | undefined;
  scope: string;

  constructor(duration: number) {
    this._duration = duration;
    this._startTime = null;
    this._paused = false;
    this.scope = `delay.${duration}`;
  }

  run() {
    this._startTime = performance.now();
    return new Promise((resolve) => {
      this._resolve = resolve;
      this._timeout = setTimeout(() => this.cancel(), this._duration);
    }) as Promise<void>;
  }

  pause() {
    if (this._paused) return;
    // to pause, clear the timeout and rewrite this._duration with whatever time is remaining
    const elapsedDelay = performance.now() - (this._startTime || 0);
    this._duration = Math.max(0, this._duration - elapsedDelay);
    clearTimeout(this._timeout!);
    this._paused = true;
  }

  resume() {
    if (!this._paused) return;
    this._startTime = performance.now();
    this._timeout = setTimeout(() => this.cancel(), this._duration);
    this._paused = false;
  }

  cancel() {
    clearTimeout(this._timeout!);
    if (this._resolve) {
      this._resolve();
    }
    this._resolve = undefined;
  }
}

export default class Mutation<TValue = any> implements GenericMutation {
  static Delay = Delay;

  /** Dot notation e.g. `character.highlight.strokeColor` */
  scope: string;
  _valuesOrCallable: any | ((renderStateObj: RenderStateObject) => any);
  _duration: number;
  _force: any;
  _pausedDuration: number;
  _startPauseTime: number | null;

  // Only set on .run()
  _startTime: number | undefined;
  _startState: RenderStateObject | undefined;
  _renderState: RenderState | undefined;
  _frameHandle: number | undefined;
  _values: any;
  _resolve: (() => void) | undefined;

  constructor(
    /** Dot notation e.g. `character.highlight.strokeColor` */
    scope: string,
    valuesOrCallable: TValue | ((renderStateObj: RenderStateObject) => TValue),
    options: { duration?: number; force?: boolean } = {},
  ) {
    this.scope = scope;
    this._valuesOrCallable = valuesOrCallable;
    this._duration = options.duration || 0;
    this._force = options.force;
    this._pausedDuration = 0;
    this._startPauseTime = null;
  }

  run(renderState: RenderState) {
    if (!this._values) {
      this._inflateValues(renderState);
    }
    if (this._duration === 0) {
      renderState.updateState(this._values);
    }
    return new Promise((resolve) => {
      if (this._duration === 0 || isAlreadyAtEnd(renderState.state, this._values)) {
        resolve();
        return;
      }
      this._renderState = renderState;
      this._startState = renderState.state;
      this._startTime = performance.now();
      this._frameHandle = requestAnimationFrame(this._tick);
      this._resolve = resolve;
    }) as Promise<void>;
  }

  pause() {
    if (this._startPauseTime !== null) {
      return;
    }
    if (this._frameHandle) {
      cancelAnimationFrame(this._frameHandle);
    }
    this._startPauseTime = performance.now();
  }

  resume() {
    if (this._startPauseTime === null) {
      return;
    }
    this._frameHandle = requestAnimationFrame(this._tick);
    this._pausedDuration += performance.now() - this._startPauseTime;
    this._startPauseTime = null;
  }

  _tick = (timing: number) => {
    if (this._startPauseTime !== null) {
      return;
    }

    const progress = Math.min(
      1,
      (timing - this._startTime! - this._pausedDuration) / this._duration,
    );

    if (progress === 1) {
      this._renderState!.updateState(this._values);
      this._frameHandle = undefined;
      this.cancel(this._renderState!);
    } else {
      const easedProgress = ease(progress);
      this._renderState!.updateState(
        getPartialValues(this._startState!, this._values, easedProgress),
      );
      this._frameHandle = requestAnimationFrame(this._tick);
    }
  };

  _inflateValues(renderState: RenderState) {
    const values: TValue =
      typeof this._valuesOrCallable === "function"
        ? this._valuesOrCallable(renderState.state)
        : this._valuesOrCallable;

    this._values = inflate(this.scope, values);
  }

  cancel(renderState: RenderState) {
    this._resolve?.();

    this._resolve = undefined;
    if (this._frameHandle) {
      cancelAnimationFrame(this._frameHandle);
    }
    this._frameHandle = undefined;
    if (this._force) {
      if (!this._values) {
        this._inflateValues(renderState);
      }
      renderState.updateState(this._values);
    }
  }
}
