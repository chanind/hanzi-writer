import { cancelAnimationFrame } from "./utils";
import RenderState, { RenderStateObject } from "./RenderState";
import { RecursivePartial } from "typings/types";

/** Used by `Mutation` & `Delay` */
export interface GenericMutation<
  TRenderStateClass extends GenericRenderStateClass = RenderState
> {
  /** Allows mutations starting with the provided string to be cancelled */
  scope: string;
  /** Can be useful for checking whether the mutation is running */
  _runningPromise: Promise<void> | undefined;
  run(renderState: TRenderStateClass): Promise<void>;
  pause(): void;
  resume(): void;
  cancel(renderState: TRenderStateClass): void;
}

class Delay implements GenericMutation {
  scope: string;
  _runningPromise: Promise<void> | undefined;
  _duration: number;
  _startTime: number | null;
  _paused: boolean;
  _timeout!: NodeJS.Timeout;
  _resolve: (() => void) | undefined;

  constructor(duration: number) {
    this._duration = duration;
    this._startTime = null;
    this._paused = false;
    this.scope = `delay.${duration}`;
  }

  run() {
    this._startTime = performance.now();
    this._runningPromise = new Promise((resolve) => {
      this._resolve = resolve;
      // @ts-ignore return type of "setTimeout" in builds is parsed as `number` instead of `Timeout`
      this._timeout = setTimeout(() => this.cancel(), this._duration);
    }) as Promise<void>;
    return this._runningPromise;
  }

  pause() {
    if (this._paused) return;
    // to pause, clear the timeout and rewrite this._duration with whatever time is remaining
    const elapsedDelay = performance.now() - (this._startTime || 0);
    this._duration = Math.max(0, this._duration - elapsedDelay);
    clearTimeout(this._timeout);
    this._paused = true;
  }

  resume() {
    if (!this._paused) return;
    this._startTime = performance.now();
    // @ts-ignore return type of "setTimeout" in builds is parsed as `number` instead of `Timeout`
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

type ValuesOrCallable<TValue> =
  | RecursivePartial<TValue>
  | ((renderStateObj: RenderStateObject) => RecursivePartial<TValue>);

type GenericRenderStateClass<T = any> = {
  state: T;
  updateState(changes: RecursivePartial<T>): void;
};

export default class Mutation<
  TRenderStateClass extends GenericRenderStateClass,
  TRenderStateObj = TRenderStateClass["state"]
> implements GenericMutation<TRenderStateClass> {
  static Delay = Delay;

  scope: string;
  _runningPromise: Promise<void> | undefined;
  _valuesOrCallable: ValuesOrCallable<TRenderStateObj>;
  _duration: number;
  _force: boolean | undefined;
  _pausedDuration: number;
  _startPauseTime: number | null;

  // Only set on .run()
  _startTime: number | undefined;
  _startState: RecursivePartial<TRenderStateObj> | undefined;
  _renderState: TRenderStateClass | undefined;
  _frameHandle: number | undefined;
  _values: RecursivePartial<TRenderStateObj> | undefined;
  _resolve: (() => void) | undefined;

  constructor(
    valuesOrCallable: ValuesOrCallable<TRenderStateObj>,
    options: {
      /** Allows mutations starting with the provided string to be cancelled */
      scope?: string;
      duration?: number;
      /** Updates render state regardless if cancelled */
      force?: boolean;
    } = {},
  ) {
    this.scope = options.scope || "mutation";
    this._valuesOrCallable = valuesOrCallable;
    this._duration = options.duration || 0;
    this._force = options.force;
    this._pausedDuration = 0;
    this._startPauseTime = null;
  }

  run(renderState: TRenderStateClass) {
    if (this._duration === 0) {
      const values = this.getValues(renderState);
      renderState.updateState(values);
    }

    this._runningPromise = new Promise((resolve) => {
      if (
        this._duration === 0 ||
        isAlreadyAtEnd(renderState.state, this.getValues(renderState))
      ) {
        resolve();
        return;
      }
      this._renderState = renderState;
      this._startState = renderState.state;
      this._startTime = performance.now();
      this._frameHandle = requestAnimationFrame(this._tick);
      this._resolve = resolve;
    });

    return this._runningPromise;
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
      this._renderState!.updateState(this._values!);
      this._frameHandle = undefined;
      this.cancel(this._renderState!);
    } else {
      const easedProgress = ease(progress);
      const stateChanges = getPartialValues(
        this._startState as TRenderStateObj,
        this._values!,
        easedProgress,
      );

      this._renderState!.updateState(stateChanges);
      this._frameHandle = requestAnimationFrame(this._tick);
    }
  };

  getValues(renderState: TRenderStateClass) {
    if (this._values) {
      return this._values;
    }

    const values: RecursivePartial<TRenderStateObj> = (() => {
      if (typeof this._valuesOrCallable === "function") {
        return this._valuesOrCallable(renderState.state);
      }
      return this._valuesOrCallable;
    })();

    this._values = values;

    return this._values;
  }

  cancel(renderState: TRenderStateClass) {
    this._resolve?.();

    this._resolve = undefined;
    if (this._frameHandle) {
      cancelAnimationFrame(this._frameHandle);
    }
    this._frameHandle = undefined;
    if (this._force) {
      renderState.updateState(this.getValues(renderState));
    }
  }
}

function getPartialValues<T>(
  startValues: T | undefined,
  endValues: RecursivePartial<T> | undefined,
  progress: number,
) {
  const target: RecursivePartial<T> = {};

  for (const key in endValues) {
    const endValue = endValues[key];
    const startValue = startValues?.[key];
    if (typeof startValue === "number" && typeof endValue === "number" && endValue >= 0) {
      target[key] = progress * (endValue - startValue) + startValue;
    } else {
      target[key] = getPartialValues(startValue, endValue, progress);
    }
  }
  return target;
}

function isAlreadyAtEnd<T>(startValues: T, endValues: RecursivePartial<T> | undefined) {
  for (const key in endValues) {
    const endValue = endValues[key];
    const startValue = startValues[key];
    if (endValue >= 0) {
      if (endValue !== startValue) {
        return false;
      }
    } else if (!isAlreadyAtEnd(startValue, endValue)) {
      return false;
    }
  }
  return true;
}

// from https://github.com/maxwellito/vivus
const ease = (x: number) => -Math.cos(x * Math.PI) / 2 + 0.5;
