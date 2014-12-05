# this is a stroke composed of several stroke parts

Drawable = require('./Drawable.coffee')

class ComboStroke extends Drawable

	constructor: (@strokes, @options = {}) ->
		stroke.setAnimationSpeedupRatio(@strokes.length) for stroke in @strokes

	show: (animationOptions = {}) ->
		stroke.show(animationOptions) for stroke in @strokes

	hide: (animationOptions = {}) ->
		stroke.hide(animationOptions) for stroke in @strokes

	draw: -> stroke.draw(@canvas) for stroke in @strokes

	animate: (onComplete = ->) -> @animateStroke(onComplete, 0)

	getDistance: (point) ->
		distances = (stroke.getDistance(point) for stroke in @strokes)
		return Math.min.apply(Math, distances)

	getAverageDistance: (points) ->
		totalDist = 0
		totalDist += @getDistance(point) for point in points
		return totalDist / points.length

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

	setCanvas: (canvas) ->
		super
		stroke.setCanvas(canvas) for stroke in @strokes

	highlight: -> stroke.highlight() for stroke in @strokes

	animateStroke: (onComplete, strokeNum) ->
		stroke = @strokes[strokeNum]
		stroke.animate =>
			if strokeNum < @strokes.length - 1
				@animateStroke(onComplete, strokeNum + 1)
			else
				onComplete()

module.exports = ComboStroke
