import express from 'express'
import { postPoolMatch, getPoolMatches, getPoolLeaderboard } from '../controllers/poolController.js'

const router = express.Router();

router.post("/", postPoolMatch);
router.get("/getPoolMatches", getPoolMatches);
router.get("/getPoolLeaderboard", getPoolLeaderboard);

export default router;
