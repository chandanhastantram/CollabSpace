"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Copy, Check, Download } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
}

export function ShareModal({ isOpen, onClose, documentId, documentTitle }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [permission, setPermission] = useState('view');
  const [expiresIn, setExpiresIn] = useState(7);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permission, expiresIn }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.shareUrl);
      }
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async (format: string) => {
    window.open(`/api/documents/${documentId}/export?format=${format}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Share Document
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Share Settings */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permission
            </label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="view">View only</option>
              <option value="edit">Can edit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expires in
            </label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={0}>Never</option>
            </select>
          </div>
        </div>

        {/* Share Link */}
        {shareUrl ? (
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
              <Button onClick={handleCopyLink} variant="outline">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleGenerateLink}
            disabled={loading}
            className="w-full mb-6 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
          >
            {loading ? 'Generating...' : 'Generate Share Link'}
          </Button>
        )}

        {/* Export Options */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Export Document
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handleExport('pdf')}
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </Button>
            <Button
              onClick={() => handleExport('docx')}
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>DOCX</span>
            </Button>
            <Button
              onClick={() => handleExport('md')}
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Markdown</span>
            </Button>
            <Button
              onClick={() => handleExport('html')}
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>HTML</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
