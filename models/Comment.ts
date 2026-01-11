import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IComment extends MongooseDocument {
  document: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  mentions: mongoose.Types.ObjectId[];
  parentComment?: mongoose.Types.ObjectId;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    document: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      index: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CommentSchema.index({ document: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
