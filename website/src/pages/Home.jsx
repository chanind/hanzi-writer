import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStats } from '../utils/storage';

const Home = () => {
  const [searchChar, setSearchChar] = useState('');
  const navigate = useNavigate();
  const stats = getStats();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchChar.trim()) {
      navigate(`/learn/${searchChar.trim()}`);
    }
  };

  const quickStartCharacters = ['你', '好', '爱', '学', '习', '中', '国'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Learn Chinese Characters
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Master Chinese character stroke order with interactive animations and practice
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchChar}
              onChange={(e) => setSearchChar(e.target.value)}
              placeholder="Enter a character (e.g., 你)"
              className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="1"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Start */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-3">Quick start with common characters:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickStartCharacters.map((char) => (
              <Link
                key={char}
                to={`/learn/${char}`}
                className="w-12 h-12 flex items-center justify-center text-2xl bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                {char}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats.totalLearned > 0 && (
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-blue-500">{stats.totalLearned}</div>
              <div className="text-gray-600 mt-2">Characters Learned</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-500">{stats.totalPracticeSessions}</div>
              <div className="text-gray-600 mt-2">Practice Sessions</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-purple-500">{stats.totalQuizzesTaken}</div>
              <div className="text-gray-600 mt-2">Quizzes Taken</div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Browse Characters */}
          <Link to="/browse" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow h-full">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-500">Browse Characters</h3>
              <p className="text-gray-600">
                Explore characters by HSK level, stroke count, or radicals
              </p>
            </div>
          </Link>

          {/* Stroke Animations */}
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold mb-2">Stroke Order</h3>
            <p className="text-gray-600">
              Watch animated stroke-by-stroke writing demonstrations
            </p>
          </div>

          {/* Practice Quiz */}
          <Link to="/practice" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow h-full">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-500">Practice Writing</h3>
              <p className="text-gray-600">
                Test your knowledge with interactive stroke order quizzes
              </p>
            </div>
          </Link>

          {/* Track Progress */}
          <Link to="/progress" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow h-full">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-500">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your learning journey and see your improvement
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* HSK Level Links */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Start by HSK Level</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['hsk1', 'hsk2', 'hsk3'].map((level) => (
            <Link
              key={level}
              to={`/browse/${level}`}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center hover:from-blue-600 hover:to-blue-700 transition-colors shadow-md"
            >
              <div className="text-2xl font-bold">{level.toUpperCase()}</div>
              <div className="text-sm mt-1">Level {level.slice(-1)}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
