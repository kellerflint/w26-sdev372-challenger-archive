import express from 'express'
import sequelize from './db/db.js';

import matchesRouter from './routes/matchesRouter.js'
import playerRouter from './routes/playerRouter.js'

const app = express();
const PORT = 3000;
//const PORT = process.env.PORT;

app.use("/", matchesRouter());       
app.use("/", playerRouter());   


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
