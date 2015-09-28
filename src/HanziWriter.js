import Character from './Character';
import UserStroke from './UserStroke';
import CharacterPositioner from './CharacterPositioner';
import inArray from './utils';
import SVG from 'svg.js';
import {_extend as extend} from 'util';

const defaultOptions = {
	charDataLoader: (char) => hanziData[char],
	width: null,
	height: null,
	padding: 20,
	strokeAnimationDuration: 300,
	strokeHighlightDuration: 500,
	strokeHighlightColor: '#AAF',
	userStrokeFadeDuration: 300,
	delayBetweenStrokes: 1000,
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
		this.svg = SVG(element);
		this.options = extend(clone(defaultOptions), options);
		this.setCharacter(character);
		this.setupListeners();
		this.hint.draw();
		this.character.draw();
	}

	showCharacter(animationOptions = {}) {
		this.character.show(animationOptions);
	}
	hideCharacter(animationOptions = {}) {
		this.character.hide(animationOptions);
	}
	animateCharacter(animationOptions = {}) {
		this.character.animate();
	}

	showHint(animationOptions = {}) {
		this.hint.show(animationOptions);
	}
	hideHint(animationOptions = {}) {
		this.hint.hide(animationOptions);
	}

	quiz(quizOptions = {}) {
		this.isQuizzing = true;
		this.hideCharacter(quizOptions);
		quizOptions.showHint ? this.showHint() : this.hideHint();
		this.enforceStrokeOrder = quizOptions.enforceStrokeOrder;
		this.currentStrokeIndex = 0;
		this.numRecentMistakes = 0;
		this.drawnStrokes = [];
	}

	setCharacter(char) {
		const pathStrings = this.options.charDataLoader(char);
		this.character = new Character(pathStrings, this.options);
		this.hint = new Character(pathStrings, this.getHintOptions());
		this.positioner = new CharacterPositioner(this.character, this.options);
		this.hintPositioner = new CharacterPositioner(this.hint, this.options);
		this.hintPositioner.setCanvas(this.svg);
		this.positioner.setCanvas(this.svg);
	}

	setupListeners() {
		this.svg.node.addEventListener('mousedown', (e) => {
			e.preventDefault();
			this.startUserStroke(this.getMousePoint(e));
		});
		this.svg.node.addEventListener('touchstart', (e) => {
			e.preventDefault();
			this.startUserStroke(this.getTouchPoint(e));
		});
		this.svg.node.addEventListener('mousemove', (e) => {
			e.preventDefault();
			this.continueUserStroke(this.getMousePoint(e));
		});
		this.svg.node.addEventListener('touchmove', (e) => {
			e.preventDefault();
			this.continueUserStroke(this.getTouchPoint(e));
		});
		document.addEventListener('mouseup', (e) => this.endUserStroke());
		document.addEventListener('touchend', (e) => this.endUserStroke());
	}

	startUserStroke(point) {
		this.point = point;
		if (this.userStroke) return this.endUserStroke();
		this.userStroke = new UserStroke(point, this.options);
		this.userStroke.setCanvas(this.svg);
		window.lastUserStroke = this.userStroke;
		this.userStroke.draw();
	}
	
	continueUserStroke(point) {
		if (this.userStroke) this.userStroke.appendPoint(point);
	}

	endUserStroke() {
		if (!this.userStroke) return;
		const translatedPoints = this.positioner.convertExternalPoints(this.userStroke.getPoints());
		const matchingStroke = this.character.getMatchingStroke(translatedPoints);
		this.userStroke.fadeAndRemove();
		this.userStroke = null;
		if (!this.isQuizzing) return;
		const isValidStroke = matchingStroke && !inArray(matchingStroke, this.drawnStrokes);
		if (isValidStroke && (!this.enforceStrokeOrder || matchingStroke === this.character.getStroke(this.currentStrokeIndex))) {
			this.drawnStrokes.push(matchingStroke);
			this.currentStrokeIndex += 1;
			this.numRecentMistakes = 0;
			matchingStroke.show();
			if (this.drawnStrokes.length === this.character.getNumStrokes()) this.isQuizzing = false;
		} else {
			this.numRecentMistakes += 1;
			if (this.numRecentMistakes > 3) this.character.getStroke(this.currentStrokeIndex).highlight();
		}
	}

	getMousePoint(evt) {
		return {
			x: evt.offsetX,
			y: evt.offsetY,
		};
	}

	getTouchPoint(evt) {
		return {
			x: evt.touches[0].pageX - this.svg.node.offsetLeft,
			y: evt.touches[0].pageY - this.svg.node.offsetTop,
		};
	}

	getHintOptions() {
		const hintOptions = extend({}, this.options);
		hintOptions.strokeAttrs = this.options.hintAttrs;
		return hintOptions;
	}

};

// set up window.HanziWriter if we're in the browser
if (typeof window !== 'undefined') {

	// store whatever used to be called HanziWriter in case of a conflict
	const previousHanziWriter = window.HanziWriter;

	// add a jQuery-esque noConflict method to restore the previous window.HanziWriter if necessary
	HanziWriter.noConflict = () => {
		window.HanziWriter = previousHanziWriter;
		return HanziWriter;
	}

	window.HanziWriter = HanziWriter;
}

// set up module.exports if we're in node/webpack
export default HanziWriter;
