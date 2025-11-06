'use client';

import { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, MessageSquare, Lightbulb, Award, BookOpen, Calculator, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';

interface AgentCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  capabilities: string[];
}

export default function LearningAgentsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agentResponse, setAgentResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    message: '',
    problem: '',
    subject: '',
    difficulty: 'intermediate'
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const agents: AgentCard[] = [
    {
      id: 'study-coach',
      name: 'Study Coach',
      description: 'Motivational mentor for study habits, time management, and learning strategies',
      icon: <Brain className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
      capabilities: [
        'Study planning and scheduling',
        'Time management techniques',
        'Goal setting and motivation',
        'Stress management',
        'Productivity tips',
        'Learning habit formation'
      ]
    },
    {
      id: 'problem-solver',
      name: 'Problem Solver',
      description: 'Expert in breaking down complex problems with step-by-step solutions',
      icon: <Calculator className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-green-500 to-green-700',
      capabilities: [
        'Step-by-step problem solving',
        'Mathematical reasoning',
        'Alternative solution methods',
        'Common mistake identification',
        'Practice problem generation',
        'Subject-specific expertise'
      ]
    },
    {
      id: 'analytics',
      name: 'Learning Analytics',
      description: 'AI-powered analysis of your learning patterns and personalized insights',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-gradient-to-br from-purple-500 to-purple-700',
      capabilities: [
        'Learning pattern analysis',
        'Performance insights',
        'Study habit evaluation',
        'Personalized recommendations',
        'Progress tracking',
        'Improvement predictions'
      ]
    }
  ];

  const handleAgentInteraction = async (agentId: string) => {
    setLoading(true);
    setSelectedAgent(agentId);
    setAgentResponse(null);

    try {
      let response;

      switch (agentId) {
        case 'study-coach':
          if (!inputData.message.trim()) {
            alert('Please enter a message for the Study Coach');
            return;
          }
          response = await apiClient.chatWithStudyCoach(inputData.message);
          break;

        case 'problem-solver':
          if (!inputData.problem.trim() || !inputData.subject.trim()) {
            alert('Please enter both problem and subject for the Problem Solver');
            return;
          }
          response = await apiClient.solveProblem(
            inputData.problem,
            inputData.subject,
            inputData.difficulty
          );
          break;

        case 'analytics':
          response = await apiClient.getLearningAnalytics('week');
          break;

        default:
          throw new Error('Unknown agent');
      }

      setAgentResponse(response);
    } catch (error) {
      console.error('Agent interaction error:', error);
      setAgentResponse({ error: 'Agent is currently unavailable. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetInteraction = () => {
    setSelectedAgent(null);
    setAgentResponse(null);
    setInputData({
      message: '',
      problem: '',
      subject: '',
      difficulty: 'intermediate'
    });
  };

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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-12 w-12 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Learning Agents</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Specialized AI agents designed to enhance your learning experience with targeted expertise
          </p>
        </div>

        {/* Agent Selection */}
        {!selectedAgent && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div className={`w-16 h-16 ${agent.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {agent.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{agent.name}</h3>
                <p className="text-gray-400 mb-4">{agent.description}</p>
                <div className="space-y-1">
                  {agent.capabilities.slice(0, 3).map((capability, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      {capability}
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  Interact with {agent.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Agent Interaction Interface */}
        {selectedAgent && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {agents.find(a => a.id === selectedAgent)?.icon}
                <h2 className="text-2xl font-semibold text-white ml-3">
                  {agents.find(a => a.id === selectedAgent)?.name}
                </h2>
              </div>
              <button
                onClick={resetInteraction}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Back to Agents
              </button>
            </div>

            {/* Input Forms */}
            <div className="mb-6">
              {selectedAgent === 'study-coach' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      What would you like help with? (study habits, motivation, planning, etc.)
                    </label>
                    <textarea
                      value={inputData.message}
                      onChange={(e) => setInputData({...inputData, message: e.target.value})}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      placeholder="e.g., I'm struggling with staying motivated, or I need help creating a study schedule..."
                    />
                  </div>
                </div>
              )}

              {selectedAgent === 'problem-solver' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Subject</label>
                    <select
                      value={inputData.subject}
                      onChange={(e) => setInputData({...inputData, subject: e.target.value})}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select subject</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                      <option value="History">History</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Difficulty Level</label>
                    <select
                      value={inputData.difficulty}
                      onChange={(e) => setInputData({...inputData, difficulty: e.target.value})}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">Problem Statement</label>
                    <textarea
                      value={inputData.problem}
                      onChange={(e) => setInputData({...inputData, problem: e.target.value})}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      placeholder="Describe the problem you need help solving..."
                    />
                  </div>
                </div>
              )}

              {selectedAgent === 'analytics' && (
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    Get detailed insights into your learning patterns, strengths, and areas for improvement.
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={() => handleAgentInteraction(selectedAgent)}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium flex items-center transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask {agents.find(a => a.id === selectedAgent)?.name}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Agent Response */}
            {agentResponse && (
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Response</h3>

                {agentResponse.error ? (
                  <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">
                    {agentResponse.error}
                  </div>
                ) : selectedAgent === 'analytics' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-600 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-blue-400">{agentResponse.engagement_score || 0}</div>
                        <div className="text-sm text-gray-300">Engagement Score</div>
                      </div>
                      <div className="bg-gray-600 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-green-400 capitalize">{agentResponse.consistency_rating || 'N/A'}</div>
                        <div className="text-sm text-gray-300">Consistency</div>
                      </div>
                      <div className="bg-gray-600 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-purple-400 capitalize">{agentResponse.learning_style || 'Mixed'}</div>
                        <div className="text-sm text-gray-300">Learning Style</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-white font-medium mb-2">Subject Focus</h4>
                        <div className="flex flex-wrap gap-2">
                          {(agentResponse.subject_focus || []).map((subject: string, index: number) => (
                            <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">Strength Areas</h4>
                        <ul className="text-gray-300 space-y-1">
                          {(agentResponse.strength_areas || []).map((strength: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <Award className="h-4 w-4 text-green-400 mr-2" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">Recommendations</h4>
                        <ul className="text-gray-300 space-y-1">
                          {(agentResponse.recommendations || []).map((rec: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <Lightbulb className="h-4 w-4 text-yellow-400 mr-2" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : selectedAgent === 'problem-solver' ? (
                  <div className="space-y-4">
                    <div className="bg-gray-600 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Solution</h4>
                      <div className="text-gray-300 whitespace-pre-wrap">{agentResponse.response}</div>
                    </div>

                    {agentResponse.steps && agentResponse.steps.length > 0 && (
                      <div className="bg-gray-600 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">Step-by-Step Breakdown</h4>
                        <ol className="text-gray-300 space-y-2">
                          {agentResponse.steps.map((step: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {agentResponse.practiceProblems && agentResponse.practiceProblems.length > 0 && (
                      <div className="bg-gray-600 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">Related Practice Problems</h4>
                        <div className="space-y-3">
                          {agentResponse.practiceProblems.map((problem: any, index: number) => (
                            <div key={index} className="bg-gray-700 rounded-lg p-3">
                              <div className="font-medium text-white mb-1">Problem {index + 1}:</div>
                              <div className="text-gray-300 mb-2">{problem.problem}</div>
                              {problem.hints && (
                                <div className="text-sm text-gray-400">
                                  <strong>Hint:</strong> {Array.isArray(problem.hints) ? problem.hints[0] : problem.hints}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {agentResponse.response}
                    </div>

                    {agentResponse.suggestions && agentResponse.suggestions.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Quick Suggestions</h4>
                        <div className="flex flex-wrap gap-2">
                          {agentResponse.suggestions.map((suggestion: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => setInputData({...inputData, message: suggestion})}
                              className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-full text-sm transition-colors duration-200"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            These specialized AI agents are designed to complement your learning experience.
            Each agent focuses on specific aspects of learning to provide targeted support.
          </p>
        </div>
      </div>
    </div>
  );
}
