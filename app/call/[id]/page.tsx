"use client";

import { useState, useEffect, useRef } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { VideoGrid } from '@/components/video/VideoGrid';
import { VideoControls } from '@/components/video/VideoControls';
import { Loading } from '@/components/ui/loading';
import { getUserMedia, stopMediaStream, toggleTrack } from '@/lib/webrtc';
import { useRouter } from 'next/navigation';

export default function CallPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useRequireAuth();
  const router = useRouter();
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      initializeCall();
    }

    return () => {
      if (localStream) {
        stopMediaStream(localStream);
      }
    };
  }, [user]);

  const initializeCall = async () => {
    try {
      const stream = await getUserMedia(true, true);
      setLocalStream(stream);
      setLoading(false);
    } catch (error) {
      console.error('Failed to get user media:', error);
      setLoading(false);
    }
  };

  const handleToggleAudio = () => {
    toggleTrack(localStream, 'audio', !isAudioEnabled);
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleToggleVideo = () => {
    toggleTrack(localStream, 'video', !isVideoEnabled);
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleScreenShare = async () => {
    // Screen sharing implementation would go here
    setIsScreenSharing(!isScreenSharing);
  };

  const handleLeaveCall = () => {
    if (localStream) {
      stopMediaStream(localStream);
    }
    router.push('/workspaces');
  };

  if (authLoading || loading) {
    return <Loading fullScreen text="Joining call..." />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 relative">
        <VideoGrid
          participants={participants}
          localStream={localStream}
          localName={user?.name || 'You'}
          isLocalMuted={!isAudioEnabled}
        />
      </div>

      {/* Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <VideoControls
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          isScreenSharing={isScreenSharing}
          onToggleAudio={handleToggleAudio}
          onToggleVideo={handleToggleVideo}
          onToggleScreenShare={handleToggleScreenShare}
          onLeaveCall={handleLeaveCall}
        />
      </div>
    </div>
  );
}
