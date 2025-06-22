// Backend/src/controller/progress/getProgress.ts

import { Request, Response } from 'express';
import { ProgressModel } from '../../models/progress';
import { ChallengeModel } from '../../models/challenge';
import mongoose from 'mongoose';
import { z } from 'zod';

// Zod schema for query parameters
const querySchema = z.object({
  challengeId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userId: z.string().optional()
});

export const getProgress = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const { challengeId, startDate, endDate, userId } = querySchema.parse(req.query);

    // Check if challenge exists
    const challenge = await ChallengeModel.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ msg: "Challenge not found" });
    }

    // Authorization: Only creator, assigned users, or admin can access
    const isCreator = challenge.createdBy.toString() === req.user._id.toString();
    const isAssigned = challenge.assignedUsers.some(
      (id: any) => id.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAssigned && !isAdmin) {
      return res.status(403).json({ msg: "You are not authorized to view progress for this challenge." });
    }

    // Build filter
    const filter: any = { challengeId: new mongoose.Types.ObjectId(challengeId) };

    // Admin can filter by any user, others can only see their own progress
    if (isAdmin && userId) {
      filter.userId = new mongoose.Types.ObjectId(userId);
    } else if (!isAdmin) {
      filter.userId = req.user._id;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Query progress
    const progress = await ProgressModel.find(filter)
      .populate('challengeId', 'title description')
      .populate('userId', 'name email')
      .sort({ date: 1 });

    res.status(200).json({ progress });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ msg: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ msg: "Failed to get progress", error: error.message });
    }
  }
};