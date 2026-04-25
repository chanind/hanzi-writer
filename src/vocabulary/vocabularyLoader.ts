import { VocabularyData, VocabularyOptions } from '../typings/types';
import { VOCABULARY_DATABASE, BUILT_IN_CHARACTERS } from './vocabularyData';

export type VocabDataLoaderFn = (
  char: string,
  options?: Partial<VocabularyOptions>
) => Promise<VocabularyData>;

const DEFAULT_VOCABULARY: VocabularyData = {
  character: '',
  pinyin: '',
  meaning: '',
  words: [],
  idioms: [],
  examples: [],
};

export function defaultVocabDataLoader(
  char: string,
  options?: Partial<VocabularyOptions>
): VocabularyData {
  const vocab = VOCABULARY_DATABASE[char];
  
  if (!vocab) {
    return {
      ...DEFAULT_VOCABULARY,
      character: char,
    };
  }

  const {
    maxWords = 5,
    maxIdioms = 3,
    maxExamples = 3,
    showWords = true,
    showIdioms = true,
    showExamples = true,
  } = options || {};

  return {
    ...vocab,
    words: showWords ? vocab.words.slice(0, maxWords) : [],
    idioms: showIdioms ? vocab.idioms.slice(0, maxIdioms) : [],
    examples: showExamples ? vocab.examples.slice(0, maxExamples) : [],
  };
}

export function hasBuiltInVocabulary(char: string): boolean {
  return BUILT_IN_CHARACTERS.includes(char);
}

export function getAllBuiltInCharacters(): string[] {
  return [...BUILT_IN_CHARACTERS];
}

export default defaultVocabDataLoader;
