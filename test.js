window.onload = function() {
	window.han = new HanziWriter('han', '汉', {
		width: 200,
		height: 200,
		padding: 0,
		strokeColor: '#fff',
		hintColor: '#000',
	});
	han.animateCharacter({onComplete: han.animateCharacter.bind(han) });

	window.zi = new HanziWriter('zi', '子', {
		width: 200,
		height: 200,
		padding: 0,
		strokeColor: '#fff',
		hintColor: '#000',
	});
	zi.animateCharacter({onComplete: zi.animateCharacter.bind(zi) });

};