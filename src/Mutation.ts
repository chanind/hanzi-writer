const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'inflate'.
  inflate,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'performanc... Remove this comment to see the full error message
  performanceNow,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestAni... Remove this comment to see the full error message
  requestAnimationFrame,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cancelAnim... Remove this comment to see the full error message
  cancelAnimationFrame,
} = require('./utils');

// ------ Mutation class --------

const getPartialValues = function(startValues: any, endValues: any, progress: any) {
  const target = {};
  for (const key in endValues) { // eslint-disable-line guard-for-in
    // skipping hasOwnProperty check for performance reasons - we shouldn't be passing any objects
    // in here that aren't plain objects anyway and this is a hot code path
    const endValue = endValues[key];
    const startValue = startValues[key];
    if (endValue >= 0) {
      // @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'strin... Remove this comment to see the full error message
      target[key] = progress * (endValue - startValue) + startValue;
    } else {
      // @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'strin... Remove this comment to see the full error message
      target[key] = getPartialValues(startValue, endValue, progress);
    }
  }
  return target;
};

const isAlreadyAtEnd = function(startValues: any, endValues: any) {
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
const ease = (x: any) => -Math.cos(x * Math.PI) / 2 + 0.5;

function Mutation(scope: any, valuesOrCallable: any, options = {}) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.scope = scope;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._valuesOrCallable = valuesOrCallable;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._duration = options.duration || 0;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._force = options.force;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._pausedDuration = 0;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._tickBound = this._tick.bind(this);
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._startPauseTime = null;
}


// @ts-expect-error ts-migrate(2454) FIXME: Variable 'Mutation' is used before being assigned.
Mutation.prototype.run = function(renderState: any) {
  if (!this._values) this._inflateValues(renderState);
  if (this._duration === 0) renderState.updateState(this._values);
  if (this._duration === 0 || isAlreadyAtEnd(renderState.state, this._values)) {
    return Promise.resolve();
  }
  this._renderState = renderState;
  this._startState = renderState.state;
  this._startTime = performanceNow();
  this._frameHandle = requestAnimationFrame(this._tickBound);
  return new Promise((resolve) => {
    this._resolve = resolve;
  });
};

// @ts-expect-error ts-migrate(2454) FIXME: Variable 'Mutation' is used before being assigned.
Mutation.prototype.pause = function() {
  if (this._startPauseTime !== null) return;
  if (this._frameHandle) cancelAnimationFrame(this._frameHandle);
  this._startPauseTime = performanceNow();
};

// @ts-expect-error ts-migrate(2454) FIXME: Variable 'Mutation' is used before being assigned.
Mutation.prototype.resume = function() {
  if (this._startPauseTime === null) return;
  this._frameHandle = requestAnimationFrame(this._tickBound);
  this._pausedDuration += performanceNow() - this._startPauseTime;
  this._startPauseTime = null;
};

// @ts-expect-error ts-migrate(2454) FIXME: Variable 'Mutation' is used before being assigned.
Mutation.prototype._tick = function(timing: any) {
  if (this._startPauseTime !== null) return;
  const progress = Math.min(1, (timing - this._startTime - this._pausedDuration) / this._duration);
  if (progress === 1) {
    this._renderState.updateState(this._values);
    this._frameHandle = null;
    this.cancel(this._renderState);
  } else {
    const easedProgress = ease(progress);
    this._renderState.updateState(getPartialValues(this._startState, this._values, easedProgress));
    this._frameHandle = requestAnimationFrame(this._tickBound);
  }
};

// @ts-expect-error ts-migrate(2454) FIXME: Variable 'Mutation' is used before being assigned.
Mutation.prototype._inflateValues = function(renderState: any) {
  let values = this._valuesOrCallable;
  if (typeof this._valuesOrCallable === 'function') {
    values = this._valuesOrCallable(renderState.state);
  }
  this._values = inflate(this.scope, values);
};

// @ts-expect-error ts-migrate(2454) FIXME: Variable 'Mutation' is used before being assigned.
Mutation.prototype.cancel = function(renderState: any) {
  if (this._resolve) this._resolve();
  this._resolve = null;
  if (this._frameHandle) cancelAnimationFrame(this._frameHandle);
  this._frameHandle = null;
  if (this._force) {
    if (!this._values) this._inflateValues(renderState);
    renderState.updateState(this._values);
  }
};

// ------ Mutation.Delay Class --------

function Delay(duration: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._duration = duration;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._startTime = null;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._paused = false;
}

Delay.prototype.pause = function() {
  if (this._paused) return;
  // to pause, clear the timeout and rewrite this._duration with whatever time is remaining
  const elapsedDelay = performanceNow() - this._startTime;
  this._duration = Math.max(0, this._duration - elapsedDelay);
  clearTimeout(this._timeout);
  this._paused = true;
};

Delay.prototype.resume = function() {
  if (!this._paused) return;
  this._startTime = performanceNow();
  this._timeout = setTimeout(() => this.cancel(), this._duration);
  this._paused = false;
};

Delay.prototype.run = function() {
  const timeoutPromise = new Promise((resolve) => {
    this._resolve = resolve;
  });
  this._startTime = performanceNow();
  this._timeout = setTimeout(() => this.cancel(), this._duration);
  return timeoutPromise;
};

Delay.prototype.cancel = function() {
  clearTimeout(this._timeout);
  if (this._resolve) this._resolve();
  this._resolve = false;
};

// @ts-expect-error ts-migrate(2454) FIXME: Variable 'Mutation' is used before being assigned.
Mutation.Delay = Delay;

// -------------------------------------


// @ts-expect-error ts-migrate(2454) FIXME: Variable 'Mutation' is used before being assigned.
module.exports = Mutation;
