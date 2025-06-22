import mongoose from "mongoose";

export interface IProgress {
  challengeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  isCompleted: boolean;
  notes?: string;
  completedAt?: Date;
  createdAt: Date;
}

const ProgressSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task_User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    optional: true,
  },
  completedAt: {
    type: Date,
    optional: true,
  }
}, { timestamps: true });

// Compound index to ensure one progress entry per user per challenge per date
ProgressSchema.index({ userId: 1, challengeId: 1, date: 1 }, { unique: true });

export const ProgressModel = mongoose.model('Progress', ProgressSchema);