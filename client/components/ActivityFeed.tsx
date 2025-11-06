'use client';

import { useRealtime } from '@/lib/realtime-context';
import { User, BookOpen, Award, TrendingUp, MessageSquare, Clock } from 'lucide-react';

interface ActivityFeedProps {
  className?: string;
  maxItems?: number;
}

export default function ActivityFeed({ className = '', maxItems = 10 }: ActivityFeedProps) {
  const { activities } = useRealtime();

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment_submitted':
        return <BookOpen className="h-4 w-4 text-blue-400" />;
      case 'grade_posted':
        return <Award className="h-4 w-4 text-green-400" />;
      case 'quiz_completed':
        return <TrendingUp className="h-4 w-4 text-purple-400" />;
      case 'tutor_interaction':
        return <MessageSquare className="h-4 w-4 text-orange-400" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActivityMessage = (activity: any) => {
    switch (activity.type) {
      case 'assignment_submitted':
        return `Submitted assignment: ${activity.data?.title || 'Unknown'}`;
      case 'grade_posted':
        return `Received grade: ${activity.data?.grade || 'N/A'} on ${activity.data?.assignmentTitle || 'assignment'}`;
      case 'quiz_completed':
        return `Completed quiz with score: ${activity.data?.score || 'N/A'}%`;
      case 'tutor_interaction':
        return 'Interacted with AI Tutor';
      case 'new_assignment':
        return `New assignment posted: ${activity.data?.title || 'Unknown'}`;
      default:
        return 'Activity performed';
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Activity</h3>
        <div className="flex items-center text-green-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          Live
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No recent activity</p>
            <p className="text-gray-500 text-xs">Activities will appear here in real-time</p>
          </div>
        ) : (
          displayedActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 leading-relaxed">
                  {getActivityMessage(activity)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {displayedActivities.length >= maxItems && (
        <div className="text-center mt-4">
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
}
