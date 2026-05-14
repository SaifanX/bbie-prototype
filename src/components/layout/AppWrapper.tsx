'use client'

import { usePathname } from 'next/navigation';
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { clsx } from 'clsx';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define pages that should NOT have a sidebar or header (Full-screen presentation mode)
  const isLandingPage = pathname === '/' || pathname === '/gateway' || pathname === '/docs';

  if (isLandingPage) {
    return (
      <div className="flex-1 min-h-screen relative z-10">
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}
