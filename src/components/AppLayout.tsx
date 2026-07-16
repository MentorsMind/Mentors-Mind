import { Sidebar, BottomNav } from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans antialiased overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-primary font-bold">
        Skip to main content
      </a>
      {/* Desktop Sidebar */}
      <div className="z-50">
          <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto pb-24 md:pb-0" tabIndex={-1}>
          {children}
        </main>
        
        {/* Mobile Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
}
