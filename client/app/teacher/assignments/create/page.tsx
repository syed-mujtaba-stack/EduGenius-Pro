'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calendar, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

interface Class {
  id: string;
  name: string;
  subject: string;
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    description: '',
    dueDate: '',
    totalPoints: '',
    instructions: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Fetch classes when user is authenticated
  useEffect(() => {
    if (!user) return;

    const fetchClasses = async () => {
      try {
        const response = await apiClient.getClasses();
        setClasses(response.classes || []);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [user]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const assignmentData = {
        title: formData.title,
        classId: formData.classId,
        description: formData.description || undefined,
        dueDate: formData.dueDate,
        totalPoints: formData.totalPoints ? parseInt(formData.totalPoints) : undefined,
        instructions: formData.instructions || undefined,
      };

      const response = await apiClient.createAssignment(assignmentData);
      router.push('/teacher');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Create Assignment</h1>
            <p className="text-gray-400">Assign work to your students.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="space-y-6">
            {/* Assignment Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Assignment Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Algebra Quiz 1"
                required
              />
            </div>

            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Class *
              </label>
              <select
                value={formData.classId}
                onChange={(e) => handleInputChange('classId', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:text-gray-500"
                required
                disabled={loadingClasses}
              >
                <option value="">
                  {loadingClasses ? 'Loading classes...' : 'Select a class'}
                </option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} - {classItem.subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Due Date *
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Total Points */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Total Points
              </label>
              <input
                type="number"
                value={formData.totalPoints}
                onChange={(e) => handleInputChange('totalPoints', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 100"
                min="1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                placeholder="Brief description of the assignment..."
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Detailed Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                placeholder="Detailed instructions for students..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.title || !formData.classId || !formData.dueDate}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md flex items-center transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Assignment
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Preview Card */}
        {formData.title && formData.classId && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Assignment Preview</h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium text-lg">{formData.title}</h4>
              <p className="text-gray-400 text-sm mt-1">
                {classes.find(c => c.id === formData.classId)?.name || 'Unknown Class'}
              </p>
              {formData.description && (
                <p className="text-gray-300 text-sm mt-2">{formData.description}</p>
              )}
              <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                <span>Due: {formData.dueDate ? new Date(formData.dueDate).toLocaleString() : 'Not set'}</span>
                {formData.totalPoints && <span>{formData.totalPoints} points</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
