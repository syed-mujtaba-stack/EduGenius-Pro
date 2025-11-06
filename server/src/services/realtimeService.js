const socketIo = require('socket.io');
const { db } = require('../config/firebase');

class RealtimeService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
  }

  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupSocketHandlers();
    console.log('✅ Real-time service initialized');
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔗 User connected: ${socket.id}`);

      // Authenticate user
      socket.on('authenticate', (userId) => {
        this.connectedUsers.set(userId, socket.id);
        socket.userId = userId;
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} authenticated`);

        // Send welcome notification
        this.sendToUser(userId, 'notification', {
          type: 'welcome',
          title: 'Connected',
          message: 'Real-time updates are now active!',
          timestamp: new Date()
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          console.log(`❌ User ${socket.userId} disconnected`);
        }
      });

      // Handle user activity
      socket.on('user_activity', (data) => {
        this.handleUserActivity(socket.userId, data);
      });
    });
  }

  // Send data to specific user
  sendToUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Send data to all users in a room
  sendToRoom(room, event, data) {
    this.io.to(room).emit(event, data);
  }

  // Broadcast to all connected users
  broadcast(event, data) {
    this.io.emit(event, data);
  }

  // Handle user activity and trigger real-time updates
  async handleUserActivity(userId, activity) {
    try {
      // Save activity to database
      await db.collection('activities').add({
        userId,
        type: activity.type,
        data: activity.data,
        timestamp: new Date()
      });

      // Broadcast activity to relevant users (classmates, teachers, etc.)
      if (activity.type === 'assignment_submitted') {
        // Notify teacher
        const assignment = activity.data;
        this.notifyTeacherOfSubmission(assignment.teacherId, assignment);
      } else if (activity.type === 'grade_posted') {
        // Notify student
        const grade = activity.data;
        this.notifyStudentOfGrade(grade.studentId, grade);
      }

      // Send activity update to user's dashboard
      this.sendToUser(userId, 'activity_update', {
        type: 'new_activity',
        activity: activity
      });

    } catch (error) {
      console.error('Error handling user activity:', error);
    }
  }

  // Notify teacher when student submits assignment
  async notifyTeacherOfSubmission(teacherId, submission) {
    const notification = {
      type: 'assignment_submitted',
      title: 'New Assignment Submission',
      message: `A student submitted ${submission.title}`,
      data: submission,
      timestamp: new Date()
    };

    this.sendToUser(teacherId, 'notification', notification);
  }

  // Notify student when grade is posted
  async notifyStudentOfGrade(studentId, grade) {
    const notification = {
      type: 'grade_posted',
      title: 'Grade Posted',
      message: `Your grade for ${grade.assignmentTitle} is now available`,
      data: grade,
      timestamp: new Date()
    };

    this.sendToUser(studentId, 'notification', notification);
  }

  // Notify class about new assignment
  async notifyClassOfNewAssignment(classId, assignment) {
    try {
      // Get all students in the class
      const enrollments = await db.collection('enrollments')
        .where('classId', '==', classId)
        .get();

      const studentIds = enrollments.docs.map(doc => doc.data().studentId);

      const notification = {
        type: 'new_assignment',
        title: 'New Assignment Posted',
        message: `${assignment.title} is now available`,
        data: assignment,
        timestamp: new Date()
      };

      // Send to all students in class
      studentIds.forEach(studentId => {
        this.sendToUser(studentId, 'notification', notification);
      });

    } catch (error) {
      console.error('Error notifying class of new assignment:', error);
    }
  }

  // Send real-time progress update
  async sendProgressUpdate(userId, progressData) {
    this.sendToUser(userId, 'progress_update', {
      type: 'progress_changed',
      data: progressData,
      timestamp: new Date()
    });
  }

  // Send live leaderboard update
  async sendLeaderboardUpdate(classId, leaderboard) {
    this.sendToRoom(`class_${classId}`, 'leaderboard_update', {
      type: 'leaderboard_changed',
      data: leaderboard,
      timestamp: new Date()
    });
  }

  // Get real-time stats
  getRealtimeStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      activeRooms: this.io ? this.io.sockets.adapter.rooms.size : 0
    };
  }
}

module.exports = new RealtimeService();
