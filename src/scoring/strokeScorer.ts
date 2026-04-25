import {
  cosineSimilarity,
  equals,
  frechetDist,
  distance,
  subtract,
  normalizeCurve,
  rotate,
  length,
  getPathString,
} from '../geometry';
import { Point, StrokeScore, StructureScore, WritingScore, ScoreOptions } from '../typings/types';
import UserStroke from '../models/UserStroke';
import Stroke from '../models/Stroke';
import Character from '../models/Character';

const SHAPE_FIT_ROTATIONS = [
  Math.PI / 16,
  Math.PI / 32,
  0,
  (-1 * Math.PI) / 32,
  (-1 * Math.PI) / 16,
];

const FRECHET_THRESHOLD = 0.4;
const COSINE_SIMILARITY_THRESHOLD = 0;
const START_AND_END_DIST_THRESHOLD = 250;
const MIN_LEN_THRESHOLD = 0.35;

function stripDuplicates(points: Point[]): Point[] {
  if (points.length < 2) return points;
  const [firstPoint, ...rest] = points;
  const dedupedPoints = [firstPoint];

  for (const point of rest) {
    if (!equals(point, dedupedPoints[dedupedPoints.length - 1])) {
      dedupedPoints.push(point);
    }
  }

  return dedupedPoints;
}

function getEdgeVectors(points: Point[]): Point[] {
  const vectors: Point[] = [];
  let lastPoint = points[0];
  points.slice(1).forEach((point) => {
    vectors.push(subtract(point, lastPoint));
    lastPoint = point;
  });
  return vectors;
}

function getAverageSimilarity(userPoints: Point[], stroke: Stroke): number {
  const edgeVectors = getEdgeVectors(userPoints);
  const strokeVectors = stroke.getVectors();
  
  if (edgeVectors.length === 0 || strokeVectors.length === 0) {
    return 0;
  }

  const similarities = edgeVectors.map((edgeVector) => {
    const strokeSimilarities = strokeVectors.map((strokeVector) =>
      cosineSimilarity(strokeVector, edgeVector)
    );
    return Math.max(...strokeSimilarities);
  });

  const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
  return Math.max(0, Math.min(1, (avgSimilarity + 1) / 2));
}

function getShapeMatchScore(userPoints: Point[], stroke: Stroke, leniency: number): number {
  const normUserPoints = normalizeCurve(userPoints);
  const normStrokePoints = normalizeCurve(stroke.points);
  
  let minDist = Infinity;
  SHAPE_FIT_ROTATIONS.forEach((theta) => {
    const dist = frechetDist(normUserPoints, rotate(normStrokePoints, theta));
    if (dist < minDist) {
      minDist = dist;
    }
  });

  const threshold = FRECHET_THRESHOLD * leniency;
  if (minDist <= threshold) {
    return 1 - (minDist / threshold) * 0.5;
  } else {
    return Math.max(0, 1 - (minDist - threshold) / (FRECHET_THRESHOLD * 2));
  }
}

function getPositionScore(userPoints: Point[], stroke: Stroke, leniency: number): number {
  const avgDist = stroke.getAverageDistance(userPoints);
  const threshold = START_AND_END_DIST_THRESHOLD * leniency;
  
  const startDist = distance(stroke.getStartingPoint(), userPoints[0]);
  const endDist = distance(stroke.getEndingPoint(), userPoints[userPoints.length - 1]);
  
  const avgStartEndDist = (startDist + endDist) / 2;
  const combinedDist = (avgDist * 0.6 + avgStartEndDist * 0.4);

  if (combinedDist <= threshold) {
    return 1 - (combinedDist / threshold) * 0.3;
  } else {
    return Math.max(0, 1 - (combinedDist - threshold) / (threshold * 1.5));
  }
}

function getLengthScore(userPoints: Point[], stroke: Stroke, leniency: number): number {
  const userLength = length(userPoints);
  const strokeLength = stroke.getLength();
  
  const ratio = (userLength + 25) / (strokeLength + 25);
  const normalizedRatio = ratio > 1 ? 1 / ratio : ratio;
  
  const minRatio = MIN_LEN_THRESHOLD / leniency;
  if (normalizedRatio >= minRatio) {
    return Math.min(1, (normalizedRatio - minRatio) / (1 - minRatio) * 0.8 + 0.2);
  } else {
    return (normalizedRatio / minRatio) * 0.3;
  }
}

