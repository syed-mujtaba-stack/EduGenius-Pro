# EduGenius Pro - Setup Guide

## 🚀 Firebase + Backend Setup Complete!

Your EduGenius Pro application now has:
- ✅ **Firebase Authentication** (Email/Password & Google Sign-In)
- ✅ **Firestore Database** for user data and application content
- ✅ **Express.js Backend** with protected API routes
- ✅ **Next.js Frontend** with authentication integration
- ✅ **Login/Signup Pages** with modern UI
- ✅ **Protected Routes** and authentication guards

## 📋 Next Steps: Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Name your project: `edugenius-pro`
4. Enable Google Analytics (optional)
5. Choose your Google Analytics account or create new
6. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable the following providers:
   - **Email/Password** (click enable)
   - **Google** (click enable, provide project support email)

### 3. Enable Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (you can change security rules later)
4. Select a location for your database
5. Click **Done**

### 4. Get Firebase Configuration

1. Go to **Project settings** (gear icon in left sidebar)
2. Scroll down to **Your apps** section
3. Click **Add app** → **Web app** (</> icon)
4. Register your app with name: `EduGenius Pro`
5. **IMPORTANT:** Check "Also set up Firebase Hosting" (optional but recommended)
6. Click **Register app**
7. Copy the Firebase config object - you'll need this next!

### 5. Configure Environment Variables

1. **Copy the template file:**
   ```bash
   cd client
   cp firebase-env-template.txt .env.local
   ```

2. **Edit `.env.local` and replace with your Firebase config:**

   Replace the placeholder values with your actual Firebase configuration:

   ```env
   # Firebase Configuration (Client-side)
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=edugenius-pro.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=edugenius-pro
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=edugenius-pro.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
   ```

### 6. Configure Firebase Admin (Backend)

1. Go to **Project settings** → **Service accounts** tab
2. Click **Generate new private key**
3. Download the JSON file (keep it secure!)
4. Copy the contents of the JSON file
5. **Edit `server/.env.example`** and replace the placeholder:

   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"edugenius-pro",...}
   ```

6. **Copy to server environment:**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your service account key
   ```

## 🏃‍♂️ Running the Application

### Install Dependencies

```bash
# Install all dependencies
npm install

# Or install client and server separately
cd client && npm install
cd ../server && npm install
```

### Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:3000
```

### Test the Application

1. **Visit** http://localhost:3000
2. **Click login/signup** - you'll be redirected to auth pages
3. **Create an account** or **sign in**
4. **Access the dashboard** and explore features

## 🔧 Available API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `DELETE /auth/profile` - Delete user account

### Application Data
- `GET /api/summaries` - Get user summaries
- `POST /api/summaries` - Create new summary
- `GET /api/quizzes` - Get user quizzes
- `POST /api/quizzes` - Create new quiz
- `GET /api/progress` - Get user progress
- `PUT /api/progress/stats` - Update user stats

### Admin (requires admin role)
- `GET /api/admin/chapters` - Get all chapters
- `POST /api/admin/chapters` - Create new chapter

## 🔒 Security Features

- **JWT Authentication** with Firebase tokens
- **CORS Protection** configured for development
- **Rate Limiting** (100 requests per 15 minutes)
- **Helmet.js** security headers
- **Input validation** on all endpoints
- **Protected routes** in frontend

## 🗄️ Firestore Data Structure

```
/users/{uid}/
  ├── summaries/
  │   └── {summaryId}
  ├── quizzes/
  │   └── {quizId}
  └── user profile data

/chapters/
  └── {chapterId} (admin content)
```

## 🎯 What's Working Now

- ✅ User registration and login
- ✅ Google OAuth integration
- ✅ Protected dashboard access
- ✅ User profile management
- ✅ API authentication
- ✅ Database connectivity
- ✅ Modern UI with authentication flows

## 🚀 Next Steps

1. **Deploy to production:**
   - Set up Firebase Hosting
   - Configure production environment variables
   - Set up CI/CD with GitHub Actions

2. **Add more features:**
   - AI-powered content generation
   - Progress analytics
   - Admin panel for content management
   - File upload capabilities

3. **Enhance security:**
   - Configure Firestore security rules
   - Add API rate limiting per user
   - Implement refresh tokens

## 🐛 Troubleshooting

**Firebase Config Issues:**
- Double-check all environment variables
- Ensure Firebase project is properly set up
- Verify API keys are correct

**Authentication Problems:**
- Check browser console for Firebase errors
- Verify Firebase Auth is enabled in console
- Ensure service account key is properly formatted

**API Connection Issues:**
- Confirm backend server is running on port 5000
- Check CORS configuration
- Verify Firebase tokens are being sent correctly

---

**🎉 Congratulations!** Your EduGenius Pro application is now ready with full authentication and database integration!
