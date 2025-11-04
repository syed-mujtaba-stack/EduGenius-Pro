<div align="center">

# 🛠️ EduGenius Pro - Backend Server

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io)

<h3 align="center">🔥 Robust Node.js Backend for AI-Powered Education Platform 🔥</h3>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=339933&center=true&vCenter=true&width=435&lines=Express.js+Backend;Firebase+Admin+SDK;RESTful+APIs;JWT+Authentication;Firestore+Database" alt="Typing SVG" />
</p>

---

</div>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project with Admin SDK
- MongoDB (optional, for additional data)

### Installation

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Configure your Firebase and other credentials.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **API will be available at**
   ```
   http://localhost:5000
   ```

---

## 🏗️ Project Structure

```
server/
├── src/                    # Source code
│   ├── config/            # Configuration files
│   │   └── firebase.js    # Firebase Admin SDK setup
│   ├── routes/            # API route handlers
│   │   ├── auth.js        # Authentication routes
│   │   └── api.js         # Application data routes
│   ├── middleware/        # Express middleware
│   ├── controllers/       # Route controllers
│   ├── models/           # Data models
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
├── .env                   # Environment variables
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

---

## 🎯 Key Features

### 🔐 Authentication & Security
- **Firebase Admin SDK** - Server-side authentication
- **JWT Token Verification** - Secure API access
- **CORS Protection** - Cross-origin request handling
- **Rate Limiting** - API abuse protection
- **Input Validation** - Data sanitization and validation

### 🗄️ Database Integration
- **Firestore** - NoSQL database for user data
- **Firebase Auth** - User management and authentication
- **Real-time Sync** - Live data updates
- **Backup & Recovery** - Data persistence

### 🚀 API Architecture
- **RESTful Design** - Clean API endpoints
- **Modular Routes** - Organized route handlers
- **Error Handling** - Comprehensive error responses
- **Logging** - Request/response logging

### 📊 Data Management
- **User Profiles** - Student and admin data
- **Learning Progress** - Track user achievements
- **Content Management** - Chapters and materials
- **Analytics** - Usage statistics and insights

---

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: Node.js with Express.js framework
- **Language**: JavaScript (ES6+)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Admin SDK

### Security & Middleware
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Rate Limiting**: API request throttling
- **Compression**: Response compression

### Development Tools
- **Nodemon**: Auto-restart for development
- **Morgan**: HTTP request logger
- **Dotenv**: Environment variable management
- **UUID**: Unique identifier generation

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_KEY={"type": "service_account", ...}
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com

# Optional: AI Service Configuration
OPENROUTER_API_KEY=your_openrouter_key_here
GEMINI_API_KEY=your_gemini_key_here
```

### Firebase Setup
1. Create Firebase project
2. Enable Firestore Database
3. Generate service account key
4. Configure authentication providers

---

## 🚀 API Endpoints

### Authentication Routes (`/auth`)
```
POST /auth/verify          # Verify Firebase token
GET  /auth/profile         # Get user profile
PUT  /auth/profile         # Update user profile
DELETE /auth/account       # Delete user account
```

### Application Routes (`/api`)
```
GET    /api/summaries      # Get chapter summaries
POST   /api/summaries      # Create new summary
GET    /api/quizzes        # Get available quizzes
POST   /api/quizzes        # Submit quiz answers
GET    /api/progress       # Get user progress
PUT    /api/progress       # Update progress
GET    /api/chapters       # Get course chapters
POST   /api/chapters       # Add new chapter (admin)
```

### Health Check
```
GET  /health               # Server health status
GET  /api/health           # API health check
```

---

## 🏃 Development Scripts

```bash
# Development
npm run dev         # Start with nodemon (auto-restart)
npm run start       # Start production server
npm run build       # Build for production
npm test            # Run tests

# Utilities
npm run lint        # Code linting
npm run format      # Code formatting
npm run clean       # Clean build files
```

---

## 🔒 Security Features

### Authentication
- **Token Verification** - Firebase JWT validation
- **Role-based Access** - Student/Admin permissions
- **Session Management** - Secure user sessions
- **API Key Protection** - Sensitive operations

### Data Protection
- **Input Sanitization** - XSS and injection prevention
- **Rate Limiting** - Brute force protection
- **CORS Policies** - Domain restrictions
- **Error Masking** - Secure error responses

---

## 📊 Database Schema

### Users Collection
```javascript
{
  uid: "firebase_user_id",
  email: "user@example.com",
  displayName: "User Name",
  role: "student|admin",
  createdAt: timestamp,
  lastLogin: timestamp,
  preferences: {...}
}
```

### Progress Collection
```javascript
{
  userId: "firebase_user_id",
  chapterId: "chapter_id",
  completed: true,
  score: 85,
  timeSpent: 1200, // seconds
  completedAt: timestamp
}
```

### Summaries Collection
```javascript
{
  chapterId: "chapter_id",
  language: "english|urdu",
  content: "AI generated summary...",
  createdAt: timestamp,
  authorId: "firebase_user_id"
}
```

---

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Test coverage
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/          # Unit tests
├── integration/   # API integration tests
├── fixtures/      # Test data
└── utils/         # Test utilities
```

---

## 🚀 Deployment

### Production Setup
1. **Environment Variables** - Set production values
2. **Firebase Project** - Use production Firebase project
3. **Database Backup** - Enable automated backups
4. **Monitoring** - Set up error tracking

### Hosting Options
- **Render** - Easy Node.js deployment
- **Railway** - Modern app hosting
- **Vercel** - Serverless functions
- **AWS EC2** - Full server control

---

## 🐛 Troubleshooting

### Common Issues

**Firebase Connection:**
```bash
# Check service account key
node -e "console.log(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))"
```

**Port Already in Use:**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**Environment Variables:**
```bash
# Check if .env is loaded
node -e "console.log(require('dotenv').config())"
```

---

## 📈 Performance

### Optimization Features
- **Response Compression** - Gzip compression
- **Caching Headers** - Browser caching
- **Database Indexing** - Optimized queries
- **Connection Pooling** - Efficient database connections

### Monitoring
- **Request Logging** - Morgan middleware
- **Error Tracking** - Sentry integration
- **Performance Metrics** - Response times
- **Health Checks** - Automated monitoring

---

## 🤝 API Documentation

### Request/Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Authentication Header
```
Authorization: Bearer <firebase_jwt_token>
```

---

## 📚 Learn More

- [Express.js Documentation](https://expressjs.com/) - Framework docs
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) - Server SDK
- [Firestore Documentation](https://firebase.google.com/docs/firestore) - Database
- [JWT.io](https://jwt.io/) - Token standard

---

<div align="center">

### 🎯 Ready to Power Amazing Learning Experiences?

**Start the server with:**

```bash
npm run dev
```

**API available at:** [http://localhost:5000](http://localhost:5000)

**Health check:** [http://localhost:5000/health](http://localhost:5000/health)

---

**Built with ❤️ using Node.js & Firebase**

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=339933&center=true&vCenter=true&width=435&lines=Happy+Backend+Dev!;Build+Scalable+APIs!;Secure+Your+Data!" alt="Typing SVG" />

**Developed by Syed Mujtaba Abbas**

</div>