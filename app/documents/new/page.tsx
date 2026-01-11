"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function NewDocumentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    router.push('/documents');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-white/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/documents" className="flex items-center text-white hover:text-gray-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
          <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-200">
            <Save className="w-4 h-4 mr-2" />
            Save Document
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Document"
          className="w-full text-4xl font-bold bg-transparent border-none outline-none mb-6 text-white placeholder-gray-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full min-h-[500px] text-lg bg-transparent border-none outline-none resize-none text-white placeholder-gray-500"
        />
      </div>
    </div>
  );
}
