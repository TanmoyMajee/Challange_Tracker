import { Request, Response } from 'express';
import { ProgressModel } from '../../models/progress';
import { ChallengeModel } from '../../models/challenge';
import mongoose from 'mongoose';

export const getTodayProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Get all active challenges assigned to the user
    const assignedChallenges = await ChallengeModel.find({
      isActive: true,
      $or: [
        { assignedUsers: req.user._id },
        { createdBy: req.user._id }
      ],
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    // Get today's progress for these challenges
    const todayProgress = await ProgressModel.find({
      userId: req.user._id,
      challengeId: { $in: assignedChallenges.map(c => c._id) },
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // End of today
      }
    });

    // Create a map of challenge progress
    const progressMap = new Map();
    todayProgress.forEach(progress => {
      progressMap.set(progress.challengeId.toString(), progress);
    });

    // Prepare pending challenges (challenges without today's progress)
    const pendingChallenges = assignedChallenges
      .filter(challenge => !progressMap.has(challenge._id.toString()))
      .map(challenge => ({
        _id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        isActive: challenge.isActive
      }));

    // Prepare completed challenges (challenges with today's completed progress)
    const completedChallenges = todayProgress
      .filter(progress => progress.isCompleted)
      .map(progress => {
        const challenge = assignedChallenges.find(c => c._id.toString() === progress.challengeId.toString());
        return {
          _id: challenge?._id,
          title: challenge?.title,
          description: challenge?.description,
          progress: {
            isCompleted: progress.isCompleted,
            notes: progress.notes,
            completedAt: progress.completedAt
          }
        };
      });

    res.status(200).json({
      msg: "Today's progress retrieved successfully",
      pendingChallenges,
      completedChallenges,
      totalAssigned: assignedChallenges.length,
      pendingCount: pendingChallenges.length,
      completedCount: completedChallenges.length
    });

  } catch (error: any) {
    res.status(500).json({ msg: "Failed to get today's progress", error: error.message });
  }
};