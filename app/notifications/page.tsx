"use client";

import { Bell, Check, X } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Button } from '@/components/ui/Button';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Mark all as read
          </Button>
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="relative">
              <div className="relative rounded-lg border border-white/20 p-1">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                <div className="relative p-4 bg-black rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Bell className="w-5 h-5 mt-1 text-white" />
                      <div>
                        <p className="font-bold text-white">New notification {i}</p>
                        <p className="text-sm text-gray-400 mt-1">Someone mentioned you in a document</p>
                        <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-white hover:text-gray-300">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-white hover:text-gray-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
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
