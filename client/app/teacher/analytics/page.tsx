'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Award, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

interface ClassAnalytics {
  id: string;
  name: string;
  studentCount: number;
  assignmentCount: number;
  averageGrade: number;
  submissionRate: number;
  onTimeSubmissionRate: number;
}

interface AssignmentAnalytics {
  id: string;
  title: string;
  className: string;
  submissions: number;
  totalStudents: number;
  averageGrade: number;
  dueDate: string;
}

interface OverallStats {
  totalClasses: number;
  totalStudents: number;
  totalAssignments: number;
  averageGrade: number;
  totalSubmissions: number;
  onTimeSubmissions: number;
}

export default function TeacherAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<{
    overall: OverallStats;
    classes: ClassAnalytics[];
    assignments: AssignmentAnalytics[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'month', 'week'

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">Please log in to access teacher analytics.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // In a real implementation, you'd have a dedicated analytics endpoint
        // Fetch classes and assignments in parallel
        const [classesResponse, assignmentsResponse] = await Promise.all([
          apiClient.getClasses(),
          apiClient.getAssignments()
        ]);

        const classes = classesResponse.classes || [];
        const assignments = assignmentsResponse.assignments || [];

        // Calculate overall stats
        const totalClasses = classes.length;
        const totalStudents = classes.reduce((sum: number, cls: ClassAnalytics) => sum + (cls.studentCount || 0), 0);
        const totalAssignments = assignments.length;

        // Mock analytics data - in real app, this would come from backend
        const overall: OverallStats = {
          totalClasses,
          totalStudents,
          totalAssignments,
          averageGrade: 85.2,
          totalSubmissions: assignments.reduce((sum: number, ass: AssignmentAnalytics) => sum + (ass.submissions || 0), 0),
          onTimeSubmissions: Math.floor(assignments.reduce((sum: number, ass: AssignmentAnalytics) => sum + (ass.submissions || 0), 0) * 0.85)
        };

        // Mock class analytics
        const classesAnalytics: ClassAnalytics[] = classes.map((cls: any) => ({
          id: cls.id,
          name: cls.name,
          studentCount: cls.studentCount || 0,
          assignmentCount: cls.assignmentCount || 0,
          averageGrade: Math.floor(Math.random() * 20) + 75, // Mock data
          submissionRate: Math.floor(Math.random() * 30) + 70,
          onTimeSubmissionRate: Math.floor(Math.random() * 25) + 75
        }));

        // Mock assignment analytics
        const assignmentsAnalytics: AssignmentAnalytics[] = assignments.map((ass: any) => ({
          id: ass.id,
          title: ass.title,
          className: ass.className,
          submissions: ass.submissions || 0,
          totalStudents: ass.totalStudents || 0,
          averageGrade: Math.floor(Math.random() * 25) + 70,
          dueDate: ass.dueDate
        }));

        setAnalytics({
          overall,
          classes: classesAnalytics,
          assignments: assignmentsAnalytics
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No Data Available</h2>
          <p className="text-gray-400">Unable to load analytics data.</p>
        </div>
      </div>
    );
  }

  const { overall, classes, assignments } = analytics;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Track student performance and class engagement.</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Average Grade</p>
                <p className="text-3xl font-bold text-white">{overall.averageGrade.toFixed(1)}%</p>
              </div>
              <Award className="h-8 w-8 text-blue-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Submission Rate</p>
                <p className="text-3xl font-bold text-white">
                  {((overall.totalSubmissions / (overall.totalAssignments * overall.totalStudents || 1)) * 100).toFixed(0)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">On-Time Rate</p>
                <p className="text-3xl font-bold text-white">
                  {((overall.onTimeSubmissions / (overall.totalSubmissions || 1)) * 100).toFixed(0)}%
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-300" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Active Students</p>
                <p className="text-3xl font-bold text-white">{overall.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-purple-300" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Class Performance */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Class Performance
            </h2>
            <div className="space-y-4">
              {classes.slice(0, 5).map((classItem) => (
                <div key={classItem.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">{classItem.name}</h3>
                    <span className="text-sm text-gray-400">{classItem.studentCount} students</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Avg Grade</p>
                      <p className="text-white font-medium">{classItem.averageGrade}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Submission Rate</p>
                      <p className="text-white font-medium">{classItem.submissionRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">On-Time</p>
                      <p className="text-white font-medium">{classItem.onTimeSubmissionRate}%</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${classItem.averageGrade}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Assignments */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Assignment Performance
            </h2>
            <div className="space-y-4">
              {assignments.slice(0, 5).map((assignment) => {
                const submissionRate = assignment.totalStudents > 0
                  ? (assignment.submissions / assignment.totalStudents) * 100
                  : 0;
                const isOverdue = new Date(assignment.dueDate) < new Date();

                return (
                  <div key={assignment.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium text-sm">{assignment.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        isOverdue ? 'bg-red-600 text-red-100' : 'bg-green-600 text-green-100'
                      }`}>
                        {isOverdue ? 'Overdue' : 'Active'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-3">{assignment.className}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {assignment.submissions}/{assignment.totalStudents} submitted
                      </span>
                      <span className="text-white font-medium">
                        {assignment.averageGrade.toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-2 bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${submissionRate > 80 ? 'bg-green-500' : submissionRate > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${submissionRate}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alerts and Recommendations */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            Insights & Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-4">
              <h3 className="text-yellow-400 font-medium mb-2">Low Submission Rate</h3>
              <p className="text-yellow-200 text-sm">
                {assignments.filter(a => (a.submissions / (a.totalStudents || 1)) < 0.7).length} assignments have submission rates below 70%.
              </p>
            </div>
            <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
              <h3 className="text-blue-400 font-medium mb-2">High Performers</h3>
              <p className="text-blue-200 text-sm">
                {classes.filter(c => c.averageGrade > 90).length} classes are performing above 90% average.
              </p>
            </div>
            <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-4">
              <h3 className="text-green-400 font-medium mb-2">Improvement Areas</h3>
              <p className="text-green-200 text-sm">
                Focus on assignments with average grades below 75% for targeted support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
