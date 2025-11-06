'use client';

import Link from 'next/link';
import {
  Brain,
  Users,
  Trophy,
  Zap,
  BookOpen,
  Target,
  Heart,
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Rocket,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  Clock,
  GraduationCap
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Syed Mujtaba Abbas",
      role: "Founder & Lead Developer",
      description: "Passionate about revolutionizing education through AI and technology",
      avatar: "👨‍💻",
      skills: ["Full-Stack Development", "AI Integration", "Education Technology"]
    },
    {
      name: "AI Assistant Team",
      role: "EduBot & AI Tutors",
      description: "Advanced AI systems providing personalized learning experiences",
      avatar: "🤖",
      skills: ["Natural Language Processing", "Adaptive Learning", "24/7 Support"]
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "EduGenius Pro launched with core AI tutoring features",
      icon: Rocket
    },
    {
      year: "2024",
      title: "10,000+ Students",
      description: "Reached milestone of 10,000 active learners worldwide",
      icon: Users
    },
    {
      year: "2024",
      title: "Real-Time Features",
      description: "Implemented live collaboration and notification systems",
      icon: Zap
    },
    {
      year: "2025",
      title: "Learning Agents",
      description: "Introduced specialized AI agents for targeted learning support",
      icon: Brain
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Accessibility",
      description: "Making quality education accessible to everyone, regardless of location or background"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly pushing the boundaries of educational technology with cutting-edge AI"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your data is protected with enterprise-grade security and privacy measures"
    },
    {
      icon: Target,
      title: "Personalization",
      description: "Every student gets a tailored learning experience that adapts to their needs"
    },
    {
      icon: Globe,
      title: "Inclusivity",
      description: "Supporting multiple languages and learning styles for diverse global learners"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering the highest quality educational experience possible"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Heart className="h-4 w-4 mr-2" />
            About EduGenius Pro
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Revolutionizing Education
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Through AI
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            EduGenius Pro is on a mission to democratize education by combining cutting-edge artificial intelligence
            with proven pedagogical methods. We believe every student deserves access to personalized, high-quality education
            that adapts to their unique learning style and pace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center shadow-lg"
            >
              Join Our Mission
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#mission"
              className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 flex items-center shadow-lg border border-gray-300"
            >
              Learn More
              <BookOpen className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the future of education, one AI-powered lesson at a time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Empowering Every Learner</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At EduGenius Pro, we believe that education should be personalized, accessible, and effective for everyone.
                Our platform uses advanced artificial intelligence to understand how each student learns best, providing
                tailored educational experiences that maximize understanding and retention.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Whether you're a student preparing for exams, a teacher looking to enhance classroom engagement, or
                a lifelong learner exploring new subjects, EduGenius Pro adapts to your needs and helps you achieve your goals.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <Target className="h-5 w-5 mr-2" />
                Making quality education accessible to all
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Personalized Learning</h4>
                    <p className="text-gray-600">AI adapts to your learning style and pace</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">24/7 Availability</h4>
                    <p className="text-gray-600">Learn anytime, anywhere with our AI tutors</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Proven Results</h4>
                    <p className="text-gray-600">98% student satisfaction and improved outcomes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How EduGenius Pro Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform makes learning intuitive, engaging, and effective
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Path</h3>
              <p className="text-gray-600 leading-relaxed">
                Select from our comprehensive library of subjects and topics. Whether you're studying for exams,
                exploring new interests, or enhancing your skills, we have content tailored to your goals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced AI analyzes your learning patterns and adapts content in real-time. Get personalized
                explanations, practice problems, and study recommendations that match your unique learning style.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Track & Succeed</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your progress with detailed analytics and insights. Celebrate achievements, identify areas
                for improvement, and stay motivated with our comprehensive learning dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at EduGenius Pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg w-fit mb-6">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate educators and technologists working together to transform learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="text-6xl mb-6">{member.avatar}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6 leading-relaxed">{member.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our mission to revolutionize education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <milestone.icon className="h-10 w-10 text-white" />
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h3>
                <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">EduGenius Pro by Numbers</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Our impact on education worldwide continues to grow
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">10,000+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Expert Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">50,000+</div>
              <div className="text-blue-100">AI Interactions</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Join the Education Revolution?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Be part of the future of learning. Join thousands of students and educators who are already
            experiencing the power of AI-powered education with EduGenius Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start Learning Today
            </Link>
            <Link
              href="/"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Talk to EduBot
            </Link>
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
                Revolutionizing education with AI-powered learning, real-time collaboration,
                and personalized educational experiences.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-gray-400">
                  <Heart className="h-4 w-4 mr-1 text-red-500" />
                  Made with love for learners worldwide
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
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
      `}</style>
    </div>
  );
}
