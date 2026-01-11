"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { VideoGrid } from '@/components/video/VideoGrid';
import { VideoControls } from '@/components/video/VideoControls';
import { getUserMedia, getScreenShare, stopMediaStream, toggleTrack } from '@/lib/webrtc';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/loading';
import { Video, Copy, Users, CheckCircle, MessageSquare, Send } from 'lucide-react';

export default function MeetingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [meetingId, setMeetingId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Socket connection for multi-user
  const { 
    participants, 
    isConnected, 
    chatMessages, 
    toggleAudio: notifyAudioToggle,
    toggleVideo: notifyVideoToggle,
    sendMessage 
  } = useSocket({
    roomId: isInCall ? meetingId : '',
    userId: user?.id || '',
    userName: user?.name || 'Guest',
    localStream,
  });

  // Get meeting ID from URL or generate new
  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId) {
      setMeetingId(urlId);
    } else {
      const id = `meet-${Date.now().toString(36)}`;
      setMeetingId(id);
    }
  }, [searchParams]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaStream(localStream);
      stopMediaStream(screenStream);
    };
  }, [localStream, screenStream]);

  const startCall = async () => {
    try {
      setError('');
      const stream = await getUserMedia(true, true);
      setLocalStream(stream);
      setIsInCall(true);
    } catch (err: any) {
      setError('Could not access camera/microphone. Please allow permissions.');
      console.error(err);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      toggleTrack(localStream, 'audio', !isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
      notifyAudioToggle(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      toggleTrack(localStream, 'video', !isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
      notifyVideoToggle(!isVideoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopMediaStream(screenStream);
      setScreenStream(null);
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await getScreenShare();
        setScreenStream(stream);
        setIsScreenSharing(true);
        
        stream.getVideoTracks()[0].onended = () => {
          stopMediaStream(stream);
          setScreenStream(null);
          setIsScreenSharing(false);
        };
      } catch (err) {
        console.error('Screen share error:', err);
      }
    }
  };

  const leaveCall = () => {
    stopMediaStream(localStream);
    stopMediaStream(screenStream);
    setLocalStream(null);
    setScreenStream(null);
    setIsInCall(false);
    setIsScreenSharing(false);
    router.push('/dashboard');
  };

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/meeting?id=${meetingId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput('');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  // Pre-call lobby
  if (!isInCall) {
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
                value={meetingId}
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
            onClick={startCall}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3"
          >
            <Video className="w-5 h-5 mr-2" />
            {searchParams.get('id') ? 'Join Call' : 'Start Call'}
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

  // In-call view
  return (
    <div className="h-screen bg-gray-950 flex">
      {/* Main video area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Video className="w-5 h-5 text-indigo-500 mr-2" />
              <span className="text-white font-medium">Meeting</span>
              {isConnected && (
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <Users className="w-4 h-4 mr-1" />
              <span>{participants.length + 1}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={copyMeetingLink}
              className="flex items-center text-gray-400 hover:text-white text-sm transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied!' : 'Invite'}
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg transition-colors ${showChat ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 relative">
          <VideoGrid
            participants={participants.map(p => ({
              id: p.socketId,
              name: p.userName,
              stream: p.stream || null,
              isMuted: p.isMuted,
            }))}
            localStream={isScreenSharing ? screenStream : localStream}
            localName={user?.name || 'You'}
            isLocalMuted={!isAudioEnabled}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center py-6 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
          <VideoControls
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onLeaveCall={leaveCall}
          />
        </div>
      </div>

      {/* Chat sidebar */}
      {showChat && (
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-medium">Chat</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium text-indigo-400">{msg.userName}:</span>
                <span className="text-gray-300 ml-2">{msg.message}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              />
              <Button onClick={handleSendMessage} className="px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
