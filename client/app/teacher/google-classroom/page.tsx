'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, Download, RefreshCw, ExternalLink, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';

interface GoogleCourse {
  id: string;
  name: string;
  section?: string;
  description?: string;
  enrollmentCode?: string;
}

export default function GoogleClassroomPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [connected, setConnected] = useState(false);
  const [courses, setCourses] = useState<GoogleCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Check connection status and load courses
  useEffect(() => {
    if (!user) return;

    checkConnectionStatus();
  }, [user]);

  const checkConnectionStatus = async () => {
    try {
      setLoading(true);
      const statusResponse = await apiClient.getGoogleClassroomStatus();
      setConnected(statusResponse.connected);

      if (statusResponse.connected) {
        await loadGoogleCourses();
      }
    } catch (error) {
      console.error('Error checking Google Classroom status:', error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const loadGoogleCourses = async () => {
    try {
      const coursesResponse = await apiClient.getGoogleClassroomCourses();
      setCourses(coursesResponse.courses || []);
    } catch (error) {
      console.error('Error loading Google courses:', error);
    }
  };

  const handleConnect = async () => {
    try {
      const authResponse = await apiClient.getGoogleClassroomAuthUrl();
      window.open(authResponse.authUrl, '_blank', 'width=600,height=700');
    } catch (error) {
      console.error('Error getting auth URL:', error);
      alert('Failed to connect to Google Classroom. Please try again.');
    }
  };

  const handleImportCourse = async (googleCourse: GoogleCourse) => {
    try {
      setImporting(googleCourse.id);
      const importResponse = await apiClient.importGoogleClassroomCourse(googleCourse.id);

      alert(`Successfully imported "${googleCourse.name}" with ${importResponse.importedStudents} students!`);

      // Refresh to show the new class
      router.push('/teacher');
    } catch (error) {
      console.error('Error importing course:', error);
      alert('Failed to import course. Please try again.');
    } finally {
      setImporting(null);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Google Classroom Integration</h1>
            <p className="text-gray-400">Import your Google Classroom courses and assignments to EduGenius Pro</p>
          </div>
          <div className="flex items-center space-x-4">
            {connected ? (
              <div className="flex items-center text-green-400">
                <CheckCircle className="h-5 w-5 mr-2" />
                Connected
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors duration-200"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Connect Google Classroom
              </button>
            )}
            <button
              onClick={checkConnectionStatus}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {!connected ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center shadow-lg">
            <BookOpen className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">Connect Your Google Classroom</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Seamlessly import your Google Classroom courses, students, and assignments to EduGenius Pro.
              Enhance your teaching experience with AI-powered learning tools while keeping all your classroom data synchronized.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700 rounded-lg p-4">
                <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">Import Students</h3>
                <p className="text-gray-400 text-sm">Automatically enroll students from Google Classroom</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <BookOpen className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">Sync Assignments</h3>
                <p className="text-gray-400 text-sm">Import assignments and track submissions</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <CheckCircle className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">Grade Management</h3>
                <p className="text-gray-400 text-sm">Grade assignments with AI assistance</p>
              </div>
            </div>
            <button
              onClick={handleConnect}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium flex items-center mx-auto transition-colors duration-200"
            >
              <ExternalLink className="h-6 w-6 mr-3" />
              Connect Google Classroom
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Available Courses</p>
                    <p className="text-3xl font-bold text-white">{courses.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-300" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm">Connected Account</p>
                    <p className="text-lg font-bold text-white">Google Classroom</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-300" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Import Status</p>
                    <p className="text-lg font-bold text-white">Ready</p>
                  </div>
                  <Download className="h-8 w-8 text-purple-300" />
                </div>
              </div>
            </div>

            {/* Courses List */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Your Google Classroom Courses</h2>
                <button
                  onClick={loadGoogleCourses}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No courses found in Google Classroom</p>
                  <p className="text-gray-500 text-sm">Make sure you have active courses in Google Classroom</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-lg mb-1">{course.name}</h3>
                          {course.section && (
                            <p className="text-gray-400 text-sm mb-2">{course.section}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleImportCourse(course)}
                            disabled={importing === course.id}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm flex items-center transition-colors duration-200"
                          >
                            {importing === course.id ? (
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3 mr-1" />
                            )}
                            Import
                          </button>
                        </div>
                      </div>

                      {course.description && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{course.description}</p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Google Classroom</span>
                        {course.enrollmentCode && (
                          <span>Code: {course.enrollmentCode}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">Connect</h3>
                  <p className="text-gray-400 text-sm">Link your Google Classroom account</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">Import</h3>
                  <p className="text-gray-400 text-sm">Import courses and students automatically</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">Enhance</h3>
                  <p className="text-gray-400 text-sm">Add AI-powered learning features</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">Grade</h3>
                  <p className="text-gray-400 text-sm">Grade assignments with detailed feedback</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
