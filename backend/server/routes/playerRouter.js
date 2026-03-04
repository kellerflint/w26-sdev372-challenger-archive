import express from 'express'
import { playerController, postPoolMatch } from '../controllers/playerController.js'
import { calcOddsPool } from '../controllers/calcOddsPool.js';
import { postPool } from "../controllers/postPool.js";
import { getPoolMatches } from "../controllers/getPoolMatches.js";

const router = express.Router();

router.get("/", playerController);
router.post("/", postPoolMatch);
router.get("/odds", calcOddsPool);
router.post("/poolGames", postPool);
router.get("/poolGames", getPoolMatches);

export default router;