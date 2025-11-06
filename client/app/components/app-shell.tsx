'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth-context';
import Sidebar from './sidebar';
import MobileBottomNav from './mobile-bottom-nav';
import NativeAppBar from './native-app-bar';

// Dynamically import OfflineIndicator to prevent hydration mismatch
const OfflineIndicator = dynamic(() => import('./offline-indicator'), {
  ssr: false,
});

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show sidebar only for authenticated users (not on landing page)
  const showSidebar = !!user;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Offline Indicator - only renders on client */}
      <OfflineIndicator />

      {/* Mobile App Bar - only for authenticated users */}
      {showSidebar && (
        <NativeAppBar
          showMenu={true}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
      )}

      {/* Mobile sidebar overlay - only for authenticated users */}
      {showSidebar && mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-col bg-gray-800">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar - only for authenticated users */}
      {showSidebar && (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <Sidebar />
        </div>
      )}

      {/* Main content */}
      <div className={showSidebar ? "md:pl-64" : ""}>
        <main className="flex-1 pb-20 md:pb-0">
          <div className={showSidebar ? "pt-16 md:pt-0" : ""}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - only for authenticated users */}
      {showSidebar && <MobileBottomNav />}
    </div>
  );
}
