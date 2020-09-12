function emptyFunc() {}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'performanc... Remove this comment to see the full error message
const performanceNow = (global.performance && (() => global.performance.now())) || (() => Date.now());
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'requestAni... Remove this comment to see the full error message
const requestAnimationFrame = global.requestAnimationFrame || ((callback: any) => setTimeout(() => callback(performanceNow()), 1000 / 60));
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cancelAnim... Remove this comment to see the full error message
const cancelAnimationFrame = global.cancelAnimationFrame || clearTimeout;

// Object.assign polyfill, because IE :/
// @ts-expect-error ts-migrate(7019) FIXME: Rest parameter 'overrides' implicitly has an 'any[... Remove this comment to see the full error message
const _assign = function(target: any, ...overrides) {
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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assign'.
const assign = Object.assign || _assign;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'arrLast'.
const arrLast = (arr: any) => arr[arr.length - 1];

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'copyAndMer... Remove this comment to see the full error message
function copyAndMergeDeep(base: any, override: any) {
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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'inflate'.
function inflate(scope: any, obj: any) {
  const parts = scope.split('.');
  const final = {};
  let current = final;
  for (let i = 0; i < parts.length; i++) {
    const cap = i === parts.length - 1 ? obj : {};
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    current[parts[i]] = cap;
    current = cap;
  }
  return final;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callIfExis... Remove this comment to see the full error message
function callIfExists(callback: any, arg: any) {
  if (callback) callback(arg);
  return arg;
}

let count = 0;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'counter'.
function counter() {
  count++;
  return count;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'average'.
function average(arr: any) {
  const sum = arr.reduce((acc: any, val: any) => val + acc, 0);
  return sum / arr.length;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'timeout'.
function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'colorStrin... Remove this comment to see the full error message
function colorStringToVals(colorString: any) {
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
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
      a: parseFloat(rgbMatch[4] || 1, 10),
    };
  }
  throw new Error(`Invalid color: ${colorString}`);
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'trim'.
const trim = (string: any) => string.replace(/^\s+/, '').replace(/\s+$/, '');

// return a new array-like object with int keys where each key is item
// ex: objRepeat({x: 8}, 3) === {0: {x: 8}, 1: {x: 8}, 2: {x: 8}}
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'objRepeat'... Remove this comment to see the full error message
const objRepeat = (item: any, times: any) => {
  const obj = {};
  for (let i = 0; i < times; i++) {
    // @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'numbe... Remove this comment to see the full error message
    obj[i] = item;
  }
  return obj;
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'navigator' does not exist on type 'Globa... Remove this comment to see the full error message
const ua = (global.navigator && global.navigator.userAgent) || '';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isMsBrowse... Remove this comment to see the full error message
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
