Drawable = require('./Drawable.coffee')

class Stroke extends Drawable

	@HORIZONTAL_STROKE = 1
	@BACK_SLASH_STROKE = 2
	@VERTICAL_STROKE = 3
	@FORWARD_SLASH_STROKE = 4
	@REVERSE_HORIZONTAL_STROKE = 5
	@REVERSE_BACK_SLASH_STROKE = 6
	@REVERSE_VERTICAL_STROKE = 7
	@REVERSE_FORWARD_SLASH_STROKE = 8

	constructor: (zdtPathData, @options = {}) ->
		[metadataString, pathString] = zdtPathData.split ':'
		pathString = pathString.replace(/;?\s*$/, '')
		@points = (@parsePoint(pointString) for pointString in pathString.split(';'))
		@isComplete = metadataString[2] == 'P'
		@strokeType = parseInt(metadataString[1])
		@animationSpeedupRatio = 1

	getPathString: ->
		start = @points[0]
		remainingPoints = @points[1..-1]
		pathString = "M #{start.x} #{start.y}"
		for  point in remainingPoints
			pathString += " L #{point.x} #{point.y}"
		pathString += " z"
		return pathString

	parsePoint: (pointString) ->
		pointArr = pointString.split(',')
		return {x: pointArr[0], y: pointArr[1]}

	drawPath: (svg) -> svg.path(@getPathString(), @attrs)

	setAnimationSpeedupRatio: (@animationSpeedupRatio) ->

	getStrokeAnimationStartingPoint: -> @getStrokeAnimationExtremePoint(@strokeType, false)
	getStrokeAnimationEndingPoint: -> @getStrokeAnimationExtremePoint(@strokeType, true)

	# where to start or end drawing the stroke based on the stroke type
	getStrokeAnimationExtremePoint: (strokeType, isReverse) ->
		extremeYs = @getExtremes(@getAllYs(@points))
		extremeXs = @getExtremes(@getAllXs(@points))

		# handle reversed strokes
		if strokeType > Stroke.FORWARD_SLASH_STROKE
			strokeType = strokeType - Stroke.FORWARD_SLASH_STROKE
			isReverse = !isReverse

		minIndex = if isReverse then 0 else 2
		maxIndex = if isReverse then 2 else 0
		midIndex = 1

		switch strokeType
			when Stroke.HORIZONTAL_STROKE then {x: extremeXs[minIndex], y: extremeYs[midIndex]}
			when Stroke.BACK_SLASH_STROKE then {x: extremeXs[minIndex], y: extremeYs[minIndex]}
			when Stroke.VERTICAL_STROKE then {x: extremeXs[midIndex], y: extremeYs[minIndex]}
			when Stroke.FORWARD_SLASH_STROKE then {x: extremeXs[maxIndex], y: extremeYs[minIndex]}

	getBounds: ->
		[maxY, midY, minY] = @getExtremes(@getAllYs(@points))
		[maxX, midX, minX] = @getExtremes(@getAllXs(@points))
		return [{x: minX, y: minY}, {x: maxX, y: maxY}]

	getStrokeAnimationDistance: ->
		start = @getStrokeAnimationStartingPoint()
		end = @getStrokeAnimationEndingPoint()
		return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))

	draw: (svg) -> @drawPath(svg)

	animate: (svg, onComplete = ->) ->
		start = @getStrokeAnimationStartingPoint()
		mask = svg.circle(0).center(start.x, start.y)
		stroke = @drawPath(svg)
			.attr(@options.strokeAttrs)
			.clipWith(mask)

		mask.animate(@options.strokeAnimationDuration / @animationSpeedupRatio)
			.radius(@getStrokeAnimationDistance())
			.after(onComplete)

module.exports = Stroke
