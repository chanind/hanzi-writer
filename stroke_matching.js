var VERSION = '2.0';
var getCharDataUrl = (char) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${VERSION}/${char}.json`;

function loadData(char) {
  return fetch(getCharDataUrl(char)).then(function(res) { return res.json(); });
};

function attr(elm, name, value) {
  elm.setAttributeNS(null, name, value);
}

function createElm(elmType) {
  return document.createElementNS('http://www.w3.org/2000/svg', elmType);
}


function getPathString(points, close = false) {
  const start = points[0];
  const remainingPoints = points.slice(1);
  let pathString = `M ${start.x} ${start.y}`;
  remainingPoints.forEach(point => {
    pathString += ` L ${point.x} ${point.y}`;
  });
  if (close) pathString += 'Z';
  return pathString;
}

function renderCharacter(target, charData, dataRow) {
  target.innerHTML = '';
  var svg = createElm('svg');
  attr(svg, 'width', '100%');
  attr(svg, 'height', '100%');
  target.appendChild(svg);
  var group = createElm('g');
  attr(group, 'transform', 'translate(0, 175.78125) scale(0.1953125, -0.1953125)');
  svg.appendChild(group);
  charData.strokes.forEach((stroke, i) => {
    var path = createElm('path');
    attr(path, 'd', stroke);
    group.appendChild(path);

    if (i === dataRow.strokeNum) {
      path.classList.toggle('target-path', true);
    }
  });

  var userStroke = createElm('path');
  userStroke.classList.toggle('user-stroke', true);
  attr(userStroke, 'd', getPathString(dataRow.points));
  group.appendChild(userStroke);

}

fetch('hzw_strokes.json').then(function(res) { return res.json(); }).then(function(strokesJson) {
  const target = document.getElementById('target');
  var chain = Promise.resolve();
  strokesJson.forEach(function(row, i) {
    chain = chain.then(function() { return loadData(row.char); }).then(function(charData) {
      var charContainerDiv = document.createElement('div');
      charContainerDiv.className = 'char-container';
      charContainerDiv.classList.toggle('correct', row.correct);

      var charTarget = document.createElement('div');
      charTarget.className = 'char-target';

      var infoTarget = document.createElement('div');
      infoTarget.className = 'info-target';
      infoTarget.innerHTML = `${row.char} / ${row.strokeNum} / ${row.device}`;

      var countTarget = document.createElement('div');
      countTarget.className = 'count-target';
      countTarget.innerHTML = i + 1;

      var button = document.createElement('a');
      button.className = 'show-data';
      button.href = '#';
      button.innerHTML = 'points'
      button.addEventListener('click', function(evt) {
        evt.preventDefault();
        var pointsStr = '[\n';
        row.points.forEach(function(point) {
          pointsStr += `  {x: ${point.x}, y: ${point.y}},\n`;
        });
        pointsStr += ']';

        $('#modal-content').text(pointsStr);
        $('#data-modal').modal('show');
      });

      charContainerDiv.appendChild(charTarget);
      charContainerDiv.appendChild(infoTarget);
      charContainerDiv.appendChild(countTarget);
      charContainerDiv.appendChild(button);
      target.appendChild(charContainerDiv);
      renderCharacter(charTarget, charData, row);
    }); 
  });
});


