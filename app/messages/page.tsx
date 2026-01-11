"use client";

import { MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function MessagesPage() {
  const [message, setMessage] = useState('');

  return (
    <div className="h-screen bg-black flex">
      {/* Conversations List */}
      <div className="w-80 border-r border-white/20">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-white/20 hover:bg-white/5 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full" />
                <div className="flex-1">
                  <p className="font-bold text-white">User {i}</p>
                  <p className="text-sm text-gray-400">Last message...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-white/20">
          <h3 className="font-bold text-white">User 1</h3>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-4 rounded-lg ${i % 2 === 0 ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                  <p>This is a message {i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-white/20">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button className="bg-white text-black hover:bg-gray-200">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
