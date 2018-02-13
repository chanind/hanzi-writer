const HanziWriterRenderer = require('./renderers/HanziWriterRenderer');
const StateManager = require('./StateManager');
const Point = require('./models/Point');
const CharDataParser = require('./CharDataParser');
const Positioner = require('./Positioner');
const QuizManager = require('./QuizManager');
const svg = require('./svg');
const defaultCharDataLoader = require('./defaultCharDataLoader');
const LoadingManager = require('./LoadingManager');
const characterActions = require('./characterActions');
const { assign, isMSBrowser, callIfExists } = require('./utils');


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

  showHintAfterMisses: 3,
  highlightOnComplete: true,

  // undocumented obscure options

  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  outlineWidth: 2,
  // MS browsers are terrible and can't handle masks using paths with stroke
  usePolygonMasks: isMSBrowser(),
};

function HanziWriter(element, character, options = {}) {
  this._canvas = svg.Canvas.init(element);
  this._options = this._assignOptions(options);
  this._loadingManager = new LoadingManager(this._options);
  this.setCharacter(character);
  this._setupListeners();
}

// ------ public API ------ //

HanziWriter.prototype.showCharacter = function(options = {}) {
  return this._withData(() => (
    this._stateManager.runMutationChain(characterActions.showCharacter(
      'main',
      this._character,
      options.duration || this._options.strokeFadeDuration,
    )).then(() => callIfExists(options.onComplete))
  ), { scope: 'character.main' });
};
HanziWriter.prototype.hideCharacter = function(options = {}) {
  return this._withData(() => (
    this._stateManager.runMutationChain(characterActions.hideCharacter(
      'main',
      this._character,
      options.duration || this._options.strokeFadeDuration,
    ), { scope: 'character.main' }).then(() => callIfExists(options.onComplete))
  ));
};
HanziWriter.prototype.animateCharacter = function(options = {}) {
  this.cancelQuiz();
  return this._withData(() => (
    this._stateManager.runMutationChain(characterActions.animateCharacter(
      'main',
      this._character,
      this._options.strokeFadeDuration,
      this._options.strokeAnimationSpeed,
      this._options.delayBetweenStrokes,
    ), { scope: 'character.main' }).then(() => callIfExists(options.onComplete))
  ));
};
HanziWriter.prototype.loopCharacterAnimation = function(options = {}) {
  this.cancelQuiz();
  return this._withData(() => (
    this._stateManager.runMutationChain(characterActions.animateCharacter(
      'main',
      this._character,
      this._options.strokeFadeDuration,
      this._options.strokeAnimationSpeed,
      this._options.delayBetweenStrokes,
      this._options.delayBetweenLoops,
    ), { loop: true, scope: 'character.main' })
  ));
};

HanziWriter.prototype.showOutline = function(options = {}) {
  return this._withData(() => (
    this._stateManager.runMutationChain(characterActions.showCharacter(
      'outline',
      this._character,
      options.duration || this._options.strokeFadeDuration,
    )).then(() => callIfExists(options.onComplete))
  ), { scope: 'character.outline' });
};

HanziWriter.prototype.hideOutline = function(options = {}) {
  return this._withData(() => (
    this._stateManager.runMutationChain(characterActions.hideCharacter(
      'outline',
      this._character,
      options.duration || this._options.strokeFadeDuration,
    ), { scope: 'character.outline' }).then(() => callIfExists(options.onComplete))
  ));
};

HanziWriter.prototype.quiz = function(quizOptions = {}) {
  this._withData(() => {
    this.cancelQuiz();
    this._quizManager.startQuiz(assign({}, this._options, quizOptions));
  });
};

HanziWriter.prototype.cancelQuiz = function() {
  if (this._quizManager) this._quizManager.cancelQuiz();
};

