Stroke = require('./Stroke.coffee')
ComboStroke = require('./ComboStroke.coffee')
Drawable = require('./Drawable.coffee')

class Character extends Drawable

	constructor: (pathStrings, @options = {}) ->
		@strokes = []
		rawStrokes = (new Stroke(pathString, @options) for pathString in pathStrings)
		comboStrokeBuffer = []
		for stroke in rawStrokes
			if stroke.isComplete and comboStrokeBuffer.length == 0
				@strokes.push(stroke)
			else if stroke.isComplete
				comboStrokeBuffer.push(stroke)
				@strokes.push(new ComboStroke(comboStrokeBuffer, @options))
				comboStrokeBuffer = []
			else
				comboStrokeBuffer.push(stroke)

	getBounds: ->
		strokeBoundingPoints = @getAllStrokeBounds()
		[maxY, midY, minY] = @getExtremes(@getAllYs(strokeBoundingPoints))
		[maxX, midX, minX] = @getExtremes(@getAllXs(strokeBoundingPoints))
		return [{x: minX, y: minY}, {x: maxX, y: maxY}]

	getAllStrokeBounds: ->
		bounds = []
		for stroke in @strokes
			strokeBounds = stroke.getBounds()
			bounds.push strokeBounds[0]
			bounds.push strokeBounds[1]
		return bounds

	draw: (svg) -> stroke.draw(svg) for stroke in @strokes
	animate: (svg, onComplete = ->) -> @animateStroke(svg, onComplete, 0)

	animateStroke: (svg, onComplete, strokeNum) ->
		stroke = @strokes[strokeNum]
		stroke.animate svg, =>
			if strokeNum < @strokes.length - 1
				nextStroke = => @animateStroke(svg, onComplete, strokeNum + 1)
				setTimeout nextStroke, @options.delayBetweenStrokes
			else
				onComplete()

module.exports = Character