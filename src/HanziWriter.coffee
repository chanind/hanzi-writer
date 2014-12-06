Character = require('./Character.coffee')
UserStroke = require('./UserStroke.coffee')
CharacterPositioner = require('./CharacterPositioner.coffee')
SVG = require('svg.js')
extend = require('util')._extend

class HanziWriter

	options:
		charDataLoader: (char) -> hanziData[char]
		width: null
		height: null
		padding: 20
		strokeAnimationDuration: 300
		strokeHighlightDuration: 500
		strokeHighlightColor: '#AAF'
		userStrokeFadeDuration: 300
		delayBetweenStrokes: 1000
		userStrokeAttrs:
			fill: 'none'
			stroke: '#333'
			'stroke-width': 4
		strokeAttrs:
			fill: '#555'
			stroke: '#555'
			'stroke-width': 2
		hintAttrs:
			fill: '#DDD'
			stroke: '#DDD'
			'stroke-width': 2

	constructor: (element, character, options = {}) ->
		@svg = SVG(element)
		@options[key] = value for key, value of options
		@setCharacter(character)
		@setupListeners()
		@hint.draw()
		@character.draw()

	showCharacter: (animationOptions = {}) -> @character.show(animationOptions)
	hideCharacter: (animationOptions = {}) -> @character.hide(animationOptions)
	animateCharacter: (animationOptions = {}) -> @character.animate() 

	showHint: (animationOptions = {}) -> @hint.show(animationOptions)
	hideHint: (animationOptions = {}) -> @hint.hide(animationOptions)

	quiz: (quizOptions = {}) ->
		@isQuizzing = true
		@hideCharacter(quizOptions)
		if quizOptions.showHint then @showHint() else @hideHint()
		@enforceStrokeOrder = quizOptions.enforceStrokeOrder
		@currentStrokeIndex = 0
		@numRecentMistakes = 0
		@drawnStrokes = []

	setCharacter: (char) ->
		pathStrings = @options.charDataLoader(char)
		@character = new Character(pathStrings, @options)
		@hint = new Character(pathStrings, @getHintOptions())
		@positioner = new CharacterPositioner(@character, @options)
		@hintPositioner = new CharacterPositioner(@hint, @options)
		@hintPositioner.setCanvas(@svg)
		@positioner.setCanvas(@svg)

	setupListeners: ->
		@svg.node.addEventListener 'mousedown', (e) => 
			e.preventDefault()
			@startUserStroke(@getMousePoint(e))
		@svg.node.addEventListener 'touchstart', (e) => 
			e.preventDefault()
			@startUserStroke(@getTouchPoint(e))
		@svg.node.addEventListener 'mousemove', (e) => 
			e.preventDefault()
			@continueUserStroke(@getMousePoint(e))
		@svg.node.addEventListener 'touchmove', (e) => 
			e.preventDefault()
			@continueUserStroke(@getTouchPoint(e))
		document.addEventListener 'mouseup', (e) => @endUserStroke()
		document.addEventListener 'touchend', (e) => @endUserStroke()

	startUserStroke: (point) ->
		@point = point
		return @endUserStroke() if @userStroke
		@userStroke = new UserStroke(point, @options)
		@userStroke.setCanvas(@svg)
		window.lastUserStroke = @userStroke
		@userStroke.draw()
	continueUserStroke: (point) ->
		@userStroke.appendPoint(point) if @userStroke

	endUserStroke: ->
		return unless @userStroke
		translatedPoints = @positioner.convertExternalPoints(@userStroke.getPoints())
		matchingStroke = @character.getMatchingStroke(translatedPoints)
		@userStroke.fadeAndRemove()
		@userStroke = null
		return unless @isQuizzing
		isValidStroke = matchingStroke and matchingStroke not in @drawnStrokes
		if isValidStroke and (!@enforceStrokeOrder or matchingStroke == @character.getStroke(@currentStrokeIndex))
			@drawnStrokes.push(matchingStroke)
			@currentStrokeIndex += 1
			@numRecentMistakes = 0
			matchingStroke.show()
			@isQuizzing = false if @drawnStrokes.length == @character.getNumStrokes()
		else
			@numRecentMistakes += 1
			@character.getStroke(@currentStrokeIndex).highlight() if @numRecentMistakes > 3

	getMousePoint: (evt) -> {x: evt.offsetX, y: evt.offsetY}
	getTouchPoint: (evt) ->
		x: evt.touches[0].pageX - @svg.node.offsetLeft
		y: evt.touches[0].pageY - @svg.node.offsetTop

	getHintOptions: ->
		hintOptions = extend({}, @options)
		hintOptions.strokeAttrs = @options.hintAttrs
		hintOptions

# set up window.HanziWriter if we're in the browser
if typeof window != 'undefined'

	# store whatever used to be called HanziWriter in case of a conflict
	previousHanziWriter = window.HanziWriter

	# add a jQuery-esque noConflict method to restore the previous window.HanziWriter if necessary
	HanziWriter.noConflict = ->
		window.HanziWriter = previousHanziWriter
		return HanziWriter

	window.HanziWriter = HanziWriter

# set up module.exports if we're in node/browserify
if typeof module != 'undefined' && module.exports
	module.exports = HanziWriter
