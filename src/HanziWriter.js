import CharacterRenderer from './renderers/CharacterRenderer';
import UserStrokeRenderer from './renderers/UserStrokeRenderer';
import CharacterPositionerRenderer from './renderers/CharacterPositionerRenderer';
import Point from './models/Point';
import UserStroke from './models/UserStroke';
import StrokeMatcher from './StrokeMatcher';
import ZdtStrokeParser from './ZdtStrokeParser';
import {inArray} from './utils';
import svg from 'svg.js';
import {_extend as extend} from 'util';

const defaultOptions = {
  charDataLoader: (char) => global.hanziData[char],
  width: null,
  height: null,
  padding: 20,
  strokeAnimationDuration: 300,
  strokeHighlightDuration: 500,
  strokeHighlightColor: '#AAF',
  userStrokeFadeDuration: 300,
  delayBetweenStrokes: 1000,
  matchDistanceThreshold: 30,
  userStrokeAttrs: {
    fill: 'none',
    stroke: '#333',
    'stroke-width': 4,
  },
  strokeAttrs: {
    fill: '#555',
    stroke: '#555',
    'stroke-width': 2,
  },
  hintAttrs: {
    fill: '#DDD',
    stroke: '#DDD',
    'stroke-width': 2,
  },
};

// todo: better clone
const clone = (obj) => extend({}, obj);

class HanziWriter {

  constructor(element, character, options = {}) {
    this.svg = svg(element);
    this.options = extend(clone(defaultOptions), options);
    this.setCharacter(character);
    this.setupListeners();
    this.hintRenderer.draw();
    this.characterRenderer.draw();
  }

  showCharacter(animationOptions = {}) {
    this.characterRenderer.show(animationOptions);
  }
  hideCharacter(animationOptions = {}) {
    this.characterRenderer.hide(animationOptions);
  }
  // TODO: figure out this animationOption stuff
  animateCharacter(/* animationOptions = {} */) {
    this.characterRenderer.animate();
  }

  showHint(animationOptions = {}) {
    this.hintRenderer.show(animationOptions);
  }
  hideHint(animationOptions = {}) {
    this.hintRenderer.hide(animationOptions);
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
    this.characterRenderer = new CharacterRenderer(this.character, this.options);
    this.hintRenderer = new CharacterRenderer(this.character, this.getHintOptions());
    this.positioner = new CharacterPositionerRenderer(this.characterRenderer, this.options);
    this.hintPositioner = new CharacterPositionerRenderer(this.hintRenderer, this.options);
    this.hintPositioner.setCanvas(this.svg);
    this.positioner.setCanvas(this.svg);
  }

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
    this.userStrokeRenderer = new UserStrokeRenderer(this.userStroke, this.options);
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
    const translatedPoints = this.positioner.convertExternalPoints(this.userStroke.getPoints());
    const strokeMatcher = new StrokeMatcher(this.options);
    const matchingStroke = strokeMatcher.getMatchingStroke(translatedPoints, this.character.getStrokes());
    this.userStrokeRenderer.fadeAndRemove();
    this.userStroke = null;
    this.userStrokeRenderer = null;
    if (!this.isQuizzing) return;
    const isValidStroke = matchingStroke && !inArray(matchingStroke, this.drawnStrokes);
    if (isValidStroke && (!this.enforceStrokeOrder || matchingStroke === this.character.getStroke(this.currentStrokeIndex))) {
      this.drawnStrokes.push(matchingStroke);
      this.currentStrokeIndex += 1;
      this.numRecentMistakes = 0;
      this.characterRenderer.showStroke(matchingStroke.getStrokeNum());
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

  getHintOptions() {
    const hintOptions = extend({}, this.options);
    hintOptions.strokeAttrs = this.options.hintAttrs;
    return hintOptions;
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
