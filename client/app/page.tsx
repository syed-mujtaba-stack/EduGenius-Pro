'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CheckCircle, BarChart3, Flame, Brain } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome back, {user.displayName || 'Student'}!
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Continue your personalized learning journey with EduGenius Pro.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl md:rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 md:active:scale-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-blue-200 text-sm mb-1">Chapters Completed</p>
                <p className="text-2xl md:text-3xl font-bold text-white">12</p>
              </div>
              <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-blue-300 ml-4" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl md:rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 md:active:scale-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-green-200 text-sm mb-1">Quizzes Passed</p>
                <p className="text-2xl md:text-3xl font-bold text-white">8</p>
              </div>
              <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-green-300 ml-4" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl md:rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 md:active:scale-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-purple-200 text-sm mb-1">Average Score</p>
                <p className="text-2xl md:text-3xl font-bold text-white">85%</p>
              </div>
              <BarChart3 className="h-8 w-8 md:h-10 md:w-10 text-purple-300 ml-4" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl md:rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 md:active:scale-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-orange-200 text-sm mb-1">Study Streak</p>
                <p className="text-2xl md:text-3xl font-bold text-white">5 days</p>
              </div>
              <Flame className="h-8 w-8 md:h-10 md:w-10 text-orange-300 ml-4" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl md:rounded-lg p-4 md:p-6 mb-6 md:mb-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 md:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <Link href="/summaries" className="bg-gray-700 hover:bg-gray-600 rounded-xl md:rounded-lg p-4 md:p-6 transition-all duration-200 group active:scale-95 md:active:scale-100 min-h-[80px] md:min-h-[120px] flex flex-col items-center justify-center">
              <BookOpen className="h-8 w-8 md:h-12 md:w-12 mb-2 md:mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-white font-medium text-center group-hover:text-blue-400 transition-colors text-sm md:text-base">Get Summary</h3>
              <p className="text-gray-400 text-xs md:text-sm text-center mt-1">AI-powered chapter summaries</p>
            </Link>
            <Link href="/quizzes" className="bg-gray-700 hover:bg-gray-600 rounded-xl md:rounded-lg p-4 md:p-6 transition-all duration-200 group active:scale-95 md:active:scale-100 min-h-[80px] md:min-h-[120px] flex flex-col items-center justify-center">
              <Brain className="h-8 w-8 md:h-12 md:w-12 mb-2 md:mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-white font-medium text-center group-hover:text-blue-400 transition-colors text-sm md:text-base">Take Quiz</h3>
              <p className="text-gray-400 text-xs md:text-sm text-center mt-1">Test your knowledge</p>
            </Link>
            <Link href="/progress" className="bg-gray-700 hover:bg-gray-600 rounded-xl md:rounded-lg p-4 md:p-6 transition-all duration-200 group active:scale-95 md:active:scale-100 min-h-[80px] md:min-h-[120px] flex flex-col items-center justify-center">
              <BarChart3 className="h-8 w-8 md:h-12 md:w-12 mb-2 md:mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <h3 className="text-white font-medium text-center group-hover:text-blue-400 transition-colors text-sm md:text-base">View Progress</h3>
              <p className="text-gray-400 text-xs md:text-sm text-center mt-1">Track your improvement</p>
            </Link>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-gray-800 rounded-xl md:rounded-lg p-4 md:p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4 md:mb-6">Recent Activities</h2>
          <div className="space-y-3 md:space-y-4">
            <div className="bg-gray-700 rounded-xl md:rounded-lg p-4 transition-all duration-200 active:scale-98 md:active:scale-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="bg-blue-600 rounded-xl md:rounded-full p-3 mr-4">
                    <BookOpen className="h-5 w-5 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm md:text-base">Completed Chapter 3: Physics Fundamentals</p>
                    <p className="text-gray-400 text-xs md:text-sm">2 hours ago</p>
                  </div>
                </div>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium">Score: 92%</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-xl md:rounded-lg p-4 transition-all duration-200 active:scale-98 md:active:scale-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="bg-green-600 rounded-xl md:rounded-full p-3 mr-4">
                    <CheckCircle className="h-5 w-5 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm md:text-base">Passed Chemistry Quiz</p>
                    <p className="text-gray-400 text-xs md:text-sm">1 day ago</p>
                  </div>
                </div>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium">Score: 88%</span>
              </div>
            </div>
            <div className="bg-gray-700 rounded-xl md:rounded-lg p-4 transition-all duration-200 active:scale-98 md:active:scale-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="bg-purple-600 rounded-xl md:rounded-full p-3 mr-4">
                    <BookOpen className="h-5 w-5 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm md:text-base">Generated Summary for Biology Chapter 5</p>
                    <p className="text-gray-400 text-xs md:text-sm">2 days ago</p>
                  </div>
                </div>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium">English</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
