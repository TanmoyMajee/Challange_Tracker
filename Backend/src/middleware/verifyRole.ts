import express, { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ msg: "User not authenticated" });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ msg: "Admin access required" });
    return;
  }
  next();
};

export const verifyUserRole = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ msg: "User not authenticated" });
    return;
  }

  if (req.user.role !== 'user') {
    res.status(403).json({ msg: "User access required" });
    return;
  }
  next();
};