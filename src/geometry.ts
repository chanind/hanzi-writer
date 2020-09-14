import { Point } from "./typings/types";
import { average, arrLast } from "./utils";

export const subtract = (p1: Point, p2: Point) => ({ x: p1.x - p2.x, y: p1.y - p2.y });

export const magnitude = (point: Point) =>
  Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));

export const distance = (point1: Point, point2: Point) =>
  magnitude(subtract(point1, point2));

export const equals = (point1: Point, point2: Point) =>
  point1.x === point2.x && point1.y === point2.y;

export const round = (point: Point, precision = 1) => {
  const multiplier = precision * 10;
  return {
    x: Math.round(multiplier * point.x) / multiplier,
    y: Math.round(multiplier * point.y) / multiplier,
  };
};

export const length = (points: Point[]) => {
  let lastPoint = points[0];
  const pointsSansFirst = points.slice(1);
  return pointsSansFirst.reduce((acc, point) => {
    const dist = distance(point, lastPoint);
    lastPoint = point;
    return acc + dist;
  }, 0);
};

export const cosineSimilarity = (point1: Point, point2: Point) => {
  const rawDotProduct = point1.x * point2.x + point1.y * point2.y;
  return rawDotProduct / magnitude(point1) / magnitude(point2);
};

/**
 * return a new point, p3, which is on the same line as p1 and p2, but distance away
 * from p2. p1, p2, p3 will always lie on the line in that order
 */
export const _extendPointOnLine = (p1: Point, p2: Point, dist: number) => {
  const vect = subtract(p2, p1);
  const norm = dist / magnitude(vect);
  return { x: p2.x + norm * vect.x, y: p2.y + norm * vect.y };
};

/** based on http://www.kr.tuwien.ac.at/staff/eiter/et-archive/cdtr9464.pdf */
export const frechetDist = (curve1: Point[], curve2: Point[]) => {
  const results: number[][] = [];
  for (let i = 0; i < curve1.length; i++) {
    results.push([]);
    for (let j = 0; j < curve2.length; j++) {
      results[i].push(-1);
    }
  }

  const recursiveCalc = (i: number, j: number) => {
    if (results[i][j] > -1) {
      return results[i][j];
    }
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

/** break up long segments in the curve into smaller segments of len maxLen or smaller */
export const subdivideCurve = (curve: Point[], maxLen = 0.05) => {
  const newCurve = curve.slice(0, 1);
  curve.slice(1).forEach((point) => {
    const prevPoint = newCurve[newCurve.length - 1];
    const segLen = distance(point, prevPoint);
    if (segLen > maxLen) {
      const numNewPoints = Math.ceil(segLen / maxLen);
      const newSegLen = segLen / numNewPoints;
      for (let i = 0; i < numNewPoints; i++) {
        newCurve.push(_extendPointOnLine(point, prevPoint, -1 * newSegLen * (i + 1)));
      }
    } else {
      newCurve.push(point);
    }
  });
  return newCurve;
};

/** redraw the curve using numPoints equally spaced out along the length of the curve */
export const outlineCurve = (curve: Point[], numPoints = 30) => {
  const curveLen = length(curve);
  const segmentLen = curveLen / (numPoints - 1);
  const outlinePoints = [curve[0]];
  const endPoint = arrLast(curve);
  const remainingCurvePoints = curve.slice(1);

  for (let i = 0; i < numPoints - 2; i++) {
    let lastPoint: Point = arrLast(outlinePoints);
    let remainingDist = segmentLen;
    let outlinePointFound = false;
    while (!outlinePointFound) {
      const nextPointDist = distance(lastPoint, remainingCurvePoints[0]);
      if (nextPointDist < remainingDist) {
        remainingDist -= nextPointDist;
        lastPoint = remainingCurvePoints.shift()!;
      } else {
        const nextPoint = _extendPointOnLine(
          lastPoint,
          remainingCurvePoints[0],
          remainingDist - nextPointDist,
        );
        outlinePoints.push(nextPoint);
        outlinePointFound = true;
      }
    }
  }

  outlinePoints.push(endPoint);

  return outlinePoints;
};

/** translate and scale from https://en.wikipedia.org/wiki/Procrustes_analysis */
export const normalizeCurve = (curve: Point[]) => {
  const outlinedCurve = outlineCurve(curve);
  const meanX = average(outlinedCurve.map((point) => point.x));
  const meanY = average(outlinedCurve.map((point) => point.y));
  const mean = { x: meanX, y: meanY };
  const translatedCurve = outlinedCurve.map((point) => subtract(point, mean));
  const scale = Math.sqrt(
    average([
      Math.pow(translatedCurve[0].x, 2) + Math.pow(translatedCurve[0].y, 2),
      Math.pow(arrLast(translatedCurve).x, 2) + Math.pow(arrLast(translatedCurve).y, 2),
    ]),
  );
  const scaledCurve = translatedCurve.map((point) => ({
    x: point.x / scale,
    y: point.y / scale,
  }));
  return subdivideCurve(scaledCurve);
};

// rotate around the origin
export const rotate = (curve: Point[], theta: number) => {
  return curve.map((point) => ({
    x: Math.cos(theta) * point.x - Math.sin(theta) * point.y,
    y: Math.sin(theta) * point.x + Math.cos(theta) * point.y,
  }));
};

// remove intermediate points that are on the same line as the points to either side
export const _filterParallelPoints = (points: Point[]) => {
  if (points.length < 3) return points;
  const filteredPoints = [points[0], points[1]];
  points.slice(2).forEach((point) => {
    const numFilteredPoints = filteredPoints.length;
    const curVect = subtract(point, filteredPoints[numFilteredPoints - 1]);
    const prevVect = subtract(
      filteredPoints[numFilteredPoints - 1],
      filteredPoints[numFilteredPoints - 2],
    );
    // this is the z coord of the cross-product. If this is 0 then they're parallel
    const isParallel = curVect.y * prevVect.x - curVect.x * prevVect.y === 0;
    if (isParallel) {
      filteredPoints.pop();
    }
    filteredPoints.push(point);
  });
  return filteredPoints;
};

export function getPathString(points: Point[], close = false) {
  const start = round(points[0]);
  const remainingPoints = points.slice(1);
  let pathString = `M ${start.x} ${start.y}`;
  remainingPoints.forEach((point) => {
    const roundedPoint = round(point);
    pathString += ` L ${roundedPoint.x} ${roundedPoint.y}`;
  });
  if (close) {
    pathString += "Z";
  }
  return pathString;
}

/** take points on a path and move their start point backwards by distance */
export const extendStart = (points: Point[], dist: number) => {
  const filteredPoints = _filterParallelPoints(points);
  if (filteredPoints.length < 2) return filteredPoints;
  const p1 = filteredPoints[1];
  const p2 = filteredPoints[0];
  const newStart = _extendPointOnLine(p1, p2, dist);
  const extendedPoints = filteredPoints.slice(1);
  extendedPoints.unshift(newStart);
  return extendedPoints;
};
