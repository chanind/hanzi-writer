import RenderTarget from '../RenderTarget';

describe('RenderTarget', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it('correctly initializes with an id selector', () => {
    const target = RenderTarget.init('target');
    expect(target.node).toBeTruthy();
    expect(target.node.nodeName.toUpperCase()).toBe('SVG');
  });

  it('correctly initializes with an element as an argument', () => {
    const targetElement = document.querySelector('#target')!;
    const target = RenderTarget.init(targetElement);
    expect(target.node).toBeTruthy();
    expect(target.node.nodeName.toUpperCase()).toBe('SVG');
  });

  it("doesn't create a new SVG element when an SVG target is given", () => {
    document.body.innerHTML = `<svg id="target"></svg>`;
    const targetElement = document.querySelector('#target')!;
    const target = RenderTarget.init(targetElement);
    expect(target.node).toEqual(targetElement);
  });

  it('invokes callback after mouse/touch start events', () => {
    const map: Record<string, any> = {};
    EventTarget.prototype.addEventListener = function (type, fn) {
      map[type] = fn;
    };

    const targetElement = document.querySelector('#target')!;

    const target = RenderTarget.init(targetElement);

    const pointerStartCallback = jest.fn();
    target.addPointerStartListener(pointerStartCallback);

    expect(pointerStartCallback).not.toBeCalled();

    map.mousedown({ target: targetElement, clientX: 100, clientY: 250 });
    expect(pointerStartCallback).toBeCalled();

    map.mousedown({ target: targetElement, clientX: 100, clientY: 250 });
    expect(pointerStartCallback).toBeCalledTimes(2);

    map.touchstart({ target: targetElement, clientX: 100, clientY: 250 });
    expect(pointerStartCallback).toBeCalledTimes(3);
  });

  it('invokes callback after mouse/touch move events', () => {
    const map: Record<string, any> = {};
    EventTarget.prototype.addEventListener = function (type, fn) {
      map[type] = fn;
    };

    const targetElement = document.querySelector('#target')!;

    const target = RenderTarget.init(targetElement);

    const pointerMoveCallback = jest.fn();
    target.addPointerMoveListener(pointerMoveCallback);

    expect(pointerMoveCallback).not.toBeCalled();

    map.mousemove({ target: targetElement, clientX: 100, clientY: 250 });
    expect(pointerMoveCallback).toBeCalled();

    map.mousemove({ target: targetElement, clientX: 100, clientY: 250 });
    expect(pointerMoveCallback).toBeCalledTimes(2);

    map.touchmove({ target: targetElement, clientX: 100, clientY: 250 });
    expect(pointerMoveCallback).toBeCalledTimes(3);
  });
});
