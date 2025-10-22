import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HanziWriter from 'hanzi-writer';
import { markCharacterAsLearned, isCharacterLearned, toggleFavorite, getFavorites } from '../utils/storage';

const Learn = () => {
  const { character } = useParams();
  const navigate = useNavigate();
  const writerRef = useRef(null);
  const containerRef = useRef(null);
  const [writer, setWriter] = useState(null);
  const [isLearned, setIsLearned] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOutline, setShowOutline] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!character) return;

    setIsLearned(isCharacterLearned(character));
    setIsFavorite(getFavorites().has(character));

    // Clean up previous writer
    if (writerRef.current) {
      writerRef.current = null;
    }

    // Clear container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create new HanziWriter instance
    try {
      const newWriter = HanziWriter.create(containerRef.current, character, {
        width: 300,
        height: 300,
        padding: 5,
        showOutline: showOutline,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        strokeColor: '#555',
        outlineColor: '#DDD',
        drawingColor: '#333',
      });

      writerRef.current = newWriter;
      setWriter(newWriter);
    } catch (error) {
      console.error('Error creating HanziWriter:', error);
    }

    return () => {
      if (writerRef.current) {
        writerRef.current = null;
      }
    };
  }, [character]);

  useEffect(() => {
    if (writer) {
      if (showOutline) {
        writer.showOutline();
      } else {
        writer.hideOutline();
      }
    }
  }, [showOutline, writer]);

  const handleAnimate = () => {
    if (writer && !isAnimating) {
      setIsAnimating(true);
      writer.animateCharacter({
        onComplete: () => {
          setIsAnimating(false);
        },
      });
    }
  };

  const handleAnimateStroke = (strokeNum) => {
    if (writer) {
      writer.animateStroke(strokeNum);
    }
  };

  const handleMarkLearned = () => {
    if (!isLearned) {
      markCharacterAsLearned(character);
      setIsLearned(true);
    }
  };

  const handleToggleFavorite = () => {
    const newState = toggleFavorite(character);
    setIsFavorite(newState);
  };

  const handlePractice = () => {
    navigate(`/practice/${character}`);
  };

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600">Please enter a character to learn</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Learning: {character}</h1>
          <div className="flex gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️' : '🤍'} Favorite
            </button>
            {!isLearned && (
              <button
                onClick={handleMarkLearned}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                ✓ Mark as Learned
              </button>
            )}
            {isLearned && (
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                ✓ Learned
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Character Display */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div
              ref={containerRef}
              className="mx-auto mb-4"
              style={{ width: '300px', height: '300px' }}
            />

            {/* Controls */}
            <div className="space-y-3">
              <button
                onClick={handleAnimate}
                disabled={isAnimating}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  isAnimating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isAnimating ? 'Animating...' : '▶ Animate Full Character'}
              </button>

              <button
                onClick={() => setShowOutline(!showOutline)}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                {showOutline ? '👁 Hide Outline' : '👁 Show Outline'}
              </button>

              <button
                onClick={handlePractice}
                className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                ✍️ Practice Writing
              </button>
            </div>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Character Info</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Character:</span>
                  <span className="text-4xl">{character}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Unicode:</span>
                  <span>U+{character.charCodeAt(0).toString(16).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">💡 Learning Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Watch the stroke order animation carefully</li>
                <li>• Pay attention to stroke direction</li>
                <li>• Practice writing the character multiple times</li>
                <li>• Take the quiz to test your knowledge</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">📝 Next Steps</h3>
              <p className="text-sm text-gray-700 mb-3">
                Ready to test your knowledge? Try the practice quiz to see if you can write the character correctly!
              </p>
              <button
                onClick={handlePractice}
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Start Practice Quiz →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
