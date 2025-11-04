'use client';

import { useState } from 'react';
import Sidebar from './sidebar';
import MobileBottomNav from './mobile-bottom-nav';
import NativeAppBar from './native-app-bar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile App Bar */}
      <NativeAppBar
        showMenu={true}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-col bg-gray-800">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="flex-1 pb-20 md:pb-0">
          <div className="pt-16 md:pt-0">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
