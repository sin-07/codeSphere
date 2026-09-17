import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeSphere - The AI-Native Git Platform',
  description: 'Production-grade GitHub alternative with real Git hosting, AI repository brain, browser IDE, CI/CD, and developer intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0d1117] text-[#f0f6fc] antialiased">
        {children}
      </body>
    </html>
  );
}
