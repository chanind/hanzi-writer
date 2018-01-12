const CharacterRenderer = require('./renderers/CharacterRenderer');
const PositionerRenderer = require('./renderers/PositionerRenderer');
const Point = require('./models/Point');
const CharDataParser = require('./CharDataParser');
const Positioner = require('./Positioner');
const Quiz = require('./Quiz');
const svg = require('./svg');
const defaultCharDataLoader = require('./defaultCharDataLoader');
const Animator = require('./Animator');


const defaultOptions = {
  charDataLoader: defaultCharDataLoader,
  showOutline: true,
  showCharacter: true,

  // positioning options

  width: null,
  height: null,
  padding: 20,

  // animation options

  strokeAnimationDuration: 300,
  strokeHighlightDuration: 200,
  delayBetweenStrokes: 1000,

  // colors

  strokeColor: '#555',
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
};

class HanziWriter {

  constructor(element, character, options = {}) {
    this._animator = new Animator();
    this._canvas = svg.Canvas.init(element, options);
    this.setOptions(options);
    this.setCharacter(character);
    this._setupListeners();
    this._quiz = null;
  }

  setOptions(options) {
    this._options = Object.assign({}, defaultOptions, options);
    this._mainCharOptions = {
      strokeColor: this._options.strokeColor,
      strokeWidth: this._options.strokeWidth,
      strokeAnimationDuration: this._options.strokeAnimationDuration,
      delayBetweenStrokes: this._options.delayBetweenStrokes,
    };
    this._outlineCharOptions = Object.assign({}, this._mainCharOptions, {
      strokeColor: this._options.outlineColor,
      strokeWidth: this._options.outlineWidth,
    });
    this._highlightCharOptions = Object.assign({}, this._mainCharOptions, {
      strokeColor: this._options.highlightColor,
      strokeAnimationDuration: this._options.strokeHighlightDuration,
    });
    this._userStrokeOptions = {
      strokeColor: this._options.drawingColor,
      strokeWidth: this._options.drawingWidth,
      fadeDuration: this._options.drawingFadeDuration,
    };
  }

  // ------ public API ------ //

  showCharacter(options = {}) {
    this._animateWithData(animation => this._characterRenderer.show(animation), options);
  }
  hideCharacter(options = {}) {
    this._animateWithData(animation => this._characterRenderer.hide(animation), options);
  }
  animateCharacter(options = {}) {
    this.cancelQuiz();
    this._animateWithData(animation => this._characterRenderer.animate(animation), options);
  }

  showOutline(options = {}) {
    this._animateWithData(animation => this._outlineRenderer.show(animation), options);
  }
  hideOutline(options = {}) {
    this._animateWithData(animation => this._outlineRenderer.hide(animation), options);
  }

  quiz(quizOptions = {}) {
    this._withData(() => {
      this.cancelQuiz();
      this._quiz = new Quiz({
        canvas: this._canvas,
        animator: this._animator,
        character: this._character,
        characterRenderer: this._characterRenderer,
        highlightRenderer: this._highlightRenderer,
        quizOptions: Object.assign({}, this._options, quizOptions),
        userStrokeOptions: this._userStrokeOptions,
      });
    });
  }

  cancelQuiz() {
    if (this._quiz) this._quiz.cancel();
    this._quiz = null;
  }

  setCharacter(char) {
    this.cancelQuiz();
    if (this._positionerRenderer) this._positionerRenderer.destroy();
    if (this._characterRenderer) this._characterRenderer.destroy();
    if (this._outlineRenderer) this._outlineRenderer.destroy();
    if (this._highlightRenderer) this._highlightRenderer.destroy();
    this._withDataPromise = this._loadCharacterData(char).then(pathStrings => {
      const charDataParser = new CharDataParser();
      this._character = charDataParser.generateCharacter(char, pathStrings);
      this._positioner = new Positioner(this._character, this._options);

      this._positionerRenderer = new PositionerRenderer(this._positioner).setCanvas(this._canvas);
      this._subCanvas = this._positionerRenderer.getPositionedCanvas();

      this._outlineRenderer = new CharacterRenderer(this._character, this._outlineCharOptions).setCanvas(this._subCanvas).draw();
      this._characterRenderer = new CharacterRenderer(this._character, this._mainCharOptions).setCanvas(this._subCanvas).draw();
      this._highlightRenderer = new CharacterRenderer(this._character, this._highlightCharOptions).setCanvas(this._subCanvas).draw();

      if (this._options.showCharacter) this._characterRenderer.showImmediate();
      if (this._options.showOutline) this._outlineRenderer.showImmediate();
    });
  }

  // ------------- //

  _loadCharacterData(char) {
    if (this.isLoadingCharData) this.cancelLoadingCharData();
    this.isLoadingCharData = true;
    return new Promise((resolve, reject) => {
      this.cancelLoadingCharData = reject;
      const returnedData = this._options.charDataLoader(char, resolve);
      if (returnedData) resolve(returnedData);
    }).then((data) => {
      this.isLoadingCharData = false;
      return data;
    });
  }

  _withData(func) {
    this._withDataPromise = this._withDataPromise.then(func);
    return this._withDataPromise;
  }

  _setupListeners() {
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
  }

  _forwardToQuiz(method, ...args) {
    if (!this._quiz) return;
    this._quiz[method](...args);
  }

  _getMousePoint(evt) {
    const box = this._canvas.svg.getBoundingClientRect();
    return this._positioner.convertExternalPoint(new Point(evt.clientX - box.left, evt.clientY - box.top));
  }

  _getTouchPoint(evt) {
    const box = this._canvas.svg.getBoundingClientRect();
    const x = evt.touches[0].clientX - box.left;
    const y = evt.touches[0].clientY - box.top;
    return this._positioner.convertExternalPoint(new Point(x, y));
  }

  _animate(func, options = {}) {
    return this._animator.animate(func, options);
  }

  _animateWithData(func, options = {}) {
    return this._withData(() => {
      return this._animate(func, options);
    });
  }
}

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
