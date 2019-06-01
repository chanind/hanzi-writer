function createElm(elmType) {
  return global.document.createElementNS('http://www.w3.org/2000/svg', elmType);
}

function attr(elm, name, value) {
  elm.setAttributeNS(null, name, value);
}

function attrs(elm, attrsMap) {
  Object.keys(attrsMap).forEach(attrName => attr(elm, attrName, attrsMap[attrName]));
}

// inspired by https://talk.observablehq.com/t/hanzi-writer-renders-incorrectly-inside-an-observable-notebook-on-a-mobile-browser/1898
function urlIdRef(id) {
  let prefix = '';
  if (global.location && global.location.href) {
    prefix = global.location.href.replace(/#[^#]*$/, '');
  }
  return `url(${prefix}#${id})`;
}

function removeElm(elm) {
  if (elm) elm.parentNode.removeChild(elm);
}

module.exports = { createElm, attrs, attr, removeElm, urlIdRef };
