const {average} = require('./utils');
const {
  cosineSimilarity,
  equals,
  frechetDist,
  distance,
  subtract,
  normalizeCurve,
  rotate,
} = require('./geometry');

const AVG_DIST_THRESHOLD = 300; // bigger = more lenient
const COSINE_SIMILARITY_THRESHOLD = 0; // -1 to 1, smaller = more lenient
const START_AND_END_DIST_THRESHOLD = 250; // bigger = more lenient

const startAndEndMatches = function(points, closestStroke) {
  const startingDist = distance(closestStroke.getStartingPoint(), points[0]);
  const endingDist = distance(closestStroke.getEndingPoint(), points[points.length - 1]);
  return startingDist < START_AND_END_DIST_THRESHOLD && endingDist < START_AND_END_DIST_THRESHOLD;
};

// returns a list of the direction of all segments in the line connecting the points
const getEdgeVectors = (points) => {
  const vectors = [];
  let lastPoint = points[0];
  points.slice(1).forEach(point => {
    vectors.push(subtract(point, lastPoint));
    lastPoint = point;
  });
  return vectors;
};


const directionMatches = (points, stroke) => {
  const edgeVectors = getEdgeVectors(points);
  const strokeVectors = stroke.getVectors();
  const similarities = edgeVectors.map(edgeVector => {
    const strokeSimilarities = strokeVectors.map(strokeVector => cosineSimilarity(strokeVector, edgeVector));
    return Math.max.apply(Math, strokeSimilarities);
  });
  const avgSimilarity = average(similarities);
  return avgSimilarity > COSINE_SIMILARITY_THRESHOLD;
};

const stripDuplicates = (points) => {
  if (points.length < 2) return points;
  const dedupedPoints = [points[0]];
  points.slice(1).forEach(point => {
    if (!equals(point, dedupedPoints[dedupedPoints.length - 1])) {
      dedupedPoints.push(point);
    }
  });
  return dedupedPoints;
};

const FIT_ROTATIONS = [
  Math.PI / 8,
  Math.PI / 16,
  0,
  -1 * Math.PI / 16,
  -1 * Math.PI / 8,
];

const shapeFit = (curve1, curve2) => {
  const normCurve1 = normalizeCurve(curve1);
  const normCurve2 = normalizeCurve(curve2);
  let minFrechetDist = Math.Infinity;
  FIT_ROTATIONS.forEach(theta => {
    const rotatedCurve2 = rotate(normCurve2, theta);
    const dist = frechetDist(normCurve1, rotatedCurve2);
    if (dist < minFrechetDist) {
      minFrechetDist = dist;
    }
  });
  return minFrechetDist;
};

const strokeMatches = (userStroke, stroke) => {
  const points = stripDuplicates(userStroke.points);
  if (points.length < 2) return null;

  const avgDist = stroke.getAverageDistance(points);
  const withinDistThresh = avgDist < AVG_DIST_THRESHOLD;
  const startAndEndMatch = startAndEndMatches(points, stroke);
  const directionMatch = directionMatches(points, stroke);
  const shapeMatch = shapeFit(points, stroke.points);
  console.log(shapeMatch);
  return withinDistThresh && startAndEndMatch && directionMatch;
};


module.exports = strokeMatches;
