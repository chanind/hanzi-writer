window.onload = function() {
	window.ni = new HanziWriter('ni', '你', {
		width: 200,
		height: 200,
		padding: 0,
		showCharacter: false,
		showOutline: true
	});

	window.hao = new HanziWriter('hao', '好', {
		width: 200,
		height: 200,
		padding: 0,
		showCharacter: false,
		showOutline: true
	});

	var lastAnimatedNi = false;
	var animateNext = function() {
		var char = lastAnimatedNi ? hao : ni;
		lastAnimatedNi = !lastAnimatedNi;
		char.animateCharacter({onComplete: animateNext});
	};
	animateNext();
};