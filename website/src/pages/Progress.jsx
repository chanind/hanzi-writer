import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getPracticeHistory, getQuizScores, getLearnedCharacters, getFavorites, clearAllData } from '../utils/storage';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const data = getStats();
    setStats(data);
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    loadStats();
  };

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const learnedCharacters = [...getLearnedCharacters()];
  const favorites = [...getFavorites()];
  const practiceHistory = getPracticeHistory();
  const quizScores = getQuizScores();

  // Calculate quiz statistics
  const totalQuizzes = Object.values(quizScores).reduce((sum, arr) => sum + arr.length, 0);
  const perfectScores = Object.values(quizScores).reduce(
    (sum, arr) => sum + arr.filter((score) => score.mistakes === 0).length,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Learning Progress</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold mb-2">{stats.totalLearned}</div>
            <div className="text-blue-100">Characters Learned</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold mb-2">{stats.totalPracticeSessions}</div>
            <div className="text-green-100">Practice Sessions</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold mb-2">{totalQuizzes}</div>
            <div className="text-purple-100">Total Quizzes</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold mb-2">{perfectScores}</div>
            <div className="text-yellow-100">Perfect Scores</div>
          </div>
        </div>

        {stats.totalLearned === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center mb-8">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">Start Your Learning Journey!</h2>
            <p className="text-gray-600 mb-4">
              You haven't learned any characters yet. Let's get started!
            </p>
            <Link
              to="/browse"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Browse Characters
            </Link>
          </div>
        )}

        {stats.totalLearned > 0 && (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-3 font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('learned')}
                  className={`flex-1 px-6 py-3 font-medium transition-colors ${
                    activeTab === 'learned'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Learned ({learnedCharacters.length})
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 px-6 py-3 font-medium transition-colors ${
                    activeTab === 'favorites'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Favorites ({favorites.length})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 px-6 py-3 font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  History
                </button>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-3">Recent Activity</h3>
                      {stats.recentSessions.length > 0 ? (
                        <div className="space-y-2">
                          {stats.recentSessions.slice(-5).reverse().map((session, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{session.character || 'Practice'}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                  {new Date(session.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No recent activity</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3">Achievement Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl mb-1">
                            {totalQuizzes > 0 ? Math.round((perfectScores / totalQuizzes) * 100) : 0}%
                          </div>
                          <div className="text-sm text-gray-600">Perfect Score Rate</div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl mb-1">{learnedCharacters.length}</div>
                          <div className="text-sm text-gray-600">Total Characters Mastered</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Learned Tab */}
                {activeTab === 'learned' && (
                  <div>
                    {learnedCharacters.length > 0 ? (
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                        {learnedCharacters.map((char) => (
                          <Link
                            key={char}
                            to={`/learn/${char}`}
                            className="aspect-square flex items-center justify-center text-2xl bg-green-100 border-2 border-green-400 rounded-lg hover:scale-110 transition-transform"
                          >
                            {char}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No characters learned yet</p>
                    )}
                  </div>
                )}

                {/* Favorites Tab */}
                {activeTab === 'favorites' && (
                  <div>
                    {favorites.length > 0 ? (
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                        {favorites.map((char) => (
                          <Link
                            key={char}
                            to={`/learn/${char}`}
                            className="aspect-square flex items-center justify-center text-2xl bg-red-100 border-2 border-red-400 rounded-lg hover:scale-110 transition-transform"
                          >
                            {char}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No favorite characters yet</p>
                    )}
                  </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <div>
                    {practiceHistory.length > 0 ? (
                      <div className="space-y-2">
                        {practiceHistory.slice().reverse().map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="text-3xl">{session.character || '?'}</div>
                              <div>
                                <div className="font-medium">
                                  {session.character ? `Practiced ${session.character}` : 'Practice session'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(session.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            {session.character && (
                              <Link
                                to={`/learn/${session.character}`}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                              >
                                Review
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No practice history yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Clear Data Section */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Clear all your learning data. This action cannot be undone.
              </p>
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Clear All Data
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={handleClearData}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Confirm Clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;
