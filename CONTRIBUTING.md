# Contributing to EduGenius Pro

Thank you for your interest in contributing to EduGenius Pro! 🎓

We welcome contributions from developers of all skill levels. Whether you're fixing bugs, adding features, improving documentation, or suggesting ideas, your help is valuable to us.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes**
5. **Test your changes** thoroughly
6. **Commit with clear messages**
7. **Push to your fork**
8. **Create a Pull Request**

## 📋 Development Guidelines

### Code Style
- **TypeScript**: Strictly typed, no `any` types
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **Naming**: Descriptive, camelCase for variables/functions
- **Comments**: Clear, concise comments for complex logic

### Commit Messages
Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat: add dark mode toggle`
- `fix: resolve quiz submission bug`
- `docs: update API documentation`

### Branch Naming
- `feature/description-of-feature`
- `bugfix/issue-description`
- `docs/update-documentation`
- `hotfix/critical-fix`

## 🏗️ Project Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/edugenius-pro.git
cd edugenius-pro

# Install client dependencies
cd client
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run type-check # Run TypeScript type checking
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### Manual Testing Checklist
- [ ] Works on Chrome, Firefox, Safari
- [ ] Mobile responsive on iOS and Android
- [ ] Dark mode works correctly
- [ ] All form validations work
- [ ] Error states are handled gracefully

## 🎨 UI/UX Guidelines

### Design Principles
- **Accessibility First**: WCAG 2.1 AA compliance
- **Mobile-First**: Design for mobile, enhance for desktop
- **Dark Theme**: Consistent dark UI throughout
- **Native Feel**: iOS/Android inspired interactions

### Component Guidelines
- **Reusable**: Components should be flexible and reusable
- **Props Interface**: Well-defined TypeScript interfaces
- **Default Props**: Sensible defaults for all optional props
- **Documentation**: JSDoc comments for complex components

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)
- **Background**: Gray-900 (#111827)

## 📱 Mobile Development

### Responsive Design
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`
- Mobile-first approach
- Touch targets: minimum 44px
- Readable fonts: minimum 16px

### PWA Features
- Service Worker for offline support
- Web App Manifest
- Install prompt handling
- Background sync for forms

## 🔧 API Development (Backend)

### RESTful API Design
- Resource-based URLs
- HTTP methods: GET, POST, PUT, DELETE
- JSON responses
- Proper HTTP status codes

### Authentication
- JWT tokens for session management
- Secure password hashing
- Role-based access control

### Database Design
- Normalized schema
- Proper indexing
- Data validation
- Migration scripts

## 📚 Documentation

### Code Documentation
```typescript
interface UserProps {
  /** User's unique identifier */
  id: string;
  /** User's display name */
  name: string;
  /** User's email address */
  email: string;
}

/**
 * User profile component
 * @param props - Component props
 */
function UserProfile(props: UserProps) {
  // Component implementation
}
```

### API Documentation
- OpenAPI/Swagger specifications
- Request/response examples
- Error code documentation
- Rate limiting information

## 🚨 Issue Reporting

### Bug Reports
- Clear title describing the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

### Feature Requests
- Clear description of the feature
- Use case and problem it solves
- Proposed implementation
- Mockups or examples if possible

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the README and docs folder first

## 🙏 Recognition

Contributors will be recognized in:
- Repository contributors list
- Release notes
- Project documentation
- Social media mentions

Thank you for contributing to EduGenius Pro! Your efforts help make quality education accessible to students worldwide. 🌍📚
