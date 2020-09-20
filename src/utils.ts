import { RecursivePartial } from "typings/types";

export const cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

export function arrLast<TValue>(arr: Array<TValue>) {
  return arr[arr.length - 1];
}

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
      typeof baseVal === "object" &&
      typeof overrideVal === "object" &&
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

export function colorStringToVals(colorString: string | null) {
  if (typeof colorString !== "string") {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    };
  }
  const normalizedColor = colorString.toUpperCase().trim();
  // based on https://stackoverflow.com/a/21648508
  if (/^#([A-F0-9]{3}){1,2}$/.test(normalizedColor)) {
    let hexParts = normalizedColor.substring(1).split("");
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
    const hexStr = `${hexParts.join("")}`;
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

export const trim = (string: string) => string.replace(/^\s+/, "").replace(/\s+$/, "");

// return a new array-like object with int keys where each key is item
// ex: objRepeat({x: 8}, 3) === {0: {x: 8}, 1: {x: 8}, 2: {x: 8}}
export function objRepeat<T>(item: T, times: number) {
  const obj: Record<number, T> = {};
  for (let i = 0; i < times; i++) {
    obj[i] = item;
  }
  return obj;
}

const ua = window.navigator?.userAgent || "";

export const isMsBrowser =
  ua.indexOf("MSIE ") > 0 || ua.indexOf("Trident/") > 0 || ua.indexOf("Edge/") > 0;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
