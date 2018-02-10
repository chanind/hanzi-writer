const { performanceNow, inherits, getKeyPaths, copyAndMergeDeep } = require('./utils');

let idCounter = 1;

function Mutation() { 
  this.id = idCounter;
  idCounter += 1;
  this.reset();
}
Mutation.prototype.execute = function(state) { return {}; };
Mutation.prototype.wait = function() { return false; };
Mutation.prototype.cancel = function(state) {
  this.isDone = true;
  return {};
};
Mutation.prototype.reset = function() {
  this.isDone = false;
  this.isAnimating = false;
};
Mutation.prototype.getRelevantPaths = function() { return []; };

// used to change state values immediately

function InstantMutation(values) { 
  InstantMutation.super_.call(this);
  this._values = values;
}
inherits(InstantMutation, Mutation);
InstantMutation.prototype.execute = function(state) {
  this.isDone = true;
  return this._values;
};
InstantMutation.prototype.wait = function() {
  return false;
};
InstantMutation.prototype.cancel = function(state) {
  this.isDone = true;
  return {};
};
InstantMutation.prototype.getRelevantPaths = function() {
  return getKeyPaths(this._values);
};

// used to animate state changes

function AnimatedMutation(values, options) {
  AnimatedMutation.super_.call(this, values);
  this._duration = options.duration;
  this._ensureComplete = options.ensureComplete;
  this._onComplete = options.onComplete;
}
inherits(AnimatedMutation, InstantMutation);

AnimatedMutation.prototype.execute = function(state) {
  this.isAnimating = true;
  this._startTime = performanceNow();
  this._startState = state;
  return {};
};

AnimatedMutation.prototype.cancel = function(state) {
  if (!this.isDone && this._onComplete) {
    this._onComplete();
  }
  AnimatedMutation.super_.prototype.cancel.call(this, state);
  if (this._ensureComplete) {
    return this._values;
  }
  return {};
}

AnimatedMutation.prototype.tick = function(timing) {
  const progress = Math.min(1, (timing - this._startTime) / this._duration);
  this._progress = progress;
  const easedProgress = ease(progress);
  if (progress === 1) {
    this.cancel();
    return this._values;
  }
  return getPartialValues(this._startState, this._values, progress);
};

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

// used to pause for some time

function DelayedMutation(duration) {
  DelayedMutation.super_.call(this);
  this._duration = duration;
}
inherits(DelayedMutation, Mutation);

DelayedMutation.prototype.wait = function() {
  this.isDone = true;
  return this._duration;
};


// used to chain mutations one after another

function ChainedMutation(mutations, options = {}) {
  ChainedMutation.super_.call(this);
  this._mutations = mutations;
  this._loop = options.loop;
  this._onComplete = options.onComplete;
  this._activeIndex = 0;
}
inherits(ChainedMutation, Mutation);

ChainedMutation.prototype._callOnActiveMutation = function(func) {
  const curMutation = this._mutations[this._activeIndex];
  const retVal = func(curMutation);

  // contine on to the next mutation in the list if this one is done
  if (curMutation.isDone) {
    const isAtEnd = this._activeIndex === this._mutations.length - 1;
    if (isAtEnd) {
      if (this._loop) {
        this._activeIndex = 0;
        this._mutations.forEach(mutation => mutation.reset());
        return this._mutations[0];
      } else {
        this.cancel();
      }
    }
  }

  return retVal;
};

ChainedMutation.prototype.cancel = function(state) {
  if (!this.isDone && this._onComplete) {
    this._onComplete();
  }
  ChainedMutation.super_.prototype.cancel.call(this, state);
  let finalState = {};
  this._mutations.forEach(mutation => {
    if (!mutation.isDone) {
      finalState = copyAndMergeDeep(finalState, mutation.cancel(state));
    }
  })
  return finalState;
};


ChainedMutation.prototype.wait = function() {
  return this._callOnActiveMutation().wait();
};


module.exports = {
  AnimatedMutation,
  InstantMutation,
  DelayedMutation,
};
