'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Circle,
  Play,
  RotateCcw,
  Award
} from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Test {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  questions: Question[];
  timeLimit: number;
  totalPoints: number;
  createdAt: string;
  isPublished: boolean;
}

interface TestPreviewProps {
  test: Test;
  onBack: () => void;
}

export default function TestPreview({ test, onBack }: TestPreviewProps) {
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(test.timeLimit * 60); // in seconds
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const startTest = () => {
    setIsTakingTest(true);
    setTimeRemaining(test.timeLimit * 60);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTestCompleted(false);
    setScore(0);
  };

  const submitAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitTest = () => {
    let totalScore = 0;
    test.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;

      if (userAnswer !== undefined) {
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
          if (userAnswer === correctAnswer) {
            totalScore += question.points;
          }
        } else if (question.type === 'short-answer') {
          // Simple string comparison for short answers
          if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
            if (userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
              totalScore += question.points;
            }
          }
        }
        // Essay questions are manually graded, so we don't score them here
      }
    });

    setScore(totalScore);
    setTestCompleted(true);
  };

  const resetTest = () => {
    setIsTakingTest(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestCompleted(false);
    setScore(0);
    setTimeRemaining(test.timeLimit * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  if (!isTakingTest) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Tests
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Test Preview</h1>
              <div className="w-24" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Test Overview */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{test.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{test.description}</p>

              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 mb-8">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {test.timeLimit} minutes
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {test.questions.length} questions
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  {test.totalPoints} points
                </div>
              </div>

              <button
                onClick={startTest}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Test
              </button>
            </div>

            {/* Test Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {test.questions.filter(q => q.difficulty === 'easy').length}
                </div>
                <div className="text-sm text-gray-600">Easy Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {test.questions.filter(q => q.difficulty === 'medium').length}
                </div>
                <div className="text-sm text-gray-600">Medium Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {test.questions.filter(q => q.difficulty === 'hard').length}
                </div>
                <div className="text-sm text-gray-600">Hard Questions</div>
              </div>
            </div>

            {/* Question Types */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Circle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    {test.questions.filter(q => q.type === 'multiple-choice').length} Multiple Choice
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Circle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    {test.questions.filter(q => q.type === 'true-false').length} True/False
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Circle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">
                    {test.questions.filter(q => q.type === 'short-answer').length} Short Answer
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Circle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">
                    {test.questions.filter(q => q.type === 'essay').length} Essay
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Questions Preview</h2>
            <div className="space-y-4">
              {test.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
                        Q{index + 1}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        question.type === 'multiple-choice' ? 'bg-blue-100 text-blue-800' :
                        question.type === 'true-false' ? 'bg-green-100 text-green-800' :
                        question.type === 'short-answer' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {question.type.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {question.points} point{question.points !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <p className="text-gray-900 font-medium mb-3">
                    {question.question}
                  </p>

                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-3">
                          <Circle className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <Circle className="h-4 w-4 text-gray-400" />
                        <span>True</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Circle className="h-4 w-4 text-gray-400" />
                        <span>False</span>
                      </div>
                    </div>
                  )}

                  {question.type === 'short-answer' && (
                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <span className="text-gray-500 text-sm">Short answer response...</span>
                    </div>
                  )}

                  {question.type === 'essay' && (
                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <span className="text-gray-500 text-sm">Essay response...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    const percentage = (score / test.totalPoints) * 100;
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Results Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <Award className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h1>
              <p className="text-lg text-gray-600">Here are your results</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Score Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-4">
                {percentage.toFixed(0)}%
              </div>
              <p className="text-xl text-gray-600 mb-2">
                You scored {score} out of {test.totalPoints} points
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span>{test.questions.length} questions</span>
                <span>•</span>
                <span>{test.timeLimit} minutes</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={resetTest}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Test
              </button>
              <button
                onClick={onBack}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Tests
              </button>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Question Review</h2>
            <div className="space-y-4">
              {test.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = question.type === 'multiple-choice' || question.type === 'true-false'
                  ? userAnswer === question.correctAnswer
                  : userAnswer !== undefined; // For other types, just check if answered

                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
                          Q{index + 1}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {question.points} point{question.points !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <p className="text-gray-900 font-medium mb-3">
                      {question.question}
                    </p>

                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-3">
                            {optionIndex === userAnswer ? (
                              <CheckCircle className={`h-4 w-4 ${optionIndex === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`} />
                            ) : optionIndex === question.correctAnswer ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400" />
                            )}
                            <span className={`${
                              optionIndex === question.correctAnswer ? 'text-green-700 font-medium' :
                              optionIndex === userAnswer && optionIndex !== question.correctAnswer ? 'text-red-700' :
                              'text-gray-700'
                            }`}>
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'true-false' && (
                      <div className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                          {userAnswer === 0 ? (
                            <CheckCircle className={`h-4 w-4 ${0 === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`} />
                          ) : 0 === question.correctAnswer ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={`${0 === question.correctAnswer ? 'text-green-700 font-medium' : 0 === userAnswer && 0 !== question.correctAnswer ? 'text-red-700' : 'text-gray-700'}`}>
                            True
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {userAnswer === 1 ? (
                            <CheckCircle className={`h-4 w-4 ${1 === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`} />
                          ) : 1 === question.correctAnswer ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={`${1 === question.correctAnswer ? 'text-green-700 font-medium' : 1 === userAnswer && 1 !== question.correctAnswer ? 'text-red-700' : 'text-gray-700'}`}>
                            False
                          </span>
                        </div>
                      </div>
                    )}

                    {question.type === 'short-answer' && (
                      <div className="space-y-2">
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <div className="text-sm font-medium text-blue-800 mb-1">Your Answer:</div>
                          <div className="text-blue-900">{userAnswer || 'Not answered'}</div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <div className="text-sm font-medium text-green-800 mb-1">Correct Answer:</div>
                          <div className="text-green-900">{question.correctAnswer}</div>
                        </div>
                      </div>
                    )}

                    {question.explanation && (
                      <div className="mt-3 bg-gray-50 border border-gray-200 rounded p-3">
                        <div className="text-sm font-medium text-gray-800 mb-1">Explanation:</div>
                        <div className="text-gray-700">{question.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{test.title}</h1>
              <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="font-medium">{formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={submitTest}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={index}
                      checked={answers[currentQuestion.id] === index}
                      onChange={() => submitAnswer(currentQuestion.id, index)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="flex space-x-6">
                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={0}
                    checked={answers[currentQuestion.id] === 0}
                    onChange={() => submitAnswer(currentQuestion.id, 0)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-900">True</span>
                </label>
                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={1}
                    checked={answers[currentQuestion.id] === 1}
                    onChange={() => submitAnswer(currentQuestion.id, 1)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-900">False</span>
                </label>
              </div>
            )}

            {currentQuestion.type === 'short-answer' && (
              <div>
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => submitAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {currentQuestion.type === 'essay' && (
              <div>
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => submitAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Write your essay response here..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === test.questions.length - 1}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {test.questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`aspect-square rounded-lg border-2 font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white border-blue-600'
                    : answers[question.id] !== undefined
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
