'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Settings,
  Play,
  BookOpen,
  Target,
  Clock,
  Users,
  Award,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Save,
  Eye
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import TestEditor from '@/components/TestEditor';
import TestPreview from '@/components/TestPreview';

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
  timeLimit: number; // in minutes
  totalPoints: number;
  createdAt: string;
  isPublished: boolean;
}

export default function TestGeneratorPage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'edit' | 'preview'>('dashboard');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [tests, setTests] = useState<Test[]>([
    {
      id: '1',
      title: 'Mathematics Quiz - Algebra Basics',
      description: 'Test covering fundamental algebra concepts including equations, inequalities, and functions.',
      subject: 'Mathematics',
      grade: '9-10',
      questions: [],
      timeLimit: 45,
      totalPoints: 50,
      createdAt: '2024-11-15',
      isPublished: true
    },
    {
      id: '2',
      title: 'Physics - Forces and Motion',
      description: 'Comprehensive assessment of Newtonian mechanics and kinematics.',
      subject: 'Physics',
      grade: '10-11',
      questions: [],
      timeLimit: 60,
      totalPoints: 75,
      createdAt: '2024-11-14',
      isPublished: false
    }
  ]);

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English', 'History', 'Geography', 'Computer Science'
  ];

  const grades = [
    '6-7', '7-8', '8-9', '9-10', '10-11', '11-12'
  ];

  const handleCreateTest = () => {
    const newTest: Test = {
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
    };
    setSelectedTest(newTest);
    setCurrentView('create');
  };

  const handleEditTest = (test: Test) => {
    setSelectedTest(test);
    setCurrentView('edit');
  };

  const handleDeleteTest = (testId: string) => {
    setTests(tests.filter(test => test.id !== testId));
  };

  const handleSaveTest = (test: Test) => {
    const existingIndex = tests.findIndex(t => t.id === test.id);
    if (existingIndex >= 0) {
      const updatedTests = [...tests];
      updatedTests[existingIndex] = test;
      setTests(updatedTests);
    } else {
      setTests([...tests, test]);
    }
    setSelectedTest(null);
    setCurrentView('dashboard');
  };

  if (currentView === 'create' || currentView === 'edit') {
    return <TestEditor test={selectedTest} onSave={handleSaveTest} onCancel={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'preview') {
    return <TestPreview test={selectedTest!} onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <FileText className="h-4 w-4 mr-2" />
            Test Generator
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Intelligent
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Assessments
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Design comprehensive tests with multiple question types, automatic grading,
            and detailed analytics to enhance student learning outcomes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCreateTest}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Test
            </button>
            <Link
              href="/test-generator/templates"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Browse Templates
            </Link>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{tests.length}</div>
              <div className="text-gray-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{tests.filter(t => t.isPublished).length}</div>
              <div className="text-gray-600">Published Tests</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1,247</div>
              <div className="text-gray-600">Students Tested</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">94%</div>
              <div className="text-gray-600">Avg. Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tests List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Tests</h2>
            <div className="flex gap-4">
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Test Card */}
            <div
              onClick={handleCreateTest}
              className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-8 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New Test</h3>
                <p className="text-gray-600">Start building a custom assessment</p>
              </div>
            </div>

            {/* Existing Tests */}
            {tests.map((test) => (
              <div key={test.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                        {test.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {test.description}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      test.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {test.isPublished ? 'Published' : 'Draft'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {test.subject}
                    </span>
                    <span className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Grade {test.grade}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {test.timeLimit}m
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {test.questions.length} questions • {test.totalPoints} points
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTest(test)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Test"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCurrentView('preview')}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Preview Test"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTest(test.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Test"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Assessment Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create engaging tests with advanced features designed for modern education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Question Types</h3>
              <p className="text-gray-600">Support for multiple choice, true/false, short answer, and essay questions</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Adaptive Difficulty</h3>
              <p className="text-gray-600">Automatically adjust question difficulty based on student performance</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Grading</h3>
              <p className="text-gray-600">Automatic scoring and detailed performance analytics</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time Management</h3>
              <p className="text-gray-600">Set time limits and monitor progress in real-time</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborative Creation</h3>
              <p className="text-gray-600">Work with other educators to build comprehensive assessments</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Standards Alignment</h3>
              <p className="text-gray-600">Ensure tests align with curriculum standards and learning objectives</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
