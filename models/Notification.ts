import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface INotification extends MongooseDocument {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: 'mention' | 'comment' | 'invite' | 'share' | 'edit' | 'other';
  title: string;
  message: string;
  link?: string;
  relatedDocument?: mongoose.Types.ObjectId;
  relatedWorkspace?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['mention', 'comment', 'invite', 'share', 'edit', 'other'],
      default: 'other',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    relatedDocument: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
    },
    relatedWorkspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
