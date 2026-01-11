"use client";

import { UserAvatar } from '@/components/user/UserAvatar';
import { Users } from 'lucide-react';

interface PresenceUser {
  userId: string;
  userName: string;
  avatar?: string;
  status: 'active' | 'idle' | 'away';
  color: string;
}

interface PresenceBarProps {
  users: PresenceUser[];
  currentUserId?: string;
}

export function PresenceBar({ users, currentUserId }: PresenceBarProps) {
  const activeUsers = users.filter((u) => u.status === 'active');
  const otherUsers = users.filter((u) => u.userId !== currentUserId);

  return (
    <div className="flex items-center space-x-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {activeUsers.length} {activeUsers.length === 1 ? 'user' : 'users'} active
        </span>
      </div>

      {/* User Avatars */}
      <div className="flex -space-x-2">
        {otherUsers.slice(0, 5).map((user) => (
          <div
            key={user.userId}
            className="relative"
            title={user.userName}
          >
            <div
              className="ring-2 ring-white dark:ring-gray-800 rounded-full"
              style={{ borderColor: user.color }}
            >
              <UserAvatar
                name={user.userName}
                avatar={user.avatar}
                size="sm"
                online={user.status === 'active'}
              />
            </div>
          </div>
        ))}
        
        {otherUsers.length > 5 && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
            +{otherUsers.length - 5}
          </div>
        )}
      </div>

      {/* Status Indicators */}
      <div className="flex items-center space-x-1">
        {users.some((u) => u.status === 'active') && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Editing
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
