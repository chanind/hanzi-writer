import CharacterRenderer from './renderers/CharacterRenderer';
import UserStrokeRenderer from './renderers/UserStrokeRenderer';
import CharacterPositionerRenderer from './renderers/CharacterPositionerRenderer';
import Point from './models/Point';
import UserStroke from './models/UserStroke';
import StrokeMatcher from './StrokeMatcher';
import ZdtStrokeParser from './ZdtStrokeParser';
import {inArray, copyAndExtend} from './utils';
import Animation from './Animation';
import svg from 'svg.js';

const defaultOptions = {
  charDataLoader: (char) => global.hanziData[char],

  // positioning options

  width: null,
  height: null,
  padding: 20,

  // animation options

  strokeAnimationDuration: 300,
  strokeHighlightDuration: 500,
  delayBetweenStrokes: 1000,

  // colors

  strokeColor: '#555',
  highlightColor: '#AAF',
  hintColor: '#DDD',
  drawingColor: '#333',

  // undocumented obscure options

  drawingFadeDuration: 300,
  matchDistanceThreshold: 30,
  drawingWidth: 4,
  strokeWidth: 2,
  hintWidth: 2,
};

class HanziWriter {

  constructor(element, character, options = {}) {
    this.svg = svg(element);
    this.setOptions(options);
    this.setCharacter(character);
    this.setupListeners();
    this.hintRenderer.draw();
    this.characterRenderer.draw();
    this.lastAnimation = null;
  }

  setOptions(options) {
    this.options = copyAndExtend(defaultOptions, options);
    this.mainCharOptions = {
      strokeColor: this.options.strokeColor,
      strokeWidth: this.options.strokeWidth,
      strokeAnimationDuration: this.options.strokeAnimationDuration,
      delayBetweenStrokes: this.options.delayBetweenStrokes,

      // TODO: move highlighting to its own character
      highlightColor: this.options.highlightColor,
      strokeHighlightDuration: this.options.strokeHighlightDuration,
    };
    this.hintCharOptions = copyAndExtend(this.mainCharOptions, {
      strokeColor: this.options.hintColor,
      strokeWidth: this.options.hintWidth,
    });
    this.userStrokeOptions = {
      strokeColor: this.options.drawingColor,
      strokeWidth: this.options.drawingWidth,
      fadeDuration: this.options.drawingFadeDuration,
    };
  }

  // ------ public API ------ //

  showCharacter(options = {}) {
    const animation = this.setupAnimation();
    this.characterRenderer.show(copyAndExtend(this.mainCharOptions, options), animation);
  }
  hideCharacter(options = {}) {
    const animation = this.setupAnimation();
    this.characterRenderer.hide(copyAndExtend(this.mainCharOptions, options), animation);
  }
  animateCharacter(options = {}) {
    const animation = this.setupAnimation();
    this.characterRenderer.animate(copyAndExtend(this.mainCharOptions, options), animation);
  }

  showHint(options = {}) {
    const animation = this.setupAnimation();
    this.hintRenderer.show(copyAndExtend(this.hintCharOptions, options), animation);
  }
  hideHint(options = {}) {
    const animation = this.setupAnimation();
    this.hintRenderer.hide(copyAndExtend(this.hintCharOptions, options), animation);
  }

  quiz(quizOptions = {}) {
    this.isQuizzing = true;
    this.hideCharacter(quizOptions);
    if (quizOptions.showHint) {
      this.showHint();
    } else {
      this.hideHint();
    }
    this.enforceStrokeOrder = quizOptions.enforceStrokeOrder;
    this.currentStrokeIndex = 0;
    this.numRecentMistakes = 0;
    this.drawnStrokes = [];
  }

  setCharacter(char) {
    const pathStrings = this.options.charDataLoader(char);
    const zdtStrokeParser = new ZdtStrokeParser();
    this.character = zdtStrokeParser.generateCharacter(char, pathStrings);
    this.characterRenderer = new CharacterRenderer(this.character, this.mainCharOptions);
    this.hintRenderer = new CharacterRenderer(this.character, this.hintCharOptions);
    this.positioner = new CharacterPositionerRenderer(this.characterRenderer, this.options);
    this.hintPositioner = new CharacterPositionerRenderer(this.hintRenderer, this.options);
    this.hintPositioner.setCanvas(this.svg);
    this.positioner.setCanvas(this.svg);
  }

  // ------------- //

  setupListeners() {
    this.svg.node.addEventListener('mousedown', (evt) => {
      evt.preventDefault();
      this.startUserStroke(this.getMousePoint(evt));
    });
    this.svg.node.addEventListener('touchstart', (evt) => {
      evt.preventDefault();
      this.startUserStroke(this.getTouchPoint(evt));
    });
    this.svg.node.addEventListener('mousemove', (evt) => {
      evt.preventDefault();
      this.continueUserStroke(this.getMousePoint(evt));
    });
    this.svg.node.addEventListener('touchmove', (evt) => {
      evt.preventDefault();
      this.continueUserStroke(this.getTouchPoint(evt));
    });
    document.addEventListener('mouseup', () => this.endUserStroke());
    document.addEventListener('touchend', () => this.endUserStroke());
  }

  startUserStroke(point) {
    this.point = point;
    if (this.userStroke) return this.endUserStroke();
    this.userStroke = new UserStroke(point);
    this.userStrokeRenderer = new UserStrokeRenderer(this.userStroke, this.userStrokeOptions);
    this.userStrokeRenderer.setCanvas(this.svg);
    this.userStrokeRenderer.draw();
  }

  continueUserStroke(point) {
    if (this.userStroke) {
      this.userStroke.appendPoint(point);
      this.userStrokeRenderer.updatePath();
    }
  }

  endUserStroke() {
    if (!this.userStroke) return;
    const animation = this.setupAnimation();
    const translatedPoints = this.positioner.convertExternalPoints(this.userStroke.getPoints());
    const strokeMatcher = new StrokeMatcher(this.options);
    const matchingStroke = strokeMatcher.getMatchingStroke(translatedPoints, this.character.getStrokes());
    this.userStrokeRenderer.fadeAndRemove({}, animation);
    this.userStroke = null;
    this.userStrokeRenderer = null;
    if (!this.isQuizzing) return;
    const isValidStroke = matchingStroke && !inArray(matchingStroke, this.drawnStrokes);
    if (isValidStroke && (!this.enforceStrokeOrder || matchingStroke === this.character.getStroke(this.currentStrokeIndex))) {
      this.drawnStrokes.push(matchingStroke);
      this.currentStrokeIndex += 1;
      this.numRecentMistakes = 0;
      this.characterRenderer.showStroke(matchingStroke.getStrokeNum(), {}, animation);
      if (this.drawnStrokes.length === this.character.getNumStrokes()) this.isQuizzing = false;
    } else {
      this.numRecentMistakes += 1;
      if (this.numRecentMistakes > 3) this.characterRenderer.getStrokeRenderer(this.currentStrokeIndex).highlight();
    }
  }

  getMousePoint(evt) {
    return new Point(evt.offsetX, evt.offsetY);
  }

  getTouchPoint(evt) {
    const x = evt.touches[0].pageX - this.svg.node.offsetLeft;
    const y = evt.touches[0].pageY - this.svg.node.offsetTop;
    return new Point(x, y);
  }

  setupAnimation() {
    if (this.lastAnimation) this.lastAnimation.cancel();
    this.lastAnimation = new Animation();
    return this.lastAnimation;
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
