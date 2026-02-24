export function calcOddsMma(req,res) {

    //Advntages
    const headShot = 10;
    const bodyShot = 5;
    const dodge = 3;
    const shotAtt = 10;
    const takedowns = 2;

    //Disadvantages
    const missedAtt = -2;
    const blocks = 1;
    const shotsBlocked = -1;

    const totalScore = headShot + bodyShot + dodge + shotAtt + takedowns
                 + missedAtt + blocks + shotsBlocked;   

    const maxScore = headShot + bodyShot + dodge + shotAtt + takedowns;
    
    let percentage = (totalScore / maxScore) * 100;

    const data = {
        message: "Mma stats calculated (mock Data)",
        headShot: 20,
        bodyShot: 18,
        dodges: 2,
        takedowns: 5,
        pWin: percentage
    }

    res.json(data)
}