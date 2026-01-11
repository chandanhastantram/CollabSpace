"use client";

import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black">Notifications</h1>
          <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white">
            Mark all as read
          </Button>
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-2 border-black rounded-lg p-4 hover:bg-black hover:text-white transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Bell className="w-5 h-5 mt-1" />
                  <div>
                    <p className="font-bold">New notification {i}</p>
                    <p className="text-sm opacity-70 mt-1">Someone mentioned you in a document</p>
                    <p className="text-xs opacity-50 mt-2">2 hours ago</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:opacity-70">
                    <Check className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:opacity-70">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
