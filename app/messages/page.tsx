"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { FloatingShapes, Sticker, BrutalistCard, BrutalistButton } from '@/components/ui/RetroElements';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Hash,
  Circle,
  ArrowLeft,
  Zap
} from 'lucide-react';

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  const workspaceId = searchParams.get('workspace') || 'demo-workspace';
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!messageInput.trim()) return;
    
    const success = await sendMessage(messageInput);
    if (success) {
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="retro-loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] dark:bg-[#0a0a0a] grid-pattern relative overflow-hidden flex">
      <FloatingShapes />

      {/* Sidebar */}
      <div className="relative z-10 w-72 border-r-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-4 hidden md:flex flex-col">
        {/* Back Button */}
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 mb-6 text-black dark:text-white hover:text-[#FF6B35] transition font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#FFE500] border-3 border-black flex items-center justify-center" style={{ borderWidth: '3px' }}>
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="font-black text-black dark:text-white">Messages</span>
        </div>

        {/* Channels */}
        <div className="mb-8">
          <Sticker variant="yellow" className="mb-4">Channels</Sticker>
          <BrutalistCard variant="yellow" className="p-3 flex items-center gap-2">
            <Hash className="w-4 h-4 text-black" />
            <span className="font-bold text-black">general</span>
          </BrutalistCard>
        </div>

        {/* Online Members */}
        <div className="flex-1">
          <Sticker variant="mint" className="mb-4">Online — {onlineMembers.length}</Sticker>
          <div className="space-y-2">
            {onlineMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-2 border-2 border-black bg-white dark:bg-[#1a1a1a]">
                <div className="relative">
                  <div className="w-8 h-8 bg-[#FFE500] border-2 border-black flex items-center justify-center font-bold text-black">
                    {member.info.name?.charAt(0) || '?'}
                  </div>
                  <Circle className="w-3 h-3 text-[#00D9A5] fill-[#00D9A5] absolute -bottom-0.5 -right-0.5" />
                </div>
                <span className="text-black dark:text-white text-sm font-medium truncate">{member.info.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-4 p-3 border-2 border-black bg-white dark:bg-[#1a1a1a]">
          <div className="flex items-center gap-2 text-sm">
            <Circle className={`w-3 h-3 ${isConnected ? 'text-[#00D9A5] fill-[#00D9A5]' : 'text-[#FF6B35] fill-[#FF6B35]'}`} />
            <span className="font-bold text-black dark:text-white">{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFE500] border-3 border-black flex items-center justify-center" style={{ borderWidth: '3px' }}>
              <MessageSquare className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black text-black dark:text-white"># general</h1>
              <p className="text-sm text-black/60 dark:text-white/60">Team communication</p>
            </div>
          </div>
          <Sticker variant="orange">{onlineMembers.length} online</Sticker>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FFF8E7] dark:bg-[#0a0a0a]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <BrutalistCard variant="white" className="p-8 text-center">
                <MessageSquare className="w-16 h-16 text-black/30 mx-auto mb-4" />
                <p className="font-bold text-black text-lg">No messages yet</p>
                <p className="text-black/60">Start the conversation!</p>
              </BrutalistCard>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.senderId === user?.id ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0 w-10 h-10 bg-[#FFE500] border-3 border-black flex items-center justify-center font-bold text-black" style={{ borderWidth: '3px' }}>
                  {message.senderName?.charAt(0) || '?'}
                </div>

                {/* Message */}
                <BrutalistCard 
                  variant={message.senderId === user?.id ? 'yellow' : 'white'}
                  hover={false}
                  className={`max-w-[70%] p-3 ${message.senderId === user?.id ? 'transform -rotate-1' : 'transform rotate-1'}`}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-black text-sm">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-black/50">
                      {new Date(message.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-black text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </BrutalistCard>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="px-6 py-2 text-sm text-black/60 dark:text-white/60 font-medium">
            <Sticker variant="mint" className="text-xs">
              {typingUsers.map(u => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </Sticker>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="brutalist-input flex-1"
            />
            <BrutalistButton 
              onClick={handleSend}
              disabled={!messageInput.trim()}
              variant="orange"
              className="p-3"
            >
              <Send className="w-5 h-5" />
            </BrutalistButton>
          </div>
        </div>
      </div>
    </div>
  );
}
