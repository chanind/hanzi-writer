var writer;
var isCharVisible;
var isOutlineVisible;

function updateCharacter() {
	document.querySelector('#target').innerHTML = '';

	var character = document.querySelector('.js-char').value
	writer = new HanziWriter('target', character, {
		width: 400,
		height: 400,
	});
	isCharVisible = true;
	isOutlineVisible = true;
	window.writer = writer;
}

window.onload = function() {
	updateCharacter();

	document.querySelector('.js-char-form').addEventListener('submit', function(evt) {
		evt.preventDefault();
		updateCharacter();
	});

	document.querySelector('.js-toggle').addEventListener('click', function() {
		isCharVisible ? writer.hideCharacter() : writer.showCharacter();
		isCharVisible = !isCharVisible;
	});
	document.querySelector('.js-toggle-hint').addEventListener('click', function() {
		isOutlineVisible ? writer.hideOutline() : writer.showOutline();
		isOutlineVisible = !isOutlineVisible;
	});
	document.querySelector('.js-animate').addEventListener('click', function() {
		writer.animateCharacter();
	});
	document.querySelector('.js-quiz').addEventListener('click', function() {
		writer.quiz({
			showOutline: true
		});
	});
}