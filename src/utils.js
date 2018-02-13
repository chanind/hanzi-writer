function emptyFunc() {}

const performanceNow = (global.performance && (() => global.performance.now())) || (() => Date.now());
const requestAnimationFrame = global.requestAnimationFrame || (callback => setTimeout(() => callback(performanceNow()), 1000 / 60));
const cancelAnimationFrame = global.cancelAnimationFrame || clearTimeout;

// Object.assign polyfill, because IE :/
function assign(target, ...overrides) {
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
}

function copyAndMergeDeep(base, override) {
  const output = assign({}, base);
  for (const key in override) {
    if (Object.prototype.hasOwnProperty.call(override, key)) {
      if (
        base[key] &&
        override[key] &&
        typeof base[key] === 'object' &&
        typeof override[key] === 'object' &&
        !Array.isArray(override[key])
      ) {
        output[key] = copyAndMergeDeep(base[key], override[key]);
      } else {
        output[key] = override[key];
      }
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

// utils for classes without es6, sigh...
// from: https://github.com/nodejs/node-v0.x-archive/blob/546ae2ee/lib/util.js#L552-L575
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor; // eslint-disable-line no-param-reassign
  ctor.prototype = Object.create(superCtor.prototype, { // eslint-disable-line no-param-reassign
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
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

function isMSBrowser() {
  return global.navigator && global.navigator.userAgent && (
    global.navigator.userAgent.indexOf('Edge') >= 0
    || global.navigator.userAgent.indexOf('MSIE') >= 0
  );
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
  inherits,
  isMSBrowser,
  objRepeat,
  performanceNow,
  requestAnimationFrame,
  timeout,
};
