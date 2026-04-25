import { HanziWriterOptions } from './typings/types';
import defaultCharDataLoader from './defaultCharDataLoader';

const defaultOptions: HanziWriterOptions = {
  charDataLoader: defaultCharDataLoader,
  onLoadCharDataError: null,
  onLoadCharDataSuccess: null,
  showOutline: true,
  showCharacter: true,
  renderer: 'svg',

  // positioning options

  width: 0,
  height: 0,
  padding: 20,

  // animation options

  strokeAnimationSpeed: 1,
  strokeFadeDuration: 400,
  strokeHighlightDuration: 200,
  strokeHighlightSpeed: 2,
  delayBetweenStrokes: 1000,
  delayBetweenLoops: 2000,

  // colors

  strokeColor: '#555',
  radicalColor: null,
  highlightColor: '#AAF',
  outlineColor: '#DDD',
  drawingColor: '#333',

  // quiz options

  leniency: 1,
  showHintAfterMisses: 3,
  highlightOnComplete: true,
  highlightCompleteColor: null,
  markStrokeCorrectAfterMisses: false,
  acceptBackwardsStrokes: false,
  quizStartStrokeNum: 0,
  averageDistanceThreshold: 350,

  // undocumented obscure options

  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  outlineWidth: 2,
  rendererOverride: {},

  // theme options

  theme: 'light',
  customTheme: undefined,

  // scoring options

  scoreOptions: {
    enableScoring: true,
    showScorePanel: true,
    scorePerStroke: 100,
    weightShape: 0.4,
    weightDirection: 0.3,
    weightPosition: 0.3,
    weightStructure: 0.2,
    passingScore: 60,
    showGrade: true,
  },

  // vocabulary options

  vocabularyOptions: {
    showVocabulary: true,
    vocabularyPosition: 'bottom',
    showWords: true,
    showIdioms: true,
    showExamples: true,
    maxWords: 5,
    maxIdioms: 3,
    maxExamples: 3,
    translationLanguage: 'en',
  },

  // new UI options

  showScoreFeedback: true,
  showStrokeFeedback: true,
  autoPlayAnimation: false,

  // callbacks

  onScoreUpdate: undefined,
  onVocabularyLoad: undefined,
};

export default defaultOptions;
