const {
  performanceNow,
  requestAnimationFrame,
  cancelAnimationFrame,
} = require('./utils');

// ------ Mutation class --------

const getPartialValues = function(startValues, endValues, progress) {
  const target = {};
  for (const key in endValues) {
    if (endValues.hasOwnProperty(key)) {
      const endValue = endValues[key];
      const startValue = startValues[key];
      if (endValue >= 0) {
        target[key] = progress * (endValue - startValue) + startValue;
      } else {
        target[key] = getPartialValues(startValue, endValue, progress);
      }
    }
  }
  return target;
};

const isAlreadyAtEnd = function(startValues, endValues) {
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
const ease = x => -Math.cos(x * Math.PI) / 2 + 0.5;

function Mutation(values, options = {}) {
  this._values = values;
  this._duration = options.duration;
  this._ensureComplete = options.ensureComplete;
}

Mutation.prototype.run = function(stateManager) {
  if (this._duration === 0 || isAlreadyAtEnd(stateManager.state, this._values)) {
    stateManager.updateState(this._values);
    return Promise.resolve();
  }
  this._stateManager = stateManager;
  this._startState = stateManager.state;
  this._startTime = performanceNow();
  this._nextTick();
  return new Promise((resolve) => {
    this._resolve = resolve;
  });
};

Mutation.prototype._nextTick = function() {
  this._frameHandle = requestAnimationFrame((timing) => this._tick(timing));
};

Mutation.prototype._tick = function(timing) {
  const progress = Math.min(1, (timing - this._startTime) / this._duration);
  const easedProgress = ease(progress);
  this._stateManager.updateState(getPartialValues(this._startState, this._values, easedProgress));
  if (easedProgress === 1) {
    this._frameHandle = null;
    this.cancel(this._stateManager);
  } else {
    this._nextTick();
  }
};

Mutation.prototype.cancel = function(stateManager) {
  if (this._resolve) this._resolve();
  this._resolve = null;
  if (this._frameHandle) cancelAnimationFrame(this._frameHandle);
  if (this._ensureComplete) stateManager.updateState(this._values);
};

// ------ Mutation.Pause Class --------

function Pause(duration) {
  this._duration = duration;
}

Pause.prototype.run = function() {
  const timeoutPromise = new Promise((resolve) => {
    this._resolve = resolve;
  });
  this._timeout = setTimeout(() => this.cancel(), this._duration);
  return timeoutPromise;
};

Pause.prototype.cancel = function() {
  clearTimeout(this._timeout);
  if (this._resolve) this._resolve();
  this._resolve = false;
};

Mutation.Pause = Pause;

// -------------------------------------


module.exports = Mutation;
