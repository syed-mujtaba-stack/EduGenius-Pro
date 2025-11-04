'use client';

import { useState } from 'react';
import { BookOpen, CheckCircle, FileText, Settings, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Chapter {
  id: number;
  subject: string;
  title: string;
  description: string;
  status: 'active' | 'draft';
}

export default function AdminPage() {
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: 1, subject: 'Mathematics', title: 'Algebra Basics', description: 'Introduction to algebraic expressions and equations', status: 'active' },
    { id: 2, subject: 'Physics', title: 'Mechanics', description: 'Fundamental principles of motion and forces', status: 'active' },
    { id: 3, subject: 'Chemistry', title: 'Organic Compounds', description: 'Study of carbon-based compounds', status: 'draft' },
  ]);

  const [newChapter, setNewChapter] = useState({
    subject: '',
    title: '',
    description: '',
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleAddChapter = () => {
    if (!newChapter.subject || !newChapter.title || !newChapter.description) return;

    const chapter: Chapter = {
      id: Date.now(),
      ...newChapter,
      status: 'draft',
    };

    setChapters([...chapters, chapter]);
    setNewChapter({ subject: '', title: '', description: '' });
    setIsAdding(false);
  };

  const toggleStatus = (id: number) => {
    setChapters(chapters.map(chapter =>
      chapter.id === id
        ? { ...chapter, status: chapter.status === 'active' ? 'draft' : 'active' }
        : chapter
    ));
  };

  const deleteChapter = (id: number) => {
    setChapters(chapters.filter(chapter => chapter.id !== id));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage syllabus, chapters, and platform content.</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Chapters</p>
                <p className="text-2xl font-bold text-white">{chapters.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-gray-300" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Chapters</p>
                <p className="text-2xl font-bold text-white">{chapters.filter(c => c.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Draft Chapters</p>
                <p className="text-2xl font-bold text-white">{chapters.filter(c => c.status === 'draft').length}</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Add Chapter Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Manage Chapters</h2>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isAdding ? 'Cancel' : 'Add Chapter'}
            </button>
          </div>

          {isAdding && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newChapter.subject}
                    onChange={(e) => setNewChapter({ ...newChapter, subject: e.target.value })}
                    className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chapter Title</label>
                  <input
                    type="text"
                    value={newChapter.title}
                    onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                    className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Algebra Basics"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newChapter.description}
                  onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the chapter content..."
                />
              </div>
              <button
                onClick={handleAddChapter}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Add Chapter
              </button>
            </div>
          )}

          {/* Chapters List */}
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{chapter.title}</h3>
                    <p className="text-gray-400 text-sm">{chapter.subject}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      chapter.status === 'active'
                        ? 'bg-green-600 text-white'
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {chapter.status}
                    </span>
                    <button
                      onClick={() => toggleStatus(chapter.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {chapter.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => deleteChapter(chapter.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{chapter.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Analytics */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Platform Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-300 font-medium mb-3">User Engagement</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Users (24h)</span>
                  <span className="text-white">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quizzes Generated</span>
                  <span className="text-white">5,432</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Summaries Created</span>
                  <span className="text-white">3,891</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-gray-300 font-medium mb-3">Content Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg. Quiz Score</span>
                  <span className="text-white">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completion Rate</span>
                  <span className="text-white">65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User Retention</span>
                  <span className="text-white">82%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
