function emptyFunc() {}

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

function getPathString(points) {
  const start = points[0];
  const remainingPoints = points.slice(1);
  let pathString = `M ${start.x} ${start.y}`;
  remainingPoints.forEach(point => {
    pathString += ` L ${point.x} ${point.y}`;
  });
  return pathString;
}

let count = 0;
function counter() {
  count += 1;
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

module.exports = {
  inherits,
  assign,
  arrayMax,
  arrayMin,
  average,
  callIfExists,
  counter,
  emptyFunc,
  getExtremes,
  getPathString,
  timeout,
};
