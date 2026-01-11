"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function NewWorkspacePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    router.push('/workspaces');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/workspaces" className="flex items-center text-white hover:text-gray-300 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Workspaces
        </Link>

        <div className="border border-white/20 rounded-lg p-8 bg-black">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-black" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-6">Create Workspace</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Workspace Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Team Workspace"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this workspace for?"
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              />
            </div>

            <Button onClick={handleCreate} className="w-full bg-white text-black hover:bg-gray-200 py-3">
              Create Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
