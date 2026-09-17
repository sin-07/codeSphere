'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { 
  Bell, 
  Check, 
  GitPullRequest, 
  PlayCircle, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications()
      .then(res => {
        if (res?.notifications) {
          setNotifications(res.notifications);
          setUnreadCount(res.unreadCount || 0);
        }
      })
      .catch(() => {
        setNotifications([
          {
            _id: 'n1',
            type: 'pr_review',
            actor: 'demo-dev',
            title: 'Review submitted on PR #1',
            message: 'demo-dev approved your pull request: Integrate AI Repository Brain AST Service',
            link: '/demo-dev/codesphere-core/pull/1',
            read: false,
            createdAt: new Date(Date.now() - 1800000).toISOString()
          },
          {
            _id: 'n2',
            type: 'ci_completed',
            actor: 'CodeSphere CI',
            title: 'Workflow Run Passed',
            message: 'Build & Quality Gate completed successfully in 16s for main branch.',
            link: '/demo-dev/codesphere-core/actions',
            read: false,
            createdAt: new Date(Date.now() - 7200000).toISOString()
          }
        ]);
        setUnreadCount(2);
      });
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="min-h-screen bg-[#050806] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#080d0a] border border-[rgba(16,185,129,0.15)] flex items-center justify-center text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Notifications</h1>
              <p className="text-xs text-[#91a897]">
                Real-time updates on pull requests, code reviews, and CI/CD pipelines.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0c120e] hover:bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.15)] text-xs font-semibold text-white rounded-lg transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="border border-[rgba(16,185,129,0.15)] rounded-2xl overflow-hidden bg-[#080d0a] divide-y divide-[#0c120e]">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-[#91a897] text-sm">
              All caught up! No new notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  !n.read ? 'bg-[#1c2128]/80' : 'hover:bg-[#0c120e]/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  {!n.read ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-transparent mt-2 shrink-0" />
                  )}

                  <div className="space-y-1">
                    <a
                      href={n.link}
                      onClick={() => handleMarkRead(n._id)}
                      className="font-semibold text-white hover:text-emerald-400 text-sm flex items-center gap-1.5"
                    >
                      <span>{n.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#91a897]" />
                    </a>
                    <p className="text-xs text-[#91a897]">{n.message}</p>
                    <span className="text-[10px] text-[#484f58] block">
                      {new Date(n.createdAt).toLocaleTimeString()} • {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="text-xs text-[#91a897] hover:text-white p-1"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
