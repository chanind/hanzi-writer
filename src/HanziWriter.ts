import RenderState from './RenderState';
import parseCharData from './parseCharData';
import Positioner from './Positioner';
import Quiz from './Quiz';
import svgRenderer from './renderers/svg';
import canvasRenderer from './renderers/canvas';
import defaultOptions from './defaultOptions';
import LoadingManager from './LoadingManager';
import * as characterActions from './characterActions';
import { trim, colorStringToVals, selectIndex, fixIndex } from './utils';
import Character from './models/Character';
import HanziWriterRendererBase, {
  HanziWriterRendererConstructor,
} from './renderers/HanziWriterRendererBase';
import RenderTargetBase from './renderers/RenderTargetBase';
import { GenericMutation } from './Mutation';

// New modules
import { defaultVocabDataLoader, hasBuiltInVocabulary } from './vocabulary';

// Typings
import {
  ColorOptions,
  DimensionOptions,
  HanziWriterOptions,
  LoadingManagerOptions,
  OnCompleteFunction,
  ParsedHanziWriterOptions,
  QuizOptions,
  RenderTargetInitFunction,
  VocabularyData,
  WritingScore,
  UITheme,
  ThemeMode,
  ScoreOptions,
  VocabularyOptions,
} from './typings/types';

// Export type interfaces
export * from './typings/types';

export default class HanziWriter {
  _options: ParsedHanziWriterOptions;
  _loadingManager: LoadingManager;
  /** Only set when calling .setCharacter() */
  _char: string | undefined;
  /** Only set when calling .setCharacter() */
  _renderState: RenderState | undefined;
  /** Only set when calling .setCharacter() */
  _character: Character | undefined;
  /** Only set when calling .setCharacter() */
  _positioner: Positioner | undefined;
  /** Only set when calling .setCharacter() */
  _hanziWriterRenderer: HanziWriterRendererBase<HTMLElement, any> | null | undefined;
  /** Only set when calling .setCharacter() */
  _withDataPromise: Promise<void> | undefined;

  _quiz: Quiz | undefined;
  _renderer: {
    HanziWriterRenderer: HanziWriterRendererConstructor;
    createRenderTarget: RenderTargetInitFunction<any>;
  };

  target: RenderTargetBase;

  _vocabularyData: VocabularyData | undefined;
  _vocabDataLoader: typeof defaultVocabDataLoader;
  _currentTheme: ThemeMode = 'light';

  /** Main entry point */
  static create(
    element: string | HTMLElement,
    character: string,
    options?: Partial<HanziWriterOptions>,
  ) {
    const writer = new HanziWriter(element, options);
    writer.setCharacter(character);

    return writer;
  }

  /** Singleton instance of LoadingManager. Only set in `loadCharacterData` */
  static _loadingManager: LoadingManager | null = null;
  /** Singleton loading options. Only set in `loadCharacterData` */
  static _loadingOptions: Partial<HanziWriterOptions> | null = null;

  static loadCharacterData(
    character: string,
    options: Partial<LoadingManagerOptions> = {},
  ) {
    const loadingManager = (() => {
      const { _loadingManager, _loadingOptions } = HanziWriter;
      if (_loadingManager?._loadingChar === character && _loadingOptions === options) {
        return _loadingManager;
      }
      return new LoadingManager({ ...defaultOptions, ...options });
    })();

    HanziWriter._loadingManager = loadingManager;
    HanziWriter._loadingOptions = options;
    return loadingManager.loadCharData(character);
  }

  static getScalingTransform(width: number, height: number, padding = 0) {
    const positioner = new Positioner({ width, height, padding });
    return {
      x: positioner.xOffset,
      y: positioner.yOffset,
      scale: positioner.scale,
      transform: trim(`
        translate(${positioner.xOffset}, ${positioner.height - positioner.yOffset})
        scale(${positioner.scale}, ${-1 * positioner.scale})
      `).replace(/\s+/g, ' '),
    };
  }

  constructor(element: string | HTMLElement, options: Partial<HanziWriterOptions> = {}) {
    const { HanziWriterRenderer, createRenderTarget } =
      options.renderer === 'canvas' ? canvasRenderer : svgRenderer;
    const rendererOverride = options.rendererOverride || {};

    this._renderer = {
      HanziWriterRenderer: rendererOverride.HanziWriterRenderer || HanziWriterRenderer,
      createRenderTarget: rendererOverride.createRenderTarget || createRenderTarget,
    };
    // wechat miniprogram component needs direct access to the render target, so this is public
    this.target = this._renderer.createRenderTarget(
      element,
      options.width,
      options.height,
    );
    this._options = this._assignOptions(options);
    this._loadingManager = new LoadingManager(this._options);
    
    this._vocabDataLoader = defaultVocabDataLoader;
    this._currentTheme = this._options.theme || 'light';
    
    this._setupListeners();
  }

