import express, { Request, Response} from 'express';
import { UserModel } from '../../models/user';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is already attached to req by verifyUser middleware
    if (!req.user) {
      res.status(401).json({ msg: "User not authenticated" });
      return;
    }

    // Find user by ID (excluding password)
    const user = await UserModel.findById(req.user._id).select('-password');

    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    // Return user profile data
    res.status(200).json({
      msg: "Profile retrieved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error: any) {
    res.status(500).json({
      msg: "Failed to retrieve profile",
      error: error.message
    });
  }
};
