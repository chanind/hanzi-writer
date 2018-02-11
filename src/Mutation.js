const {
  performanceNow,
  inherits,
  copyAndMergeDeep,
  requestAnimationFrame,
  cancelAnimationFrame,
} = require('./utils');

// ------ Mutation class --------


function Mutation(values, options = {}) {
  this._values = values;
  this._ensureComplete = options.ensureComplete;
  this.isDone = false;
}
Mutation.prototype.run = function(stateManager) {
  this.isDone = true;
  stateManager.updateState(this._values);
};
Mutation.prototype.cancel = function(stateManager) {
  this.isDone = true;
  if (this._ensureComplete) {
    stateManager.updateState(this._values);
  }
};

// ------ AnimatedMutation class --------

const getPartialValues = function(startValues, endValues, progress) {
  const target = {};
  Object.keys(endValues).forEach(key => {
    endValue = endValues[key];
    if (endValue >= 0) {
      target[key] = progress * (endValue - startValues[key]) + endValue;
    } else {
      target[key] = getPartialValues(startValues[key], endValue[key], progress);
    }
  });
  return target;
}

// from https://github.com/maxwellito/vivus
const ease = x => -Math.cos(x * Math.PI) / 2 + 0.5;

function AnimatedMutation(values, options = {}) {
  AnimatedMutation.super_.call(this, values, options);
  this._duration = options.duration;
}
inherits(AnimatedMutation, Mutation);

AnimatedMutation.prototype.run = function(stateManager) {
  this._stateManager = stateManager;
  this._startTime = performanceNow();
  this._startState = state;
  this._nextTick();
  return new Promise((resolve) => {
    this._resolve = resolve;
  });
};

AnimatedMutation.prototype._nextTick = function() {
  this._frameHandle = requestAnimationFrame((timing) => this._tick(timing));
};

AnimatedMutation.prototype._tick = function(timing) {
  if (this.isDone) return;

  const progress = Math.min(1, (timing - this._startTime) / this._duration);
  const easedProgress = ease(progress);
  this._stateManager.updateState(getPartialValues(this._startState, this._values, progress));
  if (progress === 1) {
    this._frameHandle = null;
    this.cancel();
  } else {
    this._nextTick();
  }
};

AnimatedMutation.prototype.cancel = function(stateManager) {
  this.isDone = true;
  if (this._resolve) this._resolve();
  if (this._frameHandle) cancelAnimationFrame(this._frameHandle);
}

// ------ PauseMutation Class --------

function PauseMutation(duration) {
  this.isDone = false;
  this._duration = duration;
}

PauseMutation.prototype.run = function() {
  const timeoutPromise = new Promise((resolve) => {
    this._resolve = resolve;
  });
  this._timeout = setTimeout(() => this.cancel(), this._duration);
  return timeoutPromise;
};

PauseMutation.prototype.cancel = function() {
  this.isDone = true;
  clearTimeout(this._timeout);
  if (this._resolve) this._resolve();
};

// -------------------------------------


module.exports = {
  AnimatedMutation,
  InstantMutation,
  DelayedMutation,
};