  showCharacter(
    options: {
      onComplete?: OnCompleteFunction;
      duration?: number;
    } = {},
  ) {
    this._options.showCharacter = true;
    return this._withData(() =>
      this._renderState
        ?.run(
          characterActions.showCharacter(
            'main',
            this._character!,
            typeof options.duration === 'number'
              ? options.duration
              : this._options.strokeFadeDuration,
          ),
        )
        .then((res) => {
          options.onComplete?.(res);
          return res;
        }),
    );
  }

  hideCharacter(
    options: {
      onComplete?: OnCompleteFunction;
      duration?: number;
    } = {},
  ) {
    this._options.showCharacter = false;
    return this._withData(() =>
      this._renderState
        ?.run(
          characterActions.hideCharacter(
            'main',
            this._character!,
            typeof options.duration === 'number'
              ? options.duration
              : this._options.strokeFadeDuration,
          ),
        )
        .then((res) => {
          options.onComplete?.(res);
          return res;
        }),
    );
  }

  animateCharacter(
    options: {
      onComplete?: OnCompleteFunction;
    } = {},
  ) {
    this.cancelQuiz();

    return this._withData(() =>
      this._renderState
        ?.run(
          characterActions.animateCharacter(
            'main',
            this._character!,
            this._options.strokeFadeDuration,
            this._options.strokeAnimationSpeed,
            this._options.delayBetweenStrokes,
          ),
        )
        .then((res) => {
          options.onComplete?.(res);
          return res;
        }),
    );
  }

  animateStroke(
    strokeNum: number,
    options: {
      onComplete?: OnCompleteFunction;
    } = {},
  ) {
    this.cancelQuiz();
    return this._withData(() =>
      this._renderState
        ?.run(
          characterActions.animateSingleStroke(
            'main',
            this._character!,
            fixIndex(strokeNum, this._character!.strokes.length),
            this._options.strokeAnimationSpeed,
          ),
        )
        .then((res) => {
          options.onComplete?.(res);
          return res;
        }),
    );
  }

  highlightStroke(
    strokeNum: number,
    options: {
      onComplete?: OnCompleteFunction;
    } = {},
  ) {
    const promise = () => {
      if (!this._character || !this._renderState) {
        return;
      }

      return this._renderState
        .run(
          characterActions.highlightStroke(
            selectIndex(this._character.strokes, strokeNum),
            colorStringToVals(this._options.highlightColor),
            this._options.strokeHighlightSpeed,
          ),
        )
        .then((res) => {
          options.onComplete?.(res);
          return res;
        });
    };

    return this._withData(promise);
  }

  async loopCharacterAnimation() {
    this.cancelQuiz();
    return this._withData(() =>
      this._renderState!.run(
        characterActions.animateCharacterLoop(
          'main',
          this._character!,
          this._options.strokeFadeDuration,
          this._options.strokeAnimationSpeed,
          this._options.delayBetweenStrokes,
          this._options.delayBetweenLoops,
        ),
        { loop: true },
      ),
    );
  }

  pauseAnimation() {
    return this._withData(() => this._renderState?.pauseAll());
  }

  resumeAnimation() {
    return this._withData(() => this._renderState?.resumeAll());
  }

  showOutline(
    options: {
      duration?: number;
      onComplete?: OnCompleteFunction;
    } = {},
  ) {
    this._options.showOutline = true;
    return this._withData(() =>
      this._renderState
        ?.run(
          characterActions.showCharacter(
            'outline',
            this._character!,
            typeof options.duration === 'number'
              ? options.duration
              : this._options.strokeFadeDuration,
          ),
        )
        .then((res) => {
          options.onComplete?.(res);
          return res;
        }),
    );
  }

  hideOutline(
    options: {
      duration?: number;
      onComplete?: OnCompleteFunction;
    } = {},
  ) {
    this._options.showOutline = false;
    return this._withData(() =>
      this._renderState
        ?.run(
          characterActions.hideCharacter(
            'outline',
            this._character!,
            typeof options.duration === 'number'
              ? options.duration
              : this._options.strokeFadeDuration,
          ),
        )
        .then((res) => {
          options.onComplete?.(res);
          return res;
        }),
    );
  }

  /** Updates the size of the writer instance without resetting render state */
  updateDimensions({ width, height, padding }: Partial<DimensionOptions>) {
    if (width !== undefined) this._options.width = width;
    if (height !== undefined) this._options.height = height;
    if (padding !== undefined) this._options.padding = padding;
    this.target.updateDimensions(this._options.width, this._options.height);
    // if there's already a character drawn, destroy and recreate the renderer in the same state
    if (
      this._character &&
      this._renderState &&
      this._hanziWriterRenderer &&
      this._positioner
    ) {
      this._hanziWriterRenderer.destroy();
      const hanziWriterRenderer = this._initAndMountHanziWriterRenderer(this._character);
      // TODO: this should probably implement EventEmitter instead of manually tracking updates like this
      this._renderState.overwriteOnStateChange((nextState) =>
        hanziWriterRenderer.render(nextState),
      );
      hanziWriterRenderer.render(this._renderState.state);
      // update the current quiz as well, if one is active
      if (this._quiz) {
        this._quiz.setPositioner(this._positioner);
      }
    }
  }

