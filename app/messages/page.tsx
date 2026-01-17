"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/loading';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Hash,
  Circle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  const workspaceId = searchParams.get('workspace') || 'demo-workspace';
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    typingUsers,
    onlineMembers,
    isConnected,
    isLoading,
    sendMessage,
    handleTyping,
  } = useRealtimeChat({
    workspaceId,
    channelId: 'general',
    userId: user?.id || '',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message
  const handleSend = async () => {
    if (!messageInput.trim()) return;
    
    const success = await sendMessage(messageInput);
    if (success) {
      setMessageInput('');
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar - Online Members */}
      <div className="w-64 border-r border-white/10 p-4 hidden md:block">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="flex items-center text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
          <Hash className="w-4 h-4 mr-2" />
          Channels
        </h3>
        <div className="space-y-1 mb-6">
          <div className="px-3 py-2 bg-white/10 rounded-lg text-white">
            # general
          </div>
        </div>

        <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Online — {onlineMembers.length}
        </h3>
        <div className="space-y-2">
          {onlineMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-2 px-2 py-1">
              <div className="relative">
                {member.info.avatar ? (
                  <img 
                    src={member.info.avatar} 
                    alt={member.info.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {member.info.name?.charAt(0) || '?'}
                  </div>
                )}
                <Circle className="w-3 h-3 text-green-500 fill-green-500 absolute -bottom-0.5 -right-0.5" />
              </div>
              <span className="text-gray-300 text-sm truncate">{member.info.name}</span>
            </div>
          ))}
        </div>

        {/* Connection status */}
        <div className="mt-6 text-xs text-gray-500 flex items-center">
          <Circle className={`w-2 h-2 mr-2 ${isConnected ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500'}`} />
          {isConnected ? 'Connected' : 'Connecting...'}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 text-indigo-400 mr-2" />
            <h1 className="text-lg font-semibold text-white"># general</h1>
          </div>
          <div className="text-sm text-gray-400">
            {onlineMembers.length} online
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.senderId === user?.id ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {message.senderAvatar ? (
                    <img 
                      src={message.senderAvatar} 
                      alt={message.senderName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {message.senderName?.charAt(0) || '?'}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className={`max-w-[70%] ${message.senderId === user?.id ? 'text-right' : ''}`}>
                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className="text-sm font-medium text-white">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className={`relative rounded-2xl p-3 ${
                    message.senderId === user?.id 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-white/10 text-gray-100 rounded-tl-sm'
                  }`}>
                    <GlowingEffect 
                      spread={30} 
                      glow={message.senderId === user?.id}
                      disabled={message.senderId !== user?.id}
                    />
                    <p className="relative z-10 text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="px-4 py-2 text-sm text-gray-400">
            {typingUsers.map(u => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Button 
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
