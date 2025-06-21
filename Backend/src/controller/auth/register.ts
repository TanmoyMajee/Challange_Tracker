import express, { Request, Response } from 'express';
import { UserModel } from '../../models/user';
import { generateAuthToken } from '../../config/generateJwtToken';
import { z } from "zod";
import bcrypt from "bcryptjs";

const registSchema = z.object({
  name : z.string().min(2,"Name Must have Len 3"),
  email:z.string().email("Invalid Email"),
  password: z.string().min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at less then 20 characters long"),
  role: z.enum(["user", "admin"]).default("user")
});

export const register = async (req:Request,res:Response) : Promise<void>=>{
    try{
        const {name,email,password,role} = registSchema.parse(req.body);
        // find if uer alrady exits 
        const existingUser =await UserModel.findOne({email});

        if(existingUser){
          res.status(400).json({ msg: "User already exists" }); return; 
        }
        // now create the user [ hash the pass]
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        role
      });

      await newUser.save();

      // Generate JWT token
      const token = generateAuthToken(newUser._id.toString(), newUser.role);

      // Respond with token and user info (excluding password)
      res.status(201).json({
        msg: "Registration successful",
        token,
        user: {
          _id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          name: newUser.name
        }
      });
      return;

    }catch(error : any){
      // Zod err
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).send("Failed to register user, please try again later.");
    }
}