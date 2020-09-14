export function createElm(elmType: string) {
  return document.createElementNS("http://www.w3.org/2000/svg", elmType);
}

export function attr(elm: Element, name: string, value: string) {
  elm.setAttributeNS(null, name, value);
}

export function attrs(elm: Element, attrsMap: Record<string, string>) {
  Object.keys(attrsMap).forEach((attrName) => attr(elm, attrName, attrsMap[attrName]));
}

// inspired by https://talk.observablehq.com/t/hanzi-writer-renders-incorrectly-inside-an-observable-notebook-on-a-mobile-browser/1898
export function urlIdRef(id: string) {
  let prefix = "";
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'Global... Remove this comment to see the full error message
  if (global.location && global.location.href) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'Global... Remove this comment to see the full error message
    prefix = global.location.href.replace(/#[^#]*$/, "");
  }
  return `url(${prefix}#${id})`;
}

export function removeElm(elm: Element | undefined) {
  elm?.parentNode?.removeChild(elm);
}
