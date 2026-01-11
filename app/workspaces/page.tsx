"use client";

import { useRouter } from 'next/navigation';
import { Users, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function WorkspacesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Workspaces</h1>
            <p className="text-gray-600 mt-1">Collaborate with your team</p>
          </div>
          <Link href="/workspaces/new">
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              New Workspace
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-2 border-black rounded-lg p-6 hover:bg-black hover:text-white transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" />
                <Settings className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold mb-2">Workspace {i}</h3>
              <p className="text-sm opacity-70 mb-4">5 members • 12 documents</p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white group-hover:border-black" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
