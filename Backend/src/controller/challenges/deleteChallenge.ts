import { Request, Response } from 'express';
import { ChallengeModel } from '../../models/challenge';

export const deleteChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find the challenge
    const challenge = await ChallengeModel.findById(req.params.id);
    if (!challenge) {
      res.status(404).json({ msg: "Challenge not found" });
      return;
    }

    // Check permissions: only creator or admin can delete
    if (
      challenge.createdBy.toString() === req.user._id.toString() ||
      req.user.role === 'admin'
    ) {
      // Delete the challenge
      await ChallengeModel.findByIdAndDelete(req.params.id);

      res.status(200).json({
        msg: "Challenge deleted successfully"
      });
    } else {
      res.status(403).json({ msg: "Not authorized to delete this challenge" });
      return;
    }

  } catch (error: any) {
    res.status(500).json({ msg: "Failed to delete challenge", error: error.message });
  }
};