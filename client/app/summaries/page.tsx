'use client';

import { useState, useEffect } from 'react';
import { Bot, BookOpen, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';

interface Summary {
  id: string;
  chapter: string;
  content: string;
  language: string;
  aiGenerated?: boolean;
  createdAt: string;
}

export default function SummariesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recentSummaries, setRecentSummaries] = useState<Summary[]>([]);
  const [chapters, setChapters] = useState<string[]>([
    'Mathematics - Algebra Basics',
    'Physics - Mechanics',
    'Chemistry - Organic Compounds',
    'Biology - Cell Structure',
    'History - Ancient Civilizations',
    'English Literature - Poetry',
  ]);

  useEffect(() => {
    loadRecentSummaries();
  }, []);

  const loadRecentSummaries = async () => {
    try {
      const response = await apiClient.getSummaries();
      setRecentSummaries(response.summaries || []);
    } catch (error) {
      console.error('Failed to load summaries:', error);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedChapter || !user) return;

    setIsLoading(true);
    try {
      const response = await apiClient.createSummary({
        chapter: selectedChapter,
        language: selectedLanguage,
        generateAI: true, // Enable AI generation
      });

      setSummary(response.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSummary = async () => {
    if (!selectedChapter || !user) return;

    const content = prompt('Enter your summary content:');
    if (!content) return;

    setIsLoading(true);
    try {
      const response = await apiClient.createSummary({
        chapter: selectedChapter,
        content,
        language: selectedLanguage,
      });

      setSummary(response.summary);
      loadRecentSummaries(); // Refresh the list
    } catch (error) {
      console.error('Failed to create summary:', error);
      alert('Failed to create summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('summaries.title')}</h1>
          <p className="text-gray-400">{t('summaries.subtitle')}</p>
        </div>

        {/* Summary Generator */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">{t('summaries.generateSummary')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('summaries.selectChapter')}</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('common.search')}...</option>
                {chapters.map((chapter) => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('summaries.language')}</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="english"
                    checked={selectedLanguage === 'english'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-white">{t('summaries.english')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="urdu"
                    checked={selectedLanguage === 'urdu'}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-white">{t('summaries.urdu')}</span>
                </label>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleGenerateSummary}
                disabled={!selectedChapter || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('summaries.generateWithAI')}
                  </>
                )}
              </button>
              <button
                onClick={handleManualSummary}
                disabled={!selectedChapter || isLoading}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {t('summaries.createManual')}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Display */}
        {summary && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">{t('summaries.chapterSummary')}</h2>
              <div className="flex items-center space-x-2">
                {summary.aiGenerated && (
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {t('summaries.aiGenerated')}
                  </span>
                )}
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                  {summary.language === 'english' ? t('summaries.english') : t('summaries.urdu')}
                </span>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{summary.content}</p>
            </div>
            <div className="mt-6 flex space-x-4">
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                {t('common.download')}
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                {t('common.share')}
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                {t('summaries.takeQuiz')}
              </button>
            </div>
          </div>
        )}

        {/* Recent Summaries */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">{t('summaries.recentSummaries')}</h2>
          <div className="space-y-3">
            {recentSummaries.length > 0 ? recentSummaries.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center">
                  <div className="bg-purple-600 rounded-full p-2 mr-4">
                    {item.aiGenerated ? <Sparkles className="h-4 w-4 text-white" /> : <BookOpen className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.chapter}</p>
                    <p className="text-gray-400 text-sm">
                      {item.aiGenerated ? t('summaries.aiGenerated') : t('summaries.createManual')} • {item.language} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm">{t('common.view')}</button>
              </div>
            )) : (
              <p className="text-gray-400 text-center py-4">{t('summaries.noSummaries')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
