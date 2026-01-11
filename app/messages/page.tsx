"use client";

import { MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function MessagesPage() {
  const [message, setMessage] = useState('');

  return (
    <div className="h-screen bg-white flex">
      {/* Conversations List */}
      <div className="w-80 border-r-2 border-black">
        <div className="p-6 border-b-2 border-black">
          <h2 className="text-xl font-bold text-black">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b-2 border-black hover:bg-black hover:text-white cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-black rounded-full" />
                <div className="flex-1">
                  <p className="font-bold">User {i}</p>
                  <p className="text-sm opacity-70">Last message...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b-2 border-black">
          <h3 className="font-bold text-black">User 1</h3>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-4 rounded-lg ${i % 2 === 0 ? 'bg-black text-white' : 'border-2 border-black'}`}>
                  <p>This is a message {i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t-2 border-black">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Button className="bg-black text-white hover:bg-gray-800">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
