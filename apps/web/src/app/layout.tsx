import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeSphere - The AI-Native Git Platform',
  description: 'Production-grade GitHub alternative with real Git hosting, AI repository brain, browser IDE, CI/CD, and developer intelligence.',
};

import { CyberMatrixGrid } from '@/components/animations/CyberMatrixGrid';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen text-[#f0f7f2] antialiased selection:bg-emerald-500/25 selection:text-emerald-200">
        <CyberMatrixGrid />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
