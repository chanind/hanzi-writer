const Point = require('./models/Point');
const {average} = require('./utils');

const AVG_DIST_THRESHOLD = 300; // bigger = more lenient
const COSINE_SIMILARITY_THRESHOLD = 0; // -1 to 1, smaller = more lenient
const START_AND_END_DIST_THRESHOLD = 250; // bigger = more lenient

class StrokeMatcher {

  strokeMatches(userStroke, stroke) {
    const points = this._stripDuplicates(userStroke.getPoints());
    if (points.length < 2) return null;

    const avgDist = stroke.getAverageDistance(points);
    const withinDistThresh = avgDist < AVG_DIST_THRESHOLD;
    const startAndEndMatch = this._startAndEndMatches(points, stroke);
    const directionMatches = this._directionMatches(points, stroke);
    return withinDistThresh && startAndEndMatch && directionMatches;
  }

  _startAndEndMatches(points, closestStroke) {
    const startingDist = Point.getDistance(closestStroke.getStartingPoint(), points[0]);
    const endingDist = Point.getDistance(closestStroke.getEndingPoint(), points[points.length - 1]);
    return startingDist < START_AND_END_DIST_THRESHOLD && endingDist < START_AND_END_DIST_THRESHOLD;
  }

  _directionMatches(points, stroke) {
    const edgeVectors = this._getEdgeVectors(points);
    const strokeVectors = stroke.getVectors();
    const similarities = [];
    for (const edgeVector of edgeVectors) {
      const strokeSimilarities = strokeVectors.map(strokeVector => Point.cosineSimilarity(strokeVector, edgeVector));
      const maxSimilarity = Math.max.apply(Math, strokeSimilarities);
      similarities.push(maxSimilarity);
    }
    const avgSimilarity = average(similarities);
    return avgSimilarity > COSINE_SIMILARITY_THRESHOLD;
  }

  _stripDuplicates(points) {
    if (points.length < 2) return points;
    const dedupedPoints = [points[0]];
    for (const point of points.slice(1)) {
      if (!point.equals(dedupedPoints[dedupedPoints.length - 1])) {
        dedupedPoints.push(point);
      }
    }
    return dedupedPoints;
  }

  _getLength(points) {
    let length = 0;
    let lastPoint = points[0];
    for (const point of points) {
      length += Point.getDistance(point, lastPoint);
      lastPoint = point;
    }
    return length;
  }

  // returns a list of the direction of all segments in the line connecting the points
  _getEdgeVectors(points) {
    const vectors = [];
    let lastPoint = points[0];
    for (const point of points.slice(1)) {
      vectors.push(point.subtract(lastPoint));
      lastPoint = point;
    }
    return vectors;
  }
}

module.exports = StrokeMatcher;
