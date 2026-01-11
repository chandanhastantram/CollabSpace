"use client";

import { ParticipantTile } from './ParticipantTile';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  name: string;
  stream: MediaStream | null;
  isMuted: boolean;
}

interface VideoGridProps {
  participants: Participant[];
  localStream: MediaStream | null;
  localName: string;
  isLocalMuted: boolean;
  className?: string;
}

export function VideoGrid({
  participants,
  localStream,
  localName,
  isLocalMuted,
  className,
}: VideoGridProps) {
  const totalParticipants = participants.length + 1; // +1 for local user

  const getGridClass = () => {
    if (totalParticipants === 1) return 'grid-cols-1';
    if (totalParticipants === 2) return 'grid-cols-2';
    if (totalParticipants <= 4) return 'grid-cols-2';
    if (totalParticipants <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div
      className={cn(
        "grid gap-4 w-full h-full p-4",
        getGridClass(),
        className
      )}
    >
      {/* Local participant */}
      <ParticipantTile
        stream={localStream}
        name={localName}
        isMuted={isLocalMuted}
        isLocal={true}
      />

      {/* Remote participants */}
      {participants.map((participant) => (
        <ParticipantTile
          key={participant.id}
          stream={participant.stream}
          name={participant.name}
          isMuted={participant.isMuted}
        />
      ))}
    </div>
  );
}