HanziWriter.prototype.setCharacter = function(char) {
  this.cancelQuiz();
  this._char = char;
  if (this._hanziWriterRenderer) this._hanziWriterRenderer.destroy();
  this._hanziWriterRenderer = null;
  this._withDataPromise = this._loadingManager.loadCharData(char).then(pathStrings => {
    if (this._loadingManager.loadingFailed) return;

    const charDataParser = new CharDataParser();
    this._character = charDataParser.generateCharacter(char, pathStrings);
    this._positioner = new Positioner(this._character, this._options);
    this._hanziWriterRenderer = new HanziWriterRenderer(this._character, this._positioner);
    this._stateManager = new StateManager(this._character, this._options, (nextState) => {
      this._hanziWriterRenderer.render(nextState);
    });
    this._hanziWriterRenderer.mount(this._canvas, this._stateManager.state);
    this._hanziWriterRenderer.render(this._stateManager.state);
    this._quizManager = new QuizManager(this._character, this._stateManager);
  });
  return this._withDataPromise;
};

// ------------- //

HanziWriter.prototype._assignOptions = function(options) {
  const mergedOptions = assign({}, defaultOptions, options);

  // backfill strokeAnimationSpeed if deprecated strokeAnimationDuration is provided instead
  if (options.strokeAnimationDuration && !options.strokeAnimationSpeed) {
    mergedOptions.strokeAnimationSpeed = 500 / mergedOptions.strokeAnimationDuration;
  }
  if (options.strokeHighlightDuration && !options.strokeHighlightSpeed) {
    mergedOptions.strokeHighlightSpeed = 500 / mergedOptions.strokeHighlightDuration;
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
  // Try reloading again and see if it helps
  if (this._loadingManager.loadingFailed) {
    this.setCharacter(this._char);
    return Promise.resolve().then(() => {
      // check loadingFailed again just in case setCharacter fails synchronously
      if (!this._loadingManager.loadingFailed) {
        return this._withData(func);
      }
    });
  }
  return this._withDataPromise.then(() => {
    if (!this._loadingManager.loadingFailed) {
      return func();
    }
  });
};

HanziWriter.prototype._setupListeners = function() {
  this._canvas.svg.addEventListener('mousedown', (evt) => {
    if (this.isLoadingCharData || !this._quizManager) return;
    evt.preventDefault();
    this._forwardToQuiz('startUserStroke', this._getMousePoint(evt));
  });
  this._canvas.svg.addEventListener('touchstart', (evt) => {
    if (this.isLoadingCharData || !this._quizManager) return;
    evt.preventDefault();
    this._forwardToQuiz('startUserStroke', this._getTouchPoint(evt));
  });
  this._canvas.svg.addEventListener('mousemove', (evt) => {
    if (this.isLoadingCharData || !this._quizManager) return;
    evt.preventDefault();
    this._forwardToQuiz('continueUserStroke', this._getMousePoint(evt));
  });
  this._canvas.svg.addEventListener('touchmove', (evt) => {
    if (this.isLoadingCharData || !this._quizManager) return;
    evt.preventDefault();
    this._forwardToQuiz('continueUserStroke', this._getTouchPoint(evt));
  });

  // TODO: fix
  global.document.addEventListener('mouseup', () => this._forwardToQuiz('endUserStroke'));
  global.document.addEventListener('touchend', () => this._forwardToQuiz('endUserStroke'));
};

HanziWriter.prototype._forwardToQuiz = function(method, ...args) {
  if (!this._quizManager) return;
  this._quizManager[method](...args);
};

HanziWriter.prototype._getMousePoint = function(evt) {
  const box = this._canvas.svg.getBoundingClientRect();
  return this._positioner.convertExternalPoint(new Point(evt.clientX - box.left, evt.clientY - box.top));
};

HanziWriter.prototype._getTouchPoint = function(evt) {
  const box = this._canvas.svg.getBoundingClientRect();
  const x = evt.touches[0].clientX - box.left;
  const y = evt.touches[0].clientY - box.top;
  return this._positioner.convertExternalPoint(new Point(x, y));
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
