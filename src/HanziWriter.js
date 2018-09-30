const HanziWriterRenderer = require('./renderers/HanziWriterRenderer');
const RenderState = require('./RenderState');
const CharDataParser = require('./CharDataParser');
const Positioner = require('./Positioner');
const Quiz = require('./Quiz');
const svg = require('./svg');
const defaultCharDataLoader = require('./defaultCharDataLoader');
const LoadingManager = require('./LoadingManager');
const characterActions = require('./characterActions');
const { assign, callIfExists, trim } = require('./utils');


const defaultOptions = {
  charDataLoader: defaultCharDataLoader,
  onLoadCharDataError: null,
  onLoadCharDataSuccess: null,
  showOutline: true,
  showCharacter: true,

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
};

function HanziWriter(...args) {
  if (args.length > 0) {
    let character;
    let options = {};
    const element = args[0];
    if (args.length > 1) {
      if (typeof args[1] === 'string') {
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
  return this._withData(() => (
    this._renderState.run(characterActions.showCharacter(
      'main',
      this._character,
      typeof options.duration === 'number' ? options.duration : this._options.strokeFadeDuration,
    )).then(res => callIfExists(options.onComplete, res))
  ));
};
HanziWriter.prototype.hideCharacter = function(options = {}) {
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

HanziWriter.prototype.showOutline = function(options = {}) {
  return this._withData(() => (
    this._renderState.run(characterActions.showCharacter(
      'outline',
      this._character,
      typeof options.duration === 'number' ? options.duration : this._options.strokeFadeDuration,
    )).then(res => callIfExists(options.onComplete, res))
  ));
};

HanziWriter.prototype.hideOutline = function(options = {}) {
  return this._withData(() => (
    this._renderState.run(characterActions.hideCharacter(
      'outline',
      this._character,
      typeof options.duration === 'number' ? options.duration : this._options.strokeFadeDuration,
    )).then(res => callIfExists(options.onComplete, res))
  ));
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

    const charDataParser = new CharDataParser();
    this._character = charDataParser.generateCharacter(char, pathStrings);
    this._positioner = new Positioner(this._options);
    this._hanziWriterRenderer = new HanziWriterRenderer(this._character, this._positioner);
    this._renderState = new RenderState(this._character, this._options, (nextState) => {
      this._hanziWriterRenderer.render(nextState);
    });
    this._hanziWriterRenderer.mount(this._canvas, this._renderState.state);
    this._hanziWriterRenderer.render(this._renderState.state);
  });
  return this._withDataPromise;
};

// ------------- //

HanziWriter.prototype._init = function(element, options) {
  this._canvas = svg.Canvas.init(element, options.width, options.height);
  if (this._canvas.svg.createSVGPoint) {
    this._pt = this._canvas.svg.createSVGPoint();
  }
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
    const { width, height } = this._canvas.svg.getBoundingClientRect();
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
  this._canvas.svg.addEventListener('mousedown', (evt) => {
    if (this.isLoadingCharData || !this._quiz) return;
    evt.preventDefault();
    this._forwardToQuiz('startUserStroke', this._getMousePoint(evt));
  });
  this._canvas.svg.addEventListener('touchstart', (evt) => {
    if (this.isLoadingCharData || !this._quiz) return;
    evt.preventDefault();
    this._forwardToQuiz('startUserStroke', this._getTouchPoint(evt));
  });
  this._canvas.svg.addEventListener('mousemove', (evt) => {
    if (this.isLoadingCharData || !this._quiz) return;
    evt.preventDefault();
    this._forwardToQuiz('continueUserStroke', this._getMousePoint(evt));
  });
  this._canvas.svg.addEventListener('touchmove', (evt) => {
    if (this.isLoadingCharData || !this._quiz) return;
    evt.preventDefault();
    this._forwardToQuiz('continueUserStroke', this._getTouchPoint(evt));
  });

  // TODO: fix
  global.document.addEventListener('mouseup', () => this._forwardToQuiz('endUserStroke'));
  global.document.addEventListener('touchend', () => this._forwardToQuiz('endUserStroke'));
};

HanziWriter.prototype._forwardToQuiz = function(method, ...args) {
  if (!this._quiz) return;
  this._quiz[method](...args);
};

HanziWriter.prototype._getMousePoint = function(evt) {
  if (this._pt) {
    this._pt.x = evt.clientX;
    this._pt.y = evt.clientY;
    const localPt = this._pt.matrixTransform(this._canvas.svg.getScreenCTM().inverse());
    return {x: localPt.x, y: localPt.y};
  }
  // fallback in case SVG matrix transforms aren't supported
  const box = this._canvas.svg.getBoundingClientRect();
  const x = evt.clientX - box.left;
  const y = evt.clientY - box.top;
  return {x, y};
};

HanziWriter.prototype._getTouchPoint = function(evt) {
  if (this._pt) {
    this._pt.x = evt.touches[0].clientX;
    this._pt.y = evt.touches[0].clientY;
    const localPt = this._pt.matrixTransform(this._canvas.svg.getScreenCTM().inverse());
    return {x: localPt.x, y: localPt.y};
  }
  // fallback in case SVG matrix transforms aren't supported
  const box = this._canvas.svg.getBoundingClientRect();
  const x = evt.touches[0].clientX - box.left;
  const y = evt.touches[0].clientY - box.top;
  return {x, y};
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
    x: positioner.getXOffset(),
    y: positioner.getYOffset(),
    scale: positioner.getScale(),
    transform: trim(`
      translate(${positioner.getXOffset()}, ${positioner.getHeight() - positioner.getYOffset()})
      scale(${positioner.getScale()}, ${-1 * positioner.getScale()})
    `).replace(/\s+/g, ' '),
  };
};

// set up window.HanziWriter if we're in the browser
if (typeof global.window !== 'undefined') {
  // store whatever used to be called HanziWriter in case of a conflict
  const previousHanziWriter = global.window.HanziWriter;

  // add a jQuery-esque noConflict method to restore the previous global.window.HanziWriter if necessary
  HanziWriter.noConflict = () => {
    global.window.HanziWriter = previousHanziWriter;
    return HanziWriter;
  };

  global.window.HanziWriter = HanziWriter;
}

// set up module.exports if we're in node/webpack
if (typeof module !== 'undefined') {
  module.exports = HanziWriter;
}
