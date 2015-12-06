import {_extend as extend} from 'util';
import {Promise} from 'es6-promise';

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

export function callIfExists(callback, ...args) {
  if (callback) callback(...args);
}

export function average(arr) {
  let sum = 0;
  for (const val of arr) {
    sum += val;
  }
  return sum / arr.length;
}

export function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}
