// Backend/src/controller/challenges/assignChallenge.ts

import { Request, Response } from 'express';
import { ChallengeModel } from '../../models/challenge';
import { UserModel } from '../../models/user';
import mongoose from 'mongoose';
import { z } from 'zod';

// Zod schema for request body validation
const assignSchema = z.object({
  userIds: z.array(z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid user ID"
  }))
});

export const assignChallenge = async (req: Request, res: Response) : Promise<void> => {
  try {
    // Validate request body
    const { userIds } = assignSchema.parse(req.body);

    // Find the challenge
    const challenge = await ChallengeModel.findById(req.params.id);
    if (!challenge) {
       res.status(404).json({ msg: "Challenge not found" });
      return;
    }

    // Only creator or admin can assign users
    const isCreator = challenge.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isCreator && !isAdmin) {
       res.status(403).json({ msg: "You are not authorized to assign users to this challenge." });
      return;
    }

    // Validate all userIds exist
    const users = await UserModel.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
       res.status(400).json({ msg: "One or more user IDs are invalid." });
      return;
    }

    // Merge and deduplicate assigned users
    const currentAssigned = challenge.assignedUsers.map((id: any) => id.toString());
    const newAssigned = Array.from(new Set([...currentAssigned, ...userIds]));

    challenge.assignedUsers = newAssigned;
    await challenge.save();

    res.status(200).json({
      msg: "Users assigned to challenge successfully",
      assignedUsers: challenge.assignedUsers
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ msg: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ msg: "Failed to assign users", error: error.message });
    }
  }
};