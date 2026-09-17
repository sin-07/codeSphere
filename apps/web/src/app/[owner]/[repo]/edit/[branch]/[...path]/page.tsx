'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { BrowserIDE } from '@/components/BrowserIDE';
import { fetchBlob } from '@/lib/api';

export default function WebIDEPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  const branch = params.branch as string;
  const pathParts = params.path as string[];
  const filePath = Array.isArray(pathParts) ? pathParts.join('/') : (pathParts || 'README.md');

  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner || !repo || !branch) return;

    fetchBlob(owner, repo, branch, filePath)
      .then(blob => setContent(blob.content))
      .catch(() => {
        setContent('// CodeSphere Browser IDE\nexport function example() {\n  return "Ready to collaborate";\n}\n');
      })
      .finally(() => setLoading(false));
  }, [owner, repo, branch, filePath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050806] flex items-center justify-center text-[#91a897] font-mono text-sm">
        Initializing CodeSphere Browser IDE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050806] flex flex-col overflow-hidden">
      <Navbar />
      <BrowserIDE
        owner={owner}
        repo={repo}
        initialBranch={branch}
        initialPath={filePath}
        initialContent={content || ''}
      />
    </div>
  );
}
