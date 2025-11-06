const express = require('express');
const { db, auth } = require('../config/firebase');
const aiService = require('../services/aiService');
const googleClassroomService = require('../services/googleClassroomService');
const aiTutorService = require('../services/aiTutorService');
const realtimeService = require('../services/realtimeService');
let multer;
try {
  multer = require('multer');
} catch (error) {
  console.warn('Multer package not found. File upload features will be disabled.');
  multer = null;
}
const path = require('path');
const router = express.Router();

// Middleware to verify Firebase Auth token
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Configure multer for file uploads
let upload;
if (multer) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    }
  });
} else {
  console.warn('File upload routes will not be available without multer package');
}

// ========== FILE UPLOAD ROUTES ==========

// Upload a file
if (upload) {
  router.post('/upload', verifyAuth, upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const fileData = {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        userId: req.user.uid
      };

      const fileRef = await db.collection('files').add(fileData);

      res.status(201).json({
        message: 'File uploaded successfully',
        file: { id: fileRef.id, ...fileData }
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });
} else {
  router.post('/upload', verifyAuth, (req, res) => {
    res.status(503).json({ error: 'File upload not available. Please install multer package.' });
  });
}

// Get all files for a user
router.get('/files', verifyAuth, async (req, res) => {
  try {
    const filesRef = db.collection('files').where('userId', '==', req.user.uid);
    const snapshot = await filesRef.get();

    const files = [];
    snapshot.forEach(doc => {
      files.push({ id: doc.id, ...doc.data() });
    });

    res.json({ files });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Get a specific file
router.get('/files/:id', verifyAuth, async (req, res) => {
  try {
    const fileRef = db.collection('files').doc(req.params.id);
    const fileDoc = await fileRef.get();

    if (!fileDoc.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileData = fileDoc.data();
    if (fileData.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: File belongs to another user' });
    }

    res.json({ file: { id: fileDoc.id, ...fileData } });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to get file' });
  }
});

// Delete a file
router.delete('/files/:id', verifyAuth, async (req, res) => {
  try {
    const fileRef = db.collection('files').doc(req.params.id);
    const fileDoc = await fileRef.get();

    if (!fileDoc.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileData = fileDoc.data();
    if (fileData.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: File belongs to another user' });
    }

    await fileRef.delete();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// ========== SUMMARIES ROUTES ==========

// Get all summaries for a user
router.get('/summaries', verifyAuth, async (req, res) => {
  try {
    const summariesRef = db.collection('users').doc(req.user.uid).collection('summaries');
    const snapshot = await summariesRef.orderBy('createdAt', 'desc').get();

    const summaries = [];
    snapshot.forEach(doc => {
      summaries.push({ id: doc.id, ...doc.data() });
    });

    res.json({ summaries });
  } catch (error) {
    console.error('Get summaries error:', error);
    res.status(500).json({ error: 'Failed to get summaries' });
  }
});

// Create a new summary
router.post('/summaries', verifyAuth, async (req, res) => {
  try {
    const { chapter, content, language, generateAI } = req.body;

    if (!chapter) {
      return res.status(400).json({ error: 'Chapter title is required' });
    }

    let summaryContent = content;
    let aiGenerated = false;

    // Generate AI summary if requested and no content provided
    if (generateAI && !content) {
      try {
        // Get chapter content from database if available
        let chapterContent = chapter; // Fallback to chapter title

        if (req.body.chapterId) {
          const chapterDoc = await db.collection('chapters').doc(req.body.chapterId).get();
          if (chapterDoc.exists) {
            chapterContent = chapterDoc.data().content;
          }
        }

        summaryContent = await aiService.generateSummary(chapterContent, language || 'english');
        aiGenerated = true;
      } catch (aiError) {
        console.error('AI summary generation failed:', aiError);
        return res.status(500).json({ error: 'Failed to generate AI summary. Please provide content manually.' });
      }
    }

    if (!summaryContent) {
      return res.status(400).json({ error: 'Content is required (or enable AI generation)' });
    }

    const summaryData = {
      chapter,
      content: summaryContent,
      language: language || 'english',
      aiGenerated,
      createdAt: new Date(),
      userId: req.user.uid
    };

    const summaryRef = await db.collection('users').doc(req.user.uid).collection('summaries').add(summaryData);

    res.status(201).json({
      message: aiGenerated ? 'AI-generated summary created successfully' : 'Summary created successfully',
      summary: { id: summaryRef.id, ...summaryData }
    });
  } catch (error) {
    console.error('Create summary error:', error);
    res.status(500).json({ error: 'Failed to create summary' });
  }
});

// Get a specific summary
router.get('/summaries/:id', verifyAuth, async (req, res) => {
  try {
    const summaryRef = db.collection('users').doc(req.user.uid).collection('summaries').doc(req.params.id);
    const summaryDoc = await summaryRef.get();

    if (!summaryDoc.exists) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    res.json({ summary: { id: summaryDoc.id, ...summaryDoc.data() } });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Failed to get summary' });
  }
});

// ========== QUIZZES ROUTES ==========

// Get all quizzes for a user
router.get('/quizzes', verifyAuth, async (req, res) => {
  try {
    const quizzesRef = db.collection('users').doc(req.user.uid).collection('quizzes');
    const snapshot = await quizzesRef.orderBy('createdAt', 'desc').get();

    const quizzes = [];
    snapshot.forEach(doc => {
      quizzes.push({ id: doc.id, ...doc.data() });
    });

    res.json({ quizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Failed to get quizzes' });
  }
});

// Create a new quiz
router.post('/quizzes', verifyAuth, async (req, res) => {
  try {
    const { chapter, questions, score, totalQuestions, language, generateAI } = req.body;

    if (!chapter) {
      return res.status(400).json({ error: 'Chapter title is required' });
    }

    let quizQuestions = questions;
    let aiGenerated = false;

    // Generate AI quiz if requested and no questions provided
    if (generateAI && !questions) {
      try {
        // Get chapter content from database if available
        let chapterContent = chapter; // Fallback to chapter title

        if (req.body.chapterId) {
          const chapterDoc = await db.collection('chapters').doc(req.body.chapterId).get();
          if (chapterDoc.exists) {
            chapterContent = chapterDoc.data().content;
          }
        }

        quizQuestions = await aiService.generateQuiz(chapterContent, language || 'english');
        aiGenerated = true;
      } catch (aiError) {
        console.error('AI quiz generation failed:', aiError);
        return res.status(500).json({ error: 'Failed to generate AI quiz. Please provide questions manually.' });
      }
    }

    if (!quizQuestions) {
      return res.status(400).json({ error: 'Questions are required (or enable AI generation)' });
    }

    const quizData = {
      chapter,
      questions: quizQuestions,
      score: score || 0,
      totalQuestions: totalQuestions || (Array.isArray(quizQuestions) ? quizQuestions.length : 1),
      language: language || 'english',
      aiGenerated,
      createdAt: new Date(),
      userId: req.user.uid
    };

    const quizRef = await db.collection('users').doc(req.user.uid).collection('quizzes').add(quizData);

    res.status(201).json({
      message: aiGenerated ? 'AI-generated quiz created successfully' : 'Quiz created successfully',
      quiz: { id: quizRef.id, ...quizData }
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// ========== PROGRESS ROUTES ==========

// Get user progress/stats
router.get('/progress', verifyAuth, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    // Get recent activity
    const summariesRef = db.collection('users').doc(req.user.uid).collection('summaries');
    const quizzesRef = db.collection('users').doc(req.user.uid).collection('quizzes');

    const [summariesSnapshot, quizzesSnapshot] = await Promise.all([
      summariesRef.orderBy('createdAt', 'desc').limit(5).get(),
      quizzesRef.orderBy('createdAt', 'desc').limit(5).get()
    ]);

    const recentSummaries = [];
    summariesSnapshot.forEach(doc => {
      recentSummaries.push({ id: doc.id, type: 'summary', ...doc.data() });
    });

    const recentQuizzes = [];
    quizzesSnapshot.forEach(doc => {
      recentQuizzes.push({ id: doc.id, type: 'quiz', ...doc.data() });
    });

    const recentActivity = [...recentSummaries, ...recentQuizzes]
      .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
      .slice(0, 10);

    res.json({
      stats: userData.stats,
      recentActivity
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Update user stats
router.put('/progress/stats', verifyAuth, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const updateData = {
      'stats': req.body.stats,
      updatedAt: new Date()
    };

    await userRef.update(updateData);

    res.json({
      message: 'Stats updated successfully'
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

// Get AI-powered progress analysis
router.get('/progress/analysis', verifyAuth, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    // Get recent activity
    const summariesRef = db.collection('users').doc(req.user.uid).collection('summaries');
    const quizzesRef = db.collection('users').doc(req.user.uid).collection('quizzes');

    const [summariesSnapshot, quizzesSnapshot] = await Promise.all([
      summariesRef.orderBy('createdAt', 'desc').limit(10).get(),
      quizzesRef.orderBy('createdAt', 'desc').limit(10).get()
    ]);

    const recentActivity = [];
    summariesSnapshot.forEach(doc => {
      recentActivity.push({ id: doc.id, type: 'summary', ...doc.data() });
    });
    quizzesSnapshot.forEach(doc => {
      recentActivity.push({ id: doc.id, type: 'quiz', ...doc.data() });
    });

    recentActivity.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

    // Generate AI analysis
    const analysis = await aiService.analyzeProgress(userData, recentActivity);

    res.json({
      analysis,
      recentActivity: recentActivity.slice(0, 10),
      stats: userData.stats
    });
  } catch (error) {
    console.error('AI progress analysis error:', error);
    res.status(500).json({ error: 'Failed to generate progress analysis' });
  }
});

// ========== TEACHER ROUTES ==========

// Get all classes for a teacher
router.get('/classes', verifyAuth, async (req, res) => {
  try {
    const classesRef = db.collection('users').doc(req.user.uid).collection('classes');
    const snapshot = await classesRef.orderBy('createdAt', 'desc').get();

    const classes = [];
    snapshot.forEach(doc => {
      classes.push({ id: doc.id, ...doc.data() });
    });

    res.json({ classes });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
});

// Create a new class
router.post('/classes', verifyAuth, async (req, res) => {
  try {
    const { name, subject, description, gradeLevel, maxStudents } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ error: 'Name and subject are required' });
    }

    const classData = {
      name,
      subject,
      description: description || '',
      gradeLevel: gradeLevel || '',
      maxStudents: maxStudents ? parseInt(maxStudents) : null,
      teacherId: req.user.uid,
      studentCount: 0,
      assignmentCount: 0,
      classCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const classRef = await db.collection('classes').add(classData);

    // Add to teacher's classes collection
    await db.collection('users').doc(req.user.uid).collection('classes').doc(classRef.id).set({
      ...classData,
      id: classRef.id
    });

    res.status(201).json({
      message: 'Class created successfully',
      class: { id: classRef.id, ...classData }
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// Get a specific class
router.get('/classes/:id', verifyAuth, async (req, res) => {
  try {
    const classRef = db.collection('classes').doc(req.params.id);
    const classDoc = await classRef.get();

    if (!classDoc.exists) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const classData = classDoc.data();
    if (classData.teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not the class teacher' });
    }

    // Get students enrolled in this class
    const enrollmentsRef = db.collection('classEnrollments').where('classId', '==', req.params.id);
    const enrollmentsSnapshot = await enrollmentsRef.get();
    const students = [];

    for (const enrollmentDoc of enrollmentsSnapshot.docs) {
      const enrollment = enrollmentDoc.data();
      const studentRef = db.collection('users').doc(enrollment.studentId);
      const studentDoc = await studentRef.get();
      if (studentDoc.exists) {
        students.push({ id: studentDoc.id, ...studentDoc.data(), enrollmentId: enrollmentDoc.id });
      }
    }

    res.json({ class: { id: classDoc.id, ...classData }, students });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Failed to get class' });
  }
});

// Update a class
router.put('/classes/:id', verifyAuth, async (req, res) => {
  try {
    const classRef = db.collection('classes').doc(req.params.id);
    const classDoc = await classRef.get();

    if (!classDoc.exists) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const classData = classDoc.data();
    if (classData.teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not the class teacher' });
    }

    const updates = {
      ...req.body,
      updatedAt: new Date()
    };

    await classRef.update(updates);
    await db.collection('users').doc(req.user.uid).collection('classes').doc(req.params.id).update(updates);

    res.json({
      message: 'Class updated successfully',
      class: { id: req.params.id, ...classData, ...updates }
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Delete a class
router.delete('/classes/:id', verifyAuth, async (req, res) => {
  try {
    const classRef = db.collection('classes').doc(req.params.id);
    const classDoc = await classRef.get();

    if (!classDoc.exists) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const classData = classDoc.data();
    if (classData.teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not the class teacher' });
    }

    // Delete all related data
    await classRef.delete();
    await db.collection('users').doc(req.user.uid).collection('classes').doc(req.params.id).delete();

    // Delete enrollments
    const enrollmentsRef = db.collection('classEnrollments').where('classId', '==', req.params.id);
    const enrollmentsSnapshot = await enrollmentsRef.get();
    const deletePromises = enrollmentsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

// ========== ASSIGNMENTS ROUTES ==========

// Get all assignments for a teacher
router.get('/assignments', verifyAuth, async (req, res) => {
  try {
    const assignmentsRef = db.collection('assignments').where('teacherId', '==', req.user.uid);
    const snapshot = await assignmentsRef.orderBy('createdAt', 'desc').get();

    const assignments = [];
    for (const doc of snapshot.docs) {
      const assignment = { id: doc.id, ...doc.data() };

      // Get class name
      const classRef = db.collection('classes').doc(assignment.classId);
      const classDoc = await classRef.get();
      if (classDoc.exists) {
        assignment.className = classDoc.data().name;
      }

      // Get submission count
      const submissionsRef = db.collection('submissions').where('assignmentId', '==', assignment.id);
      const submissionsSnapshot = await submissionsRef.get();
      assignment.submissions = submissionsSnapshot.size;

      assignments.push(assignment);
    }

    res.json({ assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to get assignments' });
  }
});

// Create a new assignment
router.post('/assignments', verifyAuth, async (req, res) => {
  try {
    const { title, classId, description, dueDate, totalPoints, instructions } = req.body;

    if (!title || !classId || !dueDate) {
      return res.status(400).json({ error: 'Title, class ID, and due date are required' });
    }

    // Verify the teacher owns the class
    const classRef = db.collection('classes').doc(classId);
    const classDoc = await classRef.get();
    if (!classDoc.exists || classDoc.data().teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not authorized for this class' });
    }

    const assignmentData = {
      title,
      classId,
      description: description || '',
      dueDate: new Date(dueDate),
      totalPoints: totalPoints ? parseInt(totalPoints) : null,
      instructions: instructions || '',
      teacherId: req.user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const assignmentRef = await db.collection('assignments').add(assignmentData);

    // Update class assignment count
    await classRef.update({
      assignmentCount: (classDoc.data().assignmentCount || 0) + 1,
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment: { id: assignmentRef.id, ...assignmentData }
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Get a specific assignment with submissions
router.get('/assignments/:id', verifyAuth, async (req, res) => {
  try {
    const assignmentRef = db.collection('assignments').doc(req.params.id);
    const assignmentDoc = await assignmentRef.get();

    if (!assignmentDoc.exists) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = assignmentDoc.data();
    if (assignment.teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not the assignment teacher' });
    }

    // Get class name
    const classRef = db.collection('classes').doc(assignment.classId);
    const classDoc = await classRef.get();
    assignment.className = classDoc.exists ? classDoc.data().name : 'Unknown Class';

    // Get all submissions
    const submissionsRef = db.collection('submissions').where('assignmentId', '==', req.params.id);
    const submissionsSnapshot = await submissionsRef.get();
    const submissions = [];

    for (const doc of submissionsSnapshot.docs) {
      const submission = { id: doc.id, ...doc.data() };

      // Get student info
      const studentRef = db.collection('users').doc(submission.studentId);
      const studentDoc = await studentRef.get();
      if (studentDoc.exists) {
        submission.studentName = studentDoc.data().displayName || studentDoc.data().email;
        submission.studentEmail = studentDoc.data().email;
      }

      submissions.push(submission);
    }

    res.json({ assignment: { id: assignmentDoc.id, ...assignment }, submissions });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Failed to get assignment' });
  }
});

// Update an assignment
router.put('/assignments/:id', verifyAuth, async (req, res) => {
  try {
    const assignmentRef = db.collection('assignments').doc(req.params.id);
    const assignmentDoc = await assignmentRef.get();

    if (!assignmentDoc.exists) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = assignmentDoc.data();
    if (assignment.teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not the assignment teacher' });
    }

    const updates = {
      ...req.body,
      updatedAt: new Date()
    };

    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    await assignmentRef.update(updates);

    res.json({
      message: 'Assignment updated successfully',
      assignment: { id: req.params.id, ...assignment, ...updates }
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// Delete an assignment
router.delete('/assignments/:id', verifyAuth, async (req, res) => {
  try {
    const assignmentRef = db.collection('assignments').doc(req.params.id);
    const assignmentDoc = await assignmentRef.get();

    if (!assignmentDoc.exists) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = assignmentDoc.data();
    if (assignment.teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not the assignment teacher' });
    }

    // Delete the assignment
    await assignmentRef.delete();

    // Update class assignment count
    const classRef = db.collection('classes').doc(assignment.classId);
    const classDoc = await classRef.get();
    if (classDoc.exists) {
      await classRef.update({
        assignmentCount: Math.max(0, (classDoc.data().assignmentCount || 0) - 1),
        updatedAt: new Date()
      });
    }

    // Delete all submissions
    const submissionsRef = db.collection('submissions').where('assignmentId', '==', req.params.id);
    const submissionsSnapshot = await submissionsRef.get();
    const deletePromises = submissionsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

// ========== STUDENT MANAGEMENT ROUTES ==========

// Enroll a student in a class
router.post('/classes/:classId/enroll', verifyAuth, async (req, res) => {
  try {
    const { studentEmail } = req.body;
    const classId = req.params.classId;

    if (!studentEmail) {
      return res.status(400).json({ error: 'Student email is required' });
    }

    // Verify teacher owns the class
    const classRef = db.collection('classes').doc(classId);
    const classDoc = await classRef.get();
    if (!classDoc.exists || classDoc.data().teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not authorized for this class' });
    }

    // Find student by email
    const studentsRef = db.collection('users').where('email', '==', studentEmail);
    const studentsSnapshot = await studentsRef.get();
    if (studentsSnapshot.empty) {
      return res.status(404).json({ error: 'Student not found with this email' });
    }

    const studentDoc = studentsSnapshot.docs[0];
    const studentId = studentDoc.id;

    // Check if already enrolled
    const existingEnrollmentRef = db.collection('classEnrollments')
      .where('classId', '==', classId)
      .where('studentId', '==', studentId);
    const existingEnrollment = await existingEnrollmentRef.get();
    if (!existingEnrollment.empty) {
      return res.status(400).json({ error: 'Student is already enrolled in this class' });
    }

    // Create enrollment
    const enrollmentData = {
      classId,
      studentId,
      enrolledAt: new Date()
    };

    await db.collection('classEnrollments').add(enrollmentData);

    // Update class student count
    await classRef.update({
      studentCount: (classDoc.data().studentCount || 0) + 1,
      updatedAt: new Date()
    });

    res.json({
      message: 'Student enrolled successfully',
      student: { id: studentId, email: studentEmail, name: studentDoc.data().displayName }
    });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({ error: 'Failed to enroll student' });
  }
});

// Remove a student from a class
router.delete('/classes/:classId/students/:studentId', verifyAuth, async (req, res) => {
  try {
    const { classId, studentId } = req.params;

    // Verify teacher owns the class
    const classRef = db.collection('classes').doc(classId);
    const classDoc = await classRef.get();
    if (!classDoc.exists || classDoc.data().teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not authorized for this class' });
    }

    // Find and delete enrollment
    const enrollmentRef = db.collection('classEnrollments')
      .where('classId', '==', classId)
      .where('studentId', '==', studentId);
    const enrollmentSnapshot = await enrollmentRef.get();

    if (enrollmentSnapshot.empty) {
      return res.status(404).json({ error: 'Student is not enrolled in this class' });
    }

    await enrollmentSnapshot.docs[0].ref.delete();

    // Update class student count
    await classRef.update({
      studentCount: Math.max(0, (classDoc.data().studentCount || 0) - 1),
      updatedAt: new Date()
    });

    res.json({ message: 'Student removed from class successfully' });
  } catch (error) {
    console.error('Remove student error:', error);
    res.status(500).json({ error: 'Failed to remove student' });
  }
});

// ========== SUBMISSION MANAGEMENT ROUTES ==========

// Grade a submission
router.put('/submissions/:id/grade', verifyAuth, async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const submissionRef = db.collection('submissions').doc(req.params.id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const submission = submissionDoc.data();

    // Verify teacher owns the assignment
    const assignmentRef = db.collection('assignments').doc(submission.assignmentId);
    const assignmentDoc = await assignmentRef.get();
    if (!assignmentDoc.exists || assignmentDoc.data().teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not authorized for this assignment' });
    }

    const updates = {
      grade: grade ? parseFloat(grade) : null,
      feedback: feedback || '',
      gradedAt: new Date(),
      gradedBy: req.user.uid
    };

    await submissionRef.update(updates);

    res.json({
      message: 'Submission graded successfully',
      submission: { id: req.params.id, ...submission, ...updates }
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
});



// ==================== GOOGLE CLASSROOM INTEGRATION ====================

// Get Google Classroom authorization URL
router.get('/google-classroom/auth-url', verifyAuth, (req, res) => {
  try {
    const authUrl = googleClassroomService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('Google Classroom auth URL error:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
});

// Handle Google Classroom OAuth callback
router.post('/google-classroom/callback', verifyAuth, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const tokens = await googleClassroomService.setCredentials(code);

    // Store tokens in user's document
    const userRef = db.collection('users').doc(req.user.uid);
    await userRef.update({
      googleClassroomTokens: tokens,
      googleClassroomConnected: true,
      updatedAt: new Date()
    });

    res.json({ message: 'Google Classroom connected successfully', tokens });
  } catch (error) {
    console.error('Google Classroom callback error:', error);
    res.status(500).json({ error: 'Failed to connect Google Classroom' });
  }
});

// Check Google Classroom connection status
router.get('/google-classroom/status', verifyAuth, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.json({ connected: false });
    }

    const userData = userDoc.data();
    const hasTokens = userData.googleClassroomTokens && userData.googleClassroomConnected;

    if (hasTokens) {
      // Validate tokens by trying to access Google Classroom
      googleClassroomService.setStoredCredentials(userData.googleClassroomTokens);
      const validation = await googleClassroomService.validateAccess();

      res.json({
        connected: validation.valid,
        valid: validation.valid
      });
    } else {
      res.json({ connected: false });
    }
  } catch (error) {
    console.error('Google Classroom status check error:', error);
    res.json({ connected: false, error: error.message });
  }
});

// Get user's Google Classroom courses
router.get('/google-classroom/courses', verifyAuth, async (req, res) => {
  try {
    // Get user's stored tokens
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists || !userDoc.data().googleClassroomTokens) {
      return res.status(400).json({ error: 'Google Classroom not connected' });
    }

    // Set credentials and fetch courses
    googleClassroomService.setStoredCredentials(userDoc.data().googleClassroomTokens);
    const courses = await googleClassroomService.getCourses();

    res.json({ courses });
  } catch (error) {
    console.error('Get Google Classroom courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses from Google Classroom' });
  }
});

// Import Google Classroom course to EduGenius Pro
router.post('/google-classroom/import-course', verifyAuth, async (req, res) => {
  try {
    const { googleCourseId } = req.body;

    if (!googleCourseId) {
      return res.status(400).json({ error: 'Google course ID is required' });
    }

    // Get user's stored tokens
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists || !userDoc.data().googleClassroomTokens) {
      return res.status(400).json({ error: 'Google Classroom not connected' });
    }

    // Get the Google Classroom course details
    googleClassroomService.setStoredCredentials(userDoc.data().googleClassroomTokens);
    const courses = await googleClassroomService.getCourses();
    const googleCourse = courses.find(course => course.id === googleCourseId);

    if (!googleCourse) {
      return res.status(404).json({ error: 'Google Classroom course not found' });
    }

    // Import course to EduGenius Pro
    const importResult = await googleClassroomService.importCourseToEduGenius(googleCourse, req.user.uid);

    res.json({
      message: 'Course imported successfully',
      classId: importResult.classId,
      importedStudents: importResult.importedStudents,
      googleCourseName: googleCourse.name
    });
  } catch (error) {
    console.error('Import Google Classroom course error:', error);
    res.status(500).json({ error: 'Failed to import course from Google Classroom' });
  }
});

// Sync assignments from Google Classroom course
router.post('/google-classroom/sync-assignments', verifyAuth, async (req, res) => {
  try {
    const { eduGeniusClassId, googleCourseId } = req.body;

    if (!eduGeniusClassId || !googleCourseId) {
      return res.status(400).json({ error: 'Both EduGenius class ID and Google course ID are required' });
    }

    // Verify user owns the EduGenius class
    const classRef = db.collection('classes').doc(eduGeniusClassId);
    const classDoc = await classRef.get();

    if (!classDoc.exists || classDoc.data().teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not the class teacher' });
    }

    // Get user's stored tokens
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists || !userDoc.data().googleClassroomTokens) {
      return res.status(400).json({ error: 'Google Classroom not connected' });
    }

    // Set credentials and sync assignments
    googleClassroomService.setStoredCredentials(userDoc.data().googleClassroomTokens);
    const importedAssignments = await googleClassroomService.syncAssignmentsFromGoogle(
      eduGeniusClassId,
      googleCourseId,
      req.user.uid
    );

    res.json({
      message: 'Assignments synced successfully',
      importedAssignments,
      count: importedAssignments.length
    });
  } catch (error) {
    console.error('Sync Google Classroom assignments error:', error);
    res.status(500).json({ error: 'Failed to sync assignments from Google Classroom' });
  }
});

// ==================== AI TUTOR ENDPOINTS ====================

// Get AI tutor greeting
router.get('/ai-tutor/greeting', verifyAuth, async (req, res) => {
  try {
    const greeting = await aiTutorService.generateGreeting(req.user.uid);
    res.json({ greeting });
  } catch (error) {
    console.error('AI Tutor greeting error:', error);
    res.status(500).json({ error: 'Failed to generate greeting' });
  }
});

// Ask AI tutor a question
router.post('/ai-tutor/ask', verifyAuth, async (req, res) => {
  try {
    const { question, conversationHistory } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await aiTutorService.processQuestion(
      req.user.uid,
      question.trim(),
      conversationHistory || []
    );

    res.json(response);
  } catch (error) {
    console.error('AI Tutor ask error:', error);
    res.status(500).json({ error: 'Failed to process your question' });
  }
});

// Get conversation history
router.get('/ai-tutor/history', verifyAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = await aiTutorService.getConversationHistory(req.user.uid, limit);
    res.json({ history });
  } catch (error) {
    console.error('AI Tutor history error:', error);
    res.status(500).json({ error: 'Failed to retrieve conversation history' });
  }
});

// Generate practice problems for a topic
router.post('/ai-tutor/practice-problems', verifyAuth, async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const problems = await aiTutorService.generatePracticeProblems(
      topic.trim(),
      difficulty || 'intermediate',
      count || 5
    );

    res.json({ problems });
  } catch (error) {
    console.error('AI Tutor practice problems error:', error);
    res.status(500).json({ error: 'Failed to generate practice problems' });
  }
});

// Explain a concept
router.post('/ai-tutor/explain', verifyAuth, async (req, res) => {
  try {
    const { concept, subject, difficulty } = req.body;

    if (!concept || !subject) {
      return res.status(400).json({ error: 'Concept and subject are required' });
    }

    const explanation = await aiTutorService.explainConcept(
      concept.trim(),
      subject.trim(),
      difficulty || 'intermediate'
    );

    res.json({ explanation });
  } catch (error) {
    console.error('AI Tutor explain error:', error);
    res.status(500).json({ error: 'Failed to explain concept' });
  }
});

// Get learning recommendations
router.get('/ai-tutor/recommendations', verifyAuth, async (req, res) => {
  try {
    const recommendations = await aiTutorService.generateLearningRecommendations(req.user.uid);
    res.json(recommendations);
  } catch (error) {
    console.error('AI Tutor recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// ===== LEARNING AGENTS ENDPOINTS =====

// Study Coach Agent
router.post('/learning-agents/study-coach', verifyAuth, async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await aiTutorService.studyCoachInteraction(
      req.user.uid,
      message.trim(),
      context || {}
    );

    // Save to conversation history
    await aiTutorService.saveConversationMessage(req.user.uid, 'user', message.trim());
    await aiTutorService.saveConversationMessage(req.user.uid, 'assistant', `${response.agentType}: ${response.response}`);

    res.json(response);
  } catch (error) {
    console.error('Study Coach error:', error);
    res.status(500).json({ error: 'Study Coach is currently unavailable' });
  }
});

// Problem Solver Agent
router.post('/learning-agents/problem-solver', verifyAuth, async (req, res) => {
  try {
    const { problem, subject, difficulty } = req.body;

    if (!problem || !subject) {
      return res.status(400).json({ error: 'Problem and subject are required' });
    }

    const response = await aiTutorService.problemSolverInteraction(
      req.user.uid,
      problem.trim(),
      subject.trim(),
      difficulty || 'intermediate'
    );

    res.json(response);
  } catch (error) {
    console.error('Problem Solver error:', error);
    res.status(500).json({ error: 'Problem Solver is currently unavailable' });
  }
});

// Learning Analytics Agent
router.get('/learning-agents/analytics', verifyAuth, async (req, res) => {
  try {
    const timeRange = req.query.timeRange || 'week';
    const analytics = await aiTutorService.learningAnalyticsAgent(req.user.uid, timeRange);
    res.json(analytics);
  } catch (error) {
    console.error('Learning Analytics error:', error);
    res.status(500).json({ error: 'Learning Analytics are currently unavailable' });
  }
});

// Activity tracking for real-time updates
router.post('/activities/track', verifyAuth, async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Activity type is required' });
    }

    // Trigger real-time activity update
    realtimeService.handleUserActivity(req.user.uid, {
      type,
      data: data || {},
      timestamp: new Date()
    });

    res.json({ message: 'Activity tracked successfully' });
  } catch (error) {
    console.error('Activity tracking error:', error);
    res.status(500).json({ error: 'Failed to track activity' });
  }
});

// ==================== TEACHER ENDPOINTS ====================

// Get all classes for the authenticated teacher
router.get('/classes', verifyAuth, async (req, res) => {
  try {
    const classesRef = db.collection('classes');
    const snapshot = await classesRef
      .where('teacherId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const classes = [];
    snapshot.forEach(doc => {
      classes.push({ id: doc.id, ...doc.data() });
    });

    res.json({ classes });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
});

// Create a new class
router.post('/classes', verifyAuth, async (req, res) => {
  try {
    const { name, subject, description, gradeLevel, maxStudents } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ error: 'Name and subject are required' });
    }

    // Generate a unique class code
    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const classData = {
      name,
      subject,
      description: description || '',
      gradeLevel: gradeLevel || '',
      maxStudents: maxStudents || null,
      teacherId: req.user.uid,
      teacherName: req.user.displayName || req.user.email,
      classCode,
      studentCount: 0,
      assignmentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const classRef = await db.collection('classes').add(classData);

    res.status(201).json({
      message: 'Class created successfully',
      class: { id: classRef.id, ...classData }
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// Get a specific class with students
router.get('/classes/:id', verifyAuth, async (req, res) => {
  try {
    const classRef = db.collection('classes').doc(req.params.id);
    const classDoc = await classRef.get();

    if (!classDoc.exists) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const classData = classDoc.data();

    // Check if user is the teacher or enrolled student
    if (classData.teacherId !== req.user.uid) {
      const enrollmentRef = db.collection('enrollments')
        .where('classId', '==', req.params.id)
        .where('studentId', '==', req.user.uid);
      const enrollmentSnapshot = await enrollmentRef.get();

      if (enrollmentSnapshot.empty) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get enrolled students
    const enrollmentRef = db.collection('enrollments')
      .where('classId', '==', req.params.id);
    const enrollmentSnapshot = await enrollmentRef.get();

    const students = [];
    for (const enrollmentDoc of enrollmentSnapshot.docs) {
      const enrollmentData = enrollmentDoc.data();
      const studentRef = db.collection('users').doc(enrollmentData.studentId);
      const studentDoc = await studentRef.get();

      if (studentDoc.exists) {
        const studentData = studentDoc.data();
        students.push({
          id: enrollmentData.studentId,
          email: studentData.email,
          displayName: studentData.displayName,
          enrollmentId: enrollmentDoc.id
        });
      }
    }

    res.json({
      class: { id: classDoc.id, ...classData },
      students
    });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Failed to get class' });
  }
});

// Enroll a student in a class
router.post('/classes/:id/enroll', verifyAuth, async (req, res) => {
  try {
    const { studentEmail } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ error: 'Student email is required' });
    }

    // Find student by email
    const studentRef = db.collection('users').where('email', '==', studentEmail);
    const studentSnapshot = await studentRef.get();

    if (studentSnapshot.empty) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentDoc = studentSnapshot.docs[0];
    const studentId = studentDoc.id;

    // Check if already enrolled
    const existingEnrollmentRef = db.collection('enrollments')
      .where('classId', '==', req.params.id)
      .where('studentId', '==', studentId);
    const existingEnrollment = await existingEnrollmentRef.get();

    if (!existingEnrollment.empty) {
      return res.status(400).json({ error: 'Student already enrolled' });
    }

    // Check class capacity
    const classRef = db.collection('classes').doc(req.params.id);
    const classDoc = await classRef.get();

    if (!classDoc.exists) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const classData = classDoc.data();

    // Create enrollment
    const enrollmentData = {
      classId: req.params.id,
      studentId,
      studentEmail,
      enrolledAt: new Date(),
      enrolledBy: req.user.uid
    };

    await db.collection('enrollments').add(enrollmentData);

    // Update class student count
    await classRef.update({
      studentCount: (classData.studentCount || 0) + 1,
      updatedAt: new Date()
    });

    res.json({ message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({ error: 'Failed to enroll student' });
  }
});

// Remove a student from a class
router.delete('/classes/:classId/students/:studentId', verifyAuth, async (req, res) => {
  try {
    // Find and delete enrollment
    const enrollmentRef = db.collection('enrollments')
      .where('classId', '==', req.params.classId)
      .where('studentId', '==', req.params.studentId);
    const enrollmentSnapshot = await enrollmentRef.get();

    if (enrollmentSnapshot.empty) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Delete enrollment
    await enrollmentSnapshot.docs[0].ref.delete();

    // Update class student count
    const classRef = db.collection('classes').doc(req.params.classId);
    const classDoc = await classRef.get();

    if (classDoc.exists) {
      const classData = classDoc.data();
      await classRef.update({
        studentCount: Math.max(0, (classData.studentCount || 0) - 1),
        updatedAt: new Date()
      });
    }

    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error('Remove student error:', error);
    res.status(500).json({ error: 'Failed to remove student' });
  }
});

// Get all assignments for the authenticated teacher
router.get('/assignments', verifyAuth, async (req, res) => {
  try {
    const assignmentsRef = db.collection('assignments');
    const snapshot = await assignmentsRef
      .where('teacherId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const assignments = [];
    for (const doc of snapshot.docs) {
      const assignmentData = doc.data();

      // Get class name
      const classRef = db.collection('classes').doc(assignmentData.classId);
      const classDoc = await classRef.get();
      const className = classDoc.exists ? classDoc.data().name : 'Unknown Class';

      // Count submissions
      const submissionsRef = db.collection('submissions').where('assignmentId', '==', doc.id);
      const submissionsSnapshot = await submissionsRef.get();

      assignments.push({
        id: doc.id,
        ...assignmentData,
        className,
        submissions: submissionsSnapshot.size,
        totalStudents: classDoc.exists ? classDoc.data().studentCount || 0 : 0
      });
    }

    res.json({ assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to get assignments' });
  }
});

// Create a new assignment
router.post('/assignments', verifyAuth, async (req, res) => {
  try {
    const { title, classId, description, dueDate, totalPoints, instructions } = req.body;

    if (!title || !classId || !dueDate) {
      return res.status(400).json({ error: 'Title, class ID, and due date are required' });
    }

    // Verify teacher owns the class
    const classRef = db.collection('classes').doc(classId);
    const classDoc = await classRef.get();

    if (!classDoc.exists) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const classData = classDoc.data();
    if (classData.teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not the class teacher' });
    }

    const assignmentData = {
      title,
      classId,
      description: description || '',
      dueDate: new Date(dueDate),
      totalPoints: totalPoints || null,
      instructions: instructions || '',
      teacherId: req.user.uid,
      teacherName: req.user.displayName || req.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const assignmentRef = await db.collection('assignments').add(assignmentData);

    // Update class assignment count
    await classRef.update({
      assignmentCount: (classData.assignmentCount || 0) + 1,
      updatedAt: new Date()
    });

    // Send real-time notification to all students in the class
    realtimeService.notifyClassOfNewAssignment(classId, {
      id: assignmentRef.id,
      title,
      classId,
      dueDate: dueDate.toISOString(),
      teacherId: req.user.uid,
      teacherName: req.user.displayName || req.user.email
    });

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment: { id: assignmentRef.id, ...assignmentData }
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Get a specific assignment with submissions
router.get('/assignments/:id', verifyAuth, async (req, res) => {
  try {
    const assignmentRef = db.collection('assignments').doc(req.params.id);
    const assignmentDoc = await assignmentRef.get();

    if (!assignmentDoc.exists) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignmentData = assignmentDoc.data();

    // Check if user is the teacher or enrolled in the class
    if (assignmentData.teacherId !== req.user.uid) {
      const enrollmentRef = db.collection('enrollments')
        .where('classId', '==', assignmentData.classId)
        .where('studentId', '==', req.user.uid);
      const enrollmentSnapshot = await enrollmentRef.get();

      if (enrollmentSnapshot.empty) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get submissions
    const submissionsRef = db.collection('submissions')
      .where('assignmentId', '==', req.params.id);
    const submissionsSnapshot = await submissionsRef.get();

    const submissions = [];
    for (const submissionDoc of submissionsSnapshot.docs) {
      const submissionData = submissionDoc.data();

      // Get student info
      const studentRef = db.collection('users').doc(submissionData.studentId);
      const studentDoc = await studentRef.get();

      if (studentDoc.exists) {
        const studentData = studentDoc.data();
        submissions.push({
          id: submissionDoc.id,
          ...submissionData,
          studentName: studentData.displayName || studentData.email,
          studentEmail: studentData.email
        });
      }
    }

    // Get class name
    const classRef = db.collection('classes').doc(assignmentData.classId);
    const classDoc = await classRef.get();
    const className = classDoc.exists ? classDoc.data().name : 'Unknown Class';

    res.json({
      assignment: { id: assignmentDoc.id, ...assignmentData, className },
      submissions
    });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Failed to get assignment' });
  }
});

// Grade a submission
router.put('/submissions/:id/grade', verifyAuth, async (req, res) => {
  try {
    const { grade, feedback } = req.body;

    // Get submission
    const submissionRef = db.collection('submissions').doc(req.params.id);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const submissionData = submissionDoc.data();

    // Get assignment to verify teacher
    const assignmentRef = db.collection('assignments').doc(submissionData.assignmentId);
    const assignmentDoc = await assignmentRef.get();

    if (!assignmentDoc.exists || assignmentDoc.data().teacherId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied: Not the assignment teacher' });
    }

    // Update submission
    const updates = {
      grade: grade !== undefined ? grade : submissionData.grade,
      feedback: feedback !== undefined ? feedback : submissionData.feedback,
      gradedAt: new Date(),
      gradedBy: req.user.uid
    };

    await submissionRef.update(updates);

    res.json({
      message: 'Submission graded successfully',
      submission: { id: req.params.id, ...submissionData, ...updates }
    });

    // Send real-time notification to student
    realtimeService.notifyStudentOfGrade(submissionData.studentId, {
      submissionId: req.params.id,
      assignmentTitle: assignmentDoc.data().title,
      grade: updates.grade,
      feedback: updates.feedback,
      gradedAt: updates.gradedAt,
      teacherName: req.user.displayName || req.user.email
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
});

// Get all chapters (admin only)
router.get('/admin/chapters', verifyAuth, async (req, res) => {
  try {
    // Check if user is admin
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin only' });
    }

    const chaptersRef = db.collection('chapters');
    const snapshot = await chaptersRef.orderBy('createdAt', 'desc').get();

    const chapters = [];
    snapshot.forEach(doc => {
      chapters.push({ id: doc.id, ...doc.data() });
    });

    res.json({ chapters });
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({ error: 'Failed to get chapters' });
  }
});

// Create a new chapter (admin only)
router.post('/admin/chapters', verifyAuth, async (req, res) => {
  try {
    // Check if user is admin
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin only' });
    }

    const { title, subject, content, difficulty } = req.body;

    if (!title || !subject || !content) {
      return res.status(400).json({ error: 'Title, subject, and content are required' });
    }

    const chapterData = {
      title,
      subject,
      content,
      difficulty: difficulty || 'intermediate',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.user.uid,
      isActive: true
    };

    const chapterRef = await db.collection('chapters').add(chapterData);

    res.status(201).json({
      message: 'Chapter created successfully',
      chapter: { id: chapterRef.id, ...chapterData }
    });
  } catch (error) {
    console.error('Create chapter error:', error);
    res.status(500).json({ error: 'Failed to create chapter' });
  }
});

module.exports = router;
