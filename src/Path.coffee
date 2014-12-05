Drawable = require('./Drawable.coffee')

class Path extends Drawable

	getPathString: ->
		start = @points[0]
		remainingPoints = @points[1..-1]
		pathString = "M #{start.x} #{start.y}"
		for  point in remainingPoints
			pathString += " L #{point.x} #{point.y}"
		return pathString

	drawPath: -> @path = @canvas.path(@getPathString())

	getPoints: -> @points

	getBounds: ->
		[maxY, midY, minY] = @getExtremes(@getAllYs(@points))
		[maxX, midX, minX] = @getExtremes(@getAllXs(@points))
		return [{x: minX, y: minY}, {x: maxX, y: maxY}]

	draw: -> @drawPath()

module.exports = Path
