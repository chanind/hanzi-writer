import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HanziWriter from 'hanzi-writer';
import { saveQuizScore, markCharacterAsLearned } from '../utils/storage';
import hskData from '../data/hsk-characters.json';

const Practice = () => {
  const { character: urlCharacter } = useParams();
  const navigate = useNavigate();
  const writerRef = useRef(null);
  const containerRef = useRef(null);
  const [character, setCharacter] = useState(urlCharacter || '');
  const [quizActive, setQuizActive] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const getRandomCharacter = () => {
    const allChars = [...hskData.hsk1, ...hskData.hsk2, ...hskData.hsk3];
    return allChars[Math.floor(Math.random() * allChars.length)];
  };

  const startQuiz = (char) => {
    const targetChar = char || character || getRandomCharacter();
    setCharacter(targetChar);
    setQuizActive(true);
    setQuizComplete(false);
    setMistakes(0);
    setStartTime(Date.now());

    // Clean up previous writer
    if (writerRef.current) {
      writerRef.current = null;
    }

    // Clear container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create new quiz
    try {
      const writer = HanziWriter.create(containerRef.current, targetChar, {
        width: 400,
        height: 400,
        padding: 10,
        showOutline: true,
        showCharacter: false,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
      });

      writerRef.current = writer;

      writer.quiz({
        onMistake: (strokeData) => {
          setMistakes((prev) => prev + 1);
        },
        onCorrectStroke: (strokeData) => {
          // Stroke was correct
        },
        onComplete: (summaryData) => {
          setQuizComplete(true);
          setQuizActive(false);
          setTotalStrokes(summaryData.totalStrokes);

          // Save quiz score
          const timeSpent = Math.round((Date.now() - startTime) / 1000);
          saveQuizScore(targetChar, {
            mistakes: summaryData.totalMistakes || mistakes,
            totalStrokes: summaryData.totalStrokes,
            timeSpent,
          });

          // Mark as learned if perfect score
          if (summaryData.totalMistakes === 0) {
            markCharacterAsLearned(targetChar);
          }
        },
      });
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  useEffect(() => {
    if (urlCharacter) {
      startQuiz(urlCharacter);
    }
  }, []);

  const handleShowHint = () => {
    if (writerRef.current) {
      writerRef.current.showOutline();
    }
  };

  const handleNewQuiz = () => {
    const newChar = getRandomCharacter();
    startQuiz(newChar);
  };

  const handleSelectCharacter = () => {
    navigate('/browse');
  };

  const getScoreEmoji = () => {
    if (mistakes === 0) return '🌟';
    if (mistakes <= 2) return '⭐';
    if (mistakes <= 5) return '👍';
    return '💪';
  };

  const getEncouragementMessage = () => {
    if (mistakes === 0) return 'Perfect! You are a master!';
    if (mistakes <= 2) return 'Excellent work! Just a few small mistakes.';
    if (mistakes <= 5) return 'Good job! Keep practicing!';
    return 'Keep trying! Practice makes perfect!';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Practice Writing</h1>

        {!quizActive && !quizComplete && (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-6xl mb-6">✍️</div>
            <h2 className="text-2xl font-bold mb-4">Ready to Practice?</h2>
            <p className="text-gray-600 mb-6">
              Test your stroke order knowledge with an interactive quiz
            </p>

            <div className="space-y-3 max-w-md mx-auto">
              <button
                onClick={() => startQuiz()}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
              >
                Start Random Quiz
              </button>

              <button
                onClick={handleSelectCharacter}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-lg"
              >
                Choose a Character
              </button>
            </div>
          </div>
        )}

        {quizActive && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Write: {character}</h2>
              <p className="text-gray-600">Draw each stroke in the correct order</p>
              <div className="mt-3 text-lg">
                Mistakes: <span className="font-bold text-red-500">{mistakes}</span>
              </div>
            </div>

            <div
              ref={containerRef}
              className="mx-auto mb-6 border-2 border-gray-200 rounded-lg"
              style={{ width: '400px', height: '400px' }}
            />

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleShowHint}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                💡 Show Hint
              </button>

              <button
                onClick={() => {
                  setQuizActive(false);
                  setQuizComplete(false);
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {quizComplete && (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-8xl mb-4">{getScoreEmoji()}</div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-xl text-gray-600 mb-6">{getEncouragementMessage()}</p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{totalStrokes}</div>
                <div className="text-sm text-gray-600">Total Strokes</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{mistakes}</div>
                <div className="text-sm text-gray-600">Mistakes</div>
              </div>
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <button
                onClick={handleNewQuiz}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                🎯 Try Another Character
              </button>

              <button
                onClick={() => startQuiz(character)}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                🔄 Practice Same Character
              </button>

              <Link
                to={`/learn/${character}`}
                className="block w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-center"
              >
                📚 Review Character
              </Link>

              <button
                onClick={() => {
                  setQuizComplete(false);
                  setCharacter('');
                }}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Back to Start
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
