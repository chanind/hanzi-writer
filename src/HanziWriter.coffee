Character = require('./Character.coffee')
UserStroke = require('./UserStroke.coffee')
CharacterPositioner = require('./CharacterPositioner.coffee')
SVG = require('svg.js')

class HanziWriter

	options:
		charDataLoader: (char) -> hanziData[char]
		width: null
		height: null
		padding: 20
		strokeAnimationDuration: 300
		strokeHighlightDuration: 600
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

	constructor: (element, character, options = {}) ->
		@svg = SVG(element)
		@options[key] = value for key, value of options
		@setCharacter(character)
		@setupListeners()
		@positioner.animate(@svg)

	setCharacter: (char) ->
		pathStrings = @options.charDataLoader(char)
		@character = new Character(pathStrings, @options)
		@positioner = new CharacterPositioner(@character, @options)

	setupListeners: ->
		@svg.node.addEventListener 'mousedown', (e) => @startUserStroke(@getPoint(e))
		@svg.node.addEventListener 'mousemove', (e) => @continueUserStroke(@getPoint(e))
		document.addEventListener 'mouseup', (e) => @endUserStroke()

	startUserStroke: (point) ->
		@point = point
		return @endUserStroke() if @userStroke
		@userStroke = new UserStroke(point, @options)
		window.lastUserStroke = @userStroke
		@userStroke.draw(@svg)
	continueUserStroke: (point) ->
		@userStroke.appendPoint(point) if @userStroke
	endUserStroke: ->
		return unless @userStroke
		translatedPoints = @positioner.convertExternalPoints(@userStroke.getPoints())
		@matchingStroke = @character.getMatchingStroke(translatedPoints)
		@matchingStroke.highlight() if @matchingStroke
		@userStroke.fadeAndRemove()
		@userStroke = null

	getPoint: (evt) -> {x: evt.offsetX, y: evt.offsetY}

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
