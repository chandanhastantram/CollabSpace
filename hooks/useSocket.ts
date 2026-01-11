// Socket.io client hook for video calls
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002';

interface Participant {
  socketId: string;
  userId: string;
  userName: string;
  stream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
}

interface UseSocketOptions {
  roomId: string;
  userId: string;
  userName: string;
  localStream: MediaStream | null;
}

export function useSocket({ roomId, userId, userName, localStream }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // Create peer connection
  const createPeerConnection = useCallback((targetSocketId: string, initiator: boolean) => {
    const pc = new RTCPeerConnection(rtcConfig);

    // Add local tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          to: targetSocketId,
          candidate: event.candidate,
          from: socketRef.current.id,
        });
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setParticipants(prev => 
        prev.map(p => 
          p.socketId === targetSocketId 
            ? { ...p, stream: remoteStream }
            : p
        )
      );
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${targetSocketId}: ${pc.connectionState}`);
    };

    peersRef.current.set(targetSocketId, pc);
    return pc;
  }, [localStream]);

  // Initialize socket connection
  useEffect(() => {
    if (!roomId || !userId) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to signaling server');
      setIsConnected(true);
      
      // Join room
      socket.emit('join-room', { roomId, userId, userName });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
      setIsConnected(false);
    });

    // Handle existing participants
    socket.on('existing-participants', async (existingParticipants: any[]) => {
      for (const participant of existingParticipants) {
        setParticipants(prev => [...prev, {
          socketId: participant.id,
          userId: participant.userId,
          userName: participant.userName,
          isMuted: false,
          isVideoOff: false,
          isScreenSharing: false,
        }]);

        // Create offer for each existing participant
        const pc = createPeerConnection(participant.id, true);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        socket.emit('offer', {
          to: participant.id,
          offer,
          from: socket.id,
          userName,
        });
      }
    });

    // Handle new user joining
    socket.on('user-joined', async ({ socketId, userId: newUserId, userName: newUserName }) => {
      console.log(`${newUserName} joined the room`);
      
      setParticipants(prev => [...prev, {
        socketId,
        userId: newUserId,
        userName: newUserName,
        isMuted: false,
        isVideoOff: false,
        isScreenSharing: false,
      }]);
    });

    // Handle offer
    socket.on('offer', async ({ from, offer, userName: offerUserName }) => {
      const pc = createPeerConnection(from, false);
      await pc.setRemoteDescription(offer);
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socket.emit('answer', {
        to: from,
        answer,
        from: socket.id,
      });
    });

    // Handle answer
    socket.on('answer', async ({ from, answer }) => {
      const pc = peersRef.current.get(from);
      if (pc) {
        await pc.setRemoteDescription(answer);
      }
    });

    // Handle ICE candidate
    socket.on('ice-candidate', async ({ from, candidate }) => {
      const pc = peersRef.current.get(from);
      if (pc) {
        await pc.addIceCandidate(candidate);
      }
    });

    // Handle user left
    socket.on('user-left', ({ socketId, userName: leftUserName }) => {
      console.log(`${leftUserName} left the room`);
      
      // Close peer connection
      const pc = peersRef.current.get(socketId);
      if (pc) {
        pc.close();
        peersRef.current.delete(socketId);
      }
      
      setParticipants(prev => prev.filter(p => p.socketId !== socketId));
    });

    // Handle audio toggle
    socket.on('user-audio-toggle', ({ socketId, enabled }) => {
      setParticipants(prev => 
        prev.map(p => 
          p.socketId === socketId ? { ...p, isMuted: !enabled } : p
        )
      );
    });

    // Handle video toggle
    socket.on('user-video-toggle', ({ socketId, enabled }) => {
      setParticipants(prev => 
        prev.map(p => 
          p.socketId === socketId ? { ...p, isVideoOff: !enabled } : p
        )
      );
    });

    // Handle chat messages
    socket.on('chat-message', (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    // Cleanup
    return () => {
      socket.emit('leave-room', { roomId });
      socket.disconnect();
      
      // Close all peer connections
      peersRef.current.forEach(pc => pc.close());
      peersRef.current.clear();
    };
  }, [roomId, userId, userName, createPeerConnection]);

  // Toggle audio
  const toggleAudio = (enabled: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit('toggle-audio', { roomId, enabled });
    }
  };

  // Toggle video
  const toggleVideo = (enabled: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit('toggle-video', { roomId, enabled });
    }
  };

  // Send chat message
  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit('chat-message', { roomId, message, userName });
    }
  };

  return {
    participants,
    isConnected,
    chatMessages,
    toggleAudio,
    toggleVideo,
    sendMessage,
  };
}
