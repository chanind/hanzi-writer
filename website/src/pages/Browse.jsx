import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import hskData from '../data/hsk-characters.json';
import { isCharacterLearned } from '../utils/storage';

const Browse = () => {
  const { level } = useParams();
  const [selectedLevel, setSelectedLevel] = useState(level || 'hsk1');
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (level) {
      setSelectedLevel(level);
    }
  }, [level]);

  useEffect(() => {
    const chars = hskData[selectedLevel] || [];
    setCharacters(chars);
  }, [selectedLevel]);

  const filteredCharacters = characters.filter((char) =>
    searchTerm ? char.includes(searchTerm) : true
  );

  const learnedCount = filteredCharacters.filter((char) => isCharacterLearned(char)).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Browse Characters</h1>

      {/* Level Selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {['hsk1', 'hsk2', 'hsk3'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedLevel === lvl
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {lvl.toUpperCase()} ({hskData[lvl]?.length || 0} characters)
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search characters..."
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Progress Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700">
          <span className="font-semibold">{learnedCount}</span> of{' '}
          <span className="font-semibold">{filteredCharacters.length}</span> characters learned
          {learnedCount > 0 && (
            <span className="ml-2 text-blue-600">
              ({Math.round((learnedCount / filteredCharacters.length) * 100)}%)
            </span>
          )}
        </p>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
        {filteredCharacters.map((char, index) => {
          const learned = isCharacterLearned(char);
          return (
            <Link
              key={`${char}-${index}`}
              to={`/learn/${char}`}
              className={`relative aspect-square flex items-center justify-center text-3xl rounded-lg transition-all hover:scale-110 shadow-sm ${
                learned
                  ? 'bg-green-100 border-2 border-green-400 text-green-800'
                  : 'bg-white border-2 border-gray-200 hover:border-blue-400'
              }`}
              title={char}
            >
              {char}
              {learned && (
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 text-xs">
                  ✓
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">No characters found</p>
          <p className="mt-2">Try a different search term or level</p>
        </div>
      )}
    </div>
  );
};

export default Browse;
