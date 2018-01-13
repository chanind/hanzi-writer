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
