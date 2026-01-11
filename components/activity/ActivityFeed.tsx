"use client";

import { UserAvatar } from '@/components/user/UserAvatar';
import { FileText, Users, Folder, MessageSquare, Share2, Plus } from 'lucide-react';

interface Activity {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  targetType: string;
  targetName: string;
  createdAt: Date;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActionIcon = (action: string, targetType: string) => {
    if (action === 'create') {
      if (targetType === 'document') return <FileText className="w-4 h-4" />;
      if (targetType === 'folder') return <Folder className="w-4 h-4" />;
      return <Plus className="w-4 h-4" />;
    }
    if (action === 'comment') return <MessageSquare className="w-4 h-4" />;
    if (action === 'share') return <Share2 className="w-4 h-4" />;
    if (action === 'invite') return <Users className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getActionText = (activity: Activity) => {
    const { action, targetType, targetName } = activity;
    
    if (action === 'create') {
      return `created ${targetType} "${targetName}"`;
    }
    if (action === 'edit') {
      return `edited ${targetType} "${targetName}"`;
    }
    if (action === 'delete') {
      return `deleted ${targetType} "${targetName}"`;
    }
    if (action === 'comment') {
      return `commented on "${targetName}"`;
    }
    if (action === 'share') {
      return `shared "${targetName}"`;
    }
    if (action === 'invite') {
      return `invited someone to "${targetName}"`;
    }
    return `updated "${targetName}"`;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No recent activity
        </div>
      ) : (
        activities.map((activity) => (
          <div
            key={activity._id}
            className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <UserAvatar
              name={activity.user.name}
              avatar={activity.user.avatar}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-medium">{activity.user.name}</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {getActionText(activity)}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatTime(activity.createdAt)}
              </p>
            </div>
            <div className="flex-shrink-0 text-gray-400">
              {getActionIcon(activity.action, activity.targetType)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
