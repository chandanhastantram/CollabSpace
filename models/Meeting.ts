import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IMeeting extends MongooseDocument {
  title: string;
  description: string;
  workspace: mongoose.Types.ObjectId;
  document?: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  host: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  meetingLink: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    document: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    meetingLink: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MeetingSchema.index({ workspace: 1, startTime: 1 });
MeetingSchema.index({ host: 1 });
MeetingSchema.index({ meetingLink: 1 });

export default mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema);
