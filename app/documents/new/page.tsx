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
    // Save logic here
    router.push('/documents');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/documents" className="flex items-center text-black hover:opacity-70">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
          <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800">
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
          className="w-full text-4xl font-bold border-none outline-none mb-6 text-black placeholder-gray-400"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full min-h-[500px] text-lg border-none outline-none resize-none text-black placeholder-gray-400"
        />
      </div>
    </div>
  );
}
