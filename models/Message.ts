import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderAvatar?: string;
  workspaceId: mongoose.Types.ObjectId;
  channelId?: string;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
    size: number;
  }>;
  replyTo?: mongoose.Types.ObjectId;
  reactions?: Array<{
    emoji: string;
    userId: mongoose.Types.ObjectId;
  }>;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    channelId: {
      type: String,
      default: 'general',
      index: true,
    },
    attachments: [{
      type: {
        type: String,
        enum: ['image', 'file'],
      },
      url: String,
      name: String,
      size: Number,
    }],
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    reactions: [{
      emoji: String,
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
MessageSchema.index({ workspaceId: 1, createdAt: -1 });
MessageSchema.index({ workspaceId: 1, channelId: 1, createdAt: -1 });

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
