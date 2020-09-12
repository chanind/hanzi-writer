const RenderState = require('./RenderState');
const parseCharData = require('./parseCharData');
const Positioner = require('./Positioner');
const Quiz = require('./Quiz');
const svgRenderer = require('./renderers/svg');
const canvasRenderer = require('./renderers/canvas');
const defaultCharDataLoader = require('./defaultCharDataLoader');
const LoadingManager = require('./LoadingManager');
const characterActions = require('./characterActions');
const { assign, callIfExists, trim, colorStringToVals } = require('./utils');


const defaultOptions = {
  charDataLoader: defaultCharDataLoader,
  onLoadCharDataError: null,
  onLoadCharDataSuccess: null,
  showOutline: true,
  showCharacter: true,
  renderer: 'svg',

  // positioning options

  width: null,
  height: null,
  padding: 20,

  // animation options

  strokeAnimationSpeed: 1,
  strokeFadeDuration: 400,
  strokeHighlightDuration: 200,
  strokeHighlightSpeed: 2,
  delayBetweenStrokes: 1000,
  delayBetweenLoops: 2000,

  // colors

  strokeColor: '#555',
  radicalColor: null,
  highlightColor: '#AAF',
  outlineColor: '#DDD',
  drawingColor: '#333',

  // quiz options

  leniency: 1,
  showHintAfterMisses: 3,
  highlightOnComplete: true,
  highlightCompleteColor: null,

  // undocumented obscure options

  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  outlineWidth: 2,
  rendererOverride: {},
};

function HanziWriter(...args) {
  if (args.length > 0) {
    let character;
    let options = {};
    const element = args[0];
    if (args.length > 1) {
      if (typeof args[1] === 'string') {
        // eslint-disable-next-line
        console.warn('Using new HanziWriter() to set a character is deprecated. Use HanziWriter.create() instead');
        character = args[1];
        options = args[2] || {};
      } else {
        options = args[1];
      }
    }
    this._init(element, options);
    if (character) {
      this.setCharacter(character);
    }
  }
}

// ------ public API ------ //

HanziWriter.prototype.showCharacter = function(options = {}) {
  this._options.showCharacter = true;
  return this._withData(() => (
    this._renderState.run(characterActions.showCharacter(
      'main',
      this._character,
      typeof options.duration === 'number' ? options.duration : this._options.strokeFadeDuration,
    )).then(res => callIfExists(options.onComplete, res))
  ));
};
HanziWriter.prototype.hideCharacter = function(options = {}) {
  this._options.showCharacter = false;
  return this._withData(() => (
    this._renderState.run(characterActions.hideCharacter(
      'main',
      this._character,
      typeof options.duration === 'number' ? options.duration : this._options.strokeFadeDuration,
    )).then(res => callIfExists(options.onComplete, res))
  ));
};
HanziWriter.prototype.animateCharacter = function(options = {}) {
  this.cancelQuiz();
  return this._withData(() => (
    this._renderState.run(characterActions.animateCharacter(
      'main',
      this._character,
      this._options.strokeFadeDuration,
      this._options.strokeAnimationSpeed,
      this._options.delayBetweenStrokes,
    )).then(res => callIfExists(options.onComplete, res))
  ));
};
HanziWriter.prototype.animateStroke = function(strokeNum, options = {}) {
  this.cancelQuiz();
  return this._withData(() => (
    this._renderState.run(characterActions.animateSingleStroke(
      'main',
      this._character,
      strokeNum,
      this._options.strokeAnimationSpeed,
    )).then(res => callIfExists(options.onComplete, res))
  ));
};
HanziWriter.prototype.highlightStroke = function(strokeNum, options = {}) {
  return this._withData(() => (
    this._renderState.run(characterActions.highlightStroke(
      this._character.strokes[strokeNum],
      this._options.highlightColor,
      this._options.strokeHighlightSpeed,
    )).then(res => callIfExists(options.onComplete, res))
  ));
};
HanziWriter.prototype.loopCharacterAnimation = function(options = {}) {
  this.cancelQuiz();
  return this._withData(() => (
    this._renderState.run(characterActions.animateCharacterLoop(
      'main',
      this._character,
      this._options.strokeFadeDuration,
      this._options.strokeAnimationSpeed,
      this._options.delayBetweenStrokes,
      this._options.delayBetweenLoops,
    ), { loop: true })
  ));
};

HanziWriter.prototype.pauseAnimation = function() {
  return this._withData(() => this._renderState.pauseAll());
};

HanziWriter.prototype.resumeAnimation = function() {
  return this._withData(() => this._renderState.resumeAll());
};

HanziWriter.prototype.showOutline = function(options = {}) {
  this._options.showOutline = true;
  return this._withData(() => (
    this._renderState.run(characterActions.showCharacter(
      'outline',
      this._character,
      typeof options.duration === 'number' ? options.duration : this._options.strokeFadeDuration,
    )).then(res => callIfExists(options.onComplete, res))
  ));
};

HanziWriter.prototype.hideOutline = function(options = {}) {
  this._options.showOutline = false;
  return this._withData(() => (
    this._renderState.run(characterActions.hideCharacter(
      'outline',
      this._character,
      typeof options.duration === 'number' ? options.duration : this._options.strokeFadeDuration,
    )).then(res => callIfExists(options.onComplete, res))
  ));
};

