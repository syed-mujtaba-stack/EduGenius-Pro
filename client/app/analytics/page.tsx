'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Brain, Award, Target, Clock, BarChart3, Users, Calendar, Star } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

interface AnalyticsData {
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    nextSteps: string[];
  };
  recentActivity: any[];
  stats: any;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  useEffect(() => {
    loadAnalytics();
  }, [selectedTimeframe]);

  const loadAnalytics = async () => {
    try {
      const response = await apiClient.getProgressAnalysis();
      setAnalyticsData(response);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing your learning data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Learning Analytics</h1>
          <p className="text-gray-400">AI-powered insights into your learning progress and personalized recommendations.</p>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['week', 'month', 'quarter', 'all'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 capitalize ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {timeframe === 'all' ? 'All Time' : `Last ${timeframe}`}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Study Sessions</p>
                <p className="text-3xl font-bold text-white">24</p>
                <p className="text-blue-200 text-xs mt-1">+12% from last week</p>
              </div>
              <Clock className="h-8 w-8 text-blue-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Average Score</p>
                <p className="text-3xl font-bold text-white">85%</p>
                <p className="text-green-200 text-xs mt-1">+5% improvement</p>
              </div>
              <Target className="h-8 w-8 text-green-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Topics Mastered</p>
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-purple-200 text-xs mt-1">3 this week</p>
              </div>
              <Award className="h-8 w-8 text-purple-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Study Streak</p>
                <p className="text-3xl font-bold text-white">7 days</p>
                <p className="text-orange-200 text-xs mt-1">Keep it up!</p>
              </div>
              <Star className="h-8 w-8 text-orange-300" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Strengths */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                Your Strengths
              </h3>
              {analyticsData?.analysis?.strengths && analyticsData.analysis.strengths.length > 0 ? (
                <div className="space-y-3">
                  {analyticsData.analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">{strength}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Analyzing your learning patterns...</p>
              )}
            </div>

            {/* Areas for Improvement */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-orange-400" />
                Areas for Improvement
              </h3>
              {analyticsData?.analysis?.weaknesses && analyticsData.analysis.weaknesses.length > 0 ? (
                <div className="space-y-3">
                  {analyticsData.analysis.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">{weakness}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No major areas for improvement identified.</p>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-400" />
                AI Recommendations
              </h3>
              {analyticsData?.analysis?.recommendations && analyticsData.analysis.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {analyticsData.analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">{recommendation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Generating personalized recommendations...</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Steps */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                Next Steps
              </h3>
              {analyticsData?.analysis?.nextSteps && analyticsData.analysis.nextSteps.length > 0 ? (
                <div className="space-y-3">
                  {analyticsData.analysis.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Planning your next learning steps...</p>
              )}
            </div>

            {/* Learning Activity */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {analyticsData?.recentActivity && analyticsData.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'summary' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {activity.type === 'summary' ? (
                        <BookOpen className="h-4 w-4 text-white" />
                      ) : (
                        <Brain className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium capitalize">{activity.type}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-yellow-400" />
                Performance Trends
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Weekly Progress</span>
                  <span className="text-green-400 text-sm font-medium">+15%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Study Consistency</span>
                  <span className="text-blue-400 text-sm font-medium">8/7 days</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Topic Mastery</span>
                  <span className="text-purple-400 text-sm font-medium">12/15</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
