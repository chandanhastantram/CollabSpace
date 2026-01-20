"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { FloatingShapes, Sticker, BrutalistCard, BrutalistButton } from '@/components/ui/RetroElements';
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
  ArrowLeft,
  Zap,
  Play
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
  const [mounted, setMounted] = useState(false);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  
  const [mode, setMode] = useState<'start' | 'join'>(searchParams.get('id') ? 'join' : 'start');
  const [joinCode, setJoinCode] = useState(searchParams.get('id') || '');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const urlRoomId = searchParams.get('id');
    if (urlRoomId) {
      setRoomName(urlRoomId);
      setJoinCode(urlRoomId);
      setMode('join');
    } else {
      const newRoomId = `meet-${Date.now().toString(36)}`;
      setRoomName(newRoomId);
    }
  }, [searchParams]);

  const joinMeeting = async () => {
    const meetingId = mode === 'join' && joinCode ? joinCode.trim() : roomName;
    if (!meetingId) {
      setError('Please enter a meeting code');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const createResponse = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: meetingId }),
      });

      let room;
      if (createResponse.ok) {
        const data = await createResponse.json();
        room = data.room;
      } else {
        const getResponse = await fetch(`/api/meetings?name=${meetingId}`);
        if (!getResponse.ok) throw new Error('Room not found');
        const data = await getResponse.json();
        room = data.room;
      }

      const tokenResponse = await fetch('/api/meetings/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: room.name,
          userName: user?.name || 'Guest',
        }),
      });

      if (!tokenResponse.ok) throw new Error('Failed to get token');
      const { token } = await tokenResponse.json();

      setRoomUrl(room.url);
      setRoomName(room.name);

      if (!callFrameRef.current) {
        const callFrame = DailyIframe.createFrame(
          document.getElementById('video-container')!,
          {
            showLeaveButton: false,
            iframeStyle: {
              width: '100%',
              height: '100%',
              border: '4px solid #000',
            },
          }
        );

        callFrame.on('joined-meeting', () => {
          setIsJoined(true);
          setIsLoading(false);
        });

        callFrame.on('left-meeting', () => {
          setIsJoined(false);
          router.push('/dashboard');
        });

        callFrame.on('participant-joined', (event: any) => {
          setParticipants(prev => [...prev, event.participant]);
        });

        callFrame.on('participant-left', (event: any) => {
          setParticipants(prev => prev.filter(p => p.session_id !== event.participant.session_id));
        });

        callFrame.on('error', (error: any) => {
          console.error('Call error:', error);
          setError('Video call error');
          setIsLoading(false);
        });

        callFrameRef.current = callFrame;
      }

      await callFrameRef.current.join({ url: room.url, token });

    } catch (err: any) {
      setError(err.message || 'Failed to join meeting');
      setIsLoading(false);
    }
  };

  const leaveMeeting = useCallback(async () => {
    if (callFrameRef.current) {
      await callFrameRef.current.leave();
      callFrameRef.current.destroy();
      callFrameRef.current = null;
    }
    setIsJoined(false);
    router.push('/dashboard');
  }, [router]);

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
      } else {
        await callFrameRef.current.startScreenShare();
      }
      setIsScreenSharing(!isScreenSharing);
    }
  };

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/meeting?id=${roomName}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="retro-loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] dark:bg-[#0a0a0a] grid-pattern relative overflow-hidden">
      <FloatingShapes />

      {/* Header */}
      <header className="relative z-10 border-b-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#FFE500] border-3 border-black flex items-center justify-center" style={{ borderWidth: '3px' }}>
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="font-black text-xl text-black dark:text-white">CollabSpace</span>
          </Link>

          {isJoined && (
            <Sticker variant="mint">
              <Users className="w-4 h-4 inline mr-1" />
              {participants.length + 1} in call
            </Sticker>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {!isJoined ? (
          /* Pre-Join Screen */
          <div className={`max-w-lg mx-auto ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 mb-8 text-black dark:text-white hover:text-[#FF6B35] transition font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>

            <BrutalistCard variant="white" className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#FFE500] border-3 border-black mx-auto mb-4 flex items-center justify-center" style={{ borderWidth: '3px' }}>
                  <Video className="w-10 h-10 text-black" />
                </div>
                <h1 className="text-3xl font-black text-black mb-2">Video Meeting</h1>
                <p className="text-black/60">Start or join a video call</p>
              </div>

              {/* Mode Toggle */}
              <div className="flex border-3 border-black mb-6" style={{ borderWidth: '3px' }}>
                <button
                  onClick={() => setMode('start')}
                  className={`flex-1 py-3 font-bold uppercase tracking-wide text-sm transition ${
                    mode === 'start' 
                      ? 'bg-[#FFE500] text-black' 
                      : 'bg-white text-black/60 hover:bg-gray-100'
                  }`}
                >
                  Start New
                </button>
                <button
                  onClick={() => setMode('join')}
                  className={`flex-1 py-3 font-bold uppercase tracking-wide text-sm transition border-l-3 border-black ${
                    mode === 'join' 
                      ? 'bg-[#FFE500] text-black' 
                      : 'bg-white text-black/60 hover:bg-gray-100'
                  }`}
                  style={{ borderLeftWidth: '3px' }}
                >
                  Join Existing
                </button>
              </div>

              {mode === 'join' && (
                <div className="mb-6">
                  <label className="block font-bold uppercase text-sm mb-2 text-black">Meeting Code</label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter meeting code..."
                    className="brutalist-input w-full"
                  />
                </div>
              )}

              {error && (
                <div className="p-3 mb-4 bg-[#FF6B35] text-white border-3 border-black font-bold" style={{ borderWidth: '3px' }}>
                  ⚠️ {error}
                </div>
              )}

              {/* User Info */}
              <BrutalistCard variant="yellow" className="p-4 mb-6">
                <p className="text-sm text-black/60 mb-1">Joining as:</p>
                <p className="font-black text-black">{user?.name || 'Guest'}</p>
                <p className="text-sm text-black/60">{user?.email}</p>
              </BrutalistCard>

              <BrutalistButton
                onClick={joinMeeting}
                disabled={isLoading || (mode === 'join' && !joinCode.trim())}
                variant="orange"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="retro-loader w-5 h-5 border-2"></div>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {mode === 'start' ? 'Start Meeting' : 'Join Meeting'}
                  </>
                )}
              </BrutalistButton>
            </BrutalistCard>
          </div>
        ) : (
          /* In-Call Screen */
          <div className="h-[calc(100vh-200px)]">
            {/* Video Container */}
            <BrutalistCard variant="white" className="h-full mb-4 overflow-hidden">
              <div id="video-container" className="w-full h-full bg-black"></div>
            </BrutalistCard>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <BrutalistButton
                onClick={toggleMute}
                variant={isMuted ? 'orange' : 'yellow'}
                className="flex items-center gap-2"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </BrutalistButton>

              <BrutalistButton
                onClick={toggleVideo}
                variant={isVideoOff ? 'orange' : 'yellow'}
                className="flex items-center gap-2"
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                {isVideoOff ? 'Start Video' : 'Stop Video'}
              </BrutalistButton>

              <BrutalistButton
                onClick={toggleScreenShare}
                variant={isScreenSharing ? 'orange' : 'ghost'}
                className="flex items-center gap-2"
              >
                <Monitor className="w-5 h-5" />
                {isScreenSharing ? 'Stop Share' : 'Share Screen'}
              </BrutalistButton>

              <BrutalistButton
                onClick={copyMeetingLink}
                variant="ghost"
                className="flex items-center gap-2"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-[#00D9A5]" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </BrutalistButton>

              <BrutalistButton
                onClick={leaveMeeting}
                variant="orange"
                className="flex items-center gap-2"
              >
                <PhoneOff className="w-5 h-5" />
                Leave Call
              </BrutalistButton>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
