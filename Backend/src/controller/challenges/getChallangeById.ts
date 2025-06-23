// Backend/src/controller/challenges/getChallengeById.ts

import { Request, Response } from 'express';
import { ChallengeModel } from '../../models/challenge';

export const getChallengeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const challenge = await ChallengeModel.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedUsers', 'name email role');

    if (!challenge) {
       res.status(404).json({ msg: "Challenge not found" });
       return;
    }

    // Access control: admin, creator, or assigned user
    const isAdmin = req.user.role === 'admin';
    const isCreator = challenge.createdBy._id.toString() === req.user._id.toString();
    const isAssigned = challenge.assignedUsers.some(
      (user: any) => user._id.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isCreator && !isAssigned) {
       res.status(403).json({ msg: "You are not authorized to view this challenge." });
      return;
    }

    res.status(200).json({
      msg: "Challenge retrieved successfully",
      challenge
    });
  } catch (error: any) {
    res.status(500).json({
      msg: "Failed to retrieve challenge",
      error: error.message
    });
  }
};