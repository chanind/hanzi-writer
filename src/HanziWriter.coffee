class window.HanziWriter

	options:
		charDataLoader: (char) -> hanziData[char]
		strokeAttrs:
			fill: '#EEE'

	constructor: (element, character, options = {}) ->
		@svg = SVG(element)
		@options[key] = value for key, value of options
		@setCharacter(character)
		@animate()

	setCharacter: (char) ->
		pathStrings = @options.charDataLoader(char)
		@strokes = (new Stroke(pathString, @options.strokeAttrs) for pathString in pathStrings)

	draw: ->
		stroke.draw(@svg) for stroke in @strokes

	animate: -> @animateStroke(0)

	animateStroke: (strokeNum) ->
		stroke = @strokes[strokeNum]
		stroke.animate @svg, =>
			@animateStroke(strokeNum + 1) if strokeNum < @strokes.length - 1