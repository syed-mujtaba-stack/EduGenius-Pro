'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, BookOpen, Lightbulb, Target, MessageSquare, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  followUpQuestions?: string[];
  relatedTopics?: string[];
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  color: string;
}

export default function AiTutorPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Load initial greeting and conversation history
  useEffect(() => {
    if (!user) return;

    loadInitialData();
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadInitialData = async () => {
    try {
      // Load greeting
      const greetingResponse = await apiClient.getAiTutorGreeting();
      setGreeting(greetingResponse.greeting);

      // Load conversation history
      const historyResponse = await apiClient.getAiTutorHistory(20);
      const historyMessages = historyResponse.history.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp.seconds * 1000),
      }));
      setMessages(historyMessages);

      // Add greeting as first message if no history
      if (historyMessages.length === 0) {
        setMessages([{
          id: 'greeting',
          role: 'assistant',
          content: greetingResponse.greeting,
          timestamp: new Date(),
          suggestions: ["Ask me about any subject", "Request practice problems", "Get explanations with examples"]
        }]);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

    setIsLoading(true);
    setInputMessage('');

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await apiClient.askAiTutor(messageToSend, messages.slice(-10));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        suggestions: response.suggestions,
        followUpQuestions: response.followUpQuestions,
        relatedTopics: response.relatedTopics,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: () => void) => {
    action();
  };

  const quickActions: QuickAction[] = [
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Explain a concept",
      action: () => setInputMessage("Can you explain the concept of "),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: "Practice problems",
      action: () => setInputMessage("Give me practice problems for "),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      label: "Study tips",
      action: () => setInputMessage("What are some effective study tips for "),
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Homework help",
      action: () => setInputMessage("I need help with this homework problem: "),
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-2">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Tutor</h1>
            <p className="text-gray-400 text-sm">Your personal learning assistant</p>
          </div>
          <div className="ml-auto">
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{message.content}</p>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs opacity-70 font-medium">Suggestions:</p>
                    {message.suggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="block text-xs bg-gray-600 hover:bg-gray-500 rounded px-2 py-1 transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Follow-up questions */}
                {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs opacity-70 font-medium">Follow-up questions:</p>
                    {message.followUpQuestions.slice(0, 2).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(question)}
                        className="block text-xs bg-gray-600 hover:bg-gray-500 rounded px-2 py-1 transition-colors duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {/* Related topics */}
                {message.relatedTopics && message.relatedTopics.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs opacity-70 font-medium">Related topics:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {message.relatedTopics.slice(0, 3).map((topic, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(`Tell me about ${topic}`)}
                          className="text-xs bg-gray-600 hover:bg-gray-500 rounded px-2 py-1 transition-colors duration-200"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 rounded-lg p-4 max-w-xs lg:max-w-md xl:max-w-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="border-t border-gray-700 p-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-medium mb-3">Quick Start</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className={`${action.color} text-white p-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 text-sm`}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your studies..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center transition-colors duration-200"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Try asking about concepts, requesting practice problems, or getting study tips!
          </p>
        </div>
      </div>
    </div>
  );
}
