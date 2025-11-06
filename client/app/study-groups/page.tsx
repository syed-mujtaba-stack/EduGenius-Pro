'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, MessageCircle, Calendar, UserPlus, Search, Filter } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  members: number;
  maxMembers: number;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
}

interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export default function StudyGroupsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover'>('my-groups');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Mock data
  const myGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'Advanced Mathematics Study Group',
      description: 'Weekly sessions covering calculus, algebra, and statistics',
      subject: 'Mathematics',
      members: 8,
      maxMembers: 15,
      createdBy: 'John Doe',
      createdAt: '2024-01-15',
      isPublic: true
    },
    {
      id: '2',
      name: 'Physics Problem Solving',
      description: 'Daily physics problem discussions and solutions',
      subject: 'Physics',
      members: 12,
      maxMembers: 20,
      createdBy: 'Jane Smith',
      createdAt: '2024-01-20',
      isPublic: false
    }
  ];

  const discoverGroups: StudyGroup[] = [
    {
      id: '3',
      name: 'Chemistry Lab Prep',
      description: 'Prepare for chemistry lab experiments together',
      subject: 'Chemistry',
      members: 6,
      maxMembers: 12,
      createdBy: 'Bob Johnson',
      createdAt: '2024-01-25',
      isPublic: true
    },
    {
      id: '4',
      name: 'English Literature Discussion',
      description: 'Discuss classic literature and writing techniques',
      subject: 'English',
      members: 15,
      maxMembers: 25,
      createdBy: 'Alice Wilson',
      createdAt: '2024-01-28',
      isPublic: true
    },
    {
      id: '5',
      name: 'Computer Science Algorithms',
      description: 'Master algorithms and data structures',
      subject: 'Computer Science',
      members: 10,
      maxMembers: 18,
      createdBy: 'Charlie Brown',
      createdAt: '2024-02-01',
      isPublic: true
    }
  ];

  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'History'];

  const filteredGroups = (activeTab === 'my-groups' ? myGroups : discoverGroups).filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === '' || selectedSubject === 'All' || group.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleJoinGroup = (groupId: string) => {
    // In a real app, this would make an API call
    alert('Join group functionality would be implemented here');
  };

  const handleCreateGroup = () => {
    setShowCreateForm(true);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Study Groups</h1>
          <p className="text-gray-400">Collaborate with peers, share knowledge, and learn together.</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-lg p-1 mb-6 shadow-lg">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('my-groups')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'my-groups'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              My Groups ({myGroups.length})
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'discover'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Discover Groups
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject === 'All' ? '' : subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            {activeTab === 'discover' && (
              <button
                onClick={handleCreateGroup}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200 whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </button>
            )}
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 rounded-full p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                    <p className="text-sm text-gray-400">{group.subject}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  group.isPublic ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                }`}>
                  {group.isPublic ? 'Public' : 'Private'}
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{group.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{group.members}/{group.maxMembers} members</span>
                <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex space-x-2">
                {activeTab === 'my-groups' ? (
                  <>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Discuss
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200">
                      <Calendar className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={group.members >= group.maxMembers}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {group.members >= group.maxMembers ? 'Full' : 'Join Group'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              {activeTab === 'my-groups' ? 'No study groups yet' : 'No groups found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'my-groups'
                ? 'Join or create your first study group to start collaborating with peers.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {activeTab === 'my-groups' && (
              <button
                onClick={() => setActiveTab('discover')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Discover Groups
              </button>
            )}
          </div>
        )}

        {/* Create Group Modal/Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Create Study Group</h3>
              <p className="text-gray-400 text-sm mb-6">
                This feature would allow creating new study groups with form fields for name, description, subject, privacy settings, etc.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    alert('Create group functionality would be implemented here');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
