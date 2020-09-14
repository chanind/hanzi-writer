import { Point } from "../typings/types";

type BoundEvent = {
  getPoint(): Point;
  preventDefault(): void;
};

export type RenderTargetInitFunction<
  TElement extends HTMLElement | SVGElement | SVGSVGElement = HTMLElement
> = (
  elmOrId: string | TElement,
  width?: string | number,
  height?: string | number,
) => RenderTargetBase<TElement>;

export default class RenderTargetBase<
  TElement extends HTMLElement | SVGElement | SVGSVGElement = HTMLElement
> {
  node: TElement;

  constructor(node: TElement) {
    this.node = node;
  }

  addPointerStartListener(callback: (arg: BoundEvent) => void) {
    // @ts-expect-error
    this.node.addEventListener("mousedown", (evt: MouseEvent) => {
      callback(this._eventify(evt, this._getMousePoint));
    });
    // @ts-expect-error
    this.node.addEventListener("touchstart", (evt: TouchEvent) => {
      callback(this._eventify(evt, this._getTouchPoint));
    });
  }

  addPointerMoveListener(callback: (arg: BoundEvent) => void) {
    // @ts-expect-error
    this.node.addEventListener("mousemove", (evt: MouseEvent) => {
      callback(this._eventify(evt, this._getMousePoint));
    });
    // @ts-expect-error
    this.node.addEventListener("touchmove", (evt: TouchEvent) => {
      callback(this._eventify(evt, this._getTouchPoint));
    });
  }

  addPointerEndListener(callback: () => void) {
    // TODO: find a way to not need global listeners
    document.addEventListener("mouseup", callback);
    document.addEventListener("touchend", callback);
  }

  getBoundingClientRect() {
    return this.node.getBoundingClientRect();
  }

  _eventify<TEvent extends Event>(evt: TEvent, pointFunc: (event: TEvent) => Point) {
    return {
      getPoint: () => pointFunc.call(this, evt),
      preventDefault: () => evt.preventDefault(),
    };
  }

  _getMousePoint(evt: MouseEvent): Point {
    const box = this.getBoundingClientRect();
    const x = evt.clientX - box.left;
    const y = evt.clientY - box.top;
    return { x, y };
  }

  _getTouchPoint(evt: TouchEvent): Point {
    const box = this.getBoundingClientRect();
    const x = evt.touches[0].clientX - box.left;
    const y = evt.touches[0].clientY - box.top;
    return { x, y };
  }
}
