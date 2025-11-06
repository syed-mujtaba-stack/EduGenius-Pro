'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  Filter,
  BookOpen,
  Brain,
  TrendingUp,
  Star,
  ArrowRight,
  Share2,
  Heart,
  MessageSquare,
  CheckCircle,
  Eye
} from 'lucide-react';
import Navbar from '@/components/Navbar';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  featured: boolean;
  image: string;
}

// Sample blog posts with educational content
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Education: Transforming Learning for the Digital Age',
    excerpt: 'Explore how artificial intelligence is revolutionizing education, from personalized learning paths to intelligent tutoring systems that adapt to every student\'s unique needs.',
    content: '',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: '👩‍🏫',
      role: 'Education Technology Researcher'
    },
    category: 'AI & Technology',
    tags: ['AI', 'Education', 'Technology', 'Future'],
    publishedAt: '2024-11-15',
    readTime: 8,
    views: 2450,
    likes: 89,
    featured: true,
    image: '/blogs/blog01.png'
  },
  {
    id: '2',
    title: '10 Study Techniques That Actually Work (Backed by Science)',
    excerpt: 'Evidence-based study methods that can improve retention by up to 300%. From spaced repetition to active recall, discover the techniques that top students swear by.',
    content: '',
    author: {
      name: 'Dr. Michael Rodriguez',
      avatar: '👨‍🎓',
      role: 'Learning Science Expert'
    },
    category: 'Study Tips',
    tags: ['Study Methods', 'Science', 'Memory', 'Learning', 'Spaced Repetition', 'Active Recall'],
    publishedAt: '2024-11-12',
    readTime: 6,
    views: 1890,
    likes: 156,
    featured: true,
    image: '/blogs/blog02.png'
  },
  {
    id: '3',
    title: 'How EduGenius Pro\'s AI Tutor Revolutionized My Math Learning',
    excerpt: 'A student\'s personal journey from struggling with algebra to acing calculus, powered by personalized AI tutoring that adapts in real-time.',
    content: '',
    author: {
      name: 'Alex Thompson',
      avatar: '🎓',
      role: 'High School Student'
    },
    category: 'Student Stories',
    tags: ['Success Story', 'Mathematics', 'Personal Growth'],
    publishedAt: '2024-11-10',
    readTime: 5,
    views: 1234,
    likes: 67,
    featured: false,
    image: '/blogs/blog03.png'
  },
  {
    id: '4',
    title: 'Building Better Classrooms: A Teacher\'s Guide to AI Integration',
    excerpt: 'Practical strategies for educators looking to incorporate AI tools into their teaching practice, with real-world examples and implementation tips.',
    content: '',
    author: {
      name: 'Prof. Jennifer Liu',
      avatar: '👩‍🏫',
      role: 'Educational Technology Consultant'
    },
    category: 'Teaching',
    tags: ['Classroom', 'Teaching', 'AI Integration', 'Professional Development'],
    publishedAt: '2024-11-08',
    readTime: 7,
    views: 987,
    likes: 43,
    featured: false,
    image: '/blogs/blog04.png'
  },
  {
    id: '5',
    title: 'The Science of Motivation: How to Stay Focused in a Distracted World',
    excerpt: 'Understanding the psychology behind motivation and practical techniques to maintain focus in our increasingly distracted digital environment.',
    content: '',
    author: {
      name: 'Dr. Emma Watson',
      avatar: '🧠',
      role: 'Educational Psychologist'
    },
    category: 'Motivation',
    tags: ['Psychology', 'Motivation', 'Focus', 'Productivity'],
    publishedAt: '2024-11-05',
    readTime: 6,
    views: 1654,
    likes: 92,
    featured: false,
    image: '/blogs/blog05.png'
  },
  {
    id: '6',
    title: 'Coding for Beginners: Why AI Makes Learning to Code Easier Than Ever',
    excerpt: 'How artificial intelligence is breaking down barriers to learning programming, making coding accessible to students of all backgrounds and skill levels.',
    content: '',
    author: {
      name: 'Marcus Chen',
      avatar: '👨‍💻',
      role: 'Software Engineer & Educator'
    },
    category: 'Technology',
    tags: ['Coding', 'Programming', 'AI', 'STEM Education'],
    publishedAt: '2024-11-03',
    readTime: 5,
    views: 2134,
    likes: 78,
    featured: false,
    image: '/blogs/blog06.png'
  }
];

const categories = [
  'All Posts',
  'AI & Technology',
  'Study Tips',
  'Student Stories',
  'Teaching',
  'Motivation',
  'Technology'
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  // Filter posts based on category and search
  const filterPosts = (category: string, query: string) => {
    let filtered = blogPosts;

    if (category !== 'All Posts') {
      filtered = filtered.filter(post => post.category === category);
    }

    if (query.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterPosts(category, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    filterPosts(selectedCategory, query);
  };

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <BookOpen className="h-4 w-4 mr-2" />
            EduGenius Pro Blog
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Insights & Inspiration for
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Modern Learning
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the latest trends in AI-powered education, proven study techniques,
            success stories, and expert insights to enhance your learning journey.
          </p>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime} min read
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{post.author.avatar}</span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{post.author.name}</p>
                          <p className="text-gray-500 text-xs">{post.author.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'All Posts' ? 'Latest Articles' : selectedCategory}
            </h2>
            <span className="text-gray-500 text-sm">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{post.author.avatar}</span>
                        <span className="text-gray-700 font-medium">{post.author.name}</span>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readTime}m
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {post.views}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/blog/${post.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Learning Insights
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Get the latest articles, study tips, and AI education insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">EduGenius Pro</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering education through AI innovation, real-time collaboration,
                and personalized learning experiences.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-gray-400">
                  <Heart className="h-4 w-4 mr-1 text-red-500" />
                  Made with love for learners worldwide
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Blog Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog?category=ai-technology" className="hover:text-white transition-colors">AI & Technology</Link></li>
                <li><Link href="/blog?category=study-tips" className="hover:text-white transition-colors">Study Tips</Link></li>
                <li><Link href="/blog?category=teaching" className="hover:text-white transition-colors">Teaching</Link></li>
                <li><Link href="/blog?category=student-stories" className="hover:text-white transition-colors">Student Stories</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduGenius Pro. All rights reserved. Empowering education through AI innovation.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
