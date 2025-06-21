import express, { Request, Response } from 'express';
// import { UserModel } from '../../models/user';
import { ChallengeModel } from '../../models/challenge';

export const getAllChalanges = async (req: Request, res: Response): Promise<void> => {
  // admin can get all the challanges 
  // user can get the cahllanges that are created by him or 
  // assigned to him

  try {
    let challenges;

    if (req.user.role === 'admin') {
      // Admin: get all challenges, populate creator and assigned users
      challenges = await ChallengeModel.find()
        .populate('createdBy', 'name email role')
        .populate('assignedUsers', 'name email role');
    } else {
      // User: get challenges created by or assigned to the user
      challenges = await ChallengeModel.find({
        $or: [
          { createdBy: req.user._id },
          { assignedUsers: req.user._id }
        ]
      })
        .populate('createdBy', 'name email role')
        .populate('assignedUsers', 'name email role');
    }

    res.status(200).json({
      msg: "Challenges retrieved successfully",
      challenges
    });
  } catch (error: any) {
    res.status(500).json({
      msg: "Failed to retrieve challenges",
      error: error.message
    });
  }

}