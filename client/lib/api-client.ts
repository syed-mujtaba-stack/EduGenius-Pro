import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  private baseUrl = API_BASE_URL;
  private async getAuthToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = await this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication endpoints
  async registerUser(userData: { uid: string; email: string; displayName?: string; photoURL?: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile() {
    return this.request('/auth/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async deleteUserAccount() {
    return this.request('/auth/profile', {
      method: 'DELETE',
    });
  }

  // Application data endpoints
  async getSummaries() {
    return this.request('/api/summaries');
  }

  async createSummary(summaryData: { chapter: string; content?: string; language?: string; generateAI?: boolean; chapterId?: string }) {
    return this.request('/api/summaries', {
      method: 'POST',
      body: JSON.stringify(summaryData),
    });
  }

  async getSummary(id: string) {
    return this.request(`/api/summaries/${id}`);
  }

  async getQuizzes() {
    return this.request('/api/quizzes');
  }

  async createQuiz(quizData: { chapter: string; questions?: any[]; score?: number; totalQuestions?: number; language?: string; generateAI?: boolean; chapterId?: string }) {
    return this.request('/api/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  }

  async getProgressAnalysis() {
    return this.request('/api/progress/analysis');
  }

  async getProgress() {
    return this.request('/api/progress');
  }

  async updateProgress(stats: any) {
    return this.request('/api/progress/stats', {
      method: 'PUT',
      body: JSON.stringify({ stats }),
    });
  }

  // Admin endpoints
  async getChapters() {
    return this.request('/api/admin/chapters');
  }

  async createChapter(chapterData: { title: string; subject: string; content: string; difficulty?: string }) {
    return this.request('/api/admin/chapters', {
      method: 'POST',
      body: JSON.stringify(chapterData),
    });
  }

  // File upload methods
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = await this.getAuthToken();

    return fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: token ? {
        'Authorization': `Bearer ${token}`,
      } : {},
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }
      return response.json();
    });
  }

  async getFiles() {
    return this.request('/api/files');
  }

  async deleteFile(fileId: string) {
    return this.request(`/api/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  async processFile(fileId: string) {
    return this.request(`/api/files/${fileId}/process`, {
      method: 'POST',
    });
  }

  // Teacher endpoints
  async getClasses() {
    return this.request('/api/classes');
  }

  async createClass(classData: { name: string; subject: string; description?: string; gradeLevel?: string; maxStudents?: number }) {
    return this.request('/api/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async getClass(id: string) {
    return this.request(`/api/classes/${id}`);
  }

  async updateClass(id: string, classData: any) {
    return this.request(`/api/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
  }

  async deleteClass(id: string) {
    return this.request(`/api/classes/${id}`, {
      method: 'DELETE',
    });
  }

  async enrollStudent(classId: string, studentEmail: string) {
    return this.request(`/api/classes/${classId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ studentEmail }),
    });
  }

  async removeStudent(classId: string, studentId: string) {
    return this.request(`/api/classes/${classId}/students/${studentId}`, {
      method: 'DELETE',
    });
  }

  async getAssignments() {
    return this.request('/api/assignments');
  }

  async createAssignment(assignmentData: { title: string; classId: string; description?: string; dueDate: string; totalPoints?: number; instructions?: string }) {
    return this.request('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async getAssignment(id: string) {
    return this.request(`/api/assignments/${id}`);
  }

  async updateAssignment(id: string, assignmentData: any) {
    return this.request(`/api/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  }

  async deleteAssignment(id: string) {
    return this.request(`/api/assignments/${id}`, {
      method: 'DELETE',
    });
  }

  async gradeSubmission(submissionId: string, gradeData: { grade?: number; feedback?: string }) {
    return this.request(`/api/submissions/${submissionId}/grade`, {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  }

  // Google Classroom integration
  async getGoogleClassroomAuthUrl() {
    return this.request('/api/google-classroom/auth-url');
  }

  async connectGoogleClassroom(code: string) {
    return this.request('/api/google-classroom/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async getGoogleClassroomStatus() {
    return this.request('/api/google-classroom/status');
  }

  async getGoogleClassroomCourses() {
    return this.request('/api/google-classroom/courses');
  }

  async importGoogleClassroomCourse(googleCourseId: string) {
    return this.request('/api/google-classroom/import-course', {
      method: 'POST',
      body: JSON.stringify({ googleCourseId }),
    });
  }

  async syncGoogleClassroomAssignments(eduGeniusClassId: string, googleCourseId: string) {
    return this.request('/api/google-classroom/sync-assignments', {
      method: 'POST',
      body: JSON.stringify({ eduGeniusClassId, googleCourseId }),
    });
  }

  // AI Tutor methods
  async getAiTutorGreeting() {
    return this.request('/api/ai-tutor/greeting');
  }

  async askAiTutor(question: string, conversationHistory?: any[]) {
    return this.request('/api/ai-tutor/ask', {
      method: 'POST',
      body: JSON.stringify({ question, conversationHistory }),
    });
  }

  async getAiTutorHistory(limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.request(`/api/ai-tutor/history${params}`);
  }

  async generatePracticeProblems(topic: string, difficulty?: string, count?: number) {
    return this.request('/api/ai-tutor/practice-problems', {
      method: 'POST',
      body: JSON.stringify({ topic, difficulty, count }),
    });
  }

  async explainConcept(concept: string, subject: string, difficulty?: string) {
    return this.request('/api/ai-tutor/explain', {
      method: 'POST',
      body: JSON.stringify({ concept, subject, difficulty }),
    });
  }

  async getLearningRecommendations() {
    return this.request('/api/ai-tutor/recommendations');
  }

  // Learning Agents methods
  async chatWithStudyCoach(message: string, context?: any) {
    return this.request('/api/learning-agents/study-coach', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async solveProblem(problem: string, subject: string, difficulty?: string) {
    return this.request('/api/learning-agents/problem-solver', {
      method: 'POST',
      body: JSON.stringify({ problem, subject, difficulty }),
    });
  }

  async getLearningAnalytics(timeRange?: string) {
    const params = timeRange ? `?timeRange=${timeRange}` : '';
    return this.request(`/api/learning-agents/analytics${params}`);
  }

  // Real-time activity tracking
  async trackActivity(activityType: string, data: any) {
    // This would trigger real-time updates via the realtime service
    return this.request('/api/activities/track', {
      method: 'POST',
      body: JSON.stringify({ type: activityType, data }),
    });
  }
}

export const apiClient = new ApiClient();
