Drawable = require('./Drawable.coffee')

class CharacterPositioner extends Drawable

	constructor: (@character, @options = {}) ->

	getBounds: -> @character.getBounds()

	nestSvg: (svg) ->
		bounds = @getBounds()
		preScaledWidth = bounds[1].x - bounds[0].x
		preScaledHeight = bounds[1].y - bounds[0].y
		effectiveWidth = @options.width - 2 * @options.padding
		effectiveHeight = @options.height - 2 * @options.padding
		scaleX = effectiveWidth / preScaledWidth
		scaleY = effectiveHeight / preScaledHeight
		scale = Math.min(scaleX, scaleY)

		xCenteringBuffer = @options.padding + (effectiveWidth - scale * preScaledWidth) / 2
		yCenteringBuffer = @options.padding + (effectiveHeight - scale * preScaledHeight) / 2

		svg
			.group()
			.move(-1 * bounds[0].x * scale + xCenteringBuffer, -1 * bounds[0].y * scale + yCenteringBuffer)
			.transform(scaleX: scale, scaleY: scale)

	draw: (svg) -> @character.draw(@nestSvg(svg))
	animate: (svg, onComplete = ->) -> @character.animate(@nestSvg(svg), onComplete)

module.exports = CharacterPositioner