  updateColor(
    colorName: keyof ColorOptions,
    colorVal: string | null,
    options: {
      duration?: number;
      onComplete?: OnCompleteFunction;
    } = {},
  ) {
    let mutations: GenericMutation[] = [];

    const fixedColorVal = (() => {
      // If we're removing radical color, tween it to the stroke color
      if (colorName === 'radicalColor' && !colorVal) {
        return this._options.strokeColor;
      }
      return colorVal;
    })();

    const mappedColor = colorStringToVals(fixedColorVal as string);

    this._options[colorName] = colorVal as any;

    const duration = options.duration ?? this._options.strokeFadeDuration;

    mutations = mutations.concat(
      characterActions.updateColor(colorName, mappedColor, duration),
    );

    // make sure to set radicalColor back to null after the transition finishes if val == null
    if (colorName === 'radicalColor' && !colorVal) {
      mutations = mutations.concat(characterActions.updateColor(colorName, null, 0));
    }

    return this._withData(() =>
      this._renderState?.run(mutations).then((res) => {
        options.onComplete?.(res);
        return res;
      }),
    );
  }

  quiz(quizOptions: Partial<QuizOptions> = {}) {
    return this._withData(async () => {
      if (this._character && this._renderState && this._positioner) {
        this.cancelQuiz();
        this._quiz = new Quiz(this._character, this._renderState, this._positioner);
        this._options = {
          ...this._options,
          ...quizOptions,
        };
        this._quiz.startQuiz(this._options);
      }
    });
  }

  skipQuizStroke() {
    if (this._quiz) {
      this._quiz.nextStroke();
    }
  }

  cancelQuiz() {
    if (this._quiz) {
      this._quiz.cancel();
      this._quiz = undefined;
    }
  }

  setCharacter(char: string) {
    this.cancelQuiz();
    this._char = char;
    if (this._hanziWriterRenderer) {
      this._hanziWriterRenderer.destroy();
    }
    if (this._renderState) {
      this._renderState.cancelAll();
    }
    this._hanziWriterRenderer = null;
    this._withDataPromise = this._loadingManager
      .loadCharData(char)
      .then((pathStrings) => {
        // if "pathStrings" isn't set, ".catch()"" was probably called and loading likely failed
        if (!pathStrings || this._loadingManager.loadingFailed) {
          return;
        }

        this._character = parseCharData(char, pathStrings);
        this._renderState = new RenderState(this._character, this._options, (nextState) =>
          hanziWriterRenderer.render(nextState),
        );

        const hanziWriterRenderer = this._initAndMountHanziWriterRenderer(
          this._character,
        );
        hanziWriterRenderer.render(this._renderState.state);
      });
    return this._withDataPromise;
  }

  _initAndMountHanziWriterRenderer(character: Character) {
    const { width, height, padding } = this._options;
    this._positioner = new Positioner({ width, height, padding });
    const hanziWriterRenderer = new this._renderer.HanziWriterRenderer(
      character,
      this._positioner,
    );
    hanziWriterRenderer.mount(this.target);
    this._hanziWriterRenderer = hanziWriterRenderer;
    return hanziWriterRenderer;
  }

  async getCharacterData(): Promise<Character> {
    if (!this._char) {
      throw new Error('setCharacter() must be called before calling getCharacterData()');
    }
    const character = await this._withData(() => this._character);
    return character!;
  }

  _assignOptions(options: Partial<HanziWriterOptions>): ParsedHanziWriterOptions {
    const mergedOptions = {
      ...defaultOptions,
      ...options,
    };

    // backfill strokeAnimationSpeed if deprecated strokeAnimationDuration is provided instead
    if (options.strokeAnimationDuration && !options.strokeAnimationSpeed) {
      mergedOptions.strokeAnimationSpeed = 500 / options.strokeAnimationDuration;
    }
    if (options.strokeHighlightDuration && !options.strokeHighlightSpeed) {
      mergedOptions.strokeHighlightSpeed = 500 / mergedOptions.strokeHighlightDuration;
    }

    if (!options.highlightCompleteColor) {
      mergedOptions.highlightCompleteColor = mergedOptions.highlightColor;
    }

    return this._fillWidthAndHeight(mergedOptions);
  }

