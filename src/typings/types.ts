import { LoadingManagerOptions } from "../LoadingManager";
import { PositionerOptions } from "../Positioner";
import { QuizOptions } from "../Quiz";
import HanziWriterRendererBase from "../renderers/HanziWriterRendererBase";
import { RenderTargetInitFunction } from "../renderers/RenderTargetBase";

export type CharacterJson = {
  strokes: string[];
  medians: [number, number][][];
  radStrokes?: number[];
};

export type CharDataLoaderFn = (
  char: string,
  onLoad: (data: CharacterJson) => void,
  onError: (err?: Error | string) => void,
) => Promise<CharacterJson> | CharacterJson | void;

export type Point = { x: number; y: number };

export type ColorObject = { r: number; g: number; b: number; a: number };

export type ColorOptions = {
  /** Default: "#555" */
  strokeColor: string | null;
  /** Default: null */
  radicalColor: string | null;
  /** Default: "#AAF" */
  highlightColor: string | null;
  /** Default: "#DDD" */
  outlineColor: string | null;
  /** Default: "#333" */
  drawingColor: string | null;
};

export type OnCompleteFunction = (res: { canceled: boolean }) => void;

export type HanziWriterOptions = PositionerOptions &
  QuizOptions &
  ColorOptions &
  LoadingManagerOptions & {
    showOutline: boolean;
    showCharacter: boolean;
    /** Default: svg */
    renderer: "svg" | "canvas";

    // Animation options

    /** Default: 1 */
    strokeAnimationSpeed: number;
    /** Default: 400 */
    strokeFadeDuration: number;
    /** Default: 200 */
    strokeHighlightDuration: number;
    /** Default: 2 */
    strokeHighlightSpeed: number;
    /** Default: 1000 */
    delayBetweenStrokes: number;
    /** Default: 2000 */
    delayBetweenLoops: number;

    /** Default: 300 */
    drawingFadeDuration: number;
    /** Default: 4 */
    drawingWidth: number;
    /** Default: 2 */
    strokeWidth: number;
    /** Default: 2 */
    outlineWidth: number;

    rendererOverride: {
      HanziWriterRenderer?: typeof HanziWriterRendererBase;
      createRenderTarget?: RenderTargetInitFunction;
    };
  };
