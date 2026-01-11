"use client";

import { useRouter } from 'next/navigation';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Documents</h1>
            <p className="text-gray-400 mt-1">Manage your documents and files</p>
          </div>
          <Link href="/documents/new">
            <Button className="bg-white text-black hover:bg-gray-200">
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative">
              <div className="relative rounded-lg border border-white/20 p-1">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                <div className="relative p-6 bg-black rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <FileText className="w-8 h-8 mb-3 text-white" />
                  <h3 className="font-bold mb-1 text-white">Document {i}</h3>
                  <p className="text-sm text-gray-400">Last edited 2 hours ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
