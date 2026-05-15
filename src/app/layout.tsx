import type { Metadata } from "next";
import "./globals.css";
import { AppWrapper } from "@/components/layout/AppWrapper";

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
      <body className="bg-[#020205] text-slate-200 min-h-screen flex selection:bg-orange-500/30">

        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
