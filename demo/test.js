var writer;
var isCharVisible;
var isOutlineVisible;

var enhancedDrawing = false;
var minDrawingWidthRatio = 0.5;
var maxDrawingWidthRatio = 1.5;
var drawingSpeedSensitivity = 0.5;

function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

function updateCharacter() {
  document.querySelector('#target').innerHTML = '';

  var character = document.querySelector('.js-char').value;
  window.location.hash = character;
  writer = HanziWriter.create('target', character, {
    width: 400,
    height: 400,
    renderer: 'svg',
    radicalColor: '#166E16',
    onCorrectStroke: printStrokePoints,
    onMistake: printStrokePoints,
    showCharacter: false,
    enhancedDrawing: enhancedDrawing,
    minDrawingWidthRatio: minDrawingWidthRatio,
    maxDrawingWidthRatio: maxDrawingWidthRatio,
    drawingSpeedSensitivity: drawingSpeedSensitivity,
  });
  isCharVisible = true;
  isOutlineVisible = true;
  window.writer = writer;
}

function updateEnhancedOptions() {
  if (writer && writer._character) {
    document.querySelector('#target').innerHTML = '';
    var character = document.querySelector('.js-char').value;
    writer = HanziWriter.create('target', character, {
      width: 400,
      height: 400,
      renderer: 'svg',
      radicalColor: '#166E16',
      onCorrectStroke: printStrokePoints,
      onMistake: printStrokePoints,
      showCharacter: false,
      enhancedDrawing: enhancedDrawing,
      minDrawingWidthRatio: minDrawingWidthRatio,
      maxDrawingWidthRatio: maxDrawingWidthRatio,
      drawingSpeedSensitivity: drawingSpeedSensitivity,
    });
    window.writer = writer;
  }
}

window.onload = function () {
  var char = decodeURIComponent(window.location.hash.slice(1));
  if (char) {
    document.querySelector('.js-char').value = char;
  }

  updateCharacter();

  document.querySelector('.js-char-form').addEventListener('submit', function (evt) {
    evt.preventDefault();
    updateCharacter();
  });

  document.querySelector('.js-toggle').addEventListener('click', function () {
    isCharVisible ? writer.hideCharacter() : writer.showCharacter();
    isCharVisible = !isCharVisible;
  });
  document.querySelector('.js-toggle-hint').addEventListener('click', function () {
    isOutlineVisible ? writer.hideOutline() : writer.showOutline();
    isOutlineVisible = !isOutlineVisible;
  });
  document.querySelector('.js-animate').addEventListener('click', function () {
    writer.animateCharacter();
  });
  document.querySelector('.js-quiz').addEventListener('click', function () {
    writer.quiz({
      showOutline: true,
    });
  });

  var enhancedCheckbox = document.querySelector('.js-enhanced-drawing');
  enhancedCheckbox.addEventListener('change', function (evt) {
    enhancedDrawing = evt.target.checked;
    updateEnhancedOptions();
  });

  var widthRangeInput = document.querySelector('.js-width-range');
  var widthRangeVal = document.querySelector('.js-width-range-val');
  widthRangeInput.addEventListener('input', function (evt) {
    var value = parseFloat(evt.target.value);
    minDrawingWidthRatio = 1 - value;
    maxDrawingWidthRatio = 1 + value;
    widthRangeVal.textContent = minDrawingWidthRatio.toFixed(1) + 'x - ' + maxDrawingWidthRatio.toFixed(1) + 'x';
  });
  widthRangeInput.addEventListener('change', function () {
    updateEnhancedOptions();
  });

  var speedInput = document.querySelector('.js-speed');
  var speedVal = document.querySelector('.js-speed-val');
  speedInput.addEventListener('input', function (evt) {
    drawingSpeedSensitivity = parseFloat(evt.target.value);
    speedVal.textContent = drawingSpeedSensitivity.toFixed(1);
  });
  speedInput.addEventListener('change', function () {
    updateEnhancedOptions();
  });
};
