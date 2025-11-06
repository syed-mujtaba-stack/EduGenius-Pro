'use client';

import { useState, useEffect } from 'react';
import { Users, BookOpen, Award, TrendingUp, Plus, Eye, Edit, Trash2, BarChart3 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface Class {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  assignmentCount: number;
  createdAt: string;
  description?: string;
  gradeLevel?: string;
  maxStudents?: number;
  classCode?: string;
}

interface Assignment {
  id: string;
  title: string;
  className: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  totalPoints?: number;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    averageGrade: 0
  });

  const handleCreateClass = () => {
    router.push('/teacher/classes/create');
  };

  const handleCreateAssignment = () => {
    router.push('/teacher/assignments/create');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch classes and assignments in parallel
        const [classesResponse, assignmentsResponse] = await Promise.all([
          apiClient.getClasses(),
          apiClient.getAssignments()
        ]);

        const classesData = classesResponse.classes || [];
        const assignmentsData = assignmentsResponse.assignments || [];

        setClasses(classesData);
        setAssignments(assignmentsData);

        // Calculate stats
        const totalClasses = classesData.length;
        const totalStudents = classesData.reduce((sum: number, cls: Class) => sum + (cls.studentCount || 0), 0);
        const totalAssignments = assignmentsData.length;

        // Calculate average grade (placeholder - would need real grade data)
        const averageGrade = 85; // Placeholder

        setStats({
          totalClasses,
          totalStudents,
          totalAssignments,
          averageGrade
        });
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        // Fallback to empty data
        setClasses([]);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">Please log in to access the teacher dashboard.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Log In
          </button>
        </div>
      </div>
    );
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Teacher Dashboard</h1>
          <p className="text-gray-400">Manage your classes, assignments, and track student progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Classes</p>
                <p className="text-3xl font-bold text-white">{stats.totalClasses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-green-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Assignments</p>
                <p className="text-3xl font-bold text-white">{stats.totalAssignments}</p>
              </div>
              <Award className="h-8 w-8 text-purple-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Average Grade</p>
                <p className="text-3xl font-bold text-white">{stats.averageGrade}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-300" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCreateClass}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </button>
            <button
              onClick={handleCreateAssignment}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </button>
            <button
              onClick={() => router.push('/teacher/google-classroom')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Import from Google Classroom
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-lg p-1 mb-6 shadow-lg">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'classes'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Classes
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'assignments'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Classes */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Classes</h3>
              <div className="space-y-3">
                {classes.slice(0, 3).map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                    <div>
                      <p className="text-white font-medium">{classItem.name}</p>
                      <p className="text-gray-400 text-sm">{classItem.studentCount} students • {classItem.assignmentCount} assignments</p>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Assignments */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Assignments</h3>
              <div className="space-y-3">
                {assignments.slice(0, 3).map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                    <div>
                      <p className="text-white font-medium">{assignment.title}</p>
                      <p className="text-gray-400 text-sm">{assignment.className} • Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm text-green-400">{assignment.submissions}/{assignment.totalStudents} submitted</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">My Classes</h3>
              <button
                onClick={handleCreateClass}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Class
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  onClick={() => router.push(`/teacher/classes/${classItem.id}`)}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <BookOpen className="h-8 w-8 text-blue-400" />
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-white font-medium mb-1">{classItem.name}</h4>
                  <p className="text-gray-400 text-sm mb-2">{classItem.subject}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{classItem.studentCount} students</span>
                    <span>{classItem.assignmentCount} assignments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Assignments</h3>
              <button
                onClick={handleCreateAssignment}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </button>
            </div>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{assignment.title}</h4>
                      <p className="text-gray-400 text-sm">{assignment.className}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/teacher/assignments/${assignment.id}`)}
                        className="text-gray-400 hover:text-white"
                        title="View assignment"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    <span className="text-sm text-green-400">{assignment.submissions}/{assignment.totalStudents} submitted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Detailed Analytics</h3>
              <p className="text-gray-400 mb-6">
                Get comprehensive insights into student performance, class engagement, and assignment analytics.
              </p>
              <button
                onClick={() => router.push('/teacher/analytics')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                View Full Analytics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}