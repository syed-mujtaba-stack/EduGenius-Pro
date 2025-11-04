'use client';

import { useState } from 'react';
import { Brain, CheckCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function QuizzesPage() {
  const [selectedChapter, setSelectedChapter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<Question[] | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const chapters = [
    'Mathematics - Algebra Basics',
    'Physics - Mechanics',
    'Chemistry - Organic Compounds',
    'Biology - Cell Structure',
  ];

  const handleGenerateQuiz = async () => {
    if (!selectedChapter) return;

    setIsLoading(true);
    // Simulate AI quiz generation
    setTimeout(() => {
      const mockQuiz: Question[] = [
        {
          id: 1,
          question: "What is the fundamental principle of mechanics?",
          options: ["Newton's First Law", "Einstein's Theory", "Quantum Mechanics", "Thermodynamics"],
          correctAnswer: 0
        },
        {
          id: 2,
          question: "Which force acts opposite to motion?",
          options: ["Gravity", "Friction", "Magnetism", "Electricity"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "What is the unit of force?",
          options: ["Joule", "Watt", "Newton", "Pascal"],
          correctAnswer: 2
        }
      ];
      setQuiz(mockQuiz);
      setAnswers(new Array(mockQuiz.length).fill(-1));
      setCurrentQuestion(0);
      setShowResults(false);
      setIsLoading(false);
    }, 2000);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    return answers.reduce((score, answer, index) => {
      return score + (answer === quiz[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI-Generated Quizzes</h1>
          <p className="text-gray-400">Test your knowledge with personalized quizzes featuring MCQs and short questions.</p>
        </div>

        {/* Quiz Generator */}
        {!quiz && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Generate Quiz</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Chapter</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a chapter...</option>
                  {chapters.map((chapter) => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleGenerateQuiz}
                disabled={!selectedChapter || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Quiz Display */}
        {quiz && !showResults && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Quiz: {selectedChapter}</h2>
                <span className="text-gray-400">Question {currentQuestion + 1} of {quiz.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-4">{quiz[currentQuestion].question}</h3>
              <div className="space-y-3">
                {quiz[currentQuestion].options.map((option, index) => (
                  <label key={index} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={index}
                      checked={answers[currentQuestion] === index}
                      onChange={() => handleAnswerSelect(currentQuestion, index)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-300 hover:text-white transition-colors">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Previous
              </button>
              {currentQuestion < quiz.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  disabled={answers[currentQuestion] === -1}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={answers.some(answer => answer === -1)}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && quiz && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Quiz Results</h2>
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">
                {calculateScore() >= quiz.length * 0.7 ? '🎉' : calculateScore() >= quiz.length * 0.5 ? <CheckCircle className="inline h-16 w-16 text-green-400" /> : '💪'}
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {calculateScore()}/{quiz.length} ({Math.round((calculateScore() / quiz.length) * 100)}%)
              </p>
              <p className="text-gray-400">
                {calculateScore() >= quiz.length * 0.7 ? 'Excellent work!' :
                 calculateScore() >= quiz.length * 0.5 ? 'Good job! Keep practicing.' :
                 'Keep studying and try again!'}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {quiz.map((question, index) => (
                <div key={question.id} className="border border-gray-700 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">{question.question}</p>
                  <p className="text-sm text-gray-400 mb-1">Your answer: {answers[index] !== -1 ? question.options[answers[index]] : 'Not answered'}</p>
                  <p className="text-sm text-green-400">Correct answer: {question.options[question.correctAnswer]}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setQuiz(null);
                  setSelectedChapter('');
                  setShowResults(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Take Another Quiz
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                📊 View Analytics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
