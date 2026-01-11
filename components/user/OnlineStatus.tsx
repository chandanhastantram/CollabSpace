"use client";

import { cn } from '@/lib/utils';

interface OnlineStatusProps {
  status: 'online' | 'idle' | 'offline';
  showText?: boolean;
  className?: string;
}

export function OnlineStatus({ status, showText = false, className }: OnlineStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'idle':
        return 'Idle';
      case 'offline':
        return 'Offline';
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn("w-2 h-2 rounded-full", getStatusColor(), status === 'online' && 'animate-pulse')} />
      {showText && (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {getStatusText()}
        </span>
      )}
    </div>
  );
}
