import { LoadingManagerOptions } from "../LoadingManager";
import { PositionerOptions } from "../Positioner";
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

export type StrokeData = {
  character: string;
  drawnPath: {
    pathString: string;
    points: Point[];
  };
  strokeNum: number;
  mistakesOnStroke: number;
  totalMistakes: number;
  strokesRemaining: number;
};

export type QuizOptions = {
  /** Default: 1. This can be set to make stroke grading more or less lenient. The closer this is to 0 the more strictly the quiz is graded. */
  leniency: number;
  /** Highlights the correct stroke after a set number of incorrect attempts. Setting `false` disables entirely. Default: 3 */
  showHintAfterMisses: number | false;
  /** After a quiz is completed successfully it will flash briefly. Default: true */
  highlightOnComplete: boolean;
  highlightCompleteColor: string | null;
  onMistake?: (strokeData: StrokeData) => void;
  onCorrectStroke?: (strokeData: StrokeData) => void;
  onComplete?: (summary: { character: string; totalMistakes: number }) => void;
};

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
