import React from 'react';
import { Sidebar, BottomNav } from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans antialiased overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className="z-50">
          <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <main className="flex-1 w-full max-w-7xl mx-auto pb-24 md:pb-0">
          {children}
        </main>
        
        {/* Mobile Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
}
