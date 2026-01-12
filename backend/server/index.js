import express from 'express'

const app = express();
const PORT = 3000;
//const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
