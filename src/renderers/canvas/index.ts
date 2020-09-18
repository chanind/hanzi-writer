import { RenderTargetInitFunction } from "renderers/RenderTargetBase";
import HanziWriterRenderer from "./HanziWriterRenderer";
import RenderTarget from "./RenderTarget";

export default {
  HanziWriterRenderer,
  createRenderTarget: RenderTarget.init as RenderTargetInitFunction<HTMLCanvasElement>,
};
