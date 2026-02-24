export function calcOddsPool(req,res) {
    const shotAtt = 20;
    const shotPot = 18;
    const errors = 2;
    const effSafety = 5;
    const averageShot = shotPot/shotAtt;
    const averageError = errors/shotAtt;
    const pWin = (0.5 * averageShot) + (0.3 * effSafety) + (0.2 * (1 - averageError));
    
    const data = {
        message: "Stats and mock percentage win",
        shotAtt: 20,
        shotPot: 18,
        errors: 2,
        effSafety: 5,
        pWin: pWin,
        status: 200
    }

    res.json(data)
}
