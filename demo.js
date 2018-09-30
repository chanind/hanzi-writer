var animationWriter;
var quizWriter;
var character;
var isCharVisible;
var isOutlineVisible;

function updateCharacter() {
  $('#animation-target').html('');
  $('#quiz-target').html('');

  var character = $('#character-select').val();
  $('.char-symbol').text(character);
  animationWriter = HanziWriter.create('animation-target', character, {
    width: 300,
    height: 300,
    showOutline: shouldShowOutline('animation'),
    showCharacter: false
  });
  quizWriter = HanziWriter.create('quiz-target', character, {
    width: 300,
    height: 300,
    showOutline: shouldShowOutline('quiz'),
    showCharacter: false,
    showHintAfterMisses: 1
  });
  quizWriter.quiz();

  // for easier debugging
  window.animationWriter = animationWriter;
  window.quizWriter = quizWriter;
}

function shouldShowOutline(demoType) {
  return $('#' + demoType + '-show-outline').prop('checked');
}

$(function() {
  updateCharacter();

  $('.js-char-form').on('submit', function(evt) {
    evt.preventDefault();
    updateCharacter();
  });

  $('#animate').on('click', function(evt) {
    evt.preventDefault();
    animationWriter.animateCharacter();
  });
  $('#quiz-reset').on('click', function(evt) {
    evt.preventDefault();
    quizWriter.quiz();
  });

  $('#animation-show-outline').on('click', function() {
    var method = shouldShowOutline('animation') ? 'showOutline' : 'hideOutline';
    animationWriter[method]();
  });
  $('#quiz-show-outline').on('click', function() {
    var method = shouldShowOutline('quiz') ? 'showOutline' : 'hideOutline';
    quizWriter[method]();
  });
});
