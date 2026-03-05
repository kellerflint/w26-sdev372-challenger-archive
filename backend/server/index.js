import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
dotenv.config()

import mmaRouter from './routes/mmaRouter.js'
import poolRouter from './routes/poolRouter.js'

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/mma", mmaRouter);
app.use("/pool", poolRouter);

app.get("/", (req, res) => {
    fetch("https://www.thesportsdb.com/api/v2/examples/all_sports.json", {
        headers: {
            Accept: "application/JSON"
        }
    })
    .then(res => res.json())
    .then(dataFromMyJSON => {
        console.log(dataFromMyJSON.all[2].strSport),
        res.send({
            sport: dataFromMyJSON.all[2].strSport,
            sportPic: dataFromMyJSON.all[3].strSportThumb
        })
    })
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