function checkBackwards(userPoints: Point[], stroke: Stroke): boolean {
  const reversedPoints = [...userPoints].reverse();
  const forwardSimilarity = getAverageSimilarity(userPoints, stroke);
  const backwardSimilarity = getAverageSimilarity(reversedPoints, stroke);
  return backwardSimilarity > forwardSimilarity + 0.2;
}

function generateStrokeFeedback(
  strokeScore: {
    shapeScore: number;
    directionScore: number;
    positionScore: number;
    totalScore: number;
  },
  isBackwards: boolean
): string {
  const feedbacks: string[] = [];
  
  if (isBackwards) {
    feedbacks.push('笔画方向写反了，请从正确的起点开始书写。');
  }
  
  if (strokeScore.shapeScore < 0.6) {
    feedbacks.push('笔画形状不够准确，请参考标准字形多加练习。');
  } else if (strokeScore.shapeScore < 0.8) {
    feedbacks.push('笔画形状基本正确，稍加改进会更好。');
  }
  
  if (strokeScore.directionScore < 0.6) {
    feedbacks.push('笔画方向偏差较大，请注意运笔方向。');
  } else if (strokeScore.directionScore < 0.8) {
    feedbacks.push('笔画方向基本正确，注意细节。');
  }
  
  if (strokeScore.positionScore < 0.6) {
    feedbacks.push('笔画位置偏离较大，请参考汉字结构。');
  } else if (strokeScore.positionScore < 0.8) {
    feedbacks.push('笔画位置基本准确，注意细节。');
  }
  
  if (feedbacks.length === 0) {
    if (strokeScore.totalScore >= 0.9) {
      feedbacks.push('写得非常好！笔画准确规范。');
    } else if (strokeScore.totalScore >= 0.8) {
      feedbacks.push('写得不错，继续保持！');
    } else {
      feedbacks.push('继续努力，多练习会更好！');
    }
  }
  
  return feedbacks.join(' ');
}

export function scoreStroke(
  userStroke: UserStroke,
  stroke: Stroke,
  strokeNum: number,
  options: {
    leniency?: number;
    weightShape?: number;
    weightDirection?: number;
    weightPosition?: number;
  } = {}
): StrokeScore {
  const {
    leniency = 1,
    weightShape = 0.4,
    weightDirection = 0.3,
    weightPosition = 0.3,
  } = options;

  const userPoints = stripDuplicates(userStroke.points);
  
  if (userPoints.length < 2) {
    return {
      strokeNum,
      correct: false,
      isBackwards: false,
      shapeScore: 0,
      directionScore: 0,
      positionScore: 0,
      totalScore: 0,
      feedback: '笔画太短，请完整书写。',
    };
  }

  const isBackwards = checkBackwards(userPoints, stroke);
  const effectivePoints = isBackwards ? [...userPoints].reverse() : userPoints;
  
  const shapeScore = getShapeMatchScore(effectivePoints, stroke, leniency);
  const directionScore = getAverageSimilarity(effectivePoints, stroke);
  const positionScore = getPositionScore(effectivePoints, stroke, leniency);
  const lengthScore = getLengthScore(userPoints, stroke, leniency);
  
  const weightedShape = shapeScore * 0.8 + lengthScore * 0.2;
  const totalScore = 
    weightedShape * weightShape +
    directionScore * weightDirection +
    positionScore * weightPosition;

  const correct = totalScore >= 0.6;

  const feedback = generateStrokeFeedback(
    {
      shapeScore: weightedShape,
      directionScore,
      positionScore,
      totalScore,
    },
    isBackwards
  );

  return {
    strokeNum,
    correct,
    isBackwards,
    shapeScore: Math.round(weightedShape * 100) / 100,
    directionScore: Math.round(directionScore * 100) / 100,
    positionScore: Math.round(positionScore * 100) / 100,
    totalScore: Math.round(totalScore * 100) / 100,
    feedback,
  };
}

