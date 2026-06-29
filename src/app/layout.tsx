import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AG Quota Manager",
  description: "Local-first dashboard for managing Google accounts quota",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0f111a] text-zinc-300 h-screen overflow-hidden flex relative font-sans`}>
        {/* Subdued ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#1a233a] rounded-full blur-[150px] mix-blend-screen opacity-20"></div>
        </div>
        
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}
