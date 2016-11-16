import Point from './models/Point';
import {average} from './utils';

const AVG_DIST_THRESHOLD = 200; // bigger = more lenient
const LENGTH_RATIO_THRESHOLD = 0.5; // 0 to 1, bigger = more lenient
const COSINE_SIMILARITY_THRESHOLD = 0;  // -1 to 1, smaller = more lenient
const START_AND_END_DIST_THRESHOLD = 250; // bigger = more lenient

class StrokeMatcher {

  getMatchingStroke(userStroke, strokes) {
    const points = this._stripDuplicates(userStroke.getPoints());
    if (points.length < 2) return null;

    let closestStroke = null;
    let bestAvgDist = 0;
    for (const stroke of strokes) {
      const avgDist = stroke.getAverageDistance(points);
      if (avgDist < bestAvgDist || !closestStroke) {
        closestStroke = stroke;
        bestAvgDist = avgDist;
      }
    }

    const withinDistThresh = bestAvgDist < AVG_DIST_THRESHOLD;
    const lengthRatio = this._getLength(points) / closestStroke.getLength();
    const withinLengthThresh = lengthRatio > (1 - LENGTH_RATIO_THRESHOLD) && lengthRatio < (1 + LENGTH_RATIO_THRESHOLD);
    const startAndEndMatch = this._startAndEndMatches(points, closestStroke);
    const directionMatches = this._directionMatches(points, closestStroke);
    if (withinDistThresh && withinLengthThresh && startAndEndMatch && directionMatches) {
      return closestStroke;
    }
    return null;
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

export default StrokeMatcher;
