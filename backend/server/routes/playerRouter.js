import express from 'express'
import { playerController } from '../controllers/playerController.js'
import { calcOddsPool } from '../controllers/calcOddsPool.js';
import { calcOddsMma } from '../controllers/calcOddsMma.js';

const router = express.Router();

export default () => {
    router.get("/", playerController);
    router.get("/odds", calcOddsPool);
    router.get("/oddsMma", calcOddsMma);

    return router;
  };

