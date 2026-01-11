"use client";

import { UserAvatar } from '@/components/user/UserAvatar';

interface RemoteCursorProps {
  userId: string;
  userName: string;
  userColor: string;
  position: number;
  selection?: { start: number; end: number };
}

export function RemoteCursor({
  userId,
  userName,
  userColor,
  position,
  selection,
}: RemoteCursorProps) {
  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: `${position}px`,
        transition: 'all 0.1s ease-out',
      }}
    >
      {/* Cursor Line */}
      <div
        className="w-0.5 h-5 animate-pulse"
        style={{ backgroundColor: userColor }}
      />
      
      {/* User Label */}
      <div
        className="absolute top-0 left-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-lg"
        style={{ backgroundColor: userColor }}
      >
        {userName}
      </div>

      {/* Selection Highlight */}
      {selection && (
        <div
          className="absolute top-0 opacity-20"
          style={{
            backgroundColor: userColor,
            left: 0,
            width: `${selection.end - selection.start}px`,
            height: '20px',
          }}
        />
      )}
    </div>
  );
}
