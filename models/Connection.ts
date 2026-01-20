import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConnection extends Document {
  _id: mongoose.Types.ObjectId;
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'blocked'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique connections between two users
ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Indexes for querying
ConnectionSchema.index({ requester: 1, status: 1 });
ConnectionSchema.index({ recipient: 1, status: 1 });

const Connection: Model<IConnection> = 
  mongoose.models.Connection || mongoose.model<IConnection>('Connection', ConnectionSchema);

export default Connection;
