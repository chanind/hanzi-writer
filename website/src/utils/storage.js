// localStorage utility functions for managing learning progress

const STORAGE_KEYS = {
  LEARNED_CHARACTERS: 'hanzi_learned_characters',
  PRACTICE_HISTORY: 'hanzi_practice_history',
  QUIZ_SCORES: 'hanzi_quiz_scores',
  FAVORITES: 'hanzi_favorites',
};

/**
 * Get learned characters from localStorage
 * @returns {Set<string>} Set of learned character strings
 */
export const getLearnedCharacters = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEARNED_CHARACTERS);
    return new Set(data ? JSON.parse(data) : []);
  } catch (error) {
    console.error('Error reading learned characters:', error);
    return new Set();
  }
};

/**
 * Mark a character as learned
 * @param {string} character - The character to mark as learned
 */
export const markCharacterAsLearned = (character) => {
  try {
    const learned = getLearnedCharacters();
    learned.add(character);
    localStorage.setItem(
      STORAGE_KEYS.LEARNED_CHARACTERS,
      JSON.stringify([...learned])
    );
  } catch (error) {
    console.error('Error saving learned character:', error);
  }
};

/**
 * Check if a character has been learned
 * @param {string} character - The character to check
 * @returns {boolean}
 */
export const isCharacterLearned = (character) => {
  return getLearnedCharacters().has(character);
};

/**
 * Get practice history
 * @returns {Array} Array of practice sessions
 */
export const getPracticeHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRACTICE_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading practice history:', error);
    return [];
  }
};

/**
 * Add a practice session to history
 * @param {Object} session - Practice session data
 */
export const addPracticeSession = (session) => {
  try {
    const history = getPracticeHistory();
    history.push({
      ...session,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 100 sessions
    const trimmed = history.slice(-100);
    localStorage.setItem(STORAGE_KEYS.PRACTICE_HISTORY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving practice session:', error);
  }
};

/**
 * Get quiz scores for a character
 * @param {string} character - The character to get scores for
 * @returns {Array} Array of quiz attempts
 */
export const getQuizScores = (character = null) => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES);
    const scores = data ? JSON.parse(data) : {};
    return character ? (scores[character] || []) : scores;
  } catch (error) {
    console.error('Error reading quiz scores:', error);
    return character ? [] : {};
  }
};

/**
 * Save a quiz score
 * @param {string} character - The character
 * @param {Object} score - Score data (correct, total, time, etc.)
 */
export const saveQuizScore = (character, score) => {
  try {
    const scores = getQuizScores();
    if (!scores[character]) {
      scores[character] = [];
    }
    scores[character].push({
      ...score,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(scores));
  } catch (error) {
    console.error('Error saving quiz score:', error);
  }
};

/**
 * Get favorite characters
 * @returns {Set<string>} Set of favorite character strings
 */
export const getFavorites = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return new Set(data ? JSON.parse(data) : []);
  } catch (error) {
    console.error('Error reading favorites:', error);
    return new Set();
  }
};

/**
 * Toggle a character as favorite
 * @param {string} character - The character to toggle
 * @returns {boolean} True if now favorited, false if unfavorited
 */
export const toggleFavorite = (character) => {
  try {
    const favorites = getFavorites();
    if (favorites.has(character)) {
      favorites.delete(character);
    } else {
      favorites.add(character);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([...favorites]));
    return favorites.has(character);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};

/**
 * Get learning statistics
 * @returns {Object} Statistics about learning progress
 */
export const getStats = () => {
  const learned = getLearnedCharacters();
  const history = getPracticeHistory();
  const scores = getQuizScores();

  return {
    totalLearned: learned.size,
    totalPracticeSessions: history.length,
    totalQuizzesTaken: Object.values(scores).reduce((sum, arr) => sum + arr.length, 0),
    learnedCharacters: [...learned],
    recentSessions: history.slice(-10),
  };
};

/**
 * Clear all data (for testing or reset)
 */
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};
