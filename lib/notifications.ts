// Notification types and utilities

export type NotificationType = 
  | 'mention'
  | 'invite'
  | 'share'
  | 'comment'
  | 'meeting'
  | 'system'
  | 'document_update'
  | 'workspace_activity';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  mentions: boolean;
  invites: boolean;
  documentUpdates: boolean;
  comments: boolean;
  meetings: boolean;
  systemUpdates: boolean;
}

export const defaultPreferences: NotificationPreferences = {
  email: true,
  push: true,
  inApp: true,
  mentions: true,
  invites: true,
  documentUpdates: true,
  comments: true,
  meetings: true,
  systemUpdates: true,
};

// Generate demo notifications
export function generateDemoNotifications(): Notification[] {
  const now = new Date();
  
  return [
    {
      id: 'notif-1',
      type: 'mention',
      title: 'New Mention',
      message: 'John Doe mentioned you in "Q1 Planning Document"',
      read: false,
      createdAt: new Date(now.getTime() - 5 * 60 * 1000), // 5 mins ago
      link: '/documents/1',
      sender: {
        id: 'user-1',
        name: 'John Doe',
      },
    },
    {
      id: 'notif-2',
      type: 'invite',
      title: 'Workspace Invitation',
      message: 'You have been invited to join "Engineering Team"',
      read: false,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 mins ago
      link: '/workspaces/1',
      sender: {
        id: 'user-2',
        name: 'Sarah Smith',
      },
    },
    {
      id: 'notif-3',
      type: 'comment',
      title: 'New Comment',
      message: 'Mike Johnson commented on "Project Roadmap"',
      read: false,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      link: '/documents/2',
      sender: {
        id: 'user-3',
        name: 'Mike Johnson',
      },
    },
    {
      id: 'notif-4',
      type: 'meeting',
      title: 'Meeting Starting Soon',
      message: 'Team standup starts in 15 minutes',
      read: true,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      link: '/meeting',
    },
    {
      id: 'notif-5',
      type: 'document_update',
      title: 'Document Updated',
      message: 'Alice Brown updated "Design Guidelines"',
      read: true,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      link: '/documents/3',
      sender: {
        id: 'user-4',
        name: 'Alice Brown',
      },
    },
    {
      id: 'notif-6',
      type: 'system',
      title: 'Welcome to CollabSpace!',
      message: 'Get started by creating your first workspace',
      read: true,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      link: '/workspaces/new',
    },
  ];
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Get notification icon based on type
export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'mention': return '💬';
    case 'invite': return '✉️';
    case 'share': return '📤';
    case 'comment': return '💭';
    case 'meeting': return '📹';
    case 'system': return '⚙️';
    case 'document_update': return '📝';
    case 'workspace_activity': return '👥';
    default: return '🔔';
  }
}
