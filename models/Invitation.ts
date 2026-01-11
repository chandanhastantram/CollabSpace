import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvitation extends Document {
  _id: string;
  workspace: mongoose.Types.ObjectId;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
  invitedBy: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'editor',
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
InvitationSchema.index({ workspace: 1, email: 1 });
InvitationSchema.index({ token: 1 });
InvitationSchema.index({ expiresAt: 1 });
InvitationSchema.index({ status: 1 });

// Auto-expire invitations
InvitationSchema.pre('save', function (next) {
  if (this.status === 'pending' && this.expiresAt < new Date()) {
    this.status = 'expired';
  }
  next();
});

const Invitation: Model<IInvitation> =
  mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);

export default Invitation;
