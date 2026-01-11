// Shared demo data store for testing without MongoDB
// This provides in-memory storage when MONGODB_URI is not set

import bcrypt from 'bcryptjs';

interface DemoUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string | null;
  role: string;
  provider: string;
  createdAt: Date;
}

interface DemoWorkspace {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: Array<{ user: string; role: string }>;
  createdAt: Date;
}

interface DemoDocument {
  _id: string;
  title: string;
  content: any;
  workspace: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

class DemoDataStore {
  private users: Map<string, DemoUser> = new Map();
  private workspaces: Map<string, DemoWorkspace> = new Map();
  private documents: Map<string, DemoDocument> = new Map();
  private initialized = false;

  constructor() {
    this.initializeDefaultUser();
  }

  private async initializeDefaultUser() {
    if (this.initialized) return;
    
    try {
      // Create default demo user
      const hashedPassword = await bcrypt.hash('demo123', 10);
      const defaultUser: DemoUser = {
        _id: 'demo-user-default',
        name: 'Demo User',
        email: 'demo@collabspace.com',
        password: hashedPassword,
        avatar: null,
        role: 'user',
        provider: 'local',
        createdAt: new Date(),
      };
      
      this.users.set(defaultUser.email.toLowerCase(), defaultUser);
      this.initialized = true;
      console.log('✅ Default demo user initialized: demo@collabspace.com / demo123');
    } catch (error) {
      console.error('Failed to initialize default user:', error);
    }
  }

  // Users
  addUser(user: DemoUser): void {
    this.users.set(user.email.toLowerCase(), user);
    console.log(`✅ Demo user added: ${user.email}`);
  }

  getUser(email: string): DemoUser | undefined {
    return this.users.get(email.toLowerCase());
  }

  getUserById(id: string): DemoUser | undefined {
    const users = Array.from(this.users.values());
    for (const user of users) {
      if (user._id === id) return user;
    }
    return undefined;
  }

  hasUser(email: string): boolean {
    return this.users.has(email.toLowerCase());
  }

  // Workspaces
  addWorkspace(workspace: DemoWorkspace): void {
    this.workspaces.set(workspace._id, workspace);
  }

  getWorkspace(id: string): DemoWorkspace | undefined {
    return this.workspaces.get(id);
  }

  getWorkspacesByUser(userId: string): DemoWorkspace[] {
    return Array.from(this.workspaces.values()).filter(
      (w) => w.owner === userId || w.members.some((m) => m.user === userId)
    );
  }

  // Documents
  addDocument(doc: DemoDocument): void {
    this.documents.set(doc._id, doc);
  }

  getDocument(id: string): DemoDocument | undefined {
    return this.documents.get(id);
  }

  getDocumentsByWorkspace(workspaceId: string): DemoDocument[] {
    return Array.from(this.documents.values()).filter(
      (d) => d.workspace === workspaceId
    );
  }

  updateDocument(id: string, updates: Partial<DemoDocument>): void {
    const doc = this.documents.get(id);
    if (doc) {
      this.documents.set(id, { ...doc, ...updates, updatedAt: new Date() });
    }
  }

  deleteDocument(id: string): boolean {
    return this.documents.delete(id);
  }

  // Stats
  getStats() {
    return {
      users: this.users.size,
      workspaces: this.workspaces.size,
      documents: this.documents.size,
    };
  }

  // Clear all data but keep default user
  clear(): void {
    this.users.clear();
    this.workspaces.clear();
    this.documents.clear();
    this.initialized = false;
    this.initializeDefaultUser();
  }
}

// Singleton instance
export const demoStore = new DemoDataStore();

export default demoStore;
