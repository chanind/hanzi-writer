var writer1, writer2;
var isCharVisible1 = true, isCharVisible2 = true;
var isOutlineVisible1 = true, isOutlineVisible2 = true;

function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

function updateCharacter(area) {
  var targetId = 'target' + area;
  document.getElementById(targetId).innerHTML = '';
  var charInput = document.querySelector('.js-char' + area).value;
  var writer = HanziWriter.create(targetId, charInput, {
    width: 400,
    height: 400,
    renderer: 'svg',
    radicalColor: '#166E16',
    onCorrectStroke: printStrokePoints,
    onMistake: printStrokePoints,
    showCharacter: false,
    drawingWidth: 50,
    keepUserStrokesVisible: true,
  });
  if (area === '1') writer1 = writer;
  else writer2 = writer;
}

window.onload = function () {
  updateCharacter('1');
  updateCharacter('2');

  document.querySelector('.js-char-form').addEventListener('submit', function (evt) {
    evt.preventDefault();
    updateCharacter('1');
    updateCharacter('2');
  });

  // Área 1
  document.querySelector('.js-toggle1').addEventListener('click', function () {
    isCharVisible1 ? writer1.hideCharacter() : writer1.showCharacter();
    isCharVisible1 = !isCharVisible1;
  });
  document.querySelector('.js-toggle-hint1').addEventListener('click', function () {
    isOutlineVisible1 ? writer1.hideOutline() : writer1.showOutline();
    isOutlineVisible1 = !isOutlineVisible1;
  });
  document.querySelector('.js-animate1').addEventListener('click', function () {
    writer1.animateCharacter();
  });
  document.querySelector('.js-quiz1').addEventListener('click', function () {
    writer1.quiz({
      showOutline: false,
      highlightOnComplete: false,
      leniency: 0.7,
    });
  });
  document.querySelector('.js-show-correct1').addEventListener('click', function () {
    if (writer1 && writer1._quiz && typeof writer1._quiz.showCorrectStrokesAndScore === 'function') {
      writer1._quiz.showCorrectStrokesAndScore('meuDivDeNota1');
    }
  });

  // Área 2
  document.querySelector('.js-toggle2').addEventListener('click', function () {
    isCharVisible2 ? writer2.hideCharacter() : writer2.showCharacter();
    isCharVisible2 = !isCharVisible2;
  });
  document.querySelector('.js-toggle-hint2').addEventListener('click', function () {
    isOutlineVisible2 ? writer2.hideOutline() : writer2.showOutline();
    isOutlineVisible2 = !isOutlineVisible2;
  });
  document.querySelector('.js-animate2').addEventListener('click', function () {
    writer2.animateCharacter();
  });
  document.querySelector('.js-quiz2').addEventListener('click', function () {
    writer2.quiz({
      showOutline: false,
      highlightOnComplete: false,
      leniency: 0.7,
    });
  });
  document.querySelector('.js-show-correct2').addEventListener('click', function () {
    if (writer2 && writer2._quiz && typeof writer2._quiz.showCorrectStrokesAndScore === 'function') {
      writer2._quiz.showCorrectStrokesAndScore('meuDivDeNota2');
    }
  });
};
