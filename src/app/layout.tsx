import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Tempo — Apex, Your AI Coach for Student Athletes",
  description: "Plan your day in 15 minutes. AI-powered daily planner built for student athletes. Balance practice, homework, meals, and sleep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-display bg-void text-gray antialiased`}>{children}</body>
    </html>
  );
}
