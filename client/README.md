<div align="center">

# 🎨 EduGenius Pro - Frontend Client

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

<h3 align="center">🌟 Modern React Frontend for AI-Powered Education Platform 🌟</h3>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=61DAFB&center=true&vCenter=true&width=435&lines=Next.js+16+Frontend;TypeScript+Powered;Firebase+Auth;Dark+UI+Theme;Mobile+Responsive" alt="Typing SVG" />
</p>

---

</div>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun
- Firebase project setup (see main [README.md](../README.md))

### Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Firebase configuration.

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🏗️ Project Structure

```
client/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── api/               # API routes (if needed)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard/Home page
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
│   ├── auth-context.tsx   # Firebase auth context
│   ├── firebase.js        # Firebase configuration
│   └── api-client.ts      # Backend API client
├── public/                # Static assets
├── styles/                # Additional styles
└── types/                 # TypeScript type definitions
```

---

## 🎯 Key Features

### 🔐 Authentication System
- **Firebase Auth Integration** - Email/password and Google OAuth
- **Protected Routes** - Automatic redirects for unauthenticated users
- **User Context** - Global auth state management
- **Persistent Sessions** - Remember user login state

### 🎨 Modern UI/UX
- **Dark Theme** - Modern dark interface design
- **Mobile-First** - Responsive design for all devices
- **Native Mobile Experience** - iOS/Android-style interactions
- **Smooth Animations** - Micro-interactions and transitions

### 📱 Pages & Components

#### Authentication Pages
- **Login Page** (`/auth/login`) - Email/password and Google sign-in
- **Signup Page** (`/auth/signup`) - User registration with validation

#### Main Application
- **Dashboard** (`/`) - Protected home page with user info
- **Summaries** (`/summaries`) - AI-powered chapter summaries
- **Quizzes** (`/quizzes`) - Interactive quiz system
- **Progress** (`/progress`) - Learning analytics

---

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS 4 for utility-first CSS
- **State Management**: React Context + Hooks

### Firebase Integration
- **Authentication**: Firebase Auth (Email/Password & Google OAuth)
- **Configuration**: Client-side Firebase SDK
- **Environment**: Secure environment variable management

### Development Tools
- **Linting**: ESLint with Next.js configuration
- **Formatting**: Prettier for code consistency
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Next.js built-in compiler

---

## 🔧 Configuration

### Environment Variables (`.env.local`)

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password and Google providers
3. Enable Firestore Database
4. Copy your web app configuration to `.env.local`

---

## 🚀 Development Scripts

```bash
# Development server
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

---

## 🎨 UI/UX Design

### Design Philosophy
- **Dark Theme First** - Modern, eye-friendly interface
- **Mobile Priority** - Responsive design from mobile up
- **Native Feel** - App-like interactions on web
- **Accessibility** - WCAG compliant design patterns

### Key Components
- **AuthProvider** - Global authentication context
- **AppShell** - Main application layout
- **ThemeProvider** - Dark/light theme management
- **Loading States** - Skeleton screens and spinners

---

## 🔗 API Integration

### Backend Communication
- **API Client**: Centralized HTTP client for backend calls
- **Authentication**: Automatic Firebase token injection
- **Error Handling**: Comprehensive error management
- **Type Safety**: Full TypeScript integration

### Available Endpoints
- `POST /auth/verify` - Token verification
- `GET /api/summaries` - Chapter summaries
- `GET /api/quizzes` - Quiz data
- `GET /api/progress` - User progress

---

## 📱 Mobile Experience

### Responsive Features
- **Bottom Navigation** - Mobile-style tab navigation
- **Touch Interactions** - Swipe gestures and touch feedback
- **Adaptive Layout** - Optimized for different screen sizes
- **PWA Ready** - Service worker and offline capabilities

---

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Firebase Connection Issues:**
- Verify `.env.local` configuration
- Check Firebase Console settings
- Ensure correct API keys

**TypeScript Errors:**
```bash
npm run type-check
```

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Framework docs
- [Firebase Documentation](https://firebase.google.com/docs) - Auth & Database
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type safety

---

<div align="center">

### 🎯 Ready to Build Amazing Learning Experiences?

**Start developing with:**

```bash
npm run dev
```

**Then visit:** [http://localhost:3000](http://localhost:3000)

---

**Built with ❤️ using Next.js & Firebase**

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=61DAFB&center=true&vCenter=true&width=435&lines=Happy+Coding!;Build+Amazing+Apps!;Learn+Something+New!" alt="Typing SVG" />

</div>