HanziWriter.prototype.updateColor = function(colorName, colorVal, options = {}) {
  return this._withData(() => {
    const duration = typeof options.duration === 'number' ? options.duration : this._options.strokeFadeDuration;
    let fixedColorVal = colorVal;
    // If we're removing radical color, tween it to the stroke color
    if (colorName === 'radicalColor' && !colorVal) {
      fixedColorVal = this._options.strokeColor;
    }
    const mappedColor = colorStringToVals(fixedColorVal);
    this._options[colorName] = colorVal;
    let mutation = characterActions.updateColor(colorName, mappedColor, duration);
    // make sure to set radicalColor back to null after the transition finishes if val == null
    if (colorName === 'radicalColor' && !colorVal) {
      mutation = mutation.concat(characterActions.updateColor(colorName, null, 0));
    }
    return this._renderState.run(mutation).then(res => callIfExists(options.onComplete, res));
  });
};

HanziWriter.prototype.quiz = function(quizOptions = {}) {
  this._withData(() => {
    this.cancelQuiz();
    this._quiz = new Quiz(this._character, this._renderState, this._positioner);
    this._quiz.startQuiz(assign({}, this._options, quizOptions));
  });
};

HanziWriter.prototype.cancelQuiz = function() {
  if (this._quiz) {
    this._quiz.cancel();
    this._quiz = null;
  }
};

HanziWriter.prototype.setCharacter = function(char) {
  this.cancelQuiz();
  this._char = char;
  if (this._hanziWriterRenderer) this._hanziWriterRenderer.destroy();
  if (this._renderState) this._renderState.cancelAll();
  this._hanziWriterRenderer = null;
  this._withDataPromise = this._loadingManager.loadCharData(char).then(pathStrings => {
    if (this._loadingManager.loadingFailed) return;

    this._character = parseCharData(char, pathStrings);
    this._positioner = new Positioner(this._options);
    const hanziWriterRenderer = new this._renderer.HanziWriterRenderer(this._character, this._positioner);
    this._hanziWriterRenderer = hanziWriterRenderer;
    this._renderState = new RenderState(this._character, this._options, (nextState) => {
      hanziWriterRenderer.render(nextState);
    });
    this._hanziWriterRenderer.mount(this.target, this._renderState.state);
    this._hanziWriterRenderer.render(this._renderState.state);
  });
  return this._withDataPromise;
};

// ------------- //

HanziWriter.prototype._init = function(element, options) {
  const renderer = options.renderer === 'canvas' ? canvasRenderer : svgRenderer;
  const rendererOverride = options.rendererOverride || {};
  this._renderer = {
    HanziWriterRenderer: rendererOverride.HanziWriterRenderer || renderer.HanziWriterRenderer,
    createRenderTarget: rendererOverride.createRenderTarget || renderer.createRenderTarget,
  };
  // wechat miniprogram component needs direct access to the render target, so this is public
  this.target = this._renderer.createRenderTarget(element, options.width, options.height);
  this._options = this._assignOptions(options);
  this._loadingManager = new LoadingManager(this._options);
  this._setupListeners();
  this._quiz = null;
  return this;
};

HanziWriter.prototype._assignOptions = function(options) {
  const mergedOptions = assign({}, defaultOptions, options);

  // backfill strokeAnimationSpeed if deprecated strokeAnimationDuration is provided instead
  if (options.strokeAnimationDuration && !options.strokeAnimationSpeed) {
    mergedOptions.strokeAnimationSpeed = 500 / mergedOptions.strokeAnimationDuration;
  }
  if (options.strokeHighlightDuration && !options.strokeHighlightSpeed) {
    mergedOptions.strokeHighlightSpeed = 500 / mergedOptions.strokeHighlightDuration;
  }

  if (!options.highlightCompleteColor) {
    mergedOptions.highlightCompleteColor = mergedOptions.highlightColor;
  }

  return this._fillWidthAndHeight(mergedOptions);
};

// returns a new options object with width and height filled in if missing
HanziWriter.prototype._fillWidthAndHeight = function(options) {
  const filledOpts = assign({}, options);
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
  return filledOpts;
};

HanziWriter.prototype._withData = function(func) {
  // if this._loadingManager.loadingFailed, then loading failed before this method was called
  if (this._loadingManager.loadingFailed) {
    throw Error('Failed to load character data. Call setCharacter and try again.');
  }
  return this._withDataPromise.then(() => {
    if (!this._loadingManager.loadingFailed) {
      return func();
    }
  });
};

HanziWriter.prototype._setupListeners = function() {
  this.target.addPointerStartListener((evt) => {
    if (this.isLoadingCharData || !this._quiz) return;
    evt.preventDefault();
    this._forwardToQuiz('startUserStroke', evt.getPoint());
  });
  this.target.addPointerMoveListener((evt) => {
    if (this.isLoadingCharData || !this._quiz) return;
    evt.preventDefault();
    this._forwardToQuiz('continueUserStroke', evt.getPoint());
  });
  this.target.addPointerEndListener(() => this._forwardToQuiz('endUserStroke'));
};

HanziWriter.prototype._forwardToQuiz = function(method, ...args) {
  if (!this._quiz) return;
  this._quiz[method](...args);
};

// --- Static Public API --- //

HanziWriter.create = (element, character, options = {}) => {
  const writer = new HanziWriter(element, options);
  writer.setCharacter(character);
  return writer;
};

let lastLoadingManager = null;
let lastLoadingOptions = null;

HanziWriter.loadCharacterData = (character, options = {}) => {
  let loadingManager;
  if (lastLoadingManager && lastLoadingOptions === options) {
    loadingManager = lastLoadingManager;
  } else {
    loadingManager = new LoadingManager(assign({}, defaultOptions, options));
  }
  lastLoadingManager = loadingManager;
  lastLoadingOptions = options;
  return loadingManager.loadCharData(character);
};

HanziWriter.getScalingTransform = (width, height, padding = 0) => {
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
};

module.exports = HanziWriter;
