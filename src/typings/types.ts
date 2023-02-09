import RenderTargetBase from '../renderers/RenderTargetBase';
import { HanziWriterRendererConstructor } from '../renderers/HanziWriterRendererBase';
import type { PositionerOptions } from '../Positioner';

export type { PositionerOptions };

export type CharacterJson = {
  strokes: string[];
  medians: number[][][];
  radStrokes?: number[];
};

export type CharDataLoaderFn = (
  char: string,
  onLoad: (data: CharacterJson) => void,
  onError: (err?: any) => void,
) => Promise<CharacterJson> | CharacterJson | void;

export type Point = { x: number; y: number };

export type ColorObject = { r: number; g: number; b: number; a: number };

export type ColorOptions = {
  /** (Hex string, Default: "#555"). The color to draw each stroke. */
  strokeColor: string;
  /** (Hex string, Default: null). The color to draw the radical in the stroke, if radical data is present. Radicals will be drawn the same color as other strokes if this is not set. */
  radicalColor: string | null;
  /** (Hex string, Default: "#AAF"). The color to use for highlighting in quizzes. */
  highlightColor: string;
  /** (Hex string, Default: "#DDD"). The color of the character outline.  */
  outlineColor: string;
  /** (Hex string, Default: "#333"). The color of the lines drawn by users during quizzing. */
  drawingColor: string;
  /** (Hex string, Default: null). The color to use when highlighting the character on complete in quizzes. If not set, `highlightColor` will be used instead. Only relevant if `highlightOnComplete` is `true`. */
  highlightCompleteColor: string | null;
};

export type OnCompleteFunction = (res: { canceled: boolean }) => void;

/** Creates a render target (e.g. svg, canvas) */
export type RenderTargetInitFunction<
  TElement extends HTMLElement | SVGElement | SVGSVGElement | HTMLCanvasElement
> = (
  elmOrId: string | TElement,
  width?: string | number | null,
  height?: string | number | null,
) => RenderTargetBase<TElement>;

export type StrokeData = {
  character: string;
  drawnPath: {
    pathString: string;
    points: Point[];
  };
  isBackwards: boolean;
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
  /** After a quiz is completed successfully, the character will flash briefly. Default: true */
  highlightOnComplete: boolean;
  /** Whether to treat strokes which are correct besides their direction as correct. */
  acceptBackwardsStrokes: boolean;
  /** Begin quiz on this stroke number rather than stroke 0 */
  quizStartStrokeNum: number;
  /** After a user makes this many mistakes, just mark the stroke correct and move on. Default: false */
  markStrokeCorrectAfterMisses: number | false;
  onMistake?: (strokeData: StrokeData) => void;
  onCorrectStroke?: (strokeData: StrokeData) => void;
  /** Callback when the quiz completes */
  onComplete?: (summary: { character: string; totalMistakes: number }) => void;
};

export type LoadingManagerOptions = {
  charDataLoader: CharDataLoaderFn;
  onLoadCharDataSuccess?: null | ((data: CharacterJson) => void);
  onLoadCharDataError?: null | ((error?: Error | string) => void);
};

type BaseHanziWriterOptions = {
  showOutline: boolean;
  showCharacter: boolean;
  /** Default: svg */
  renderer: 'svg' | 'canvas';

  // Animation options

  /** Default: 1 */
  strokeAnimationSpeed: number;
  /** Default: 400 */
  strokeFadeDuration: number;
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
    HanziWriterRenderer?: HanziWriterRendererConstructor;
    createRenderTarget?: RenderTargetInitFunction<any>;
  };

  /** @deprecated Use `strokeAnimationSpeed` */
  strokeAnimationDuration?: number;
  /** @deprecated Use `strokeHighlightSpeed` */
  strokeHighlightDuration: number;
};

export type HanziWriterOptions = Partial<PositionerOptions> &
  QuizOptions &
  ColorOptions &
  LoadingManagerOptions &
  BaseHanziWriterOptions;

export type DimensionOptions = {
  width: number;
  height: number;
  padding: number;
};

export type ParsedHanziWriterOptions = QuizOptions &
  LoadingManagerOptions &
  BaseHanziWriterOptions &
  ColorOptions &
  DimensionOptions;

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
