'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserPlus, Mail, Trash2, Copy, Check } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

interface Student {
  id: string;
  email: string;
  displayName?: string;
  enrollmentId: string;
}

interface Class {
  id: string;
  name: string;
  subject: string;
  description?: string;
  gradeLevel?: string;
  maxStudents?: number;
  classCode?: string;
  studentCount: number;
  assignmentCount: number;
  createdAt: string;
}

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

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

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getClass(classId);
        setClassData(response.class);
        setStudents(response.students || []);
      } catch (error) {
        console.error('Error fetching class data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClassData();
    }
  }, [classId]);

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim()) return;

    try {
      setEnrollLoading(true);
      await apiClient.enrollStudent(classId, studentEmail.trim());
      setStudentEmail('');

      // Refresh class data
      const response = await apiClient.getClass(classId);
      setClassData(response.class);
      setStudents(response.students || []);
      setShowEnrollForm(false);
    } catch (error) {
      console.error('Error enrolling student:', error);
      alert('Failed to enroll student. Please check the email and try again.');
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to remove this student from the class?')) return;

    try {
      await apiClient.removeStudent(classId, studentId);

      // Refresh class data
      const response = await apiClient.getClass(classId);
      setClassData(response.class);
      setStudents(response.students || []);
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Failed to remove student. Please try again.');
    }
  };

  const handleCopyClassCode = async () => {
    if (classData?.classCode) {
      await navigator.clipboard.writeText(classData.classCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Class Not Found</h2>
          <p className="text-gray-400 mb-4">The class you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{classData.name}</h1>
            <p className="text-gray-400">{classData.subject}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-400">Class Code:</span>
              <button
                onClick={handleCopyClassCode}
                className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white transition-colors"
              >
                <span>{classData.classCode}</span>
                {copiedCode ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">Share this code with students to join</p>
          </div>
        </div>

        {/* Class Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{classData.studentCount}</p>
              <p className="text-gray-400 text-sm">Students</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{classData.assignmentCount}</p>
              <p className="text-gray-400 text-sm">Assignments</p>
            </div>
            <div className="text-center">
              <div className="h-8 w-8 bg-purple-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <p className="text-2xl font-bold text-white">{classData.gradeLevel || 'All'}</p>
              <p className="text-gray-400 text-sm">Grade Level</p>
            </div>
          </div>

          {classData.description && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300">{classData.description}</p>
            </div>
          )}
        </div>

        {/* Students Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Students ({students.length})</h2>
            <button
              onClick={() => setShowEnrollForm(!showEnrollForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Enroll Student
            </button>
          </div>

          {/* Enroll Student Form */}
          {showEnrollForm && (
            <form onSubmit={handleEnrollStudent} className="mb-6 p-4 bg-gray-700 rounded-lg">
              <div className="flex space-x-4">
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="flex-1 bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={enrollLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200"
                >
                  {enrollLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Enroll'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEnrollForm(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Students List */}
          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No students enrolled yet.</p>
              <p className="text-gray-500 text-sm">Use the class code to let students join.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {(student.displayName || student.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{student.displayName || 'Unknown Student'}</p>
                      <p className="text-gray-400 text-sm">{student.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveStudent(student.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Remove student"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
