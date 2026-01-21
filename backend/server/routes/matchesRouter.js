import express from 'express'
import { matchesController } from '../controllers/matchesController.js'

const router = express.Router();

export default () => {
    router.get("/", matchesController);
    return router;
};

  