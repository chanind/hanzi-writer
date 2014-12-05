Path = require('./Path.coffee')

class UserStroke extends Path

	constructor: (startingPoint, @options = {}) ->
		@points = [startingPoint]

	appendPoint: (point) ->
		@points.push(point)
		@path.plot(@getPathString())

	animate: (svg, onComplete = ->) -> onComplete()

	draw: (svg) -> super.attr(@options.userStrokeAttrs)

	fadeAndRemove: ->
		@path.animate(@options.userStrokeFadeDuration)
			.attr(opacity: 0)
			.after => @path.remove()

module.exports = UserStroke