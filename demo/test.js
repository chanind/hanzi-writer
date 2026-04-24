var writer;
var isCharVisible;
var isOutlineVisible;
var isAnimating = false;
var debounceTimer = null;

function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

function updateCharacter() {
  document.querySelector('#target').innerHTML = '';

  var character = document.querySelector('.js-char').value;
  if (!character) {
    character = '我';
    document.querySelector('.js-char').value = character;
  }
  
  var firstChar = character.charAt(0);
  window.location.hash = firstChar;
  
  writer = HanziWriter.create('target', firstChar, {
    width: 400,
    height: 400,
    renderer: 'svg',
    radicalColor: '#166E16',
    onCorrectStroke: printStrokePoints,
    onMistake: printStrokePoints,
    showCharacter: false,
  });
  isCharVisible = true;
  isOutlineVisible = true;
  isAnimating = false;
  window.writer = writer;
}

function debounce(func, wait) {
  return function executedFunction(...args) {
    var later = function() {
      clearTimeout(debounceTimer);
      func(...args);
    };
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(later, wait);
  };
}

function playAnimation() {
  if (!writer) return;
  
  if (isAnimating) {
    writer.resumeAnimation();
  } else {
    writer.animateCharacter({
      onComplete: function() {
        isAnimating = false;
      }
    });
    isAnimating = true;
  }
}

function pauseAnimation() {
  if (!writer) return;
  writer.pauseAnimation();
}

function resetAnimation() {
  if (!writer) return;
  
  var currentChar = document.querySelector('.js-char').value;
  if (currentChar) {
    updateCharacter();
  }
  isAnimating = false;
}

window.onload = function () {
  var char = decodeURIComponent(window.location.hash.slice(1));
  if (char) {
    document.querySelector('.js-char').value = char;
  }

  updateCharacter();

  document.querySelector('.js-char').addEventListener('input', function(e) {
    var value = e.target.value;
    if (value && value.trim()) {
      debounce(function() {
        updateCharacter();
      }, 300)();
    }
  });

  document.querySelector('.js-char').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateCharacter();
    }
  });

  document.querySelector('.js-toggle').addEventListener('click', function () {
    isCharVisible ? writer.hideCharacter() : writer.showCharacter();
    isCharVisible = !isCharVisible;
  });
  
  document.querySelector('.js-toggle-hint').addEventListener('click', function () {
    isOutlineVisible ? writer.hideOutline() : writer.showOutline();
    isOutlineVisible = !isOutlineVisible;
  });
  
  document.querySelector('.js-quiz').addEventListener('click', function () {
    isAnimating = false;
    writer.quiz({
      showOutline: true,
    });
  });

  document.querySelector('.js-play').addEventListener('click', function () {
    playAnimation();
  });

  document.querySelector('.js-pause').addEventListener('click', function () {
    pauseAnimation();
  });

  document.querySelector('.js-reset').addEventListener('click', function () {
    resetAnimation();
  });
};
