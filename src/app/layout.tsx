import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "BBIE - Business Registry",
  description: "Bharat Business Intelligence Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#020205] text-slate-200 min-h-screen flex selection:bg-indigo-500/30">
        {/* Ambient Background Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 cyber-gradient opacity-40" />
          <div className="absolute inset-0 data-grid opacity-20" />
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[100px] rounded-full animate-pulse" />
        </div>

        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
