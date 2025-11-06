'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';

interface Notification {
  id: string;
  type: 'assignment_submitted' | 'grade_posted' | 'new_assignment' | 'welcome' | 'announcement';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read?: boolean;
}

interface Activity {
  id: string;
  type: string;
  userId: string;
  data: any;
  timestamp: Date;
}

interface RealtimeContextType {
  socket: Socket | null;
  notifications: Notification[];
  activities: Activity[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (user && !socket) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
        auth: {
          token: user.uid // Pass user ID for authentication
        }
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('🔗 Connected to real-time server');
        setIsConnected(true);

        // Authenticate with user ID
        newSocket.emit('authenticate', user.uid);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from real-time server');
        setIsConnected(false);
      });

      // Notification events
      newSocket.on('notification', (notification: any) => {
        const newNotification: Notification = {
          id: Date.now().toString() + Math.random(),
          ...notification,
          timestamp: new Date(notification.timestamp),
          read: false
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico'
          });
        }
      });

      // Activity events
      newSocket.on('activity_update', (activity: any) => {
        const newActivity: Activity = {
          id: Date.now().toString() + Math.random(),
          ...activity.activity,
          timestamp: new Date()
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Keep last 20 activities
      });

      // Progress updates
      newSocket.on('progress_update', (update: any) => {
        // Handle progress updates (could trigger dashboard refresh)
        console.log('📊 Progress update:', update);
      });

      // Leaderboard updates
      newSocket.on('leaderboard_update', (update: any) => {
        // Handle leaderboard updates
        console.log('🏆 Leaderboard update:', update);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, socket]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: RealtimeContextType = {
    socket,
    notifications,
    activities,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    isConnected
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};
