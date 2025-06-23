// // Backend/src/controller/challenges/getChallengesByStatus.ts

// import { Request, Response } from 'express';
// import { ChallengeModel } from '../../models/challenge';

// export const getChallengesByStatus = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { status } = req.params;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     let filter: any = {};

//     // Access control: admin gets all, user gets own/assigned
    

//     // Status logic
//     if (status === 'current') {
//       filter.startDate = { $lte: today };
//       filter.endDate = { $gte: today };
//       filter.isActive = true;
//     } else if (status === 'upcoming') {
//       filter.startDate = { $gt: today };
//       filter.isActive = true;
//     } else if (status === 'completed') {
//       filter.endDate = { $lt: today };
//       // Optionally: filter.isActive = false;
//     } else {
//        res.status(400).json({ msg: "Invalid status. Use 'current', 'upcoming', or 'completed'." });
//       return;
//     }

//     const challenges = await ChallengeModel.find(filter)
//       .populate('createdBy', 'name email role')
//       .populate('assignedUsers', 'name email role');

//     res.status(200).json({
//       msg: "Challenges retrieved successfully",
//       challenges
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       msg: "Failed to retrieve challenges by status",
//       error: error.message
//     });
//   }
// };