'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Clock, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  content?: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
}

interface Assignment {
  id: string;
  title: string;
  classId: string;
  className: string;
  description?: string;
  instructions?: string;
  dueDate: string;
  totalPoints?: number;
  createdAt: string;
}

export default function AssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState<string | null>(null);
  const [gradeData, setGradeData] = useState<{ [key: string]: { grade: string; feedback: string } }>({});

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
    const fetchAssignmentData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getAssignment(assignmentId);
        setAssignment(response.assignment);
        setSubmissions(response.submissions || []);

        // Initialize grade data for existing grades
        const initialGradeData: { [key: string]: { grade: string; feedback: string } } = {};
        response.submissions.forEach((submission: Submission) => {
          initialGradeData[submission.id] = {
            grade: submission.grade?.toString() || '',
            feedback: submission.feedback || ''
          };
        });
        setGradeData(initialGradeData);
      } catch (error) {
        console.error('Error fetching assignment data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchAssignmentData();
    }
  }, [assignmentId]);

  const handleGradeSubmission = async (submissionId: string) => {
    const data = gradeData[submissionId];
    if (!data) return;

    try {
      setGradingSubmission(submissionId);
      await apiClient.gradeSubmission(submissionId, {
        grade: data.grade ? parseFloat(data.grade) : undefined,
        feedback: data.feedback
      });

      // Update local state
      setSubmissions(prev => prev.map(sub =>
        sub.id === submissionId
          ? { ...sub, grade: data.grade ? parseFloat(data.grade) : undefined, feedback: data.feedback, gradedAt: new Date().toISOString() }
          : sub
      ));
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Failed to save grade. Please try again.');
    } finally {
      setGradingSubmission(null);
    }
  };

  const updateGradeData = (submissionId: string, field: 'grade' | 'feedback', value: string) => {
    setGradeData(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value
      }
    }));
  };

  const getSubmissionStatus = (submission: Submission, dueDate: string) => {
    const due = new Date(dueDate);
    const submitted = new Date(submission.submittedAt);
    const now = new Date();

    if (submitted > due) {
      return { status: 'late', color: 'text-red-400', icon: AlertCircle };
    } else if (submission.grade !== undefined) {
      return { status: 'graded', color: 'text-green-400', icon: CheckCircle };
    } else {
      return { status: 'submitted', color: 'text-blue-400', icon: CheckCircle };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Assignment Not Found</h2>
          <p className="text-gray-400 mb-4">The assignment you're looking for doesn't exist or you don't have access to it.</p>
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

  const dueDate = new Date(assignment.dueDate);
  const isOverdue = new Date() > dueDate;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{assignment.title}</h1>
            <p className="text-gray-400">{assignment.className}</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center space-x-2 ${isOverdue ? 'text-red-400' : 'text-blue-400'}`}>
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Due: {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString()}
              </span>
            </div>
            {assignment.totalPoints && (
              <p className="text-sm text-gray-400 mt-1">{assignment.totalPoints} points</p>
            )}
          </div>
        </div>

        {/* Assignment Details */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{submissions.length}</p>
              <p className="text-gray-400 text-sm">Submissions</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {submissions.filter(s => s.grade !== undefined).length}
              </p>
              <p className="text-gray-400 text-sm">Graded</p>
            </div>
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {submissions.filter(s => new Date(s.submittedAt) > dueDate).length}
              </p>
              <p className="text-gray-400 text-sm">Late</p>
            </div>
          </div>

          {assignment.description && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300">{assignment.description}</p>
            </div>
          )}

          {assignment.instructions && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Instructions</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">{assignment.instructions}</p>
              </div>
            </div>
          )}
        </div>

        {/* Submissions */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Student Submissions</h2>

          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No submissions yet.</p>
              <p className="text-gray-500 text-sm">Students will submit their work here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const { status, color, icon: StatusIcon } = getSubmissionStatus(submission, assignment.dueDate);
                const currentGradeData = gradeData[submission.id] || { grade: '', feedback: '' };

                return (
                  <div key={submission.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {submission.studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{submission.studentName}</p>
                          <p className="text-gray-400 text-sm">{submission.studentEmail}</p>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1 ${color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm capitalize">{status}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-400">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                      {submission.content && (
                        <div className="mt-2 p-3 bg-gray-600 rounded">
                          <p className="text-gray-300 text-sm">{submission.content}</p>
                        </div>
                      )}
                    </div>

                    {/* Grading Section */}
                    <div className="border-t border-gray-600 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Grade {assignment.totalPoints && `(/${assignment.totalPoints})`}
                          </label>
                          <input
                            type="number"
                            value={currentGradeData.grade}
                            onChange={(e) => updateGradeData(submission.id, 'grade', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter grade"
                            min="0"
                            max={assignment.totalPoints}
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => handleGradeSubmission(submission.id)}
                            disabled={gradingSubmission === submission.id}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200"
                          >
                            {gradingSubmission === submission.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                              <Save className="h-4 w-4 mr-2" />
                            )}
                            {submission.grade !== undefined ? 'Update Grade' : 'Save Grade'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Feedback
                        </label>
                        <textarea
                          value={currentGradeData.feedback}
                          onChange={(e) => updateGradeData(submission.id, 'feedback', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                          placeholder="Provide feedback for the student..."
                        />
                      </div>

                      {submission.gradedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Last graded: {new Date(submission.gradedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
