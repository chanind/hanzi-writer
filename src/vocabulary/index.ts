import defaultVocabDataLoader, {
  VocabDataLoaderFn,
  hasBuiltInVocabulary,
  getAllBuiltInCharacters,
} from './vocabularyLoader';
import { VOCABULARY_DATABASE, BUILT_IN_CHARACTERS } from './vocabularyData';

export {
  defaultVocabDataLoader,
  hasBuiltInVocabulary,
  getAllBuiltInCharacters,
  VOCABULARY_DATABASE,
  BUILT_IN_CHARACTERS,
};

export type { VocabDataLoaderFn };
