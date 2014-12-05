
window.onload = function() {
	window.writer = new HanziWriter('target', '我', {
		width: 400,
		height: 400
	});

	document.querySelector('.js-show').addEventListener('click', function() {
		writer.showCharacter();
	});
	document.querySelector('.js-hide').addEventListener('click', function() {
		writer.hideCharacter();
	});
	document.querySelector('.js-animate').addEventListener('click', function() {
		writer.animateCharacter();
	});
}