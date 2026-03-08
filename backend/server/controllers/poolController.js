import sequelize from '../db/db.js';
import { QueryTypes } from 'sequelize';
import db from '../db/db.js';

function normalizeName(fullName = '') {
    const trimmed = fullName.trim();
    return trimmed.length ? trimmed : 'Unknown';
}

async function findPlayer(firstName, options = {}) {
    const rows = await sequelize.query(
        'SELECT playerId FROM poolPlayers WHERE firstName = ? LIMIT 1',
        {
            replacements: [firstName],
            type: QueryTypes.SELECT,
            ...options,
        }
    );
    return rows[0]?.playerId ?? null;
}

async function createPlayer(firstName, options = {}) {
    await sequelize.query(
        'INSERT INTO poolPlayers (firstName, win, loss) VALUES (?, 0, 0)',
        {
            replacements: [firstName],
            type: QueryTypes.INSERT,
            ...options,
        }
    );
    const rows = await sequelize.query(
        'SELECT playerId FROM poolPlayers WHERE firstName = ? ORDER BY playerId DESC LIMIT 1',
        {
            replacements: [firstName],
            type: QueryTypes.SELECT,
            ...options,
        }
    );
    return rows[0]?.playerId ?? null;
}

async function findOrCreatePlayer(fullName, options = {}) {
    const firstName = normalizeName(fullName);
    let playerId = await findPlayer(firstName, options);
    if (playerId) return playerId;
    playerId = await createPlayer(firstName, options);
    if (!playerId) {
        throw new Error(`Unable to create player ${fullName}`);
    }
    return playerId;
}

function toInt(value) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
}

async function adjustWinLoss(winnerId, loserId, options = {}) {
    if (!winnerId || !loserId) return;
    await sequelize.query(
        'UPDATE poolPlayers SET win = COALESCE(win, 0) + 1 WHERE playerId = ?',
        { replacements: [winnerId], type: QueryTypes.UPDATE, ...options }
    );
    await sequelize.query(
        'UPDATE poolPlayers SET loss = COALESCE(loss, 0) + 1 WHERE playerId = ?',
        { replacements: [loserId], type: QueryTypes.UPDATE, ...options }
    );
}

export async function getPoolMatches(req, res) {
  try {
    const games = await db.query(
      `SELECT 
          g.gameId,
          p1.firstName AS playerOne,
          p2.firstName AS playerTwo,
          g.playerOneScore,
          g.playerTwoScore,
          g.playerOneShotAtt,
          g.playerTwoShotAtt,
          g.playerOneShotPot,
          g.playerTwoShotPot,
          g.playerOneErrors,
          g.playerTwoErrors,
          g.playerOneSafeties,
          g.playerTwoSafeties,
          g.matchDate,
          g.location
       FROM poolGames g
       JOIN poolPlayers p1 ON g.playerOneId = p1.playerId
       JOIN poolPlayers p2 ON g.playerTwoId = p2.playerId
       ORDER BY g.matchDate DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(games);
  } catch (err) {
    console.error("GET POOL ERROR:", err);
    res.status(500).json({ error: "Failed to fetch pool games" });
  }
}

const leaderboardQuery = `
  WITH ranked AS (
    SELECT
      playerId,
      firstName,
      win,
      loss,
      CASE
        WHEN (win + loss) = 0 THEN 0
        ELSE win / (win + loss)
      END AS winPct
    FROM poolPlayers
  )
  SELECT
    p.playerId,
    p.firstName,
    p.win,
    p.loss,
    p.winPct,
    matchData.gameId,
    matchData.playerOneId,
    matchData.playerTwoId,
    matchData.playerOneScore,
    matchData.playerTwoScore,
    matchData.matchDate,
    matchData.location,
    matchData.playerOne,
    matchData.playerTwo
  FROM ranked p
  LEFT JOIN LATERAL (
    SELECT
      g.gameId,
      g.playerOneId,
      g.playerTwoId,
      g.playerOneScore,
      g.playerTwoScore,
      g.matchDate,
      g.location,
      p1.firstName AS playerOne,
      p2.firstName AS playerTwo
    FROM poolGames g
    JOIN poolPlayers p1 ON g.playerOneId = p1.playerId
    JOIN poolPlayers p2 ON g.playerTwoId = p2.playerId
    WHERE g.playerOneId = p.playerId OR g.playerTwoId = p.playerId
    ORDER BY g.matchDate DESC
    LIMIT 1
  ) matchData ON TRUE
  ORDER BY p.winPct DESC, p.win DESC
  LIMIT 4;
`;

export async function getPoolLeaderboard(req, res) {
  try {
    const rows = await db.query(leaderboardQuery, { type: QueryTypes.SELECT });
    const normalized = rows.map((row) => {
      const {
        gameId,
        playerOneId,
        playerTwoId,
        playerOneScore,
        playerTwoScore,
        matchDate,
        location,
        playerOne,
        playerTwo,
        winPct,
        ...playerFields
      } = row;
      return {
        ...playerFields,
        winPct: Number(winPct ?? 0),
        recentMatch: gameId
          ? {
              gameId,
              playerOneId,
              playerTwoId,
              playerOneScore,
              playerTwoScore,
              matchDate,
              location,
              playerOne,
              playerTwo,
            }
          : null,
      };
    });
    res.json(normalized);
  } catch (error) {
    console.error('GET POOL LEADERBOARD ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch pool leaderboard' });
  }
}

export async function postPoolMatch(req, res) {
    try {
        const { playerOne, playerTwo, matchDate, location } = req.body ?? {};

        if (!playerOne?.name || !playerTwo?.name) {
            return res.status(400).json({ error: 'Both player names are required.' });
        }

        const transaction = await sequelize.transaction();

        try {
            const playerOneId = await findOrCreatePlayer(playerOne.name, { transaction });
            const playerTwoId = await findOrCreatePlayer(playerTwo.name, { transaction });

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
            const matchTimestamp = matchDate ? new Date(matchDate) : new Date();

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
                    location
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                    ],
                    type: QueryTypes.INSERT,
                    transaction,
                }
            );

            if (playerOneScore !== playerTwoScore) {
                const winnerId = playerOneScore > playerTwoScore ? playerOneId : playerTwoId;
                const loserId = winnerId === playerOneId ? playerTwoId : playerOneId;
                await adjustWinLoss(winnerId, loserId, { transaction });
            }

            await transaction.commit();

            return res.status(201).json({
                message: 'Pool match recorded',
                players: {
                    playerOneId,
                    playerTwoId,
                },
            });
        } catch (innerError) {
            await transaction.rollback();
            throw innerError;
        }
    } catch (error) {
        console.error('Failed to save pool match:', error);
        return res.status(500).json({ error: 'Unable to record pool match' });
    }
}
