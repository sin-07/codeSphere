import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeSphere - The AI-Native Git Platform',
  description: 'Production-grade GitHub alternative with real Git hosting, AI repository brain, browser IDE, CI/CD, and developer intelligence.',
};

import { CyberMatrixGrid } from '@/components/animations';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#000000] text-[#f0faf0] antialiased selection:bg-[#00ff66]/20 selection:text-[#00ff66]">
        <CyberMatrixGrid />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
