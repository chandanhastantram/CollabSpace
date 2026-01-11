/**
 * Socket.io Server for Real-Time Collaboration
 * Handles document editing, presence, cursors, and notifications
 */

import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { DocumentState, Operation } from '../lib/ot-engine';
import RedisClient from '../lib/redis';

const PORT = process.env.SOCKET_PORT || 3001;

// Store active document sessions
const documentSessions = new Map<string, DocumentState>();
const userSockets = new Map<string, Set<string>>(); // userId -> Set of socketIds
const socketUsers = new Map<string, string>(); // socketId -> userId

// Create HTTP server
const httpServer = createServer();

// Create Socket.io server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const userId = socket.handshake.auth.userId;

    if (!token || !userId) {
      return next(new Error('Authentication required'));
    }

    // Verify token (implement your JWT verification here)
    // For now, we'll trust the userId from the client
    socket.data.userId = userId;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// Connection handler
io.on('connection', (socket) => {
  const userId = socket.data.userId;
  console.log(`✅ User ${userId} connected (${socket.id})`);

  // Track user socket
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId)!.add(socket.id);
  socketUsers.set(socket.id, userId);

  // ==================== DOCUMENT COLLABORATION ====================

  /**
   * Join a document editing session
   */
  socket.on('document:join', async (data: { documentId: string; workspaceId: string }) => {
    try {
      const { documentId, workspaceId } = data;
      const room = `document:${documentId}`;

      // Join the document room
      await socket.join(room);

      // Initialize document session if not exists
      if (!documentSessions.has(documentId)) {
        // Load document from database (simplified - you'd fetch from DB)
        documentSessions.set(documentId, new DocumentState('', 0));
      }

      const docState = documentSessions.get(documentId)!;

      // Send current document state to the joining user
      socket.emit('document:state', {
        documentId,
        content: docState.getContent(),
        version: docState.getVersion(),
      });

      // Get active users in this document
      const socketsInRoom = await io.in(room).fetchSockets();
      const activeUsers = Array.from(
        new Set(socketsInRoom.map(s => s.data.userId))
      );

      // Notify others that a new user joined
      socket.to(room).emit('presence:user-joined', {
        userId,
        documentId,
      });

      // Send active users list to the joining user
      socket.emit('presence:active-users', {
        documentId,
        users: activeUsers,
      });

      // Update Redis presence
      await RedisClient.setUserPresence(userId, workspaceId, 'online');

      console.log(`📄 User ${userId} joined document ${documentId}`);
    } catch (error) {
      console.error('Error joining document:', error);
      socket.emit('error', { message: 'Failed to join document' });
    }
  });

  /**
   * Leave a document editing session
   */
  socket.on('document:leave', async (data: { documentId: string; workspaceId: string }) => {
    try {
      const { documentId, workspaceId } = data;
      const room = `document:${documentId}`;

      await socket.leave(room);

      // Notify others that user left
      socket.to(room).emit('presence:user-left', {
        userId,
        documentId,
      });

      // Check if user has other sockets in the workspace
      const userSocketIds = userSockets.get(userId) || new Set();
      const hasOtherSockets = Array.from(userSocketIds).some(
        sid => sid !== socket.id && socketUsers.get(sid) === userId
      );

      if (!hasOtherSockets) {
        await RedisClient.setUserPresence(userId, workspaceId, 'offline');
      }

      console.log(`📄 User ${userId} left document ${documentId}`);
    } catch (error) {
      console.error('Error leaving document:', error);
    }
  });

  /**
   * Handle document operations (insert, delete)
   */
  socket.on('document:operation', async (data: {
    documentId: string;
    operation: Operation;
  }) => {
    try {
      const { documentId, operation } = data;
      const room = `document:${documentId}`;

      // Get document state
      const docState = documentSessions.get(documentId);
      if (!docState) {
        socket.emit('error', { message: 'Document session not found' });
        return;
      }

      // Apply operation
      const success = docState.applyOperation(operation);

      if (success) {
        // Broadcast operation to all other users in the room
        socket.to(room).emit('document:operation', {
          documentId,
          operation: {
            ...operation,
            version: docState.getVersion(),
          },
        });

        // Acknowledge to sender
        socket.emit('document:operation-ack', {
          documentId,
          version: docState.getVersion(),
          operationId: operation.timestamp,
        });

        // Auto-save to database every 10 operations (simplified)
        if (docState.getVersion() % 10 === 0) {
          // Save to database (implement your DB save logic)
          console.log(`💾 Auto-saving document ${documentId} at version ${docState.getVersion()}`);
        }
      } else {
        socket.emit('error', { message: 'Invalid operation' });
      }
    } catch (error) {
      console.error('Error handling operation:', error);
      socket.emit('error', { message: 'Failed to process operation' });
    }
  });

  /**
   * Handle cursor position updates
   */
  socket.on('cursor:update', (data: {
    documentId: string;
    position: number;
    selection?: { start: number; end: number };
  }) => {
    const { documentId, position, selection } = data;
    const room = `document:${documentId}`;

    // Broadcast cursor position to others
    socket.to(room).emit('cursor:position', {
      userId,
      documentId,
      position,
      selection,
    });
  });

  // ==================== PRESENCE & STATUS ====================

  /**
   * Update user presence
   */
  socket.on('presence:update', async (data: {
    workspaceId: string;
    status: 'online' | 'away' | 'busy';
  }) => {
    try {
      const { workspaceId, status } = data;

      // Update Redis
      await RedisClient.setUserPresence(
        userId,
        workspaceId,
        status === 'online' ? 'online' : 'offline'
      );

      // Broadcast to workspace
      io.to(`workspace:${workspaceId}`).emit('presence:update', {
        userId,
        status,
      });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  });

  /**
   * Join workspace for notifications
   */
  socket.on('workspace:join', async (data: { workspaceId: string }) => {
    const { workspaceId } = data;
    await socket.join(`workspace:${workspaceId}`);
    console.log(`🏢 User ${userId} joined workspace ${workspaceId}`);
  });

  /**
   * Leave workspace
   */
  socket.on('workspace:leave', async (data: { workspaceId: string }) => {
    const { workspaceId } = data;
    await socket.leave(`workspace:${workspaceId}`);
    console.log(`🏢 User ${userId} left workspace ${workspaceId}`);
  });

  // ==================== NOTIFICATIONS ====================

  /**
   * Send notification to specific users
   */
  socket.on('notification:send', (data: {
    targetUserIds: string[];
    notification: {
      type: string;
      title: string;
      message: string;
      data?: any;
    };
  }) => {
    const { targetUserIds, notification } = data;

    targetUserIds.forEach(targetUserId => {
      const targetSockets = userSockets.get(targetUserId);
      if (targetSockets) {
        targetSockets.forEach(socketId => {
          io.to(socketId).emit('notification:new', {
            ...notification,
            from: userId,
            timestamp: Date.now(),
          });
        });
      }
    });
  });

  // ==================== COMMENTS ====================

  /**
   * Add comment to document
   */
  socket.on('comment:add', (data: {
    documentId: string;
    comment: {
      content: string;
      position: number;
    };
  }) => {
    const { documentId, comment } = data;
    const room = `document:${documentId}`;

    // Broadcast new comment
    io.to(room).emit('comment:new', {
      documentId,
      comment: {
        ...comment,
        userId,
        timestamp: Date.now(),
      },
    });
  });

  // ==================== DISCONNECT ====================

  socket.on('disconnect', async () => {
    console.log(`❌ User ${userId} disconnected (${socket.id})`);

    // Remove socket tracking
    const userSocketSet = userSockets.get(userId);
    if (userSocketSet) {
      userSocketSet.delete(socket.id);
      if (userSocketSet.size === 0) {
        userSockets.delete(userId);
      }
    }
    socketUsers.delete(socket.id);

    // Get all rooms this socket was in
    const rooms = Array.from(socket.rooms);
    
    for (const room of rooms) {
      if (room.startsWith('document:')) {
        const documentId = room.replace('document:', '');
        socket.to(room).emit('presence:user-left', {
          userId,
          documentId,
        });
      }
    }
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await RedisClient.disconnect();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { io, httpServer };
