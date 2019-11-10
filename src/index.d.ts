
type charDataLoader = (
  char: string,
  onComplete: (char: string) => void,
  onError?: (error: any) => void,
) => void;

interface HanziWriterOptions {
  charDataLoader?: charDataLoader;
  onLoadCharDataError?: (error: any) => void;
  onLoadCharDataSuccess?: (char: string) => void;
  showOutline:? boolean;
  showCharacter?: boolean;
  renderer?: 'svg' | 'canvas';
  width?: number;
  height?: number;
  padding?: number;
  strokeAnimationSpeed?: number;
  strokeFadeDuration?: number;
  strokeHighlightDuration?: number;
  strokeHighlightSpeed?: number;
  delayBetweenStrokes?: number;
  delayBetweenLoops?: number;
  strokeColor?: string;
  radicalColor?: string;
  highlightColor?: string;
  outlineColor?: string;
  drawingColor?: string;
  leniency?: number;
  showHintAfterMisses?: number;
  highlightOnComplete?: boolean;
  highlightCompleteColor?: string;
}

type onCompleteFunc = (res: { canceled: boolean }) => void;
type colorName = 'strokeColor' | 'radicalColor' | 'highlightColor' | 'outlineColor' | 'drawingColor';

interface quizOptions {
  onComplete: (result: { totalMistakes: number; character: string }) => void;
  onCorrectStroke: (data: {
    totalMistakes: number;
    strokeNum: number;
    mistakesOnStroke: number;
    strokesRemaining: number;
    drawnPath: {
      pathString: string;
      points: Point[];
    }
  }) => void;
  onMistake: (data: {
    totalMistakes: number;
    strokeNum: number;
    mistakesOnStroke: number;
    strokesRemaining: number;
    drawnPath: {
      pathString: string;
      points: Point[];
    }
  }) => void;
}

interface Point {
  x: number;
  y: number;
}

interface rawCharData {
  strokes: string[];
  medians: [number, number][][];
  radStrokes: number[];
}

declare class HanziWriter {
  constructor(element: string | HTMLElement, options?: HanziWriterOptions);
  showCharacter(options?: { duration?: number; onComplete?: onCompleteFunc }): Promise<void>;
  hideCharacter(options?: { duration?: number; onComplete?: onCompleteFunc }): Promise<void>;
  showOutline(options?: { duration?: number; onComplete?: onCompleteFunc }): Promise<void>;
  hideOutline(options?: { duration?: number; onComplete?: onCompleteFunc }): Promise<void>;
  animateCharacter(options?: { onComplete?: onCompleteFunc }): Promise<void>;
  animateStroke(strokeNum: number, options?: { onComplete?: onCompleteFunc }): Promise<void>;
  highlightStroke(strokeNum: number, options?: { onComplete?: onCompleteFunc }): Promise<void>;
  loopCharacterAnimation(options?: {}): Promise<void>;
  updateColor(colorName: colorName, colorVal: string, options?: { duration?: number; onComplete?: onCompleteFunc }): Promise<void>;
  setCharacter(char: string): Promise<void>;
  quiz(options?: quizOptions): void;
  cancelQuiz(): void;

  static create(element: string | HTMLElement, character: string, options?: HanziWriterOptions): HanziWriter;
  static loadCharacterData(char: string, options?: {
    charDataLoader?: charDataLoader;
    onLoadCharDataSuccess?: (charData: rawCharData) => void;
    onLoadCharDataError?: (error: any) => void;
  }): void;
  static getScalingTransform(width: number, height: number, padding?: number): { x: number; y: number; scale: number; transform: string };
}

export default HanziWriter;