<div align="center">

# 🚀 EduGenius Pro - AI-Powered Education Platform

[![EduGenius Pro](https://img.shields.io/badge/EduGenius-Pro-FF6B6B?style=for-the-badge&logo=react&logoColor=white)](https://github.com/syed-mujtaba-stack/EduGenius-Pro)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<h3 align="center">🌟 Complete AI-powered education platform with teacher dashboard, designed to make personalized learning accessible for every student and teacher 🌟</h3>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=FF6B6B&center=true&vCenter=true&width=435&lines=AI-Powered+Learning;Interactive+Quizzes;Smart+Summaries;Teacher+Dashboard;Class+Management;Progress+Tracking;Multi-Language+Support" alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://github.com/syed-mujtaba-stack/EduGenius-Pro"><strong>Explore the docs »</strong></a>
  <br />
  <br />
  <a href="https://github.com/syed-mujtaba-stack/EduGenius-Pro">View Demo</a>
  •
  <a href="https://github.com/syed-mujtaba-stack/EduGenius-Pro/issues">Report Bug</a>
  •
  <a href="https://github.com/syed-mujtaba-stack/EduGenius-Pro/issues">Request Feature</a>
</p>

---

</div>

## 🚀 Quick Start

**New to Firebase?** Follow our comprehensive [Firebase Setup Guide](FIREBASE_SETUP.md) to get authentication and database running in minutes!

## 🌟 Features

### 🤖 AI-Powered Learning
- **AI Tutor**: Interactive AI tutor for instant help and explanations
- **Learning Agents**: Specialized AI agents for targeted learning support
- **Study Coach Agent**: Motivational mentor for study habits and time management
- **Problem Solver Agent**: Expert in step-by-step mathematical and logical problem solving
- **Analytics Agent**: AI-powered learning pattern analysis and personalized insights
- **Smart Summaries**: AI-generated chapter summaries with key concepts
- **Intelligent Quizzes**: Adaptive quizzes that adjust to student performance
- **Personalized Learning**: AI recommendations based on learning patterns
- **Practice Problem Generation**: AI-generated practice problems with solutions
- **Concept Explanations**: Step-by-step explanations with examples and analogies

### 📱 Cross-Platform Experience
- **Responsive Design**: Optimized for mobile and desktop
- **Conditional UI**: Landing page shows full-width layout, dashboard includes sidebar navigation
- **PWA Support**: Offline learning capabilities
- **Native Mobile UI**: iOS/Android-style interface with bottom navigation
- **Dark Theme**: Modern dark UI design throughout the platform

### 👨‍🏫 Teacher Dashboard & Management
- **Class Management**: Create, edit, and organize classes with student enrollment
- **Assignment Creation**: Design assignments with due dates, points, and detailed instructions
- **Student Enrollment**: Email-based enrollment and class code sharing system
- **Grading System**: Comprehensive grading interface with feedback and progress tracking
- **Real-time Analytics**: Detailed performance reports, submission tracking, and insights
- **Google Classroom Integration**: Import courses, students, and assignments from Google Classroom
- **Class Overview**: Monitor student progress, assignment completion, and engagement metrics

### ⚡ Real-Time Features
- **Live Notifications**: Instant alerts for grades, assignments, and announcements
- **Real-Time Activity Feed**: Live updates of class activities and progress
- **Instant Messaging**: Real-time communication between teachers and students
- **Live Progress Updates**: Real-time progress tracking and analytics
- **Collaborative Features**: Live collaboration tools for group learning

### 👨‍🎓 Multi-User Support
- **Student Dashboard**: Personalized learning experience with progress tracking
- **Teacher/Admin Panel**: Complete classroom management and analytics
- **Role-based Access**: Secure authentication and authorization system
- **Real-time Collaboration**: Seamless interaction between teachers and students

### 🌐 Landing Page & Chatbot
- **Beautiful Landing Page**: Professional marketing page with platform overview (homepage)
- **Interactive EduBot**: AI chatbot that answers questions about the platform
- **Real-time Conversations**: Live chat with intelligent responses about features
- **Quick Questions**: Pre-built questions for instant information
- **Platform Showcase**: Visual presentation of all platform capabilities
- **Dashboard Overview**: Comprehensive landing page showcasing all platform features
- **Feature Showcase**: Interactive demonstrations of AI tutoring, test generation, and blog content
- **Test Generator Integration**: Prominent display and quick access to assessment creation tools management system
- **Dynamic Blog Posts**: Rich content with multiple block types and formatting
- **Blog Images**: Visual content integration with responsive image display
- **Image Optimization**: Proper sizing and lazy loading for blog content
- **Visual Content Blocks**: Featured images and inline content images
- **Reusable Navbar**: Consistent navigation component across public pages
- **Test Generator**: Complete assessment creation and testing platform
- **Multiple Question Types**: Support for multiple choice, true/false, short answer, and essay questions
- **Test Creation Tools**: Visual test builder with drag-and-drop question management
- **Test Taking Interface**: Interactive test-taking experience with real-time progress
- **Automatic Grading**: Instant scoring for objective questions with detailed results

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend ✅
- **Runtime**: Node.js with Express.js
- **Authentication**: Firebase Auth (Email/Password & Google OAuth)
- **Database**: Firestore (NoSQL)
- **Security**: JWT tokens, CORS, rate limiting
- **Admin SDK**: Firebase Admin for server-side operations

### DevOps
- **Hosting**: Vercel (Frontend), Render/Fly.io (Backend)
- **Storage**: AWS S3 / Supabase Storage
- **Monitoring**: Sentry, Prometheus

## 📁 Project Structure

```
EduGenius Pro/
├── client/                 # Next.js Frontend
│   ├── app/               # Next.js App Router
│   │   ├── teacher/       # Teacher Dashboard Routes
│   │   │   ├── analytics/ # Performance Analytics
│   │   │   ├── classes/   # Class Management
│   │   │   └── assignments/# Assignment Management
│   │   ├── components/    # Reusable UI Components
│   │   ├── public/        # Static Assets
│   │   └── styles/        # Global Styles
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── routes/        # API Routes (classes, assignments, grading)
│   │   └── services/      # AI Services (OpenRouter, Gemini)
├── .github/               # GitHub Actions & Templates
├── .gitignore            # Git Ignore Rules
├── LICENSE               # MIT License
└── README.md             # Project Documentation
```

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **npm**: Latest version recommended
- **Windows Users**: Ensure you have proper environment variable support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/syed-mujtaba-stack/EduGenius-Pro.git
   cd EduGenius Pro
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Configure your Firebase credentials
   - Set up authentication and database URLs
4. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd server && npm run dev

   # Terminal 2: Frontend
   cd client && npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Windows Build Compatibility

The build script has been optimized for Windows compatibility:
- **Build Command**: `npm run build` now properly sets environment variables on Windows
- **Issue Fixed**: Previous Unix-style `TURBOPACK=0` variable setting didn't work on Windows
- **Solution**: Updated to `set TURBOPACK=0&& next build` for Windows compatibility

If you encounter any build issues on Windows, ensure you have:
- Node.js version 18.0 or higher
- npm version 8.0 or higher
- Proper command prompt or PowerShell permissions

## 📱 Mobile App Experience

EduGenius Pro features a native mobile app-like experience:
- Bottom navigation tabs on mobile
- Touch-friendly interactions
- Native-style animations
- PWA support for offline learning

## 🎯 Roadmap

### Phase 1: Frontend MVP ✅
- [x] Modern dark UI design
- [x] Responsive layout
- [x] Native mobile experience
- [x] Dashboard with analytics
- [x] Quiz and summary interfaces

### Phase 2: Backend Integration ✅
- [x] Firebase Authentication (Email/Password & Google OAuth)
- [x] Firestore database setup
- [x] Express.js API server
- [x] Protected routes and middleware
- [x] User profile management
- [x] Real-time data synchronization

### Phase 3: Advanced Features 🔄
- [x] **AI integration (OpenRouter/OpenAI & Gemini)**
- [x] **Teacher Dashboard & Class Management**
- [x] **Assignment Creation & Grading System**
- [x] **Student Enrollment & Management**
- [x] **Real-time Analytics & Performance Reports**
- [ ] Offline PWA support
- [ ] Urdu language localization
- [ ] Teacher collaboration tools
- [ ] File upload capabilities

### Phase 4: Launch 🚀
- [ ] Production deployment
- [ ] User testing
- [ ] Performance optimization
- [ ] Marketing and launch

## 📊 GitHub Stats

<div align="center">

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=syed-mujtaba-stack&show_icons=true&theme=dark&hide_border=true&bg_color=0D1117&title_color=FF6B6B&icon_color=FF6B6B&text_color=C9D1D9)
![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=syed-mujtaba-stack&theme=dark&hide_border=true&background=0D1117&stroke=FF6B6B&ring=FF6B6B&fire=FF6B6B&currStreakLabel=FF6B6B)

</div>

---

## 🎯 Tech Stack & Tools

<div align="center">

### 🚀 Frontend Technologies
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 🛠️ Backend & Database
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Firestore](https://img.shields.io/badge/Firestore-FF6B6B?style=for-the-badge&logo=firebase&logoColor=white)

### 🤖 AI & APIs
![OpenRouter](https://img.shields.io/badge/OpenRouter-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

</div>

---

## 🎨 UI/UX Highlights

<div align="center">

### 🌙 Modern Dark Theme
- Sleek dark interface inspired by modern apps
- Eye-friendly design for extended learning sessions
- Consistent color palette with accent highlights

### 📱 Mobile-First Design
- Responsive layout optimized for all devices
- Native mobile app-like experience
- Touch-friendly interactions and gestures

### 👨‍🏫 Teacher Experience
- Comprehensive dashboard with class overview and quick actions
- Intuitive class creation with student enrollment management
- Assignment builder with detailed grading interfaces
- Real-time analytics with performance insights and recommendations
- Seamless student-teacher collaboration tools

</div>

---

## 🤝 Contributing

<div align="center">

### 🌟 How to Contribute

We love your input! We want to make contributing to this project as easy and transparent as possible.

1. 🍴 **Fork** the repo and create your branch from `main`
2. 🔧 **Setup** your development environment
3. 🎯 **Make** your changes (add tests if applicable)
4. ✅ **Test** your changes thoroughly
5. 📝 **Update** documentation if needed
6. 🚀 **Submit** a pull request

### 📋 Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Test your changes before submitting
- Update documentation for new features
- Follow the existing code style

</div>

---

## 🔗 Links

<div align="center">

### 📖 Documentation
[![Contributing Guide](https://img.shields.io/badge/Contributing-Guide-blue?style=for-the-badge)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/Code-Of_Conduct-orange?style=for-the-badge)](CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/Security-Policy-red?style=for-the-badge)](SECURITY.md)

### 🚀 Quick Start
[![Get Started](https://img.shields.io/badge/Get-Started-green?style=for-the-badge)](README.md#get-started)
[![Live Demo](https://img.shields.io/badge/Live-Demo-purple?style=for-the-badge)](https://edugenius-pro.vercel.app)

</div>

---

## 🙏 Acknowledgments

<div align="center">

**Built with ❤️ by passionate developers for students worldwide**

### 🚀 Powered By
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-FF6B6B?style=flat&logo=openai&logoColor=white)](https://openrouter.ai)

### 📞 Connect With Us

<a href="https://github.com/syed-mujtaba-stack">
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</a>
<a href="https://github.com/syed-mujtaba-stack/EduGenius-Pro/issues">
  <img src="https://img.shields.io/badge/Issues-FF6B6B?style=for-the-badge&logo=github&logoColor=white" alt="Issues">
</a>

---

<div align="center">

**⭐ Star this repo if you find it useful!**

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=FF6B6B&center=true&vCenter=true&width=435&lines=Happy+Learning!;Keep+Coding!;Stay+Curious!;Never+Stop+Learning!" alt="Typing SVG" />

**Developed by Syed Mujtaba Abbas**

**Made with ❤️ for students and teachers worldwide**

</div>

</div>
