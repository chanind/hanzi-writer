import CharacterRenderer from './renderers/CharacterRenderer';
import PositionerRenderer from './renderers/PositionerRenderer';
import Point from './models/Point';
import ZdtStrokeParser from './ZdtStrokeParser';
import Positioner from './Positioner';
import Quiz from './Quiz';
import {copyAndExtend} from './utils';
import Animator from './Animator';
import svg from 'svg.js';

const defaultOptions = {
  charDataLoader: (char) => global.hanziData[char],

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
  hintColor: '#DDD',
  drawingColor: '#333',

  // undocumented obscure options

  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  hintWidth: 2,
};

class HanziWriter {

  constructor(element, character, options = {}) {
    this._svg = svg(element);
    this.setOptions(options);
    this.setCharacter(character);
    this._setupListeners();
    this._animator = new Animator();
    this._quiz = null;
  }

  setOptions(options) {
    this.options = copyAndExtend(defaultOptions, options);
    this.mainCharOptions = {
      strokeColor: this.options.strokeColor,
      strokeWidth: this.options.strokeWidth,
      strokeAnimationDuration: this.options.strokeAnimationDuration,
      delayBetweenStrokes: this.options.delayBetweenStrokes,
    };
    this.hintCharOptions = copyAndExtend(this.mainCharOptions, {
      strokeColor: this.options.hintColor,
      strokeWidth: this.options.hintWidth,
    });
    this.highlightCharOptions = copyAndExtend(this.mainCharOptions, {
      strokeColor: this.options.highlightColor,
      strokeAnimationDuration: this.options.strokeHighlightDuration,
    });
    this.userStrokeOptions = {
      strokeColor: this.options.drawingColor,
      strokeWidth: this.options.drawingWidth,
      fadeDuration: this.options.drawingFadeDuration,
    };
  }

  // ------ public API ------ //

  showCharacter(options = {}) {
    this._animate(animation => this._characterRenderer.show(animation));
  }
  hideCharacter(options = {}) {
    this._animate(animation => this._characterRenderer.hide(animation));
  }
  animateCharacter(options = {}) {
    this._animate(animation => this._characterRenderer.animate(animation));
  }

  showHint(options = {}) {
    this._animate(animation => this._hintRenderer.show(animation));
  }
  hideHint(options = {}) {
    this._animate(animation => this._hintRenderer.hide(animation));
  }

  quiz(quizOptions = {}) {
    this.cancelQuiz();
    this._quiz = new Quiz({
      canvas: this._canvas,
      animator: this._animator,
      character: this._character,
      characterRenderer: this._characterRenderer,
      hintRenderer: this._hintRenderer,
      highlightRenderer: this._highlightRenderer,
      quizOptions: quizOptions,
      userStrokeOptions: this.userStrokeOptions,
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
    if (this._hintRenderer) this._hintRenderer.destroy();
    if (this._highlightRenderer) this._highlightRenderer.destroy();

    const pathStrings = this.options.charDataLoader(char);
    const zdtStrokeParser = new ZdtStrokeParser();
    this._character = zdtStrokeParser.generateCharacter(char, pathStrings);
    this._positioner = new Positioner(this._character, this.options);

    this._positionerRenderer = new PositionerRenderer(this._positioner).setCanvas(this._svg);
    this._canvas = this._positionerRenderer.getPositionedCanvas();

    this._hintRenderer = new CharacterRenderer(this._character, this.hintCharOptions).setCanvas(this._canvas).draw();
    this._characterRenderer = new CharacterRenderer(this._character, this.mainCharOptions).setCanvas(this._canvas).draw();
    this._highlightRenderer = new CharacterRenderer(this._character, this.highlightCharOptions).setCanvas(this._canvas).draw();
  }

  // ------------- //

  _setupListeners() {
    this._svg.node.addEventListener('mousedown', (evt) => {
      evt.preventDefault();
      this._forwardToQuiz('startUserStroke', this._getMousePoint(evt));
    });
    this._svg.node.addEventListener('touchstart', (evt) => {
      evt.preventDefault();
      this._forwardToQuiz('startUserStroke', this._getTouchPoint(evt));
    });
    this._svg.node.addEventListener('mousemove', (evt) => {
      evt.preventDefault();
      this._forwardToQuiz('continueUserStroke', this._getMousePoint(evt));
    });
    this._svg.node.addEventListener('touchmove', (evt) => {
      evt.preventDefault();
      this._forwardToQuiz('continueUserStroke', this._getTouchPoint(evt));
    });

    // TODO: fix
    document.addEventListener('mouseup', () => this._forwardToQuiz('endUserStroke'));
    document.addEventListener('touchend', () => this._forwardToQuiz('endUserStroke'));
  }

  _forwardToQuiz(method, ...args) {
    if (!this._quiz) return;
    this._quiz[method](...args);
  }

  _getMousePoint(evt) {
    return this._positioner.convertExternalPoint(new Point(evt.offsetX, evt.offsetY));
  }

  _getTouchPoint(evt) {
    const x = evt.touches[0].pageX - this._svg.node.offsetLeft;
    const y = evt.touches[0].pageY - this._svg.node.offsetTop;
    return this._positioner.convertExternalPoint(new Point(x, y));
  }

  _animate(func, options = {}) {
    this.cancelQuiz();
    return this._animator.animate(func, options);
  }
}

// set up window.HanziWriter if we're in the browser
if (typeof window !== 'undefined') {
  // store whatever used to be called HanziWriter in case of a conflict
  const previousHanziWriter = window.HanziWriter;

  // add a jQuery-esque noConflict method to restore the previous window.HanziWriter if necessary
  HanziWriter.noConflict = () => {
    window.HanziWriter = previousHanziWriter;
    return HanziWriter;
  };

  window.HanziWriter = HanziWriter;
}

// set up module.exports if we're in node/webpack
export default HanziWriter;
