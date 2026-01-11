"use client";

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Users, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function WorkspacesPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Workspaces</h1>
            <p className="text-gray-400 mt-1">Collaborate with your team</p>
          </div>
          <Link href="/workspaces/new">
            <Button className="bg-white text-black hover:bg-gray-200">
              <Plus className="w-4 h-4 mr-2" />
              New Workspace
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative">
              <div className="relative rounded-lg border border-white/20 p-1">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                <div className="relative p-6 bg-black rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-white" />
                    <Settings className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Workspace {i}</h3>
                  <p className="text-sm text-gray-400 mb-4">5 members • 12 documents</p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="w-8 h-8 rounded-full bg-white/20 border-2 border-black" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
