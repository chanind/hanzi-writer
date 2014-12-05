Stroke = require('./Stroke.coffee')
ComboStroke = require('./ComboStroke.coffee')
Drawable = require('./Drawable.coffee')

class Character extends Drawable

	@DISTANCE_THRESHOLD = 30

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

	getMatchingStroke: (points) ->
		closestStroke = null
		bestAvgDist = 0
		for stroke in @strokes
			avgDist = stroke.getAverageDistance(points)
			if avgDist < bestAvgDist or !closestStroke
				closestStroke = stroke
				bestAvgDist = avgDist
		return closestStroke if bestAvgDist < Character.DISTANCE_THRESHOLD

	show: (animationOptions = {}) ->
		stroke.show(animationOptions) for stroke in @strokes

	hide: (animationOptions = {}) ->
		stroke.hide(animationOptions) for stroke in @strokes

	showStroke: (strokeNum, animationOptions = {}) -> @getStroke(strokeNum).show(animationOptions)

	getStroke: (strokeNum) -> @strokes[strokeNum]
	getNumStrokes: -> @strokes.length

	draw: -> stroke.draw() for stroke in @strokes
	animate: (onComplete = ->) ->
		@hide 
			onComplete: => @animateStroke(onComplete, 0)

	setCanvas: (canvas) ->
		super
		stroke.setCanvas(canvas) for stroke in @strokes

	animateStroke: (onComplete, strokeNum) ->
		stroke = @strokes[strokeNum]
		stroke.animate =>
			if strokeNum < @strokes.length - 1
				nextStroke = => @animateStroke(onComplete, strokeNum + 1)
				setTimeout nextStroke, @options.delayBetweenStrokes
			else
				onComplete()

module.exports = Character