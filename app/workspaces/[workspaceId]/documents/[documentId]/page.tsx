"use client";

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { usePresence } from '@/hooks/usePresence';
import { CollaborativeEditor } from '@/components/editor/CollaborativeEditor';
import { PresenceBar } from '@/components/editor/PresenceBar';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function DocumentEditorPage({
  params,
}: {
  params: { workspaceId: string; documentId: string };
}) {
  const { user, loading: authLoading } = useRequireAuth();
  const [document, setDocument] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Presence tracking
  const { users } = usePresence(params.documentId, user);

  useEffect(() => {
    if (user) {
      fetchDocument();
    }
  }, [user, params.documentId]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${params.documentId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setDocument(data.document);
        setTitle(data.document.title);
      }
    } catch (error) {
      console.error('Failed to fetch document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (content: string) => {
    try {
      await fetch(`/api/documents/${params.documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to save content:', error);
      throw error;
    }
  };

  const handleSaveTitle = async () => {
    if (!title.trim()) return;

    setSaving(true);
    try {
      await fetch(`/api/documents/${params.documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to save title:', error);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <Loading fullScreen text="Loading document..." />;
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Document not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <Link
                href={`/workspaces/${params.workspaceId}/documents`}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitle}
                className="text-xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-white flex-1 max-w-md"
                placeholder="Untitled Document"
              />
              {saving && (
                <span className="text-sm text-gray-500">Saving...</span>
              )}
            </div>

            {/* Presence Bar */}
            <PresenceBar users={users} currentUserId={user?.id} />
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <CollaborativeEditor
          documentId={params.documentId}
          initialContent={document.content}
          onSave={handleSaveContent}
        />
      </main>
    </div>
  );
}
