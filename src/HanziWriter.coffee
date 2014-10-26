Character = require('./Character.coffee')
CharacterPositioner = require('./CharacterPositioner.coffee')
SVG = require('svg.js')

class window.HanziWriter

	options:
		charDataLoader: (char) -> hanziData[char]
		width: null
		height: null
		padding: 20
		strokeAnimationDuration: 300
		delayBetweenStrokes: 1000
		strokeAttrs:
			fill: '#333'
			stroke: '#333'
			'stroke-width': 2

	constructor: (element, character, options = {}) ->
		@svg = SVG(element)
		@options[key] = value for key, value of options
		@setCharacter(character)
		@positioner.animate(@svg)

	setCharacter: (char) ->
		pathStrings = @options.charDataLoader(char)
		@character = new Character(pathStrings, @options)
		@positioner = new CharacterPositioner(@character, @options)