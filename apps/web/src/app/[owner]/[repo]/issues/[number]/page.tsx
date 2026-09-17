'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RepoHeader } from '@/components/RepoHeader';
import { 
  AlertCircle, 
  CheckCircle, 
  MessageSquare, 
  Send, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { fetchIssue, fetchIssueComments, addIssueComment, updateIssue } from '@/lib/api';

export default function IssueDetailPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;
  const numberStr = params.number as string;
  const issueNumber = parseInt(numberStr, 10);

  const [issue, setIssue] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!owner || !repo || !issueNumber) return;

    fetchIssue(owner, repo, issueNumber)
      .then(setIssue)
      .catch(() => {
        setIssue({
          number: issueNumber,
          title: 'Enhance git-receive-pack post-receive hook performance',
          description: 'Optimize post-receive trigger execution using asynchronous background worker queue.',
          author: 'demo-dev',
          status: 'open',
          labels: ['enhancement', 'performance', 'git-engine'],
          createdAt: new Date().toISOString()
        });
      });

    fetchIssueComments(owner, repo, issueNumber)
      .then(setComments)
      .catch(() => {
        setComments([
          {
            _id: 'c1',
            author: 'demo-dev',
            body: 'Investigating async Bull queue integration with Redis fallback for instant push acknowledgement.',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
      });
  }, [owner, repo, issueNumber]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await addIssueComment(owner, repo, issueNumber, commentText);
      setComments(prev => [...prev, res]);
      setCommentText('');
    } catch {
      setComments(prev => [
        ...prev,
        {
          _id: 'c_' + Date.now(),
          author: 'demo-dev',
          body: commentText,
          createdAt: new Date().toISOString()
        }
      ]);
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async () => {
    const nextStatus = issue?.status === 'open' ? 'closed' : 'open';
    try {
      await updateIssue(owner, repo, issueNumber, { status: nextStatus });
      setIssue((prev: any) => ({ ...prev, status: nextStatus }));
    } catch {
      setIssue((prev: any) => ({ ...prev, status: nextStatus }));
    }
  };

  return (
    <div className="min-h-screen bg-[#050806] flex flex-col">
      <Navbar />
      <RepoHeader owner={owner} repo={repo} activeTab="issues" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        <a
          href={`/${owner}/${repo}/issues`}
          className="inline-flex items-center gap-1 text-xs text-[#91a897] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to issues list</span>
        </a>

        {/* Issue Header */}
        <div className="space-y-2 pb-4 border-b border-[rgba(16,185,129,0.15)]">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span>{issue?.title}</span>
            <span className="text-[#91a897] font-normal font-mono">#{issueNumber}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {issue?.status === 'open' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Closed
              </span>
            )}

            <span className="text-[#91a897]">
              <strong className="text-white">{issue?.author}</strong> opened this issue on {new Date(issue?.createdAt || Date.now()).toLocaleDateString()} • {comments.length} comments
            </span>
          </div>
        </div>

        {/* Issue Body */}
        <div className="border border-[rgba(16,185,129,0.15)] rounded-xl overflow-hidden bg-[#080d0a]">
          <div className="p-3 bg-[#1c2128] border-b border-[rgba(16,185,129,0.15)] text-xs text-[#91a897] flex items-center justify-between">
            <span className="font-semibold text-white">{issue?.author} commented</span>
            <span>{new Date(issue?.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
          <div className="p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {issue?.description}
          </div>
        </div>

        {/* Comments Thread */}
        <div className="space-y-4">
          {comments.map((c, idx) => (
            <div key={idx} className="border border-[rgba(16,185,129,0.15)] rounded-xl overflow-hidden bg-[#080d0a]">
              <div className="p-3 bg-[#1c2128] border-b border-[rgba(16,185,129,0.15)] text-xs text-[#91a897] flex items-center justify-between">
                <span className="font-semibold text-white">{c.author}</span>
                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="p-4 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {c.body}
              </div>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        <form onSubmit={handleAddComment} className="border border-[rgba(16,185,129,0.15)] rounded-xl bg-[#080d0a] p-4 space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Leave a comment on this issue..."
            rows={4}
            className="w-full p-3 bg-[#050806] border border-[rgba(16,185,129,0.15)] rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={toggleStatus}
              className="px-4 py-1.5 bg-[#0c120e] hover:bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.15)] text-xs font-semibold text-slate-200 rounded-lg transition-colors"
            >
              {issue?.status === 'open' ? 'Close issue' : 'Reopen issue'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
