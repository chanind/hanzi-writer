window.onload = function() {
	var size = $('#ni').width();

	window.ni = HanziWriter.create('ni', '你', {
		width: size,
		height: size,
		padding: 0,
		showCharacter: false,
		showOutline: true
	});

	window.hao = HanziWriter.create('hao', '好', {
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
		char.animateCharacter().then(function() { setTimeout(animateNext, 700) });
	};
	animateNext();
};
