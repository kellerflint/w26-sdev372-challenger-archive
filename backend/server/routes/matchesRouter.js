import express from "express";
import { matchesController } from "../controllers/matchesController.js";
import { calcOddsMma } from "../controllers/calcOddsMma.js";
import { postMMA } from "../controllers/postMMA.js";
import { getMmaMatches } from "../controllers/getMmaMatches.js";

const router = express.Router();

router.get("/", matchesController);
router.get("/oddsMma", calcOddsMma);
router.post("/mmaMatches", postMMA);
router.get("/mmaMatches", getMmaMatches);

export default router;