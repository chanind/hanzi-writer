import { ColorObject, RecursivePartial } from './typings/types';

// hacky way to get around rollup not properly setting `global` to `window` in browser
const globalObj = typeof window === 'undefined' ? global : window;

export const performanceNow = () => (globalObj?.performance || Date).now();
export const requestAnimationFrame =
  globalObj.requestAnimationFrame ||
  ((callback) => setTimeout(() => callback(performanceNow()), 1000 / 60));
export const cancelAnimationFrame = globalObj.cancelAnimationFrame || clearTimeout;

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

/**
 * Creates a new array with a given value and fills the array with the value a given number of times.
 *
 * e.g. objRepeat({x: 8}, 3) === [{x: 8}, {x: 8}, {x: 8}]
 */
export const objRepeat = <T>(value: T, times: number): T[] =>
  new Array(times).fill(value);

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

/**
 * A generator function to parse a given SVG path string and yield each command with its arguments
 *
 * This algo runs in O(n) time, which should be faster than applying regex parsing, splitting, filtering, and trimming
 */
export function* pathCommandGenerator(pathString: string): Generator<[string, number[]]> {
  let activeCommand = '';
  let args: number[] = [];
  let chars = '';

  for (let i = 0; i < pathString.length; i++) {
    const char = pathString[i].toUpperCase();

    // New command
    if (char === 'M' || char === 'C' || char === 'Q' || char === 'L' || char === 'Z') {
      // If we have a pending command, yield it along with its arguments
      if (activeCommand) {
        if (chars) {
          args.push(parseFloat(chars));
          chars = '';
        }
        yield [activeCommand, args];
      }
      // End path and break the loop
      if (char === 'Z') {
        yield ['Z', []];
        break;
      }
      // Else, start a new command
      activeCommand = char;
      args = [];
    } else if (char === ' ' || char === ',') {
      // Numbers are separated by spaces or commas
      if (chars) {
        args.push(parseFloat(chars));
      }
      chars = '';
    } else {
      // This *should* be a number or a decimal point
      chars += char;
    }
  }
}

const pathCommandSeparatorRegex = /\s+|[, ]+/;

export const getPathCommandParams = (
  pathCommand: string,
): {
  cmd: string;
  values: number[];
} => {
  const [cmd, ...params] = pathCommand.split(pathCommandSeparatorRegex);
  return { cmd, values: params.map((param) => parseFloat(param)) };
};
