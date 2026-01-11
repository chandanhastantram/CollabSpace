'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Operation } from '@/lib/ot-engine';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinDocument: (documentId: string, workspaceId: string) => void;
  leaveDocument: (documentId: string, workspaceId: string) => void;
  sendOperation: (documentId: string, operation: Operation) => void;
  updateCursor: (documentId: string, position: number, selection?: { start: number; end: number }) => void;
  joinWorkspace: (workspaceId: string) => void;
  leaveWorkspace: (workspaceId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinDocument: () => {},
  leaveDocument: () => {},
  sendOperation: () => {},
  updateCursor: () => {},
  joinWorkspace: () => {},
  leaveWorkspace: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
  userId: string;
  token: string;
}

export function SocketProvider({ children, userId, token }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    const newSocket = io(socketUrl, {
      auth: {
        token,
        userId,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [userId, token]);

  const joinDocument = useCallback(
    (documentId: string, workspaceId: string) => {
      if (socket) {
        socket.emit('document:join', { documentId, workspaceId });
      }
    },
    [socket]
  );

  const leaveDocument = useCallback(
    (documentId: string, workspaceId: string) => {
      if (socket) {
        socket.emit('document:leave', { documentId, workspaceId });
      }
    },
    [socket]
  );

  const sendOperation = useCallback(
    (documentId: string, operation: Operation) => {
      if (socket) {
        socket.emit('document:operation', { documentId, operation });
      }
    },
    [socket]
  );

  const updateCursor = useCallback(
    (documentId: string, position: number, selection?: { start: number; end: number }) => {
      if (socket) {
        socket.emit('cursor:update', { documentId, position, selection });
      }
    },
    [socket]
  );

  const joinWorkspace = useCallback(
    (workspaceId: string) => {
      if (socket) {
        socket.emit('workspace:join', { workspaceId });
      }
    },
    [socket]
  );

  const leaveWorkspace = useCallback(
    (workspaceId: string) => {
      if (socket) {
        socket.emit('workspace:leave', { workspaceId });
      }
    },
    [socket]
  );

  const value: SocketContextType = {
    socket,
    isConnected,
    joinDocument,
    leaveDocument,
    sendOperation,
    updateCursor,
    joinWorkspace,
    leaveWorkspace,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
