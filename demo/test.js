var writer;
var isCharVisible;
var isOutlineVisible;
var processCharData;
var charDataLoader;

function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

function updateCharacter() {
  document.querySelector('#target').innerHTML = '';

  var character = document.querySelector('.js-char').value;
  window.location.hash = character;

  const options = {
    width: 400,
    height: 400,
    renderer: 'svg',
    radicalColor: '#166E16',
    onCorrectStroke: printStrokePoints,
    onMistake: printStrokePoints,
    showCharacter: false,
    processCharData,
  };
  if (charDataLoader) {
    options.charDataLoader = charDataLoader;
  }

  writer = HanziWriter.create('target', character, options);
  isCharVisible = true;
  isOutlineVisible = true;
  window.writer = writer;
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

  document.querySelector('.char-selection').addEventListener('input', (ev) => {
    const value = ev.target.value; // "hanzi-writer-data" | "hanzi-writer-data-fixed" | "hanzi-writer-data-jp"
    const char = document.querySelector('.js-char').value;

    switch (value) {
      case 'hanzi-writer-data':
        charDataLoader = undefined;
        processCharData = undefined;
        break;
      case 'hanzi-writer-data-fixed': {
        charDataLoader = createCharDataLoader(
          (char) =>
            `https://raw.githubusercontent.com/jamsch/hanzi-writer-data/fixed-set/data/${char}.json`,
        );
        processCharData = null; // We don't need to process the character data
        break;
      }
      case 'hanzi-writer-data-jp': {
        charDataLoader = createCharDataLoader(
          (char) =>
            `https://raw.githubusercontent.com/jamsch/hanzi-writer-data-jp/master/data/${char}.json`,
        );
        processCharData = undefined; // We need to process the character data
        break;
      }
      case 'hanzi-writer-data-jp-fixed': {
        charDataLoader = createCharDataLoader(
          (char) =>
            `https://raw.githubusercontent.com/jamsch/hanzi-writer-data-jp/fixed-set/data/${char}.json`,
        );
        processCharData = null; // We don't need to process the character data
        break;
      }
      default:
        break;
    }

    updateCharacter();
  });
};

const createCharDataLoader = (getUrl) => {
  return (char, onLoad, onError) =>
    fetch(getUrl(char))
      .then((res) => res.json())
      .then(onLoad)
      .catch(onError);
};
