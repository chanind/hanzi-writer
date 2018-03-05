const {average} = require('./utils');
const {
  cosineSimilarity,
  equals,
  frechetDist,
  distance,
  subtract,
  normalizeCurve,
  // subdivideCurve,
  rotate,
} = require('./geometry');

const AVG_DIST_THRESHOLD = 230; // bigger = more lenient
const COSINE_SIMILARITY_THRESHOLD = 0; // -1 to 1, smaller = more lenient
const START_AND_END_DIST_THRESHOLD = 250; // bigger = more lenient
const FRECHET_THRESHOLD = 0.75; // bigger = more lenient

const startAndEndMatches = function(points, closestStroke, leniency) {
  const startingDist = distance(closestStroke.getStartingPoint(), points[0]);
  const endingDist = distance(closestStroke.getEndingPoint(), points[points.length - 1]);
  return (
    startingDist <= START_AND_END_DIST_THRESHOLD * leniency &&
    endingDist <= START_AND_END_DIST_THRESHOLD * leniency
  );
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

const SHAPE_FIT_ROTATIONS = [
  Math.PI / 16,
  Math.PI / 32,
  0,
  -1 * Math.PI / 32,
  -1 * Math.PI / 16,
];

const shapeFit = (curve1, curve2, leniency) => {
  const normCurve1 = normalizeCurve(curve1, 2);
  const normCurve2 = normalizeCurve(curve2, 2);
  let minDist = Infinity;
  SHAPE_FIT_ROTATIONS.forEach(theta => {
    const dist = frechetDist(normCurve1, rotate(normCurve2, theta));
    if (dist < minDist) {
      minDist = dist;
    }
  });
  return minDist <= FRECHET_THRESHOLD * leniency;
};

const strokeMatches = (userStroke, stroke, isOutlineVisible = false, leniency = 1) => {
  const points = stripDuplicates(userStroke.points);
  if (points.length < 2) return null;

  const avgDist = stroke.getAverageDistance(points);
  const distMod = isOutlineVisible || stroke.strokeNum > 0 ? 0.5 : 1;
  const withinDistThresh = avgDist <= AVG_DIST_THRESHOLD * distMod * leniency;
  const startAndEndMatch = startAndEndMatches(points, stroke, leniency);
  const directionMatch = directionMatches(points, stroke);
  const shapeMatch = shapeFit(points, stroke.points, leniency);
  return withinDistThresh && startAndEndMatch && directionMatch && shapeMatch;
};


module.exports = strokeMatches;
