"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DocumentsPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Documents</h1>
            <p className="text-gray-600 mt-1">Manage your documents and files</p>
          </div>
          <Link href="/documents/new">
            <Button className="bg-black text-white hover:bg-gray-800">
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
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border-2 border-black rounded-lg p-6 hover:bg-black hover:text-white transition-colors cursor-pointer">
              <FileText className="w-8 h-8 mb-3" />
              <h3 className="font-bold mb-1">Document {i}</h3>
              <p className="text-sm opacity-70">Last edited 2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