  /** returns a new options object with width and height filled in if missing */
  _fillWidthAndHeight(options: HanziWriterOptions): ParsedHanziWriterOptions {
    const filledOpts = { ...options };
    if (filledOpts.width && !filledOpts.height) {
      filledOpts.height = filledOpts.width;
    } else if (filledOpts.height && !filledOpts.width) {
      filledOpts.width = filledOpts.height;
    } else if (!filledOpts.width && !filledOpts.height) {
      const { width, height } = this.target.getBoundingClientRect();
      const minDim = Math.min(width, height);
      filledOpts.width = minDim;
      filledOpts.height = minDim;
    }
    return filledOpts as ParsedHanziWriterOptions;
  }

  _withData<T>(func: () => T) {
    // if this._loadingManager.loadingFailed, then loading failed before this method was called
    if (this._loadingManager.loadingFailed) {
      throw Error('Failed to load character data. Call setCharacter and try again.');
    }

    if (this._withDataPromise) {
      return this._withDataPromise.then(() => {
        if (!this._loadingManager.loadingFailed) {
          return func();
        }
      });
    }
    return Promise.resolve().then(func);
  }

  _setupListeners() {
    this.target.addPointerStartListener((evt) => {
      if (this._quiz) {
        evt.preventDefault();
        this._quiz.startUserStroke(evt.getPoint());
      }
    });
    this.target.addPointerMoveListener((evt) => {
      if (this._quiz) {
        evt.preventDefault();
        this._quiz.continueUserStroke(evt.getPoint());
      }
    });
    this.target.addPointerEndListener(() => {
      this._quiz?.endUserStroke();
    });
  }

  getVocabulary(): VocabularyData | undefined {
    return this._vocabularyData;
  }

  async loadVocabulary(
    options?: Partial<VocabularyOptions>
  ): Promise<VocabularyData> {
    if (!this._char) {
      throw new Error('setCharacter() must be called before calling loadVocabulary()');
    }

    const vocabOptions = { ...this._options.vocabularyOptions, ...options };
    const vocabulary = this._vocabDataLoader(this._char, vocabOptions);
    
    this._vocabularyData = vocabulary;

    if (this._options.onVocabularyLoad) {
      this._options.onVocabularyLoad(vocabulary);
    }

    return vocabulary;
  }

  setVocabDataLoader(loader: typeof defaultVocabDataLoader): void {
    this._vocabDataLoader = loader;
  }

  hasBuiltInVocabulary(char?: string): boolean {
    const targetChar = char || this._char;
    if (!targetChar) return false;
    return hasBuiltInVocabulary(targetChar);
  }

  getWritingScore(): WritingScore | undefined {
    if (!this._quiz) {
      return undefined;
    }
    return this._quiz.calculateWritingScore();
  }

  getCurrentStrokeScores(): {
    strokeScores: any[];
    writingScore?: WritingScore;
  } {
    if (!this._quiz) {
      return { strokeScores: [] };
    }
    return this._quiz.getCurrentScores();
  }

  getTheme(): ThemeMode {
    return this._currentTheme;
  }

  setTheme(theme: ThemeMode): void {
    this._currentTheme = theme;
    this._options.theme = theme;
    this._applyThemeColors();
  }

  toggleTheme(): ThemeMode {
    const newTheme = this._currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }

  _applyThemeColors(): void {
    const isDark = this._currentTheme === 'dark';
    
    if (isDark) {
      if (!this._options.customTheme) {
        this._options.strokeColor = '#E0E0E0';
        this._options.outlineColor = '#424242';
        this._options.highlightColor = '#64B5F6';
        this._options.drawingColor = '#BBDEFB';
        this._options.radicalColor = '#FFAB91';
      }
    } else {
      if (!this._options.customTheme) {
        this._options.strokeColor = '#555';
        this._options.outlineColor = '#DDD';
        this._options.highlightColor = '#AAF';
        this._options.drawingColor = '#333';
        this._options.radicalColor = null;
      }
    }

    if (this._options.customTheme) {
      const custom = this._options.customTheme;
      if (custom.strokeColor) this._options.strokeColor = custom.strokeColor;
      if (custom.outlineColor) this._options.outlineColor = custom.outlineColor;
      if (custom.highlightColor) this._options.highlightColor = custom.highlightColor;
      if (custom.drawingColor) this._options.drawingColor = custom.drawingColor;
      if (custom.radicalColor !== undefined) this._options.radicalColor = custom.radicalColor;
    }
  }

  updateScoringOptions(options: Partial<ScoreOptions>): void {
    this._options.scoreOptions = {
      ...this._options.scoreOptions,
      ...options,
    };
  }

  updateVocabularyOptions(options: Partial<VocabularyOptions>): void {
    this._options.vocabularyOptions = {
      ...this._options.vocabularyOptions,
      ...options,
    };
  }

  getCurrentOptions(): ParsedHanziWriterOptions {
    return { ...this._options };
  }
}
