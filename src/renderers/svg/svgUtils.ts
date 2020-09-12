// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'createElm'... Remove this comment to see the full error message
function createElm(elmType: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'document' does not exist on type 'Global... Remove this comment to see the full error message
  return global.document.createElementNS('http://www.w3.org/2000/svg', elmType);
}

function attr(elm: any, name: any, value: any) {
  elm.setAttributeNS(null, name, value);
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'attrs'.
function attrs(elm: any, attrsMap: any) {
  Object.keys(attrsMap).forEach(attrName => attr(elm, attrName, attrsMap[attrName]));
}

// inspired by https://talk.observablehq.com/t/hanzi-writer-renders-incorrectly-inside-an-observable-notebook-on-a-mobile-browser/1898
function urlIdRef(id: any) {
  let prefix = '';
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'Global... Remove this comment to see the full error message
  if (global.location && global.location.href) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'Global... Remove this comment to see the full error message
    prefix = global.location.href.replace(/#[^#]*$/, '');
  }
  return `url(${prefix}#${id})`;
}

function removeElm(elm: any) {
  if (elm) elm.parentNode.removeChild(elm);
}

module.exports = { createElm, attrs, attr, removeElm, urlIdRef };
