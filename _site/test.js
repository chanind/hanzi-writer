window.onload = function() {
	window.ni = new HanziWriter('ni', '你', {
		width: 200,
		height: 200,
		padding: 0,
		strokeColor: '#fff',
		hintColor: '#000',
		showCharacter: false,
		showOutline: false
	});

	window.hao = new HanziWriter('hao', '好', {
		width: 200,
		height: 200,
		padding: 0,
		strokeColor: '#fff',
		hintColor: '#000',
		showCharacter: false,
		showOutline: false
	});

	var lastAnimatedNi = false;
	var animateNext = function() {
		var char = lastAnimatedNi ? hao : ni;
		lastAnimatedNi = !lastAnimatedNi;
		char.animateCharacter({onComplete: animateNext});
	};
	animateNext();

	window.woQuiz = new HanziWriter('wo-quiz', '我', {
		width: 300,
		height: 300,
		padding: 20,
		hintColor: '#EEE',
		showCharacter: false,
		showOutline: true,
		showHintAfterMisses: 1
	});
	woQuiz.quiz();
	var woToggleOutlineCheckbox = document.getElementById('wo-show-outline');
	var woResetButton = document.getElementById('wo-reset');
	woToggleOutlineCheckbox.addEventListener('click', function() {
		woToggleOutlineCheckbox.checked ? woQuiz.showOutline() : woQuiz.hideOutline();
	});
	woResetButton.addEventListener('click', function(evt) {
		evt.preventDefault();
		woQuiz.quiz();
	});


};