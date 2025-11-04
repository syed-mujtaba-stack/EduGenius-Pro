const express = require('express');
const { auth, db } = require('../config/firebase');
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

// Register/Create user profile in Firestore
router.post('/register', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and email are required' });
    }

    // Create user profile in Firestore
    const userRef = db.collection('users').doc(uid);
    const userData = {
      uid,
      email,
      displayName: displayName || '',
      photoURL: photoURL || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'student', // default role
      preferences: {
        language: 'english',
        notifications: true,
        theme: 'dark'
      },
      stats: {
        chaptersCompleted: 0,
        quizzesTaken: 0,
        averageScore: 0,
        studyStreak: 0
      }
    };

    await userRef.set(userData);

    res.status(201).json({
      message: 'User registered successfully',
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Get user profile
router.get('/profile', verifyAuth, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({
      user: userDoc.data()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', verifyAuth, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await userRef.update(updateData);

    const updatedDoc = await userRef.get();
    res.json({
      message: 'Profile updated successfully',
      user: updatedDoc.data()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete user account
router.delete('/profile', verifyAuth, async (req, res) => {
  try {
    const uid = req.user.uid;

    // Delete user data from Firestore
    await db.collection('users').doc(uid).delete();

    // Note: Firebase Auth user deletion should be handled on the client side
    // or through Firebase Admin SDK with proper permissions

    res.json({
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Verify token endpoint (for testing)
router.get('/verify', verifyAuth, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user
  });
});

module.exports = router;
