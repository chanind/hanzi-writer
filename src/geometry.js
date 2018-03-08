const { average, arrLast } = require('./utils');


const subtract = (p1, p2) => ({x: p1.x - p2.x, y: p1.y - p2.y});
const magnitude = (point) => Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
const distance = (point1, point2) => magnitude(subtract(point1, point2));
const equals = (point1, point2) => point1.x === point2.x && point1.y === point2.y;
const round = (point, precision = 1) => {
  const multiplier = precision * 10;
  return {
    x: Math.round(multiplier * point.x) / multiplier,
    y: Math.round(multiplier * point.y) / multiplier,
  };
};

const length = (points) => {
  let lastPoint = points[0];
  const pointsSansFirst = points.slice(1);
  return pointsSansFirst.reduce((acc, point) => {
    const dist = distance(point, lastPoint);
    lastPoint = point;
    return acc + dist;
  }, 0);
};

const cosineSimilarity = (point1, point2) => {
  const rawDotProduct = point1.x * point2.x + point1.y * point2.y;
  return rawDotProduct / magnitude(point1) / magnitude(point2);
};


// return a new point, p3, which is on the same line as p1 and p2, but distance away
// from p2. p1, p2, p3 will always lie on the line in that order
const extendPointOnLine = (p1, p2, dist) => {
  const vect = subtract(p2, p1);
  const norm = dist / magnitude(vect);
  return {x: p2.x + norm * vect.x, y: p2.y + norm * vect.y};
};


// based on http://www.kr.tuwien.ac.at/staff/eiter/et-archive/cdtr9464.pdf
const frechetDist = (curve1, curve2) => {
  const results = [];
  for (let i = 0; i < curve1.length; i++) {
    results.push([]);
    for (let j = 0; j < curve2.length; j++) {
      results[i].push(-1);
    }
  }

  const recursiveCalc = (i, j) => {
    if (results[i][j] > -1) return results[i][j];
    if (i === 0 && j === 0) {
      results[i][j] = distance(curve1[0], curve2[0]);
    } else if (i > 0 && j === 0) {
      results[i][j] = Math.max(recursiveCalc(i - 1, 0), distance(curve1[i], curve2[0]));
    } else if (i === 0 && j > 0) {
      results[i][j] = Math.max(recursiveCalc(0, j - 1), distance(curve1[0], curve2[j]));
    } else if (i > 0 && j > 0) {
      results[i][j] = Math.max(
        Math.min(
          recursiveCalc(i - 1, j),
          recursiveCalc(i - 1, j - 1),
          recursiveCalc(i, j - 1),
        ),
        distance(curve1[i], curve2[j]),
      );
    } else {
      results[i][j] = Infinity;
    }
    return results[i][j];
  };

  return recursiveCalc(curve1.length - 1, curve2.length - 1);
};

// break up long segments in the curve into smaller segments of len maxLen or smaller
const subdivideCurve = (curve, maxLen = 0.05) => {
  const newCurve = curve.slice(0, 1);
  curve.slice(1).forEach(point => {
    const prevPoint = newCurve[newCurve.length - 1];
    const segLen = distance(point, prevPoint);
    if (segLen > maxLen) {
      const numNewPoints = Math.ceil(segLen / maxLen);
      const newSegLen = segLen / numNewPoints;
      for (let i = 0; i < numNewPoints; i++) {
        newCurve.push(extendPointOnLine(point, prevPoint, -1 * newSegLen * (i + 1)));
      }
    } else {
      newCurve.push(point);
    }
  });
  return newCurve;
};

// translate and scale from https://en.wikipedia.org/wiki/Procrustes_analysis
const normalizeCurve = (curve) => {
  const meanX = average([curve[0].x, arrLast(curve).x]);
  const meanY = average([curve[0].y, arrLast(curve).y]);
  const mean = { x: meanX, y: meanY };
  const translatedCurve = curve.map(point => subtract(point, mean));
  const scale = Math.sqrt(average([
    Math.pow(translatedCurve[0].x, 2) + Math.pow(translatedCurve[0].y, 2),
    Math.pow(arrLast(translatedCurve).x, 2) + Math.pow(arrLast(translatedCurve).y, 2),
  ]));
  const scaledCurve = translatedCurve.map(point => ({ x: point.x / scale, y: point.y / scale }));
  return subdivideCurve(scaledCurve);
};

// rotate around the origin
const rotate = (curve, theta) => {
  return curve.map(point => ({
    x: Math.cos(theta) * point.x - Math.sin(theta) * point.y,
    y: Math.sin(theta) * point.x + Math.cos(theta) * point.y,
  }));
};

// remove intermediate points that are on the same line as the points to either side
const filterParallelPoints = (points) => {
  if (points.length < 3) return points;
  const filteredPoints = [points[0], points[1]];
  points.slice(2).forEach((point, i) => {
    const numFilteredPoints = filteredPoints.length;
    const curVect = subtract(point, filteredPoints[numFilteredPoints - 1]);
    const prevVect = subtract(filteredPoints[numFilteredPoints - 1], filteredPoints[numFilteredPoints - 2]);
    // this is the z coord of the cross-product. If this is 0 then they're parallel
    const isParallel = ((curVect.y * prevVect.x - curVect.x * prevVect.y) === 0);
    if (isParallel) {
      filteredPoints.pop();
    }
    filteredPoints.push(point);
  });
  return filteredPoints;
};

module.exports = {
  round,
  equals,
  distance,
  frechetDist,
  length,
  rotate,
  subtract,
  cosineSimilarity,
  extendPointOnLine,
  filterParallelPoints,
  subdivideCurve,
  normalizeCurve,
};
