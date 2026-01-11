import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IActivity extends MongooseDocument {
  workspace: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  action: 'create' | 'edit' | 'delete' | 'share' | 'invite' | 'comment' | 'other';
  targetType: 'document' | 'workspace' | 'folder' | 'comment';
  targetId: mongoose.Types.ObjectId;
  targetName: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['create', 'edit', 'delete', 'share', 'invite', 'comment', 'other'],
      required: true,
    },
    targetType: {
      type: String,
      enum: ['document', 'workspace', 'folder', 'comment'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    targetName: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ActivitySchema.index({ workspace: 1, createdAt: -1 });
ActivitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
