const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let firebaseApp;

try {
  if (!admin.apps.length) {
    // Check if we have a service account key file
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    } else {
      // Use default credentials (for deployed environments)
      firebaseApp = admin.initializeApp();
    }
  } else {
    firebaseApp = admin.app();
  }

  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error);
  throw error;
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
  admin,
  db,
  auth,
  storage,
  firebaseApp
};
