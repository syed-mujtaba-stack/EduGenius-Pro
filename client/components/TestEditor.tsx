'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Save,
  X,
  Settings,
  FileText,
  Edit,
  Trash2,
  CheckCircle,
  Circle
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

interface TestEditorProps {
  test: Test | null;
  onSave: (test: Test) => void;
  onCancel: () => void;
}

export default function TestEditor({ test, onSave, onCancel }: TestEditorProps) {
  const [currentTest, setCurrentTest] = useState<Test>(
    test || {
      id: Date.now().toString(),
      title: '',
      description: '',
      subject: '',
      grade: '',
      questions: [],
      timeLimit: 30,
      totalPoints: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: false
    }
  );

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English', 'History', 'Geography', 'Computer Science'
  ];

  const grades = [
    '6-7', '7-8', '8-9', '9-10', '10-11', '11-12'
  ];

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: '',
      options: type === 'multiple-choice' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'true-false' ? 0 : '',
      points: 1,
      difficulty: 'medium'
    };
    setEditingQuestion(newQuestion);
    setShowQuestionForm(true);
  };

  const saveQuestion = (question: Question) => {
    const updatedQuestions = [...currentTest.questions];
    const existingIndex = updatedQuestions.findIndex(q => q.id === question.id);

    if (existingIndex >= 0) {
      updatedQuestions[existingIndex] = question;
    } else {
      updatedQuestions.push(question);
    }

    const totalPoints = updatedQuestions.reduce((sum, q) => sum + q.points, 0);

    setCurrentTest({
      ...currentTest,
      questions: updatedQuestions,
      totalPoints
    });

    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  const deleteQuestion = (questionId: string) => {
    const updatedQuestions = currentTest.questions.filter(q => q.id !== questionId);
    const totalPoints = updatedQuestions.reduce((sum, q) => sum + q.points, 0);

    setCurrentTest({
      ...currentTest,
      questions: updatedQuestions,
      totalPoints
    });
  };

  const handleSave = () => {
    onSave(currentTest);
  };

  const updateTestField = (field: keyof Test, value: any) => {
    setCurrentTest({
      ...currentTest,
      [field]: value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Tests
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {test ? 'Edit Test' : 'Create New Test'}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentTest.title || 'Untitled Test'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Title
                  </label>
                  <input
                    type="text"
                    value={currentTest.title}
                    onChange={(e) => updateTestField('title', e.target.value)}
                    placeholder="Enter test title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={currentTest.description}
                    onChange={(e) => updateTestField('description', e.target.value)}
                    placeholder="Describe what this test covers"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={currentTest.subject}
                      onChange={(e) => updateTestField('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade Level
                    </label>
                    <select
                      value={currentTest.grade}
                      onChange={(e) => updateTestField('grade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Grade</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={currentTest.timeLimit}
                    onChange={(e) => updateTestField('timeLimit', parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={currentTest.isPublished}
                    onChange={(e) => updateTestField('isPublished', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 text-sm text-gray-700">
                    Publish Test
                  </label>
                </div>
              </div>

              {/* Test Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Test Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{currentTest.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Points:</span>
                    <span className="font-medium">{currentTest.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Points:</span>
                    <span className="font-medium">
                      {currentTest.questions.length > 0
                        ? (currentTest.totalPoints / currentTest.questions.length).toFixed(1)
                        : '0.0'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => addQuestion('multiple-choice')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    + Multiple Choice
                  </button>
                  <button
                    onClick={() => addQuestion('true-false')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    + True/False
                  </button>
                  <button
                    onClick={() => addQuestion('short-answer')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    + Short Answer
                  </button>
                </div>
              </div>

              {currentTest.questions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Yet</h3>
                  <p className="text-gray-600 mb-6">Start building your test by adding questions</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => addQuestion('multiple-choice')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Multiple Choice
                    </button>
                    <button
                      onClick={() => addQuestion('true-false')}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add True/False
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentTest.questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
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
                          <p className="text-gray-900 font-medium mb-1">
                            {question.question || 'Untitled Question'}
                          </p>
                          <div className="text-sm text-gray-600">
                            {question.points} point{question.points !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingQuestion(question);
                              setShowQuestionForm(true);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Question"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && editingQuestion && (
        <QuestionForm
          question={editingQuestion}
          onSave={saveQuestion}
          onCancel={() => {
            setEditingQuestion(null);
            setShowQuestionForm(false);
          }}
        />
      )}
    </div>
  );
}

// Question Form Component
interface QuestionFormProps {
  question: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

function QuestionForm({ question, onSave, onCancel }: QuestionFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(question);

  const updateQuestion = (field: keyof Question, value: any) => {
    setCurrentQuestion({
      ...currentQuestion,
      [field]: value
    });
  };

  const updateOption = (index: number, value: string) => {
    if (currentQuestion.options) {
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      updateQuestion('options', newOptions);
    }
  };

  const handleSave = () => {
    onSave(currentQuestion);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {question.id ? 'Edit Question' : 'Add Question'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <textarea
                value={currentQuestion.question}
                onChange={(e) => updateQuestion('question', e.target.value)}
                placeholder="Enter your question here..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options
                </label>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="correct-answer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => updateQuestion('correctAnswer', index)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="true-false"
                      checked={currentQuestion.correctAnswer === 0}
                      onChange={() => updateQuestion('correctAnswer', 0)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">True</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="true-false"
                      checked={currentQuestion.correctAnswer === 1}
                      onChange={() => updateQuestion('correctAnswer', 1)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">False</span>
                  </label>
                </div>
              </div>
            )}

            {currentQuestion.type === 'short-answer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Answer
                </label>
                <input
                  type="text"
                  value={currentQuestion.correctAnswer as string}
                  onChange={(e) => updateQuestion('correctAnswer', e.target.value)}
                  placeholder="Enter the expected answer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => updateQuestion('points', parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={currentQuestion.difficulty}
                  onChange={(e) => updateQuestion('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation (Optional)
              </label>
              <textarea
                value={currentQuestion.explanation || ''}
                onChange={(e) => updateQuestion('explanation', e.target.value)}
                placeholder="Provide an explanation for the correct answer"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
