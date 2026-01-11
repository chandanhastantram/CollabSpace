"use client";

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface PresenceUser {
  userId: string;
  userName: string;
  avatar?: string;
  status: 'active' | 'idle' | 'away';
  color: string;
}

export function usePresence(documentId: string, currentUser: any) {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    // Connect to Socket.io
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      withCredentials: true,
    });

    setSocket(socketInstance);

    // Generate user color
    const userColor = generateUserColor(currentUser.id);

    // Join document room
    socketInstance.emit('presence:join', {
      documentId,
      userId: currentUser.id,
      userName: currentUser.name,
      avatar: currentUser.avatar,
      color: userColor,
    });

    // Listen for presence updates
    socketInstance.on('presence:update', (presenceUsers: PresenceUser[]) => {
      setUsers(presenceUsers);
    });

    socketInstance.on('presence:user-joined', (user: PresenceUser) => {
      setUsers((prev) => [...prev.filter((u) => u.userId !== user.userId), user]);
    });

    socketInstance.on('presence:user-left', (userId: string) => {
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    });

    // Heartbeat to maintain presence
    const heartbeat = setInterval(() => {
      socketInstance.emit('presence:heartbeat', {
        documentId,
        userId: currentUser.id,
      });
    }, 30000); // Every 30 seconds

    // Cleanup
    return () => {
      clearInterval(heartbeat);
      socketInstance.emit('presence:leave', {
        documentId,
        userId: currentUser.id,
      });
      socketInstance.disconnect();
    };
  }, [documentId, currentUser]);

  return { users, socket };
}

// Generate a consistent color for a user based on their ID
function generateUserColor(userId: string): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
