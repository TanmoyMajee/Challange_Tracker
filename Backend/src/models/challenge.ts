import mongoose from 'mongoose';


const ChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task_User',
      required: true,
    },
    assignedUsers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task_User' }],
      default: []
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const ChallengeModel = mongoose.model('Challenge', ChallengeSchema);