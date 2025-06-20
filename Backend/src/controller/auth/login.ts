import express, { Request, Response } from 'express';
import { UserModel , IUser } from '../../models/user';
import { generateAuthToken } from '../../config/generateJwtToken';
import { z } from "zod";
import bcrypt from "bcryptjs";



const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at less than 20 characters long")
});

export const login = async  (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      res.status(400).json({ msg: "User doesn't exist, register first" });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      res.status(400).json({ msg: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = generateAuthToken(existingUser._id.toString(), existingUser.role);

    // Respond with token and user info (excluding password)
    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        name: existingUser.name 
      }
    });
  } catch (error: any) {

    if (error instanceof z.ZodError) {

      res.status(400).json({ message: "Validation error", errors: error.errors });

    } else {
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  }
};

