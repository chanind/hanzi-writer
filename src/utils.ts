import { ColorObject, RecursivePartial } from './typings/types';

// hacky way to get around rollup not properly setting `global` to `window` in browser
const globalObj = typeof window === 'undefined' ? global : window;

export const performanceNow =
  (globalObj.performance && (() => globalObj.performance.now())) || (() => Date.now());
export const requestAnimationFrame =
  globalObj.requestAnimationFrame ||
  ((callback) => setTimeout(() => callback(performanceNow()), 1000 / 60));
export const cancelAnimationFrame = globalObj.cancelAnimationFrame || clearTimeout;

// Object.assign polyfill, because IE :/
export const _assign = function (target: any, ...overrides: any[]) {
  const overrideTarget = Object(target);
  overrides.forEach((override) => {
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

export const assign = Object.assign || _assign;

export function arrLast<TValue>(arr: Array<TValue>) {
  return arr[arr.length - 1];
}

export const fixIndex = (index: number, length: number) => {
  // helper to handle negative indexes in array indices
  if (index < 0) {
    return length + index;
  }
  return index;
};

export const selectIndex = <T>(arr: Array<T>, index: number) => {
  // helper to select item from array at index, supporting negative indexes
  return arr[fixIndex(index, arr.length)];
};

export function copyAndMergeDeep<T>(base: T, override: RecursivePartial<T> | undefined) {
  const output = { ...base };
  for (const key in override) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (baseVal === overrideVal) {
      continue;
    }
    if (
      baseVal &&
      overrideVal &&
      typeof baseVal === 'object' &&
      typeof overrideVal === 'object' &&
      !Array.isArray(overrideVal)
    ) {
      output[key] = copyAndMergeDeep(baseVal, overrideVal);
    } else {
      // @ts-ignore
      output[key] = overrideVal;
    }
  }
  return output;
}

/** basically a simplified version of lodash.get, selects a key out of an object like 'a.b' from {a: {b: 7}} */
export function inflate(scope: string, obj: any): any {
  const parts = scope.split('.');
  const final: any = {};
  let current = final;
  for (let i = 0; i < parts.length; i++) {
    const cap = i === parts.length - 1 ? obj : {};
    current[parts[i]] = cap;
    current = cap;
  }
  return final;
}

let count = 0;

export function counter() {
  count++;
  return count;
}

export function average(arr: number[]) {
  const sum = arr.reduce((acc, val) => val + acc, 0);
  return sum / arr.length;
}

export function timeout(duration = 0) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function colorStringToVals(colorString: string): ColorObject {
  const normalizedColor = colorString.toUpperCase().trim();
  // based on https://stackoverflow.com/a/21648508
  if (/^#([A-F0-9]{3}){1,2}$/.test(normalizedColor)) {
    let hexParts = normalizedColor.substring(1).split('');
    if (hexParts.length === 3) {
      hexParts = [
        hexParts[0],
        hexParts[0],
        hexParts[1],
        hexParts[1],
        hexParts[2],
        hexParts[2],
      ];
    }
    const hexStr = `${hexParts.join('')}`;
    return {
      r: parseInt(hexStr.slice(0, 2), 16),
      g: parseInt(hexStr.slice(2, 4), 16),
      b: parseInt(hexStr.slice(4, 6), 16),
      a: 1,
    };
  }
  const rgbMatch = normalizedColor.match(
    /^RGBA?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d*\.?\d+))?\)$/,
  );
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

export const trim = (string: string) => string.replace(/^\s+/, '').replace(/\s+$/, '');

// return a new array-like object with int keys where each key is item
// ex: objRepeat({x: 8}, 3) === {0: {x: 8}, 1: {x: 8}, 2: {x: 8}}
export function objRepeat<T>(item: T, times: number) {
  const obj: Record<number, T> = {};
  for (let i = 0; i < times; i++) {
    obj[i] = item;
  }
  return obj;
}

// similar to objRepeat, but takes in a callback which is called for each index in the object
export function objRepeatCb<T>(times: number, cb: (i: number) => T) {
  const obj: Record<number, T> = {};
  for (let i = 0; i < times; i++) {
    obj[i] = cb(i);
  }
  return obj;
}

const ua = globalObj.navigator?.userAgent || '';

export const isMsBrowser =
  ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
