import { Request, Response } from 'express';
import { ProgressModel } from '../../models/progress';
import { ChallengeModel } from '../../models/challenge';
import { z } from 'zod';
import mongoose from 'mongoose';

// Zod schema for progress creation/update
const progressSchema = z.object({
  challengeId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid challenge ID"
  }),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  isCompleted: z.boolean(),
  notes: z.string().optional()
});

export const createProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { challengeId, date, isCompleted, notes } = progressSchema.parse(req.body);

    // Convert date string to Date object for comparison
    const progressDate = new Date(date);

    // Check if challenge exists
    const challenge = await ChallengeModel.findById(challengeId);
    if (!challenge) {
      res.status(404).json({ msg: "Challenge not found" });
      return;
    }

    // Check if challenge is active
    if (!challenge.isActive) {
      res.status(400).json({ msg: "Challenge is not active" });
      return;
    }

    // Validate date is within challenge date range
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    if (progressDate < startDate || progressDate > endDate) {
      res.status(400).json({
        msg: `Progress date must be between ${startDate.toISOString().split('T')[0]} and ${endDate.toISOString().split('T')[0]}`
      });
      return;
    }

    // Authorization Check: Who can create progress?
    const userId = req.user._id.toString();
    const isCreator = challenge.createdBy.toString() === userId;
    const isAssigned = challenge.assignedUsers.some(
      (assignedUserId: any) => assignedUserId.toString() === userId
    );
    const isAdmin = req.user.role === 'admin';

    // User must be creator OR assigned OR admin
    if ( !isAssigned ) {
      res.status(403).json({
        msg: "You are not authorized to track progress for this challenge. You must be the creator, assigned to the challenge, or an admin."
      });
      return;
    }

    // Normalize date to avoid timezone issues (store as start of day)
    const normalizedDate = new Date(progressDate.setHours(0, 0, 0, 0));

    // Create or update progress using upsert
    const progress = await ProgressModel.findOneAndUpdate(
      {
        userId: req.user._id,
        challengeId: new mongoose.Types.ObjectId(challengeId),
        date: normalizedDate
      },
      {
        isCompleted,
        notes: notes || '',
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date()
      },
      {
        upsert: true, // Create if doesn't exist, update if exists
        new: true, // Return the updated document
        runValidators: true
      }
    );

    // Populate challenge info for response
    await progress.populate('challengeId', 'title description');

    res.status(200).json({
      msg: isCompleted ? "Progress marked as completed" : "Progress updated",
      progress: {
        _id: progress._id,
        challengeId: progress.challengeId,
        date: progress.date,
        isCompleted: progress.isCompleted,
        notes: progress.notes,
        completedAt: progress.completedAt,
        createdAt: progress.createdAt,
        updatedAt: progress.updatedAt
      }
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        msg: "Validation error",
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      console.error('Progress creation error:', error);
      res.status(500).json({
        msg: "Failed to update progress",
        error: error.message
      });
    }
  }
};

// Additional helper function for checking authorization
export const canUserTrackProgress = (user: any, challenge: any): boolean => {
  const userId = user._id.toString();

  // Admin can track any progress
  if (user.role === 'admin') {
    return true;
  }

  // Challenge creator can track progress
  if (challenge.createdBy.toString() === userId) {
    return true;
  }

  // Assigned users can track progress
  if (challenge.assignedUsers.some((assignedId: any) => assignedId.toString() === userId)) {
    return true;
  }

  return false;
};