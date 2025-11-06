const aiService = require('./aiService');
const { db } = require('../config/firebase');

class AiTutorService {
  constructor() {
    this.maxConversationHistory = 50; // Maximum messages to keep in context
  }

  // Generate a personalized greeting for the student
  async generateGreeting(userId) {
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return "Hello! I'm your AI tutor. How can I help you with your studies today?";
      }

      const userData = userDoc.data();
      const displayName = userData.displayName || userData.email?.split('@')[0] || 'Student';

      // Get student's recent activity
      const recentActivity = await this.getRecentActivity(userId);

      let context = "";
      if (recentActivity.classes.length > 0) {
        context = ` I see you're enrolled in ${recentActivity.classes.join(', ')}. `;
      }

      return `Hello ${displayName}!${context}I'm your AI tutor, ready to help you learn and understand concepts. What would you like to explore today?`;
    } catch (error) {
      console.error('Error generating greeting:', error);
      return "Hello! I'm your AI tutor. How can I help you with your studies today?";
    }
  }

  // Get student's recent activity (classes, assignments, etc.)
  async getRecentActivity(userId) {
    try {
      // Get enrolled classes
      const enrollmentRef = db.collection('enrollments')
        .where('studentId', '==', userId)
        .limit(5);
      const enrollmentSnapshot = await enrollmentRef.get();

      const classIds = [];
      for (const doc of enrollmentSnapshot.docs) {
        classIds.push(doc.data().classId);
      }

      // Get class names
      const classes = [];
      for (const classId of classIds) {
        const classRef = db.collection('classes').doc(classId);
        const classDoc = await classRef.get();
        if (classDoc.exists) {
          classes.push(classDoc.data().name);
        }
      }

      // Get recent assignments
      const assignments = [];
      for (const classId of classIds) {
        const assignmentRef = db.collection('assignments')
          .where('classId', '==', classId)
          .orderBy('createdAt', 'desc')
          .limit(3);
        const assignmentSnapshot = await assignmentRef.get();

        for (const doc of assignmentSnapshot.docs) {
          assignments.push({
            id: doc.id,
            title: doc.data().title,
            classId: classId
          });
        }
      }

      return { classes, assignments: assignments.slice(0, 5) };
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return { classes: [], assignments: [] };
    }
  }

  // Process a student question and provide AI-powered response
  async processQuestion(userId, question, conversationHistory = []) {
    try {
      // Get student's context
      const studentContext = await this.getStudentContext(userId);

      // Build conversation context
      const contextMessages = this.buildConversationContext(conversationHistory);

      // Create prompt for AI
      const prompt = this.buildTutorPrompt(question, studentContext, contextMessages);

      // Get AI response
      const aiResponse = await aiService.generateTutorResponse(prompt);

      // Save conversation to database
      await this.saveConversationMessage(userId, 'user', question);
      await this.saveConversationMessage(userId, 'assistant', aiResponse.response);

      return {
        response: aiResponse.response,
        suggestions: aiResponse.suggestions || [],
        followUpQuestions: aiResponse.followUpQuestions || [],
        relatedTopics: aiResponse.relatedTopics || []
      };
    } catch (error) {
      console.error('Error processing question:', error);
      throw new Error('Failed to process your question. Please try again.');
    }
  }

  // Get student's learning context
  async getStudentContext(userId) {
    try {
      const activity = await this.getRecentActivity(userId);

      return {
        enrolledClasses: activity.classes,
        recentAssignments: activity.assignments,
        learningGoals: [], // Could be expanded with user preferences
        currentChallenges: [] // Could be tracked from question patterns
      };
    } catch (error) {
      console.error('Error getting student context:', error);
      return { enrolledClasses: [], recentAssignments: [], learningGoals: [], currentChallenges: [] };
    }
  }

  // Build conversation context from history
  buildConversationContext(history) {
    const recentMessages = history.slice(-this.maxConversationHistory);
    return recentMessages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));
  }

  // Build AI prompt for tutoring
  buildTutorPrompt(question, studentContext, conversationHistory) {
    const contextStr = `
Student Context:
- Enrolled in: ${studentContext.enrolledClasses.join(', ') || 'No classes yet'}
- Recent assignments: ${studentContext.recentAssignments.map(a => a.title).join(', ') || 'None'}

Recent Conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current Question: ${question}

Instructions:
You are an expert AI tutor for EduGenius Pro. Provide clear, helpful, and engaging responses.
- Explain concepts step-by-step
- Use examples when helpful
- Suggest practice problems or related exercises
- Ask follow-up questions to deepen understanding
- Be encouraging and patient
- Relate explanations to student's enrolled subjects when possible
- Keep responses conversational but informative

Response format: Provide a natural, helpful response to the student's question.`;

    return contextStr;
  }

  // Save conversation message to database
  async saveConversationMessage(userId, role, content) {
    try {
      const conversationData = {
        userId,
        role, // 'user' or 'assistant'
        content,
        timestamp: new Date(),
        type: 'tutor_conversation'
      };

      await db.collection('conversations').add(conversationData);
    } catch (error) {
      console.error('Error saving conversation message:', error);
    }
  }

  // Get conversation history for a user
  async getConversationHistory(userId, limit = 20) {
    try {
      const conversationRef = db.collection('conversations')
        .where('userId', '==', userId)
        .where('type', '==', 'tutor_conversation')
        .orderBy('timestamp', 'desc')
        .limit(limit);

      const snapshot = await conversationRef.get();
      const messages = [];

      snapshot.forEach(doc => {
        messages.unshift({ // Reverse to get chronological order
          id: doc.id,
          ...doc.data()
        });
      });

      return messages;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  }

  // Generate practice problems for a topic
  async generatePracticeProblems(topic, difficulty = 'intermediate', count = 5) {
    try {
      const prompt = `
Generate ${count} practice problems for the topic: "${topic}"
Difficulty level: ${difficulty}

For each problem, provide:
1. The problem statement
2. A step-by-step solution
3. Key concepts covered
4. Hints for students who get stuck

Format as JSON array of objects with fields: problem, solution, concepts, hints
`;

      const response = await aiService.generateResponse(prompt, 'practice_problems');
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating practice problems:', error);
      throw new Error('Failed to generate practice problems');
    }
  }

  // Analyze student's learning patterns and provide recommendations
  async generateLearningRecommendations(userId) {
    try {
      const conversationHistory = await this.getConversationHistory(userId, 100);
      const studentContext = await this.getStudentContext(userId);

      const analysisPrompt = `
Analyze this student's learning patterns and provide personalized recommendations:

Student Context:
- Classes: ${studentContext.enrolledClasses.join(', ')}
- Recent assignments: ${studentContext.recentAssignments.map(a => a.title).join(', ')}

Conversation History (last 100 messages):
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Provide recommendations in JSON format:
{
  "strengths": ["areas where student excels"],
  "areas_for_improvement": ["topics needing more practice"],
  "recommended_topics": ["suggested next topics to study"],
  "study_strategies": ["personalized study tips"],
  "practice_suggestions": ["specific practice recommendations"]
}
`;

      const response = await aiService.generateResponse(analysisPrompt, 'learning_analysis');
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating learning recommendations:', error);
      throw new Error('Failed to generate learning recommendations');
    }
  }

  // Explain a concept with examples and analogies
  async explainConcept(concept, subject, difficulty = 'intermediate') {
    try {
      const prompt = `
Explain the concept "${concept}" in the subject "${subject}" at ${difficulty} level.

Provide:
1. A clear definition
2. Real-world examples or analogies
3. Step-by-step breakdown if applicable
4. Common misconceptions
5. Practice questions

Make it engaging and easy to understand for students.
`;

      const response = await aiService.generateResponse(prompt, 'concept_explanation');
      return response;
    } catch (error) {
      console.error('Error explaining concept:', error);
      throw new Error('Failed to explain the concept');
    }
  }

  // ===== LEARNING AGENTS =====

  // Study Coach Agent - Focuses on motivation, study planning, and learning strategies
  async studyCoachInteraction(userId, message, context = {}) {
    try {
      const studentContext = await this.getStudentContext(userId);
      const recentActivity = await this.getRecentActivity(userId);

      const coachPrompt = `
You are a Study Coach - an encouraging, motivational AI mentor focused on study habits, time management, and learning strategies.

Student Context:
- Enrolled in: ${studentContext.enrolledClasses.join(', ')}
- Recent assignments: ${studentContext.recentAssignments.slice(0, 3).map(a => a.title).join(', ')}
- Study goals: ${context.goals || 'Not specified'}

Student Message: "${message}"

As a Study Coach, provide:
1. Encouraging and motivational responses
2. Study planning and time management advice
3. Learning strategy recommendations
4. Goal setting and progress tracking
5. Stress management and study-life balance
6. Productivity techniques and habits

Keep responses conversational, supportive, and actionable. Focus on building good study habits rather than direct academic content.
`;

      const response = await aiService.generateResponse(coachPrompt, 'study_coach');
      return {
        response,
        agentType: 'study_coach',
        suggestions: [
          'Create a study schedule',
          'Set specific learning goals',
          'Try the Pomodoro technique',
          'Review your progress weekly'
        ]
      };
    } catch (error) {
      console.error('Error with Study Coach:', error);
      throw new Error('Study Coach is currently unavailable');
    }
  }

  // Problem Solver Agent - Specializes in step-by-step problem solving
  async problemSolverInteraction(userId, problem, subject, difficulty = 'intermediate') {
    try {
      const studentContext = await this.getStudentContext(userId);

      const solverPrompt = `
You are a Problem Solver - an expert AI specialized in breaking down complex problems into clear, step-by-step solutions.

Problem: "${problem}"
Subject: ${subject}
Difficulty Level: ${difficulty}

Student Context:
- Enrolled classes: ${studentContext.enrolledClasses.join(', ')}
- Learning level: Based on enrolled subjects and typical curriculum

Provide a comprehensive solution that includes:
1. Problem Analysis - Understand what is being asked
2. Step-by-step Solution - Clear, logical breakdown
3. Key Concepts - Important principles used
4. Alternative Approaches - Different ways to solve if applicable
5. Common Mistakes - What to avoid
6. Practice Tips - How to approach similar problems

Make the solution educational and build problem-solving skills. Use appropriate notation and terminology for the subject.
`;

      const response = await aiService.generateResponse(solverPrompt, 'problem_solver');

      // Also generate related practice problems
      const practicePrompt = `
Generate 3 related practice problems for: ${problem}
Subject: ${subject}
Difficulty: ${difficulty}

Format as JSON array with objects containing:
- problem: the practice problem statement
- hints: array of helpful hints
- solution_approach: brief approach description
`;

      const practiceProblems = await aiService.generateResponse(practicePrompt, 'practice_generation');
      let practiceData = [];
      try {
        practiceData = JSON.parse(practiceProblems);
      } catch (e) {
        practiceData = [];
      }

      return {
        response,
        agentType: 'problem_solver',
        practiceProblems: practiceData,
        subject,
        difficulty,
        steps: this.extractSteps(response)
      };
    } catch (error) {
      console.error('Error with Problem Solver:', error);
      throw new Error('Problem Solver is currently unavailable');
    }
  }

  // Helper method to extract steps from problem-solving responses
  extractSteps(response) {
    const lines = response.split('\n');
    const steps = [];
    let inStepsSection = false;

    for (const line of lines) {
      if (line.toLowerCase().includes('step') && line.match(/\d+\.?\s*/)) {
        inStepsSection = true;
        steps.push(line.replace(/^\d+\.?\s*/, '').trim());
      } else if (inStepsSection && line.trim() && !line.match(/^[A-Z]|^\*\*|^###/)) {
        if (steps.length > 0) {
          steps[steps.length - 1] += ' ' + line.trim();
        }
      } else if (line.match(/^[A-Z]|^###|^\*\*/)) {
        inStepsSection = false;
      }
    }

    return steps.slice(0, 10); // Limit to 10 steps
  }

  // Learning Analytics Agent - Analyzes learning patterns and provides insights
  async learningAnalyticsAgent(userId, timeRange = 'week') {
    try {
      const conversationHistory = await this.getConversationHistory(userId, 200);
      const studentContext = await this.getStudentContext(userId);

      const analyticsPrompt = `
Analyze this student's learning patterns and provide detailed insights:

Time Range: ${timeRange}
Enrolled Classes: ${studentContext.enrolledClasses.join(', ')}
Total Conversations: ${conversationHistory.length}

Conversation Analysis:
${conversationHistory.slice(0, 50).map(msg => `${msg.role}: ${msg.content.substring(0, 100)}...`).join('\n')}

Provide comprehensive learning analytics in JSON format:
{
  "engagement_score": 0-100,
  "consistency_rating": "low|medium|high",
  "subject_focus": ["most studied subjects"],
  "learning_style": "visual|auditory|kinesthetic|reading|mixed",
  "strength_areas": ["topics performing well in"],
  "improvement_areas": ["topics needing more attention"],
  "study_habits": ["patterns identified"],
  "recommendations": ["specific actionable advice"],
  "predicted_improvement": "estimated progress rate",
  "next_milestones": ["suggested learning goals"]
}
`;

      const response = await aiService.generateResponse(analyticsPrompt, 'learning_analytics');
      return JSON.parse(response);
    } catch (error) {
      console.error('Error with Learning Analytics:', error);
      throw new Error('Learning Analytics are currently unavailable');
    }
  }
}

module.exports = new AiTutorService();
