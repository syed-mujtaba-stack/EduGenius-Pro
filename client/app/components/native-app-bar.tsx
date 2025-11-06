'use client';

import { GraduationCap, Menu } from 'lucide-react';
import LanguageSwitcher from './language-switcher';

interface NativeAppBarProps {
  title?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export default function NativeAppBar({
  title = "EduGenius Pro",
  showMenu = true,
  onMenuClick
}: NativeAppBarProps) {
  return (
    <div className="md:hidden sticky top-0 z-40 bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {showMenu && onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
        )}
        <GraduationCap className="h-6 w-6 text-blue-400" />
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <LanguageSwitcher />
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-sm font-medium">S</span>
        </div>
      </div>
    </div>
  );
}
