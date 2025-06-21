import express, { Request, Response , NextFunction} from 'express';
import jwt from  'jsonwebtoken'
import { UserModel } from '../models/user';

interface JwtPayload {
  _id: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

export const verifyUser = async (req:Request,res:Response,next:NextFunction)=>{
      // verify the req user token form header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try{
        token = req.headers.authorization.split(' ')[1];
        // now verfiy thw jst secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // const user = await UserModel.findById(decoded._id);

        req.user = decoded; // Attach decoded user info to the request
        next();
      }catch(error : any){
        res.status(401).json({ msg: "Invalid or expired token" });
      }
  }else{
    res.status(400).json({ msg:"No token provided "});
  }
}