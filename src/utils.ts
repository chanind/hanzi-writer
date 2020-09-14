export const cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

export const arrLast = (arr: any[]) => arr[arr.length - 1];

export function copyAndMergeDeep(base: any, override: any) {
  const output = { ...base };
  for (const key in override) {
    // eslint-disable-line guard-for-in
    // skipping hasOwnProperty check for performance reasons - we shouldn't be passing any objects
    // in here that aren't plain objects anyway and this is a hot code path
    const baseVal = base[key];
    const overrideVal = override[key];
    if (baseVal === overrideVal) continue; // eslint-disable-line no-continue
    if (
      baseVal &&
      overrideVal &&
      typeof baseVal === "object" &&
      typeof overrideVal === "object" &&
      !Array.isArray(overrideVal)
    ) {
      output[key] = copyAndMergeDeep(baseVal, overrideVal);
    } else {
      output[key] = overrideVal;
    }
  }
  return output;
}

export function inflate<TObj extends {}>(scope: string, obj: TObj) {
  const parts = scope.split(".");
  const final = {};
  let current: Record<string, any> = final;
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

export function average(arr: any) {
  const sum = arr.reduce((acc: any, val: any) => val + acc, 0);
  return sum / arr.length;
}

export function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

export function colorStringToVals(colorString: any) {
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

export const trim = (string: any) => string.replace(/^\s+/, "").replace(/\s+$/, "");

// return a new array-like object with int keys where each key is item
// ex: objRepeat({x: 8}, 3) === {0: {x: 8}, 1: {x: 8}, 2: {x: 8}}
export const objRepeat = (item: any, times: any) => {
  const obj = {};
  for (let i = 0; i < times; i++) {
    obj[i] = item;
  }
  return obj;
};

const ua = window.navigator?.userAgent || "";

export const isMsBrowser =
  ua.indexOf("MSIE ") > 0 || ua.indexOf("Trident/") > 0 || ua.indexOf("Edge/") > 0;
