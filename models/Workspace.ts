import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkspaceMember {
  userId: mongoose.Types.ObjectId;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
}

export interface IWorkspace extends Document {
  _id: string;
  name: string;
  description: string;
  icon: string;
  ownerId: mongoose.Types.ObjectId;
  members: IWorkspaceMember[];
  settings: {
    isPublic: boolean;
    allowInvites: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: '📁',
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      role: {
        type: String,
        enum: ['owner', 'admin', 'editor', 'viewer'],
        default: 'viewer',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    settings: {
      isPublic: {
        type: Boolean,
        default: false,
      },
      allowInvites: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
WorkspaceSchema.index({ ownerId: 1 });
WorkspaceSchema.index({ 'members.userId': 1 });
WorkspaceSchema.index({ name: 'text', description: 'text' });

const Workspace: Model<IWorkspace> = 
  mongoose.models.Workspace || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);

export default Workspace;
