import sequelize from '../db/db.js';
import { QueryTypes } from 'sequelize';

export function playerController(req,res) {
    res.json({
        message: "Pool Backend is connected and working",
        status: 200,
    });
}

function normalizeName(fullName = '') {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    return {
        firstName: parts.shift() || 'Unknown',
        lastName: parts.join(' ') || 'Player',
    };
}

async function findPlayer(firstName, lastName) {
    const rows = await sequelize.query(
        'SELECT playerId FROM poolPlayers WHERE firstName = ? AND lastName = ? LIMIT 1',
        {
            replacements: [firstName, lastName],
            type: QueryTypes.SELECT,
        }
    );
    return rows[0]?.playerId ?? null;
}

async function createPlayer(firstName, lastName) {
    await sequelize.query(
        'INSERT INTO poolPlayers (firstName, lastName, win, loss) VALUES (?, ?, 0, 0)',
        {
            replacements: [firstName, lastName],
            type: QueryTypes.INSERT,
        }
    );
    const rows = await sequelize.query(
        'SELECT playerId FROM poolPlayers WHERE firstName = ? AND lastName = ? ORDER BY playerId DESC LIMIT 1',
        {
            replacements: [firstName, lastName],
            type: QueryTypes.SELECT,
        }
    );
    return rows[0]?.playerId ?? null;
}

async function findOrCreatePlayer(fullName) {
    const { firstName, lastName } = normalizeName(fullName);
    let playerId = await findPlayer(firstName, lastName);
    if (playerId) return playerId;
    playerId = await createPlayer(firstName, lastName);
    if (!playerId) {
        throw new Error(`Unable to create player ${fullName}`);
    }
    return playerId;
}

function toInt(value) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
}

async function adjustWinLoss(winnerId, loserId) {
    if (!winnerId || !loserId) return;
    await sequelize.query(
        'UPDATE poolPlayers SET win = COALESCE(win, 0) + 1 WHERE playerId = ?',
        { replacements: [winnerId], type: QueryTypes.UPDATE }
    );
    await sequelize.query(
        'UPDATE poolPlayers SET loss = COALESCE(loss, 0) + 1 WHERE playerId = ?',
        { replacements: [loserId], type: QueryTypes.UPDATE }
    );
}

export async function postPoolMatch(req, res) {
    try {
        const { playerOne, playerTwo, matchDate, location, notes } = req.body ?? {};

        if (!playerOne?.name || !playerTwo?.name) {
            return res.status(400).json({ error: 'Both player names are required.' });
        }

        const playerOneId = await findOrCreatePlayer(playerOne.name);
        const playerTwoId = await findOrCreatePlayer(playerTwo.name);

        const playerOneScore = toInt(playerOne.score);
        const playerTwoScore = toInt(playerTwo.score);
        const playerOneShotAtt = toInt(playerOne.attemptedBalls || playerOne.shotAtt);
        const playerTwoShotAtt = toInt(playerTwo.attemptedBalls || playerTwo.shotAtt);
        const playerOneShotPot = toInt(playerOne.madeBalls || playerOne.shotPot);
        const playerTwoShotPot = toInt(playerTwo.madeBalls || playerTwo.shotPot);
        const playerOneErrors = toInt(playerOne.errors);
        const playerTwoErrors = toInt(playerTwo.errors);
        const playerOneSafeties = toInt(playerOne.safeties);
        const playerTwoSafeties = toInt(playerTwo.safeties);
        const matchTimestamp = matchDate ? new Date(matchDate) : new Date(); // should this be create in form
        // location?
        // notes?

        await sequelize.query(
            `INSERT INTO poolGames (
                playerOneId,
                playerTwoId,
                playerOneScore,
                playerTwoScore,
                playerOneShotAtt,
                playerTwoShotAtt,
                playerOneShotPot,
                playerTwoShotPot,
                playerOneErrors,
                playerTwoErrors,
                playerOneSafeties,
                playerTwoSafeties,
                matchDate,
                location,
                notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            {
                replacements: [
                    playerOneId,
                    playerTwoId,
                    playerOneScore,
                    playerTwoScore,
                    playerOneShotAtt,
                    playerTwoShotAtt,
                    playerOneShotPot,
                    playerTwoShotPot,
                    playerOneErrors,
                    playerTwoErrors,
                    playerOneSafeties,
                    playerTwoSafeties,
                    matchTimestamp,
                    location ?? null,
                    notes ?? null,
                ],
                type: QueryTypes.INSERT,
            }
        );

        if (playerOneScore !== playerTwoScore) {
            const winnerId = playerOneScore > playerTwoScore ? playerOneId : playerTwoId;
            const loserId = winnerId === playerOneId ? playerTwoId : playerOneId;
            await adjustWinLoss(winnerId, loserId);
        }

        return res.status(201).json({
            message: 'Pool match recorded',
            players: {
                playerOneId,
                playerTwoId,
            },
        });
    } catch (error) {
        console.error('Failed to save pool match:', error);
        return res.status(500).json({ error: 'Unable to record pool match' });
    }
}
