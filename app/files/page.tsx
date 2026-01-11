"use client";

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { FolderOpen, File, Download } from 'lucide-react';

export default function FilesPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Files</h1>
        <p className="text-gray-400 mb-8">Browse and manage your files</p>

        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="relative">
              <div className="relative rounded-lg border border-white/20 p-1">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                <div className="relative p-6 bg-black rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <File className="w-12 h-12 mb-3 text-white" />
                  <h3 className="font-bold mb-1 text-white">File {i}.pdf</h3>
                  <p className="text-sm text-gray-400">2.5 MB</p>
                  <Download className="w-4 h-4 mt-3 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
