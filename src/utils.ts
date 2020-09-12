function emptyFunc() {}

const performanceNow = (global.performance && (() => global.performance.now())) || (() => Date.now());
const requestAnimationFrame = global.requestAnimationFrame || (callback => setTimeout(() => callback(performanceNow()), 1000 / 60));
const cancelAnimationFrame = global.cancelAnimationFrame || clearTimeout;

// Object.assign polyfill, because IE :/
const _assign = function(target, ...overrides) {
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

const assign = Object.assign || _assign;

const arrLast = (arr) => arr[arr.length - 1];

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

function callIfExists(callback, arg) {
  if (callback) callback(arg);
  return arg;
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

function colorStringToVals(colorString) {
  const normalizedColor = colorString.toUpperCase().trim();
  // based on https://stackoverflow.com/a/21648508
  if (/^#([A-F0-9]{3}){1,2}$/.test(normalizedColor)) {
    let hexParts = normalizedColor.substring(1).split('');
    if (hexParts.length === 3) {
      hexParts = [hexParts[0], hexParts[0], hexParts[1], hexParts[1], hexParts[2], hexParts[2]];
    }
    const hexStr = `${hexParts.join('')}`;
    return {
      r: parseInt(hexStr.slice(0, 2), 16),
      g: parseInt(hexStr.slice(2, 4), 16),
      b: parseInt(hexStr.slice(4, 6), 16),
      a: 1,
    };
  }
  const rgbMatch = normalizedColor.match(/^RGBA?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d*\.?\d+))?\)$/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: parseFloat(rgbMatch[4] || 1, 10),
    };
  }
  throw new Error(`Invalid color: ${colorString}`);
}

const trim = (string) => string.replace(/^\s+/, '').replace(/\s+$/, '');

// return a new array-like object with int keys where each key is item
// ex: objRepeat({x: 8}, 3) === {0: {x: 8}, 1: {x: 8}, 2: {x: 8}}
const objRepeat = (item, times) => {
  const obj = {};
  for (let i = 0; i < times; i++) {
    obj[i] = item;
  }
  return obj;
};

const ua = (global.navigator && global.navigator.userAgent) || '';
const isMsBrowser = ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0;

module.exports = {
  _assign,
  arrLast,
  assign,
  average,
  callIfExists,
  cancelAnimationFrame,
  colorStringToVals,
  copyAndMergeDeep,
  counter,
  emptyFunc,
  inflate,
  objRepeat,
  performanceNow,
  requestAnimationFrame,
  timeout,
  trim,
  isMsBrowser,
};
