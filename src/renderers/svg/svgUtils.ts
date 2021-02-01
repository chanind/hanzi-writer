export function createElm(elmType: string) {
  return document.createElementNS('http://www.w3.org/2000/svg', elmType);
}

export function attr(elm: Element, name: string, value: string) {
  elm.setAttributeNS(null, name, value);
}

export function attrs(elm: Element, attrsMap: Record<string, string>) {
  Object.keys(attrsMap).forEach((attrName) => attr(elm, attrName, attrsMap[attrName]));
}

// inspired by https://talk.observablehq.com/t/hanzi-writer-renders-incorrectly-inside-an-observable-notebook-on-a-mobile-browser/1898
export function urlIdRef(id: string) {
  let prefix = '';
  if (window.location && window.location.href) {
    prefix = window.location.href.replace(/#[^#]*$/, '').replace(/"/gi, '%22');
  }
  return `url("${prefix}#${id}")`;
}

export function removeElm(elm: Element | undefined) {
  elm?.parentNode?.removeChild(elm);
}
