const express = require('express');
const { db } = require('../config/firebase');
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
    const { chapter, content, language } = req.body;

    if (!chapter || !content) {
      return res.status(400).json({ error: 'Chapter and content are required' });
    }

    const summaryData = {
      chapter,
      content,
      language: language || 'english',
      createdAt: new Date(),
      userId: req.user.uid
    };

    const summaryRef = await db.collection('users').doc(req.user.uid).collection('summaries').add(summaryData);

    res.status(201).json({
      message: 'Summary created successfully',
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
    const { chapter, questions, score, totalQuestions } = req.body;

    if (!chapter || !questions) {
      return res.status(400).json({ error: 'Chapter and questions are required' });
    }

    const quizData = {
      chapter,
      questions,
      score: score || 0,
      totalQuestions: totalQuestions || questions.length,
      createdAt: new Date(),
      userId: req.user.uid
    };

    const quizRef = await db.collection('users').doc(req.user.uid).collection('quizzes').add(quizData);

    res.status(201).json({
      message: 'Quiz created successfully',
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

// ========== ADMIN ROUTES (for content management) ==========

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
