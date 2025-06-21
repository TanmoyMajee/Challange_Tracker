import { Request, Response } from 'express';
import { ChallengeModel } from '../../models/challenge';
import { z } from 'zod';

// Zod schema for challenge creation
const challengeSchema = z.object({
  title: z.string().min(5, 'Min Length of title is 5'),
  description: z.string().min(15, 'Min Length of description is 15'),
  assignedUsers: z.array(z.string()).optional(), // array of user IDs as strings, can be empty
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date" }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date" }),
  isActive: z.boolean().optional()
});

export const postAllChalanges = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the request body with Zod
    const { title, description, assignedUsers = [], startDate, endDate, isActive = true } = challengeSchema.parse(req.body);

    // Create the challenge
    const challenge = new ChallengeModel({
      title,
      description,
      createdBy: req.user._id, // assuming verifyUser middleware sets req.user
      assignedUsers, // can be an empty array
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive
    });

    await challenge.save();

    res.status(201).json({
      msg: "Challenge created successfully",
      challenge
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ msg: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ msg: "Failed to create challenge", error: error.message });
    }
  }
};