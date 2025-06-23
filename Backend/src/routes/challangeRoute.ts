import express from "express";
import { verifyUser } from "../middleware/verifyUser";
// import { verifyAdmin } from "../middleware/verifyRole"; // If you have a specific admin middleware

// Import controllers
import { getAllChalanges } from "../controller/challenges/getChallenges";
import { postAllChalanges } from "../controller/challenges/postChallenge";
import { updateChallenge } from "../controller/challenges/updateChallenge";
import { deleteChallenge } from "../controller/challenges/deleteChallenge";
import { getChallengeById } from "../controller/challenges/getChallangeById";
import { assignChallenge } from "../controller/challenges/assignChallange";
// import { getChallengesByStatus } from "../controller/challenges/getChallengesByStatus";

const router = express.Router();

// Get all challenges (admin: all, user: own/assigned)
router.get("/", verifyUser, getAllChalanges);

// Create a new challenge
router.post("/", verifyUser, postAllChalanges);

// Get a specific challenge by ID
router.get("/:id", verifyUser, getChallengeById);

// Update a challenge (creator or admin)
router.put("/:id", verifyUser, updateChallenge);

// Delete a challenge (creator or admin)
router.delete("/:id", verifyUser, deleteChallenge);

// Assign challenge to users [chlng id as params ] (creator or admin)
router.post("/assign/:id", verifyUser, assignChallenge);

// Get challenges by status (current/upcoming/completed)
// router.get("/status/:status", verifyUser, getChallengesByStatus);

export default router;