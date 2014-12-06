var writer;

function updateCharacter() {
	document.querySelector('#target').innerHTML = '';

	var character = document.querySelector('.js-char').value
	writer = new HanziWriter('target', character, {
		width: 400,
		height: 400
	});
	writer.showHint();
	writer.showCharacter();
	window.writer = writer;
}

window.onload = function() {
	updateCharacter();

	document.querySelector('.js-char-form').addEventListener('submit', function(evt) {
		evt.preventDefault();
		updateCharacter();
	});

	document.querySelector('.js-show').addEventListener('click', function() {
		writer.showCharacter();
	});
	document.querySelector('.js-hide').addEventListener('click', function() {
		writer.hideCharacter();
	});
	document.querySelector('.js-show-hint').addEventListener('click', function() {
		writer.showHint();
	});
	document.querySelector('.js-hide-hint').addEventListener('click', function() {
		writer.hideHint();
	});
	document.querySelector('.js-animate').addEventListener('click', function() {
		writer.animateCharacter();
	});
	document.querySelector('.js-quiz').addEventListener('click', function() {
		writer.quiz({
			enforceStrokeOrder: true,
			showHint: true
		});
	});
}