'use client';

import { useState } from 'react';
import { BookOpen, Brain, BarChart3, Clock, FileText, Target, Flame, Trophy } from 'lucide-react';

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState('week');

  const progressData = {
    week: {
      chapters: 3,
      quizzes: 5,
      averageScore: 82,
      studyTime: 12,
      weakTopics: ['Trigonometry', 'Chemical Reactions']
    },
    month: {
      chapters: 12,
      quizzes: 18,
      averageScore: 85,
      studyTime: 45,
      weakTopics: ['Organic Chemistry', 'Mechanics']
    },
    year: {
      chapters: 48,
      quizzes: 72,
      averageScore: 88,
      studyTime: 180,
      weakTopics: ['Advanced Calculus', 'Quantum Physics']
    }
  };

  const currentData = progressData[timeRange as keyof typeof progressData];

  const chartData = [
    { subject: 'Math', score: 85, color: 'bg-blue-500' },
    { subject: 'Physics', score: 78, color: 'bg-green-500' },
    { subject: 'Chemistry', score: 92, color: 'bg-purple-500' },
    { subject: 'Biology', score: 88, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Progress Analytics</h1>
          <p className="text-gray-400">Track your learning journey with detailed analytics and personalized recommendations.</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 capitalize ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Chapters Completed</p>
                <p className="text-2xl font-bold text-white">{currentData.chapters}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Quizzes Taken</p>
                <p className="text-2xl font-bold text-white">{currentData.quizzes}</p>
              </div>
              <Brain className="h-8 w-8 text-green-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Average Score</p>
                <p className="text-2xl font-bold text-white">{currentData.averageScore}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Study Hours</p>
                <p className="text-2xl font-bold text-white">{currentData.studyTime}h</p>
              </div>
              <Clock className="h-8 w-8 text-orange-300" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subject Performance Chart */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Subject Performance</h2>
            <div className="space-y-4">
              {chartData.map((item) => (
                <div key={item.subject} className="flex items-center">
                  <div className="w-20 text-sm text-gray-300">{item.subject}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-4 mx-4">
                    <div
                      className={`${item.color} h-4 rounded-full transition-all duration-500`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right text-sm text-white font-medium">{item.score}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">AI Recommendations</h2>
            <div className="space-y-4">
              <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                <h3 className="text-yellow-200 font-medium mb-2">Focus Areas</h3>
                <p className="text-yellow-100 text-sm">
                  Based on your recent performance, consider reviewing: {currentData.weakTopics.join(', ')}
                </p>
              </div>
              <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                <h3 className="text-blue-200 font-medium mb-2">Next Steps</h3>
                <p className="text-blue-100 text-sm">
                  Try taking quizzes in your weak subjects and generating summaries for better understanding.
                </p>
              </div>
              <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                <h3 className="text-green-200 font-medium mb-2">Study Streak</h3>
                <p className="text-green-100 text-sm">
                  Keep up your daily study routine! You're on a 5-day streak. Consistency leads to better results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-100" />
              <h3 className="text-white font-medium">First Quiz Perfect</h3>
              <p className="text-yellow-100 text-sm">Scored 100% on Physics Quiz</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-100" />
              <h3 className="text-white font-medium">Chapter Master</h3>
              <p className="text-blue-100 text-sm">Completed 10 chapters this month</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-center">
              <Flame className="h-8 w-8 mx-auto mb-2 text-purple-100" />
              <h3 className="text-white font-medium">Study Streak</h3>
              <p className="text-purple-100 text-sm">5 days in a row</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
