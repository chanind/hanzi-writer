import { Point } from "../typings/types";

type BoundEvent = {
  getPoint(): Point;
  preventDefault(): void;
};

/** Generic render target */
export default class RenderTargetBase<
  TElement extends
    | HTMLElement
    | SVGElement
    | SVGSVGElement
    | HTMLCanvasElement = HTMLElement
> {
  node: TElement;

  constructor(node: TElement) {
    this.node = node;
  }

  addPointerStartListener(callback: (arg: BoundEvent) => void) {
    this.node.addEventListener("mousedown", (evt) => {
      callback(this._eventify(evt as MouseEvent, this._getMousePoint));
    });
    this.node.addEventListener("touchstart", (evt) => {
      callback(this._eventify(evt as TouchEvent, this._getTouchPoint));
    });
  }

  addPointerMoveListener(callback: (arg: BoundEvent) => void) {
    this.node.addEventListener("mousemove", (evt) => {
      callback(this._eventify(evt as MouseEvent, this._getMousePoint));
    });
    this.node.addEventListener("touchmove", (evt) => {
      callback(this._eventify(evt as TouchEvent, this._getTouchPoint));
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
