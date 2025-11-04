'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';

export default function SummariesPage() {
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const chapters = [
    'Mathematics - Algebra Basics',
    'Physics - Mechanics',
    'Chemistry - Organic Compounds',
    'Biology - Cell Structure',
    'History - Ancient Civilizations',
    'English Literature - Poetry',
  ];

  const handleGenerateSummary = async () => {
    if (!selectedChapter) return;

    setIsLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      setSummary(`This is an AI-generated summary for ${selectedChapter} in ${selectedLanguage}. 

Key points covered:
• Fundamental concepts and definitions
• Important theorems and formulas
• Real-world applications
• Practice examples and exercises

The chapter explores the core principles that form the foundation of this subject area. Understanding these concepts is crucial for advancing to more complex topics.`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI-Powered Chapter Summaries</h1>
          <p className="text-gray-400">Get concise, personalized summaries in English or Urdu to accelerate your learning.</p>
        </div>

        {/* Summary Generator */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Generate Summary</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="english"
                    checked={selectedLanguage === 'english'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-white">English</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="urdu"
                    checked={selectedLanguage === 'urdu'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-white">Urdu</span>
                </label>
              </div>
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={!selectedChapter || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Generate Summary
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Display */}
        {summary && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Chapter Summary</h2>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                {selectedLanguage === 'english' ? 'English' : 'Urdu'}
              </span>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{summary}</p>
            </div>
            <div className="mt-6 flex space-x-4">
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                📥 Download PDF
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                🔊 Listen Audio
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                📝 Take Quiz
              </button>
            </div>
          </div>
        )}

        {/* Recent Summaries */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Summaries</h2>
          <div className="space-y-3">
            {chapters.slice(0, 3).map((chapter, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center">
                  <div className="bg-purple-600 rounded-full p-2 mr-4">
                    <span className="text-white text-sm">📖</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{chapter}</p>
                    <p className="text-gray-400 text-sm">Generated 2 days ago • English</p>
                  </div>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
