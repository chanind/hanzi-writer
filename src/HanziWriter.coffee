class window.HanziWriter

	options:
		charDataLoader: (char) -> hanziData[char]
		width: null
		height: null
		strokeAttrs:
			fill: '#EEE'

	constructor: (element, character, options = {}) ->
		@svg = SVG(element)
		@options[key] = value for key, value of options
		@setCharacter(character)
		@character.animate(@svg)

	setCharacter: (char) ->
		pathStrings = @options.charDataLoader(char)
		@character = new Character(pathStrings, @options)