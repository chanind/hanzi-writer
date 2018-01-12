function emptyFunc() {}

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
  let pathString = `M ${start.getX()} ${start.getY()}`;
  for (const point of remainingPoints) {
    pathString += ` L ${point.getX()} ${point.getY()}`;
  }
  return pathString;
}

let count = 0;
function counter() {
  count += 1;
  return count;
}

function average(arr) {
  let sum = 0;
  for (const val of arr) {
    sum += val;
  }
  return sum / arr.length;
}

function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

module.exports = {
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
