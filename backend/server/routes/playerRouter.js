import express from 'express'
import { playerController } from '../controllers/playerController.js'

const router = express.Router();

export default () => {
    router.get("/", playerController);
    return router;
  };

