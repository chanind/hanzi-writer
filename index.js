window.onload = function() {
	var size = $('#ni').width();

	window.ni = new HanziWriter('ni', '你', {
		width: size,
		height: size,
		padding: 0,
		showCharacter: false,
		showOutline: true
	});

	window.hao = new HanziWriter('hao', '好', {
		width: size,
		height: size,
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