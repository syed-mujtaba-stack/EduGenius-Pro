const { google } = require('googleapis');
const { db } = require('../config/firebase');

class GoogleClassroomService {
  constructor() {
    this.classroom = null;
    this.oauth2Client = null;
  }

  // Initialize OAuth2 client
  initializeAuth(clientId, clientSecret, redirectUri) {
    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    this.classroom = google.classroom({ version: 'v1', auth: this.oauth2Client });
  }

  // Generate authorization URL
  getAuthUrl() {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized');
    }

    const scopes = [
      'https://www.googleapis.com/auth/classroom.courses.readonly',
      'https://www.googleapis.com/auth/classroom.coursework.students',
      'https://www.googleapis.com/auth/classroom.rosters.readonly',
      'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Set credentials from authorization code
  async setCredentials(code) {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized');
    }

    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    return tokens;
  }

  // Set credentials from stored tokens
  setStoredCredentials(tokens) {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized');
    }

    this.oauth2Client.setCredentials(tokens);
  }

  // Get user's Google Classroom courses
  async getCourses() {
    if (!this.classroom) {
      throw new Error('Google Classroom not initialized');
    }

    try {
      const response = await this.classroom.courses.list({
        teacherId: 'me',
        courseStates: ['ACTIVE']
      });

      return response.data.courses || [];
    } catch (error) {
      console.error('Error fetching Google Classroom courses:', error);
      throw new Error('Failed to fetch courses from Google Classroom');
    }
  }

  // Get students in a Google Classroom course
  async getCourseStudents(courseId) {
    if (!this.classroom) {
      throw new Error('Google Classroom not initialized');
    }

    try {
      const response = await this.classroom.courses.students.list({
        courseId: courseId
      });

      return response.data.students || [];
    } catch (error) {
      console.error('Error fetching course students:', error);
      throw new Error('Failed to fetch students from Google Classroom');
    }
  }

  // Get assignments/coursework from a Google Classroom course
  async getCourseWork(courseId) {
    if (!this.classroom) {
      throw new Error('Google Classroom not initialized');
    }

    try {
      const response = await this.classroom.courses.courseWork.list({
        courseId: courseId
      });

      return response.data.courseWork || [];
    } catch (error) {
      console.error('Error fetching course work:', error);
      throw new Error('Failed to fetch assignments from Google Classroom');
    }
  }

  // Get student submissions for an assignment
  async getStudentSubmissions(courseId, courseWorkId) {
    if (!this.classroom) {
      throw new Error('Google Classroom not initialized');
    }

    try {
      const response = await this.classroom.courses.courseWork.studentSubmissions.list({
        courseId: courseId,
        courseWorkId: courseWorkId
      });

      return response.data.studentSubmissions || [];
    } catch (error) {
      console.error('Error fetching student submissions:', error);
      throw new Error('Failed to fetch submissions from Google Classroom');
    }
  }

  // Import Google Classroom course to EduGenius Pro
  async importCourseToEduGenius(googleCourse, teacherId) {
    try {
      // Create class in EduGenius Pro
      const classData = {
        name: googleCourse.name,
        subject: googleCourse.section || 'General',
        description: googleCourse.description || '',
        gradeLevel: googleCourse.gradeLevel || '',
        teacherId: teacherId,
        teacherName: 'Imported from Google Classroom',
        classCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        studentCount: 0,
        assignmentCount: 0,
        googleClassroomId: googleCourse.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      const classRef = await db.collection('classes').add(classData);

      // Get and import students
      const googleStudents = await this.getCourseStudents(googleCourse.id);
      for (const googleStudent of googleStudents) {
        // Find or create user in EduGenius Pro
        const studentEmail = googleStudent.profile.emailAddress;
        const existingUser = await db.collection('users')
          .where('email', '==', studentEmail)
          .get();

        let studentId;
        if (!existingUser.empty) {
          studentId = existingUser.docs[0].id;
        } else {
          // Create new user
          const userData = {
            email: studentEmail,
            displayName: googleStudent.profile.name.fullName,
            photoURL: googleStudent.profile.photoUrl,
            provider: 'google',
            role: 'student',
            createdAt: new Date()
          };
          const userRef = await db.collection('users').add(userData);
          studentId = userRef.id;
        }

        // Enroll student in class
        const enrollmentData = {
          classId: classRef.id,
          studentId: studentId,
          studentEmail: studentEmail,
          enrolledAt: new Date(),
          enrolledBy: teacherId,
          source: 'google_classroom_import'
        };

        await db.collection('enrollments').add(enrollmentData);
      }

      // Update student count
      await classRef.update({
        studentCount: googleStudents.length,
        updatedAt: new Date()
      });

      return { classId: classRef.id, importedStudents: googleStudents.length };
    } catch (error) {
      console.error('Error importing course:', error);
      throw new Error('Failed to import course from Google Classroom');
    }
  }

  // Sync assignments from Google Classroom
  async syncAssignmentsFromGoogle(eduGeniusClassId, googleCourseId, teacherId) {
    try {
      const googleAssignments = await this.getCourseWork(googleCourseId);
      const importedAssignments = [];

      for (const googleAssignment of googleAssignments) {
        // Check if assignment already exists
        const existingAssignment = await db.collection('assignments')
          .where('googleClassroomId', '==', googleAssignment.id)
          .get();

        if (!existingAssignment.empty) continue;

        // Create assignment in EduGenius Pro
        const assignmentData = {
          title: googleAssignment.title,
          classId: eduGeniusClassId,
          description: googleAssignment.description || '',
          dueDate: googleAssignment.dueDate ?
            new Date(googleAssignment.dueDate.year, googleAssignment.dueDate.month - 1, googleAssignment.dueDate.day) :
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
          totalPoints: googleAssignment.maxPoints || null,
          instructions: googleAssignment.description || '',
          teacherId: teacherId,
          teacherName: 'Synced from Google Classroom',
          googleClassroomId: googleAssignment.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        };

        const assignmentRef = await db.collection('assignments').add(assignmentData);
        importedAssignments.push({ id: assignmentRef.id, title: googleAssignment.title });
      }

      // Update assignment count in class
      const classRef = db.collection('classes').doc(eduGeniusClassId);
      const classDoc = await classRef.get();
      if (classDoc.exists) {
        const currentCount = classDoc.data().assignmentCount || 0;
        await classRef.update({
          assignmentCount: currentCount + importedAssignments.length,
          updatedAt: new Date()
        });
      }

      return importedAssignments;
    } catch (error) {
      console.error('Error syncing assignments:', error);
      throw new Error('Failed to sync assignments from Google Classroom');
    }
  }

  // Check if user has valid Google Classroom access
  async validateAccess() {
    try {
      await this.getCourses();
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// Initialize service
const googleClassroomService = new GoogleClassroomService();

// Initialize with environment variables if available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  googleClassroomService.initializeAuth(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/google/callback'
  );
}

module.exports = googleClassroomService;
