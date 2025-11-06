import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Brain, BarChart3, TrendingUp, Settings, GraduationCap, User, Users, FileText, MessageCircle } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Summaries', href: '/summaries', icon: BookOpen },
  { name: 'Quizzes', href: '/quizzes', icon: Brain },
  { name: 'Progress', href: '/progress', icon: BarChart3 },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Files', href: '/files', icon: FileText },
  { name: 'Study Groups', href: '/study-groups', icon: MessageCircle },
  { name: 'Teacher', href: '/teacher', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Admin', href: '/admin', icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto w-64">
      <div className="flex items-center flex-shrink-0 px-4 mb-5">
        <GraduationCap className="h-8 w-8 text-blue-400 mr-3" />
        <span className="text-xl font-bold text-white">EduGenius Pro</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-white md:hidden"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:translate-x-1'
                }`}
              >
                <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