export function calculateStructureScore(
  character: Character,
  strokeScores: StrokeScore[],
  userStrokesData: { points: Point[] }[]
): StructureScore {
  if (character.strokes.length === 0) {
    return {
      balanceScore: 0,
      proportionScore: 0,
      symmetryScore: 0,
      compactnessScore: 0,
      totalScore: 0,
      feedback: '没有笔画数据。',
    };
  }

  const totalStrokes = character.strokes.length;
  const writtenStrokes = Math.min(strokeScores.length, userStrokesData.length);

  const avgPositionScore = writtenStrokes > 0
    ? strokeScores.slice(0, writtenStrokes).reduce((acc, s) => acc + s.positionScore, 0) / writtenStrokes
    : 0;

  const avgShapeScore = writtenStrokes > 0
    ? strokeScores.slice(0, writtenStrokes).reduce((acc, s) => acc + s.shapeScore, 0) / writtenStrokes
    : 0;

  const avgDirectionScore = writtenStrokes > 0
    ? strokeScores.slice(0, writtenStrokes).reduce((acc, s) => acc + s.directionScore, 0) / writtenStrokes
    : 0;

  const backwardsCount = strokeScores.filter(s => s.isBackwards).length;
  const backwardsPenalty = backwardsCount / Math.max(1, totalStrokes);

  const balanceScore = Math.max(0, avgPositionScore - backwardsPenalty * 0.2);
  const proportionScore = avgShapeScore;
  const symmetryScore = (avgPositionScore + avgShapeScore) / 2;
  const compactnessScore = (avgPositionScore + avgDirectionScore) / 2;

  const totalScore = (
    balanceScore * 0.25 +
    proportionScore * 0.3 +
    symmetryScore * 0.25 +
    compactnessScore * 0.2
  );

  let feedback = '';
  if (totalScore >= 0.85) {
    feedback = '字形结构很好，各部分比例协调匀称。';
  } else if (totalScore >= 0.7) {
    feedback = '结构基本合格，注意笔画间的相对位置。';
  } else if (totalScore >= 0.5) {
    feedback = '结构需要改进，建议多观察标准字形。';
  } else {
    feedback = '结构偏差较大，请参考汉字结构规范多加练习。';
  }

  return {
    balanceScore: Math.round(balanceScore * 100) / 100,
    proportionScore: Math.round(proportionScore * 100) / 100,
    symmetryScore: Math.round(symmetryScore * 100) / 100,
    compactnessScore: Math.round(compactnessScore * 100) / 100,
    totalScore: Math.round(totalScore * 100) / 100,
    feedback,
  };
}

export function calculateOverallScore(
  character: Character,
  strokeScores: StrokeScore[],
  structureScore: StructureScore,
  options: ScoreOptions
): WritingScore {
  const totalStrokes = character.strokes.length;
  const correctStrokes = strokeScores.filter(s => s.correct).length;
  
  const strokeAvgScore = strokeScores.length > 0
    ? strokeScores.reduce((acc, s) => acc + s.totalScore, 0) / strokeScores.length
    : 0;

  const {
    weightStructure = 0.2,
    scorePerStroke = 100,
    passingScore = 60,
  } = options;

  const weightStrokes = 1 - weightStructure;
  const normalizedScore = strokeAvgScore * weightStrokes + structureScore.totalScore * weightStructure;
  const totalScore = Math.round(normalizedScore * scorePerStroke);

  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (totalScore >= 90) grade = 'A';
  else if (totalScore >= 80) grade = 'B';
  else if (totalScore >= 70) grade = 'C';
  else if (totalScore >= 60) grade = 'D';
  else grade = 'F';

  let overallFeedback = '';
  const accuracy = correctStrokes / Math.max(1, totalStrokes);

  if (totalScore >= 90) {
    overallFeedback = `太棒了！书写得分 ${totalScore} 分，达到优秀水平。所有笔画都非常规范，结构匀称美观。继续保持！`;
  } else if (totalScore >= 80) {
    overallFeedback = `书写得分 ${totalScore} 分，表现良好。${accuracy >= 0.8 ? '大部分笔画书写正确' : '有部分笔画需要改进'}。注意细节会更好！`;
  } else if (totalScore >= 70) {
    overallFeedback = `书写得分 ${totalScore} 分，基本合格。建议多练习 ${correctStrokes < totalStrokes ? '错误的笔画' : '笔画细节'}，参考标准字形多加临摹。`;
  } else if (totalScore >= 60) {
    overallFeedback = `书写得分 ${totalScore} 分，需要加强练习。请注意笔画的正确顺序、形状和位置，多观察标准汉字的结构。`;
  } else {
    overallFeedback = `书写得分 ${totalScore} 分，还需要更多练习。建议从基础笔画开始，重点关注笔顺、笔画形状和汉字结构。不要着急，慢慢来！`;
  }

  return {
    character: character.symbol,
    totalStrokes,
    correctStrokes,
    strokeScores: [...strokeScores],
    structureScore,
    totalScore,
    grade,
    overallFeedback,
  };
}

export default {
  scoreStroke,
  calculateStructureScore,
  calculateOverallScore,
};
