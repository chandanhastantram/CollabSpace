"use client";

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { DocumentCard } from '@/components/document/DocumentCard';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/Button';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Document {
  _id: string;
  title: string;
  workspace: string;
  lastEditedBy?: {
    name: string;
    avatar?: string;
  };
  updatedAt: Date;
}

export default function DocumentsPage({ params }: { params: { workspaceId: string } }) {
  const { user, loading: authLoading } = useRequireAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user, params.workspaceId]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents?workspaceId=${params.workspaceId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: params.workspaceId,
          title: 'Untitled Document',
          content: '',
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/workspaces/${params.workspaceId}/documents/${data.document._id}`);
      }
    } catch (error) {
      console.error('Failed to create document:', error);
    } finally {
      setCreating(false);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return <Loading fullScreen text="Loading documents..." />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/workspaces/${params.workspaceId}`}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Documents
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreateDocument}
              disabled={creating}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{creating ? 'Creating...' : 'New Document'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {search ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {search
                ? 'Try adjusting your search'
                : 'Create your first document to get started'}
            </p>
            {!search && (
              <Button
                onClick={handleCreateDocument}
                disabled={creating}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {creating ? 'Creating...' : 'Create Document'}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document._id}
                id={document._id}
                title={document.title}
                workspaceId={params.workspaceId}
                lastEditedBy={document.lastEditedBy}
                updatedAt={document.updatedAt}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
