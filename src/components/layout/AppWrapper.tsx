'use client'

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { clsx } from 'clsx';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Define pages that should NOT have a sidebar or header (Full-screen presentation mode)
  const fullScreenRoutes = ['/', '/how-it-works', '/api', '/api/docs', '/pin-auth'];
  const isLandingPage = fullScreenRoutes.includes(pathname);

  if (isLandingPage) {
    return (
      <div className="flex-1 min-h-screen relative z-10 w-full">
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen relative z-10 w-full md:w-[calc(100%-16rem)] overflow-x-hidden">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </>
  );
}
