import mongoose, { Schema, Document as MongooseDocument, Model } from 'mongoose';

export interface IDocumentPermission {
  userId: mongoose.Types.ObjectId;
  access: 'read' | 'write' | 'admin';
}

export interface IDocument extends MongooseDocument {
  _id: string;
  workspaceId: mongoose.Types.ObjectId;
  title: string;
  content: any; // Quill Delta format
  parentId: mongoose.Types.ObjectId | null;
  type: 'document' | 'folder';
  permissions: IDocumentPermission[];
  version: number;
  createdBy: mongoose.Types.ObjectId;
  lastEditedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled Document',
    },
    content: {
      type: Schema.Types.Mixed,
      default: { ops: [] }, // Quill Delta format
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      default: null,
    },
    type: {
      type: String,
      enum: ['document', 'folder'],
      default: 'document',
    },
    permissions: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      access: {
        type: String,
        enum: ['read', 'write', 'admin'],
        default: 'read',
      },
    }],
    version: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
DocumentSchema.index({ workspaceId: 1, parentId: 1 });
DocumentSchema.index({ workspaceId: 1, type: 1 });
DocumentSchema.index({ createdBy: 1 });
DocumentSchema.index({ title: 'text' });

const DocumentModel: Model<IDocument> = 
  mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;
