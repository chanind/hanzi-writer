const {average, assign} = require('./utils');
const {
  cosineSimilarity,
  equals,
  frechetDist,
  distance,
  subtract,
  normalizeCurve,
  rotate,
  length,
} = require('./geometry');

const AVG_DIST_THRESHOLD = 350; // bigger = more lenient
const COSINE_SIMILARITY_THRESHOLD = 0; // -1 to 1, smaller = more lenient
const START_AND_END_DIST_THRESHOLD = 250; // bigger = more lenient
const FRECHET_THRESHOLD = 0.40; // bigger = more lenient
const MIN_LEN_THRESHOLD = 0.35; // smaller = more lenient

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

const lengthMatches = (points, stroke, leniency) => {
  return leniency * (length(points) + 25) / (stroke.getLength() + 25) >= MIN_LEN_THRESHOLD;
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
  const normCurve1 = normalizeCurve(curve1);
  const normCurve2 = normalizeCurve(curve2);
  let minDist = Infinity;
  SHAPE_FIT_ROTATIONS.forEach(theta => {
    const dist = frechetDist(normCurve1, rotate(normCurve2, theta));
    if (dist < minDist) {
      minDist = dist;
    }
  });
  return minDist <= FRECHET_THRESHOLD * leniency;
};

const getMatchData = (points, stroke, options) => {
  const { leniency = 1, isOutlineVisible = false } = options;
  const avgDist = stroke.getAverageDistance(points);
  const distMod = isOutlineVisible || stroke.strokeNum > 0 ? 0.5 : 1;
  const withinDistThresh = avgDist <= AVG_DIST_THRESHOLD * distMod * leniency;
  // short circuit for faster matching
  if (!withinDistThresh) {
    return { isMatch: false, avgDist };
  }
  const startAndEndMatch = startAndEndMatches(points, stroke, leniency);
  const directionMatch = directionMatches(points, stroke);
  const shapeMatch = shapeFit(points, stroke.points, leniency);
  const lengthMatch = lengthMatches(points, stroke, leniency);
  return {
    isMatch: withinDistThresh && startAndEndMatch && directionMatch && shapeMatch && lengthMatch,
    avgDist,
  };
};

const strokeMatches = (userStroke, character, strokeNum, options = {}) => {
  const points = stripDuplicates(userStroke.points);
  if (points.length < 2) return null;

  const strokeMatchData = getMatchData(points, character.strokes[strokeNum], options);
  if (!strokeMatchData.isMatch) return false;

  // if there is a better match among strokes the user hasn't drawn yet, the user probably drew the wrong stroke
  const laterStrokes = character.strokes.slice(strokeNum + 1);
  let closestMatchDist = strokeMatchData.avgDist;
  for (let i = 0; i < laterStrokes.length; i++) {
    const laterMatchData = getMatchData(points, laterStrokes[i], options);
    if (laterMatchData.isMatch && laterMatchData.avgDist < closestMatchDist) {
      closestMatchDist = laterMatchData.avgDist;
    }
  }
  // if there's a better match, rather that returning false automatically, try reducing leniency instead
  // if leniency is already really high we can allow some similar strokes to pass
  if (closestMatchDist < strokeMatchData.avgDist) {
    // adjust leniency between 0.3 and 0.6 depending on how much of a better match the new match is
    const leniencyAdjustment = 0.6 * (closestMatchDist + strokeMatchData.avgDist) / (2 * strokeMatchData.avgDist);
    const newLeniency = (options.leniency || 1) * leniencyAdjustment;
    const adjustedOptions = assign({}, options, { leniency: newLeniency });
    const adjustedStrokeMatchData = getMatchData(points, character.strokes[strokeNum], adjustedOptions);
    return adjustedStrokeMatchData.isMatch;
  }
  return true;
};


module.exports = strokeMatches;
