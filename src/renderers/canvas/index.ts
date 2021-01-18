import { RenderTargetInitFunction } from '../../typings/types';
import HanziWriterRenderer from './HanziWriterRenderer';
import RenderTarget from './RenderTarget';

export default {
  HanziWriterRenderer,
  createRenderTarget: RenderTarget.init as RenderTargetInitFunction<HTMLCanvasElement>,
};
