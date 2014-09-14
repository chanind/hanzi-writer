class Stroke

	@HORIZONTAL_STROKE = 1
	@BACK_SLASH_STROKE = 2
	@VERTICAL_STROKE = 3
	@FORWARD_SLASH_STROKE = 4

	constructor: (zdtPathData, @attrs = {}) ->
		[metadataString, pathString] = zdtPathData.split ':'
		pathString = pathString.replace(/;?\s*$/, '')
		@points = (@parsePoint(pointString) for pointString in pathString.split(';'))
		@isComplete = metadataString[2] == 'P'
		@strokeType = parseInt(metadataString[1])

	getPathString: ->
		start = @points[0]
		remainingPoints = @points[1..-1]
		pathString = "M #{start[0]} #{start[1]}"
		for  point in remainingPoints
			pathString += " L #{point[0]} #{point[1]}"
		pathString += " z"
		return pathString

	parsePoint: (pointString) -> parseInt(point) for point in pointString.split(',')

	drawPath: (svg) -> svg.path(@getPathString(), @attrs)

	getStrokeAnimationStartingPoint: ->
		[maxY, midY, minY] = @getExtremes(@getAllYs())
		[maxX, midX, minX] = @getExtremes(@getAllXs())
		switch @strokeType
			when Stroke.HORIZONTAL_STROKE then [minX, midY]
			when Stroke.BACK_SLASH_STROKE then [minX, minY]
			when Stroke.VERTICAL_STROKE then [midX, minY]
			when Stroke.FORWARD_SLASH_STROKE then [maxX, minY]

	getStrokeAnimationEndingPoint: ->
		[maxY, midY, minY] = @getExtremes(@getAllYs())
		[maxX, midX, minX] = @getExtremes(@getAllXs())
		switch @strokeType
			when Stroke.HORIZONTAL_STROKE then [maxX, midY]
			when Stroke.BACK_SLASH_STROKE then [maxX, maxY]
			when Stroke.VERTICAL_STROKE then [midX, maxY]
			when Stroke.FORWARD_SLASH_STROKE then [minX, maxY]

	getExtremes: (numArray) ->
		max = Math.max.apply(null, numArray)
		min = Math.min.apply(null, numArray)
		mid = (max + min) / 2
		return [max, mid, min]

	getAllXs: -> point[0] for point in @points
	getAllYs: -> point[1] for point in @points

	getStrokeAnimationDistance: ->
		start = @getStrokeAnimationStartingPoint()
		end = @getStrokeAnimationEndingPoint()
		return Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2))

	draw: (svg) -> @drawPath(svg)

	animate: (svg, onComplete = ->) ->
		start = @getStrokeAnimationStartingPoint()
		mask = svg.circle(0).center(start[0], start[1])
		stroke = @drawPath(svg).clipWith(mask)

		mask.animate()
			.radius(@getStrokeAnimationDistance())
			.center(start[0], start[1])
			.after(onComplete)

