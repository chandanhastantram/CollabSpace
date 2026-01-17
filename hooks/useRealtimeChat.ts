"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { getPusherClient } from '@/lib/pusher-client';
import { Channel, PresenceChannel } from 'pusher-js';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  channelId: string;
  createdAt: string;
}

interface PresenceMember {
  id: string;
  info: {
    name: string;
    email: string;
    avatar?: string;
  };
}

interface TypingUser {
  userId: string;
  userName: string;
  channelId: string;
}

interface UseRealtimeChatOptions {
  workspaceId: string;
  channelId?: string;
  userId: string;
}

export function useRealtimeChat({ workspaceId, channelId = 'general', userId }: UseRealtimeChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<PresenceMember[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const channelRef = useRef<PresenceChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load message history
  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/messages?workspaceId=${workspaceId}&channelId=${channelId}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, channelId]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, workspaceId, channelId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return true;
    } catch (error) {
      console.error('Send message error:', error);
      return false;
    }
  }, [workspaceId, channelId]);

  // Send typing indicator
  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    try {
      await fetch('/api/messages/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, channelId, isTyping }),
      });
    } catch (error) {
      console.error('Typing indicator error:', error);
    }
  }, [workspaceId, channelId]);

  // Handle typing with debounce
  const handleTyping = useCallback(() => {
    sendTypingIndicator(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 2000);
  }, [sendTypingIndicator]);

  // Subscribe to Pusher channel
  useEffect(() => {
    if (!workspaceId) return;

    const pusher = getPusherClient();
    const channelName = `presence-workspace-${workspaceId}`;
    
    const channel = pusher.subscribe(channelName) as PresenceChannel;
    channelRef.current = channel;

    // Connection events
    channel.bind('pusher:subscription_succeeded', (members: any) => {
      setIsConnected(true);
      const membersList: PresenceMember[] = [];
      members.each((member: any) => {
        membersList.push({ id: member.id, info: member.info });
      });
      setOnlineMembers(membersList);
    });

    channel.bind('pusher:member_added', (member: any) => {
      setOnlineMembers(prev => [...prev, { id: member.id, info: member.info }]);
    });

    channel.bind('pusher:member_removed', (member: any) => {
      setOnlineMembers(prev => prev.filter(m => m.id !== member.id));
    });

    // Message events
    channel.bind('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // Typing events
    channel.bind('typing', (data: TypingUser & { isTyping: boolean }) => {
      if (data.userId === userId) return;
      
      if (data.isTyping) {
        setTypingUsers(prev => {
          if (prev.some(u => u.userId === data.userId)) return prev;
          return [...prev, { userId: data.userId, userName: data.userName, channelId: data.channelId }];
        });
      } else {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      }
    });

    // Load initial messages
    loadMessages();

    // Cleanup
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      pusher.unsubscribe(channelName);
    };
  }, [workspaceId, userId, loadMessages]);

  return {
    messages,
    typingUsers: typingUsers.filter(u => u.channelId === channelId),
    onlineMembers,
    isConnected,
    isLoading,
    sendMessage,
    handleTyping,
  };
}
