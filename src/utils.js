import {_extend as extend} from 'util';

// TODO: recursive clone
const clone = (obj) => {
  return extend({}, obj);
};

export function copyAndExtend(original, changes = {}) {
  const copy = clone(original);
  extend(copy, changes);
  return copy;
}

export function inArray(val, array) {
  for (const arrayVal of array) {
    if (val === arrayVal) return true;
  }
  return false;
}

export function emptyFunc() {}

export function arrayMax(numArray) {
  return Math.max.apply(null, numArray);
}

export function arrayMin(numArray) {
  return Math.min.apply(null, numArray);
}

export function getExtremes(numArray) {
  const max = arrayMax(numArray);
  const min = arrayMin(numArray);
  const mid = (max + min) / 2;
  return [max, mid, min];
}

export function callIfExists(callback) {
  if (callback) callback();
}

export function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}
