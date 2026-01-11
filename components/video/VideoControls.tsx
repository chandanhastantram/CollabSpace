"use client";

import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface VideoControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onLeaveCall: () => void;
  onOpenSettings?: () => void;
}

export function VideoControls({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveCall,
  onOpenSettings,
}: VideoControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-gray-900/90 backdrop-blur-sm rounded-xl">
      {/* Audio toggle */}
      <Button
        onClick={onToggleAudio}
        variant={isAudioEnabled ? 'default' : 'destructive'}
        className="w-12 h-12 rounded-full"
      >
        {isAudioEnabled ? (
          <Mic className="w-5 h-5" />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
      </Button>

      {/* Video toggle */}
      <Button
        onClick={onToggleVideo}
        variant={isVideoEnabled ? 'default' : 'destructive'}
        className="w-12 h-12 rounded-full"
      >
        {isVideoEnabled ? (
          <Video className="w-5 h-5" />
        ) : (
          <VideoOff className="w-5 h-5" />
        )}
      </Button>

      {/* Screen share */}
      <Button
        onClick={onToggleScreenShare}
        variant={isScreenSharing ? 'default' : 'outline'}
        className="w-12 h-12 rounded-full"
      >
        <Monitor className="w-5 h-5" />
      </Button>

      {/* Settings */}
      {onOpenSettings && (
        <Button
          onClick={onOpenSettings}
          variant="outline"
          className="w-12 h-12 rounded-full"
        >
          <Settings className="w-5 h-5" />
        </Button>
      )}

      {/* Leave call */}
      <Button
        onClick={onLeaveCall}
        variant="destructive"
        className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700"
      >
        <PhoneOff className="w-5 h-5" />
      </Button>
    </div>
  );
}
