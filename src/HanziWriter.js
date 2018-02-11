const CharacterRenderer = require('./renderers/CharacterRenderer');
const PositionerRenderer = require('./renderers/PositionerRenderer');
const Point = require('./models/Point');
const CharDataParser = require('./CharDataParser');
const Positioner = require('./Positioner');
const Quiz = require('./Quiz');
const svg = require('./svg');
const defaultCharDataLoader = require('./defaultCharDataLoader');
const Animator = require('./Animator');
const LoadingManager = require('./LoadingManager');
const { assign, isMSBrowser, timeout } = require('./utils');


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

const assignOptions = (options) => {
  const mergedOptions = assign({}, defaultOptions, options);

  // backfill strokeAnimationSpeed if deprecated strokeAnimationDuration is provided instead
  if (options.strokeAnimationDuration && !options.strokeAnimationSpeed) {
    mergedOptions.strokeAnimationSpeed = 500 / mergedOptions.strokeAnimationDuration;
  }
  if (options.strokeHighlightDuration && !options.strokeHighlightSpeed) {
    mergedOptions.strokeHighlightSpeed = 500 / mergedOptions.strokeHighlightDuration;
  }

  return mergedOptions;
};

function HanziWriter(element, character, options = {}) {
  this._animator = new Animator();
  this._canvas = svg.Canvas.init(element);
  this.setOptions(options);
  this._loadingManager = new LoadingManager(this._options);
  this.setCharacter(character);
  this._setupListeners();
  this._cancelAnimation = 0;
  this._quiz = null;
}

HanziWriter.prototype.setOptions = function(options) {
  this._options = assignOptions(options);
  this._mainCharOptions = {
    strokeColor: this._options.strokeColor,
    radicalColor: this._options.radicalColor,
    strokeWidth: this._options.strokeWidth,
    strokeAnimationSpeed: this._options.strokeAnimationSpeed,
    strokeFadeDuration: this._options.strokeFadeDuration,
    delayBetweenStrokes: this._options.delayBetweenStrokes,
    usePolygonMasks: this._options.usePolygonMasks,
  };
  this._outlineCharOptions = assign({}, this._mainCharOptions, {
    strokeColor: this._options.outlineColor,
    radicalColor: null,
    strokeWidth: this._options.outlineWidth,
  });
  this._highlightCharOptions = assign({}, this._mainCharOptions, {
    strokeColor: this._options.highlightColor,
    radicalColor: null,
    strokeAnimationSpeed: this._options.strokeHighlightSpeed,
  });
  this._userStrokeOptions = {
    strokeColor: this._options.drawingColor,
    strokeWidth: this._options.drawingWidth,
    fadeDuration: this._options.drawingFadeDuration,
  };
};

// ------ public API ------ //

HanziWriter.prototype.showCharacter = function(options = {}) {
  return this._animateWithData(animation => this._characterRenderer.show(animation), options);
};
HanziWriter.prototype.hideCharacter = function(options = {}) {
  return this._animateWithData(animation => this._characterRenderer.hide(animation), options);
};
HanziWriter.prototype.animateCharacter = function(options = {}) {
  this.cancelQuiz();
  return this._animateWithData(animation => {
    if (this._characterRenderer) {
      return this._characterRenderer.animate(animation);
    }
    return Promise.resolve();
  }, options);
};
HanziWriter.prototype.loopCharacterAnimation = function(options = {}) {
  const animateForever = (animation) => {
    if (!animation.isActive()) return null;
    const cascadedOpts = assign({}, this._options, options);
    const delayBetweenLoops = cascadedOpts.delayBetweenLoops;
    if (!this._characterRenderer || this._cancelAnimation > 0) {
      return Promise.resolve(); // ending kindly but abruptly any new loop
    }
    const animatePromise = this._characterRenderer.animate(animation);
    if (!animatePromise) return Promise.resolve();
    return animatePromise
      .then(() => timeout(delayBetweenLoops, () => this._cancelAnimation > 0))
      .then(() => animateForever(animation));
  };

  this.cancelQuiz();
  return this._animateWithData(animateForever, options);
};

