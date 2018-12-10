function removeElm(elm) {
  if (elm) elm.parentNode.removeChild(elm);
}

function initDiv(elmOrId) {
  let elm = elmOrId;
  if (typeof elmOrId === 'string') {
    elm = global.document.getElementById(elmOrId);
  }

  const div = global.document.createElement('div');
  div.style.width = '100%';
  div.style.height = '100%';
  div.style.position = 'relative';
  elm.appendChild(div);
  return div;
}

const drawPath = (ctx, points) => {
  ctx.beginPath();
  const start = points[0];
  const remainingPoints = points.slice(1);
  ctx.moveTo(start.x, start.y);
  remainingPoints.forEach(point => {
    ctx.lineTo(point.x, point.y);
  });
};

module.exports = { initDiv, removeElm, drawPath };
