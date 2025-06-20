import express, { Request, Response } from 'express';
import { UserModel } from '../../models/user';
import {generateAuthToken} from '../../config/generateJwtToken'
import { z } from "zod";
import bcrypt from "bcryptjs";
// import logger from '../../utils/logger';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at less then 20 characters long")
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const existingUser = UserModel.find({ email });
    if (!existingUser) {
      res.json({ msg: "user doesnt exists register first", status: 400 });
    }
    // now chek the pass 
    if (await bcrypt.compare(password, existingUser.password));
  } catch (error) {
    
  }
});

export default router;