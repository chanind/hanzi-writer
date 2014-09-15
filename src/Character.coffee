class Character extends Drawable

	constructor: (pathStrings, @options = {}) ->	
		@strokes = (new Stroke(pathString, @options.strokeAttrs) for pathString in pathStrings)

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

	nestSvg: (svg) ->
		bounds = @getBounds()
		scaleX = @options.width / (bounds[1].x - bounds[0].x)
		scaleY = @options.height / (bounds[1].y - bounds[0].y)
		scale = Math.min(scaleX, scaleY)
		svg
			.group()
			.move(-1 * bounds[0].x, -1 * bounds[0].y)
			.transform(scaleX: scale, scaleY: scale)

	draw: (svg) ->
		stroke.draw(@nestSvg(svg)) for stroke in @strokes

	animate: (svg) -> @animateStroke(@nestSvg(svg), 0)

	animateStroke: (svg, strokeNum) ->
		stroke = @strokes[strokeNum]
		stroke.animate svg, =>
			@animateStroke(svg, strokeNum + 1) if strokeNum < @strokes.length - 1