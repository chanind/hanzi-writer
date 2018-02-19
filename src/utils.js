function emptyFunc() {}

const performanceNow = (global.performance && (() => global.performance.now())) || (() => Date.now());
const requestAnimationFrame = global.requestAnimationFrame || (callback => setTimeout(() => callback(performanceNow()), 1000 / 60));
const cancelAnimationFrame = global.cancelAnimationFrame || clearTimeout;

// Object.assign polyfill, because IE :/
const assign = Object.assign || function(target, ...overrides) {
  const overrideTarget = Object(target);
  overrides.forEach(override => {
    if (override != null) {
      for (const key in override) {
        if (Object.prototype.hasOwnProperty.call(override, key)) {
          overrideTarget[key] = override[key];
        }
      }
    }
  });
  return overrideTarget;
};

function copyAndMergeDeep(base, override) {
  const output = assign({}, base);
  for (const key in override) { // eslint-disable-line guard-for-in
    // skipping hasOwnProperty check for performance reasons - we shouldn't be passing any objects
    // in here that aren't plain objects anyway and this is a hot code path
    const baseVal = base[key];
    const overrideVal = override[key];
    if (baseVal === overrideVal) continue; // eslint-disable-line no-continue
    if (
      baseVal &&
      overrideVal &&
      typeof baseVal === 'object' &&
      typeof overrideVal === 'object' &&
      !Array.isArray(overrideVal)
    ) {
      output[key] = copyAndMergeDeep(baseVal, overrideVal);
    } else {
      output[key] = overrideVal;
    }
  }
  return output;
}

function inflate(scope, obj) {
  const parts = scope.split('.');
  const final = {};
  let current = final;
  for (let i = 0; i < parts.length; i++) {
    const cap = i === parts.length - 1 ? obj : {};
    current[parts[i]] = cap;
    current = cap;
  }
  return final;
}


function arrayMax(numArray) {
  return Math.max.apply(null, numArray);
}

function arrayMin(numArray) {
  return Math.min.apply(null, numArray);
}

function getExtremes(numArray) {
  const max = arrayMax(numArray);
  const min = arrayMin(numArray);
  const mid = (max + min) / 2;
  return [max, mid, min];
}

function callIfExists(callback, ...args) {
  if (callback) callback(...args);
}

let count = 0;
function counter() {
  count++;
  return count;
}

function average(arr) {
  const sum = arr.reduce((acc, val) => val + acc, 0);
  return sum / arr.length;
}

function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

// return a new array-like object with int keys where each key is item
// ex: objRepeat({x: 8}, 3) === {0: {x: 8}, 1: {x: 8}, 2: {x: 8}}
const objRepeat = (item, times) => {
  const obj = {};
  for (let i = 0; i < times; i++) {
    obj[i] = item;
  }
  return obj;
};

module.exports = {
  arrayMax,
  arrayMin,
  assign,
  average,
  callIfExists,
  cancelAnimationFrame,
  copyAndMergeDeep,
  counter,
  emptyFunc,
  getExtremes,
  inflate,
  objRepeat,
  performanceNow,
  requestAnimationFrame,
  timeout,
};
