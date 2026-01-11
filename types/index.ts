export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'credentials' | 'google' | 'github';
  workspaces: string[];
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description: string;
  icon: string;
  ownerId: string;
  members: WorkspaceMember[];
  settings: {
    isPublic: boolean;
    allowInvites: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  userId: string;
  user?: User;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: string;
}

export interface Document {
  _id: string;
  workspaceId: string;
  title: string;
  content: any;
  parentId: string | null;
  type: 'document' | 'folder';
  permissions: DocumentPermission[];
  version: number;
  createdBy: string;
  lastEditedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentPermission {
  userId: string;
  access: 'read' | 'write' | 'admin';
}

export interface Activity {
  _id: string;
  workspaceId: string;
  userId: string;
  user?: User;
  type: 'document_created' | 'document_edited' | 'member_added' | 'comment_added';
  resourceId: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface Comment {
  _id: string;
  documentId: string;
  userId: string;
  user?: User;
  content: string;
  position: number;
  resolved: boolean;
  replies: CommentReply[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentReply {
  userId: string;
  user?: User;
  content: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'mention' | 'comment' | 'invite' | 'update';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

export interface CursorPosition {
  userId: string;
  userName: string;
  userColor: string;
  position: number;
  selection?: {
    start: number;
    end: number;
  };
}

export interface PresenceUser {
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'online' | 'away' | 'busy';
  lastSeen: string;
}

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type DocumentType = 'document' | 'folder';
export type ActivityType = 'document_created' | 'document_edited' | 'member_added' | 'comment_added';
export type NotificationType = 'mention' | 'comment' | 'invite' | 'update';
