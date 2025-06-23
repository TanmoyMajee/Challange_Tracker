import express from "express";
import { verifyUser } from "../middleware/verifyUser";
// import { verifyAdmin } from "../middleware/verifyRole"; // If you have a specific admin middleware

// import Controller

import { getProgress } from "../controller/progress/getAllProgress";
import { createProgress } from "../controller/progress/createProgress";
import { getTodayProgress } from "../controller/progress/getTodayProgress";

const router = express.Router();

// All routes are protected
router.use(verifyUser);

// POST /api/progress - Mark or update daily progress
router.post("/", createProgress);

// GET /api/progress - Get progress history (with filters)
router.get("/", getProgress);

// GET /api/progress/today - Get today's pending/completed challenges
router.get("/today", getTodayProgress);

export default router;