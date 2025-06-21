import { Request, Response } from 'express';
import { ChallengeModel } from '../../models/challenge';
import { z } from 'zod';
import mongoose from 'mongoose';
// Zod schema for update (all fields optional)
const updateChallengeSchema = z.object({
  title: z.string().min(5, 'Min Length of title is 5').optional(),
  description: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date" }).optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date" }).optional(),
  assignedUserIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});

export const updateChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const updates = updateChallengeSchema.parse(req.body);

    // Find the challenge
    const challenge = await ChallengeModel.findById(req.params.id);
    if (!challenge) {
      res.status(404).json({ msg: "Challenge not found" });
      return;
    }

    // Check permissions: only creator or admin can update
    if (
      challenge.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403).json({ msg: "Not authorized to update this challenge" });
      return;
    }

    // Apply updates
    if (updates.title !== undefined) challenge.title = updates.title;
    if (updates.description !== undefined) challenge.description = updates.description;
    if (updates.startDate !== undefined) challenge.startDate = new Date(updates.startDate);
    if (updates.endDate !== undefined) challenge.endDate = new Date(updates.endDate);
    if (updates.isActive !== undefined) challenge.isActive = updates.isActive;
    if (updates.assignedUserIds !== undefined) {
      challenge.assignedUsers = updates.assignedUserIds.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      );
    }

    await challenge.save();

    res.status(200).json({
      msg: "Challenge updated successfully",
      challenge
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ msg: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ msg: "Failed to update challenge", error: error.message });
    }
  }
};