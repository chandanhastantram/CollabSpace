"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/loading';
import DailyIframe from '@daily-co/daily-js';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Monitor, 
  PhoneOff,
  Copy,
  CheckCircle,
  Users,
  MessageSquare
} from 'lucide-react';

export default function MeetingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const callFrameRef = useRef<any>(null);
  const [roomUrl, setRoomUrl] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Call state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  // Get room ID from URL or generate new
  useEffect(() => {
    const urlRoomId = searchParams.get('id');
    if (urlRoomId) {
      setRoomName(urlRoomId);
    } else {
      const newRoomId = `meet-${Date.now().toString(36)}`;
      setRoomName(newRoomId);
    }
  }, [searchParams]);

  // Create or join room
  const joinMeeting = async () => {
    if (!roomName) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Create room if it doesn't exist
      const createResponse = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName }),
      });

      let room;
      if (createResponse.ok) {
        const data = await createResponse.json();
        room = data.room;
      } else {
        // Room might already exist, try to get it
        const getResponse = await fetch(`/api/meetings?name=${roomName}`);
        if (getResponse.ok) {
          const data = await getResponse.json();
          room = data.room;
        } else {
          throw new Error('Failed to create or join room');
        }
      }

      setRoomUrl(room.url);

      // Get meeting token
      const tokenResponse = await fetch('/api/meetings/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: roomName,
          userName: user?.name || 'Guest',
          isOwner: !searchParams.get('id'), // Owner if creating new room
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get meeting token');
      }

      const { token } = await tokenResponse.json();

      // Create Daily call frame
      const callFrame = DailyIframe.createFrame({
        iframeStyle: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          border: '0',
        },
        showLeaveButton: false,
        showFullscreenButton: true,
      });

      callFrameRef.current = callFrame;

      // Set up event listeners
      callFrame
        .on('joined-meeting', handleJoinedMeeting)
        .on('left-meeting', handleLeftMeeting)
        .on('participant-joined', handleParticipantJoined)
        .on('participant-left', handleParticipantLeft)
        .on('error', handleError);

      // Join the call
      await callFrame.join({ url: room.url, token });
      setIsJoined(true);
    } catch (err: any) {
      console.error('Join meeting error:', err);
      setError(err.message || 'Failed to join meeting');
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers
  const handleJoinedMeeting = useCallback(() => {
    console.log('Joined meeting');
    setIsJoined(true);
  }, []);

  const handleLeftMeeting = useCallback(() => {
    console.log('Left meeting');
    setIsJoined(false);
    router.push('/dashboard');
  }, [router]);

  const handleParticipantJoined = useCallback((event: any) => {
    console.log('Participant joined:', event.participant);
    setParticipants(prev => [...prev, event.participant]);
  }, []);

  const handleParticipantLeft = useCallback((event: any) => {
    console.log('Participant left:', event.participant);
    setParticipants(prev => 
      prev.filter(p => p.session_id !== event.participant.session_id)
    );
  }, []);

  const handleError = useCallback((error: any) => {
    console.error('Daily error:', error);
    setError(error.errorMsg || 'An error occurred');
  }, []);

  // Call controls
  const toggleMute = () => {
    if (callFrameRef.current) {
      callFrameRef.current.setLocalAudio(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (callFrameRef.current) {
      callFrameRef.current.setLocalVideo(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    if (callFrameRef.current) {
      if (isScreenSharing) {
        await callFrameRef.current.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await callFrameRef.current.startScreenShare();
        setIsScreenSharing(true);
      }
    }
  };

  const leaveMeeting = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave();
      callFrameRef.current.destroy();
      callFrameRef.current = null;
    }
    setIsJoined(false);
    router.push('/dashboard');
  };

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/meeting?id=${roomName}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
      }
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  // Pre-call lobby
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Video Call</h1>
            <p className="text-gray-400">
              {searchParams.get('id') ? 'Join this meeting' : 'Start a new meeting'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Meeting ID */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Meeting ID</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={roomName}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono"
              />
              <Button onClick={copyMeetingLink} variant="outline" className="shrink-0">
                {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share this link with others to join</p>
          </div>

          {/* User info */}
          {user && (
            <div className="flex items-center p-4 bg-gray-800/50 rounded-lg mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{user.name || 'User'}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          )}

          <Button
            onClick={joinMeeting}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Joining...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" />
                {searchParams.get('id') ? 'Join Call' : 'Start Call'}
              </>
            )}
          </Button>

          <div className="mt-6 text-center">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // In-call view (Daily iframe handles the video)
  return (
    <div className="h-screen bg-gray-950 relative">
      {/* Daily iframe will be injected here */}
      
      {/* Custom controls overlay (optional - Daily has built-in controls) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-2 text-white">
            <Users className="w-5 h-5" />
            <span>{participants.length + 1} participants</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-colors ${
                isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>
            
            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-full transition-colors ${
                isScreenSharing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Monitor className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={leaveMeeting}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <button
            onClick={copyMeetingLink}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm">{copied ? 'Copied!' : 'Invite'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