HanziWriter.prototype.showOutline = function(options = {}) {
  return this._animateWithData(animation => {
    if (this._outlineRenderer)
      return this._outlineRenderer.show(animation);
    return Promise.resolve();
  }, options);
};
HanziWriter.prototype.hideOutline = function(options = {}) {
  return this._animateWithData(animation => {
    if (this._outlineRenderer)
      return this._outlineRenderer.hide(animation);
    return Promise.resolve();
  }, options);
};

HanziWriter.prototype.quiz = function(quizOptions = {}) {
  this._withData(() => {
    this.cancelQuiz();
    this._quiz = new Quiz({
      canvas: this._subCanvas,
      animator: this._animator,
      character: this._character,
      characterRenderer: this._characterRenderer,
      highlightRenderer: this._highlightRenderer,
      quizOptions: assign({}, this._options, quizOptions),
      userStrokeOptions: this._userStrokeOptions,
    });
  });
};

HanziWriter.prototype.cancelQuiz = function() {
  if (this._quiz) this._quiz.cancel();
  this._quiz = null;
};

HanziWriter.prototype.setCharacter = function(char) {
  this.cancelQuiz();
  this._char = char;
  if (this._withDataPromise) {
    // make sure all animations are terminated (asynchronously) before
    // loosing the reference to this promise.
    this.cancelAnimation();
  }
  if (this._positionerRenderer) this._positionerRenderer.destroy();
  if (this._characterRenderer) this._characterRenderer.destroy();
  if (this._outlineRenderer) this._outlineRenderer.destroy();
  if (this._highlightRenderer) this._highlightRenderer.destroy();
  this._positionerRenderer = null;
  this._characterRenderer = null;
  this._outlineRenderer = null;
  this._highlightRenderer = null;
  this._withDataPromise = this._loadingManager.loadCharData(char).then(pathStrings => {
    if (this._loadingManager.loadingFailed) return;

    const charDataParser = new CharDataParser();
    this._character = charDataParser.generateCharacter(char, pathStrings);
    this._positioner = new Positioner(this._character, this._fillWidthAndHeight(this._options));

    this._positionerRenderer = new PositionerRenderer(this._positioner).setCanvas(this._canvas);
    this._subCanvas = this._positionerRenderer.positionedCanvas;

    this._outlineRenderer = new CharacterRenderer(this._character, this._outlineCharOptions).setCanvas(this._subCanvas).draw();
    this._characterRenderer = new CharacterRenderer(this._character, this._mainCharOptions).setCanvas(this._subCanvas).draw();
    this._highlightRenderer = new CharacterRenderer(this._character, this._highlightCharOptions).setCanvas(this._subCanvas).draw();

    if (this._options.showCharacter) this._characterRenderer.showImmediate();
    if (this._options.showOutline) this._outlineRenderer.showImmediate();
  });
  return this._withDataPromise;
};

// ------------- //

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
  return this._withDataPromise.then(() => func());
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
  const box = this._canvas.svg.getBoundingClientRect();
  return this._positioner.convertExternalPoint(new Point(evt.clientX - box.left, evt.clientY - box.top));
};

HanziWriter.prototype._getTouchPoint = function(evt) {
  const box = this._canvas.svg.getBoundingClientRect();
  const x = evt.touches[0].clientX - box.left;
  const y = evt.touches[0].clientY - box.top;
  return this._positioner.convertExternalPoint(new Point(x, y));
};

HanziWriter.prototype._animate = function(func, options = {}) {
  return this._animator.animate(func, options);
};

HanziWriter.prototype.cancelAnimation = function() {
  // Using a counter because multiple ``.cancelAnimation()`` can
  // be issued before having finished their job.
  this._cancelAnimation += 1;
  this._animator.cancel();
  // Some animation where maybe queued on dataPromise
  return this._withData(() => {
    this._cancelAnimation -= 1;
    return Promise.resolve();
  });
};

HanziWriter.prototype._animateWithData = function(func, options = {}) {
  if (this._cancelAnimation > 0)
    return Promise.resolve(); // prevent animation

  return this._withData(() => {
    return this._animate(func, options);
  });
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
