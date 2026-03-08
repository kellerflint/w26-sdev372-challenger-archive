import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import mmaRouter from './routes/mmaRouter.js';
import poolRouter from './routes/poolRouter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/mma', mmaRouter);
app.use('/pool', poolRouter);

app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://www.thesportsdb.com/api/v2/examples/all_sports.json', {
      headers: { Accept: 'application/JSON' },
    });

    if (!response.ok) {
      throw new Error(`Sports metadata fetch failed with status ${response.status}`);
    }

    const dataFromMyJSON = await response.json();

    if (!Array.isArray(dataFromMyJSON?.all) || dataFromMyJSON.all.length < 4) {
      throw new Error('Sports metadata payload was missing expected data');
    }

    console.log(dataFromMyJSON.all[2].strSport);
    res.send({
      sport: dataFromMyJSON.all[2].strSport,
      sportPic: dataFromMyJSON.all[3].strSportThumb,
    });
  } catch (error) {
    console.error('SPORTS METADATA ERROR:', error);
    res.status(502).send({ error: 'Unable to load sports metadata at this time.' });
  }
});

export default app;
