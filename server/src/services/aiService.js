let OpenAI;
try {
  OpenAI = require('openai');
} catch (error) {
  console.warn('OpenAI package not found. AI features will be disabled.');
  OpenAI = null;
}

let GoogleGenerativeAI;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (error) {
  console.warn('Google Generative AI package not found. Gemini features will be disabled.');
  GoogleGenerativeAI = null;
}

class AIService {
  constructor() {
    // Determine which AI provider to use based on environment variables
    this.aiProvider = process.env.AI_PROVIDER || 'openrouter'; // 'openrouter', 'openai', or 'gemini'

    if (OpenAI && (this.aiProvider === 'openrouter' || this.aiProvider === 'openai')) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
        baseURL: this.aiProvider === 'openrouter' ? 'https://openrouter.ai/api/v1' : undefined
      });
    } else {
      this.openai = null;
    }

    if (GoogleGenerativeAI && this.aiProvider === 'gemini') {
      this.genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.geminiModel = this.genai.getGenerativeModel({ model: 'gemini-pro' });
    } else {
      this.genai = null;
      this.geminiModel = null;
    }

    if (!this.openai && !this.geminiModel) {
      console.warn('AI service initialized without any AI clients. Please check your API keys and AI_PROVIDER setting.');
    }
  }

  async generateSummary(chapterContent, language = 'english') {
    try {
      if (this.aiProvider === 'gemini' && this.geminiModel) {
        return await this.generateSummaryGemini(chapterContent, language);
      } else if (this.openai) {
        return await this.generateSummaryOpenAI(chapterContent, language);
      } else {
        throw new Error('No AI client available. Please check your API keys and AI_PROVIDER setting.');
      }
    } catch (error) {
      console.error('AI Summary generation error:', error);
      throw new Error('Failed to generate summary');
    }
  }

  async generateSummaryOpenAI(chapterContent, language = 'english') {
    const prompt = language === 'urdu'
      ? `براہ کرم درج ذیل باب کا ایک جامع خلاصہ اردو زبان میں لکھیں۔ خلاصہ جامع اور اہم نکات پر مشتمل ہونا چاہیے:

${chapterContent}

خلاصہ:`
      : `Please generate a comprehensive summary of the following chapter content. The summary should be detailed and cover all key points:

${chapterContent}

Summary:`;

    const completion = await this.openai.chat.completions.create({
      model: this.aiProvider === 'openrouter' ? 'meta-llama/llama-3.1-70b-instruct' : 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: language === 'urdu'
            ? 'آپ ایک تعلیمی معاون ہیں جو جامع اور واضح خلاصے بناتے ہیں۔'
            : 'You are an educational assistant that creates comprehensive and clear summaries.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    return completion.choices[0].message.content.trim();
  }

  async generateSummaryGemini(chapterContent, language = 'english') {
    const prompt = language === 'urdu'
      ? `براہ کرم درج ذیل باب کا ایک جامع خلاصہ اردو زبان میں لکھیں۔ خلاصہ جامع اور اہم نکات پر مشتمل ہونا چاہیے:

${chapterContent}

خلاصہ:`
      : `Please generate a comprehensive summary of the following chapter content. The summary should be detailed and cover all key points:

${chapterContent}

Summary:`;

    const result = await this.geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  }

  async generateQuiz(chapterContent, language = 'english') {
    try {
      if (this.aiProvider === 'gemini' && this.geminiModel) {
        return await this.generateQuizGemini(chapterContent, language);
      } else if (this.openai) {
        return await this.generateQuizOpenAI(chapterContent, language);
      } else {
        throw new Error('No AI client available. Please check your API keys and AI_PROVIDER setting.');
      }
    } catch (error) {
      console.error('AI Quiz generation error:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  async generateQuizOpenAI(chapterContent, language = 'english') {
    const prompt = language === 'urdu'
      ? `براہ کرم درج ذیل باب کے مواد کی بنیاد پر 5 سے 10 سوالوں پر مشتمل ایک کوئز بنائیں۔ ہر سوال متعدد انتخابی ہو اور 4 آپشنز ہوں۔ صحیح جواب کا اشارہ بھی دیں۔

مواد:
${chapterContent}

کوئز JSON فارمیٹ میں بنائیں جس میں سوالات اور جوابات شامل ہوں۔`
      : `Please generate a quiz with 5-10 multiple choice questions based on the following chapter content. Each question should have 4 options, and indicate the correct answer.

Content:
${chapterContent}

Generate the quiz in JSON format with questions and answers.`;

    const completion = await this.openai.chat.completions.create({
      model: this.aiProvider === 'openrouter' ? 'meta-llama/llama-3.1-70b-instruct' : 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: language === 'urdu'
            ? 'آپ ایک تعلیمی معاون ہیں جو معیاری کوئز سوالات بناتے ہیں۔'
            : 'You are an educational assistant that creates high-quality quiz questions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.4
    });

    const response = completion.choices[0].message.content.trim();

    // Try to parse the JSON response
    try {
      const quizData = JSON.parse(response);
      return Array.isArray(quizData) ? quizData : [quizData];
    } catch (parseError) {
      // If JSON parsing fails, try to extract questions manually
      console.warn('Failed to parse AI quiz response as JSON, attempting manual extraction');
      return this.parseQuizText(response);
    }
  }

  async generateQuizGemini(chapterContent, language = 'english') {
    const prompt = language === 'urdu'
      ? `براہ کرم درج ذیل باب کے مواد کی بنیاد پر 5 سے 10 سوالوں پر مشتمل ایک کوئز بنائیں۔ ہر سوال متعدد انتخابی ہو اور 4 آپشنز ہوں۔ صحیح جواب کا اشارہ بھی دیں۔

مواد:
${chapterContent}

کوئز JSON فارمیٹ میں بنائیں جس میں سوالات اور جوابات شامل ہوں۔`
      : `Please generate a quiz with 5-10 multiple choice questions based on the following chapter content. Each question should have 4 options, and indicate the correct answer.

Content:
${chapterContent}

Generate the quiz in JSON format with questions and answers.`;

    const result = await this.geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Try to parse the JSON response
    try {
      const quizData = JSON.parse(text);
      return Array.isArray(quizData) ? quizData : [quizData];
    } catch (parseError) {
      // If JSON parsing fails, try to extract questions manually
      console.warn('Failed to parse Gemini quiz response as JSON, attempting manual extraction');
      return this.parseQuizText(text);
    }
  }

  parseQuizText(text) {
    // Fallback parser for quiz text if JSON fails
    const questions = [];
    const lines = text.split('\n').filter(line => line.trim());

    let currentQuestion = null;
    let options = [];

    for (const line of lines) {
      if (line.match(/^\d+\./) || line.match(/^[A-Z]\./)) {
        // New question
        if (currentQuestion && options.length >= 4) {
          questions.push({
            question: currentQuestion,
            options: options.slice(0, 4),
            correctAnswer: this.findCorrectAnswer(options)
          });
        }
        currentQuestion = line.replace(/^\d+\.\s*/, '').replace(/^[A-Z]\.\s*/, '');
        options = [];
      } else if (line.match(/^[A-D]\)/) || line.match(/^[A-D]\./)) {
        options.push(line.replace(/^[A-D]\)\s*/, '').replace(/^[A-D]\.\s*/, ''));
      }
    }

    // Add the last question
    if (currentQuestion && options.length >= 4) {
      questions.push({
        question: currentQuestion,
        options: options.slice(0, 4),
        correctAnswer: this.findCorrectAnswer(options)
      });
    }

    return questions.slice(0, 10); // Limit to 10 questions
  }

  findCorrectAnswer(options) {
    // Simple heuristic to find the correct answer (this could be improved)
    for (let i = 0; i < options.length; i++) {
      if (options[i].toLowerCase().includes('correct') ||
          options[i].toLowerCase().includes('right') ||
          options[i].match(/^\*\s*/)) {
        return i;
      }
    }
    return 0; // Default to first option if unsure
  }

  async analyzeProgress(userData, recentActivity) {
    try {
      if (this.aiProvider === 'gemini' && this.geminiModel) {
        return await this.analyzeProgressGemini(userData, recentActivity);
      } else if (this.openai) {
        return await this.analyzeProgressOpenAI(userData, recentActivity);
      } else {
        // Return default analysis if no AI is available
        return {
          strengths: ['Consistent learning activity'],
          weaknesses: ['AI analysis not available'],
          recommendations: ['Continue regular study sessions'],
          nextSteps: ['Complete more quizzes and summaries']
        };
      }
    } catch (error) {
      console.error('AI Progress analysis error:', error);
      return {
        strengths: ['Active learner'],
        weaknesses: ['Limited data available'],
        recommendations: ['Continue learning regularly'],
        nextSteps: ['Complete more quizzes and summaries']
      };
    }
  }

  // Generate tutor response for student questions
  async generateTutorResponse(prompt) {
    try {
      if (this.aiProvider === 'gemini' && this.geminiModel) {
        return await this.generateTutorResponseGemini(prompt);
      } else if (this.openai) {
        return await this.generateTutorResponseOpenAI(prompt);
      } else {
        return {
          response: "I'm sorry, but the AI tutoring service is currently unavailable. Please try again later.",
          suggestions: [],
          followUpQuestions: [],
          relatedTopics: []
        };
      }
    } catch (error) {
      console.error('AI Tutor response error:', error);
      return {
        response: "I apologize, but I encountered an error while processing your question. Could you please rephrase it or try asking something else?",
        suggestions: ["Try asking about a specific concept", "Ask for examples or practice problems"],
        followUpQuestions: [],
        relatedTopics: []
      };
    }
  }

  async generateTutorResponseOpenAI(prompt) {
    const completion = await this.openai.chat.completions.create({
      model: this.aiProvider === 'openrouter' ? 'meta-llama/llama-3.1-70b-instruct' : 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI tutor. Provide clear, helpful, and engaging responses to student questions. Include suggestions, follow-up questions, and related topics when appropriate.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content.trim();

    // Parse structured response if possible
    try {
      const lines = response.split('\n');
      let mainResponse = response;
      let suggestions = [];
      let followUpQuestions = [];
      let relatedTopics = [];

      // Extract structured elements if present
      const suggestionMatch = response.match(/Suggestions?:\s*([\s\S]*?)(?=Follow-up|$)/i);
      if (suggestionMatch) {
        suggestions = suggestionMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-/, '').trim());
        mainResponse = response.replace(suggestionMatch[0], '').trim();
      }

      const followUpMatch = response.match(/Follow-up Questions?:\s*([\s\S]*?)(?=Related|$)/i);
      if (followUpMatch) {
        followUpQuestions = followUpMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-/, '').trim());
        mainResponse = mainResponse.replace(followUpMatch[0], '').trim();
      }

      const relatedMatch = response.match(/Related Topics?:\s*([\s\S]*)/i);
      if (relatedMatch) {
        relatedTopics = relatedMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-/, '').trim());
        mainResponse = mainResponse.replace(relatedMatch[0], '').trim();
      }

      return {
        response: mainResponse,
        suggestions: suggestions.length > 0 ? suggestions : ["Ask for examples", "Request practice problems", "Explore related concepts"],
        followUpQuestions,
        relatedTopics: relatedTopics.length > 0 ? relatedTopics : ["Practice problems", "Real-world applications", "Study tips"]
      };
    } catch (parseError) {
      return {
        response,
        suggestions: ["Ask for examples", "Request practice problems", "Explore related concepts"],
        followUpQuestions: [],
        relatedTopics: ["Practice problems", "Real-world applications", "Study tips"]
      };
    }
  }

  async generateTutorResponseGemini(prompt) {
    const result = await this.geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Similar parsing logic as OpenAI
    try {
      const lines = text.split('\n');
      let mainResponse = text;
      let suggestions = [];
      let followUpQuestions = [];
      let relatedTopics = [];

      const suggestionMatch = text.match(/Suggestions?:\s*([\s\S]*?)(?=Follow-up|$)/i);
      if (suggestionMatch) {
        suggestions = suggestionMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-/, '').trim());
        mainResponse = text.replace(suggestionMatch[0], '').trim();
      }

      const followUpMatch = text.match(/Follow-up Questions?:\s*([\s\S]*?)(?=Related|$)/i);
      if (followUpMatch) {
        followUpQuestions = followUpMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-/, '').trim());
        mainResponse = mainResponse.replace(followUpMatch[0], '').trim();
      }

      const relatedMatch = text.match(/Related Topics?:\s*([\s\S]*)/i);
      if (relatedMatch) {
        relatedTopics = relatedMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-/, '').trim());
        mainResponse = mainResponse.replace(relatedMatch[0], '').trim();
      }

      return {
        response: mainResponse,
        suggestions: suggestions.length > 0 ? suggestions : ["Ask for examples", "Request practice problems", "Explore related concepts"],
        followUpQuestions,
        relatedTopics: relatedTopics.length > 0 ? relatedTopics : ["Practice problems", "Real-world applications", "Study tips"]
      };
    } catch (parseError) {
      return {
        response: text,
        suggestions: ["Ask for examples", "Request practice problems", "Explore related concepts"],
        followUpQuestions: [],
        relatedTopics: ["Practice problems", "Real-world applications", "Study tips"]
      };
    }
  }

  // Generic response generator for various AI tasks
  async generateResponse(prompt, type = 'general') {
    try {
      if (this.aiProvider === 'gemini' && this.geminiModel) {
        const result = await this.geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
      } else if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: this.aiProvider === 'openrouter' ? 'meta-llama/llama-3.1-70b-instruct' : 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant specialized in ${type} tasks. Provide clear, accurate, and helpful responses.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        });

        return completion.choices[0].message.content.trim();
      } else {
        return "AI service is currently unavailable. Please try again later.";
      }
    } catch (error) {
      console.error('AI Generate response error:', error);
      return "I apologize, but I encountered an error. Please try again.";
    }
  }

  async analyzeProgressGemini(userData, recentActivity) {
    const prompt = `Analyze the following student learning data and provide personalized recommendations:

User Stats: ${JSON.stringify(userData.stats || {})}
Recent Activity: ${JSON.stringify(recentActivity || [])}

Provide analysis and recommendations in JSON format with:
- strengths: array of strengths
- weaknesses: array of areas to improve
- recommendations: array of specific recommendations
- nextSteps: array of suggested next learning steps`;

    const result = await this.geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      return {
        strengths: ['Consistent learning activity'],
        weaknesses: ['Need more diverse subjects'],
        recommendations: ['Continue regular study sessions', 'Try different subjects'],
        nextSteps: ['Review weak areas', 'Take practice quizzes']
      };
    }
  }
}

module.exports = new AIService();
