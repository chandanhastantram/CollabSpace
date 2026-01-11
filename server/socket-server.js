// Socket.io Signaling Server for WebRTC Video Calls
// Run with: node server/socket-server.js

const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

// Store active rooms and participants
const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a meeting room
  socket.on('join-room', ({ roomId, userId, userName }) => {
    socket.join(roomId);
    
    // Add user to room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    rooms.get(roomId).set(socket.id, { id: socket.id, odId: userId, userName });

    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      socketId: socket.id,
      userId,
      userName,
    });

    // Send list of existing participants to the new user
    const participants = Array.from(rooms.get(roomId).values())
      .filter(p => p.id !== socket.id);
    socket.emit('existing-participants', participants);

    console.log(`${userName} joined room: ${roomId}`);
  });

  // Handle WebRTC signaling
  socket.on('offer', ({ to, offer, from, userName }) => {
    socket.to(to).emit('offer', { from, offer, userName });
  });

  socket.on('answer', ({ to, answer, from }) => {
    socket.to(to).emit('answer', { from, answer });
  });

  socket.on('ice-candidate', ({ to, candidate, from }) => {
    socket.to(to).emit('ice-candidate', { from, candidate });
  });

  // Handle media state changes
  socket.on('toggle-audio', ({ roomId, enabled }) => {
    socket.to(roomId).emit('user-audio-toggle', {
      socketId: socket.id,
      enabled,
    });
  });

  socket.on('toggle-video', ({ roomId, enabled }) => {
    socket.to(roomId).emit('user-video-toggle', {
      socketId: socket.id,
      enabled,
    });
  });

  // Handle screen sharing
  socket.on('screen-share-started', ({ roomId }) => {
    socket.to(roomId).emit('user-screen-share', {
      socketId: socket.id,
      sharing: true,
    });
  });

  socket.on('screen-share-stopped', ({ roomId }) => {
    socket.to(roomId).emit('user-screen-share', {
      socketId: socket.id,
      sharing: false,
    });
  });

  // Handle chat messages
  socket.on('chat-message', ({ roomId, message, userName }) => {
    io.to(roomId).emit('chat-message', {
      socketId: socket.id,
      userName,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  // Leave room
  socket.on('leave-room', ({ roomId }) => {
    handleLeaveRoom(socket, roomId);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove from all rooms
    rooms.forEach((participants, roomId) => {
      if (participants.has(socket.id)) {
        handleLeaveRoom(socket, roomId);
      }
    });
  });
});

function handleLeaveRoom(socket, roomId) {
  const room = rooms.get(roomId);
  if (room) {
    const user = room.get(socket.id);
    room.delete(socket.id);
    
    // Notify others
    socket.to(roomId).emit('user-left', {
      socketId: socket.id,
      userName: user?.userName || 'User',
    });

    // Clean up empty rooms
    if (room.size === 0) {
      rooms.delete(roomId);
    }

    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  }
}

const PORT = process.env.SOCKET_PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io signaling server running on port ${PORT}`);
});
