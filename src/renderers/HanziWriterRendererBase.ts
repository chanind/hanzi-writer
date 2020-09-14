import Character from "../models/Character";
import Positioner from "../Positioner";
import { RenderStateObject } from "../RenderState";
import RenderTargetBase from "./RenderTargetBase";

export default class HanziWriterRendererBase<
  TElementType extends HTMLElement | HTMLCanvasElement | SVGElement | SVGSVGElement,
  TRenderTarget extends RenderTargetBase<TElementType>
> {
  _character: Character;
  _positioner: Positioner;

  constructor(character: Character, positioner: Positioner) {
    this._character = character;
    this._positioner = positioner;
  }

  mount(target: TRenderTarget) {}

  render(props: RenderStateObject) {}

  destroy() {}
}
