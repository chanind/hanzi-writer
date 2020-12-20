import Character from '../models/Character';
import Positioner from '../Positioner';
import { RenderStateObject } from '../RenderState';
import RenderTargetBase from './RenderTargetBase';

export default interface HanziWriterRendererBase<
  TElementType extends HTMLElement | HTMLCanvasElement | SVGElement | SVGSVGElement,
  TRenderTarget extends RenderTargetBase<TElementType>
> {
  _character: Character;
  _positioner: Positioner;

  mount(target: TRenderTarget): void;

  render(props: RenderStateObject): void;

  destroy(): void;
}

export interface HanziWriterRendererConstructor {
  new (character: Character, positioner: Positioner): HanziWriterRendererBase<any, any>;
}
