import Point from './models/Point';

class StrokeMatcher {

  constructor(options) {
    this.options = options;
  }

  getMatchingStroke(points, strokes) {
    let closestStroke = null;
    let bestAvgDist = 0;
    for (const stroke of strokes) {
      const avgDist = stroke.getAverageDistance(points);
      if (avgDist < bestAvgDist || !closestStroke) {
        closestStroke = stroke;
        bestAvgDist = avgDist;
      }
    }

    const withinDistThresh = bestAvgDist < this.options.matchDistanceThreshold;
    const lengthRatio = this.getLength(points) / closestStroke.getLength();
    const withinLengthThresh = lengthRatio > 0.5 && lengthRatio < 1.5;

    if (withinDistThresh && withinLengthThresh) return closestStroke;
  }

  getLength(points) {
    if (points.length < 2) return 0;
    let length = 0;
    let lastPoint = points[0];
    for (const point of points) {
      length += Point.getDistance(point, lastPoint);
      lastPoint = point;
    }
    return length;
  }

}

export default StrokeMatcher;
