import express from "express";
import { postMMA, getMmaMatches, getMmaLeaderboard } from "../controllers/mmaController.js";

const router = express.Router();

router.post("/postMmaMatch", postMMA);
router.get("/getMmaMatches", getMmaMatches);
router.get("/getMmaLeaderboard", getMmaLeaderboard);

export default router;
