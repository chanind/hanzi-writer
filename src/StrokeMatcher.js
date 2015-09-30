
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
    if (bestAvgDist < this.options.matchDistanceThreshold) return closestStroke;
  }

}

export default StrokeMatcher;
