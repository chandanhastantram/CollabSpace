"use client";

import { FolderOpen, File, Download } from 'lucide-react';

export default function FilesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-black mb-2">My Files</h1>
        <p className="text-gray-600 mb-8">Browse and manage your files</p>

        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="border-2 border-black rounded-lg p-6 hover:bg-black hover:text-white transition-colors cursor-pointer group">
              <File className="w-12 h-12 mb-3" />
              <h3 className="font-bold mb-1">File {i}.pdf</h3>
              <p className="text-sm opacity-70">2.5 MB</p>
              <Download className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
