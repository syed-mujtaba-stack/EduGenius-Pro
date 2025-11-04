import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
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

  async createSummary(summaryData: { chapter: string; content: string; language?: string }) {
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

  async createQuiz(quizData: { chapter: string; questions: any[]; score?: number; totalQuestions?: number }) {
    return this.request('/api/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
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
}

export const apiClient = new ApiClient();
