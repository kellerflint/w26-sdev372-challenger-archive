import sequelize from '../db/db.js';
import { QueryTypes } from 'sequelize';
import db from '../db/db.js';

function normalizeName(fullName = '') {
  const trimmed = fullName.trim();
  return trimmed.length ? trimmed : 'Unknown';
}

async function findFighter(firstName, options = {}) {
  const rows = await sequelize.query(
    'SELECT fighterId FROM mmaFighters WHERE firstName = ? LIMIT 1',
    {
      replacements: [firstName],
      type: QueryTypes.SELECT,
      ...options,
    }
  );
  return rows[0]?.fighterId ?? null;
}

async function createFighter(firstName, options = {}) {
  await sequelize.query(
    'INSERT INTO mmaFighters (firstName, lastName) VALUES (?, ?)',
    {
      replacements: [firstName, ''],
      type: QueryTypes.INSERT,
      ...options,
    }
  );
  const rows = await sequelize.query(
    'SELECT fighterId FROM mmaFighters WHERE firstName = ? ORDER BY fighterId DESC LIMIT 1',
    {
      replacements: [firstName],
      type: QueryTypes.SELECT,
      ...options,
    }
  );
  return rows[0]?.fighterId ?? null;
}

async function findOrCreateFighter(fullName, options = {}) {
  const firstName = normalizeName(fullName);
  let fighterId = await findFighter(firstName, options);
  if (fighterId) return fighterId;
  fighterId = await createFighter(firstName, options);
  if (!fighterId) {
    throw new Error(`Unable to create fighter ${fullName}`);
  }
  return fighterId;
}

function toInt(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

const leaderboardQuery = `
  WITH stats AS (
    SELECT
      fighterOneId AS fighterId,
      (fighterOneHeadHits + fighterOneBodyHits + fighterOneDodges + fighterOneBlocks) AS metric
    FROM mmaMatches
    UNION ALL
    SELECT
      fighterTwoId AS fighterId,
      (fighterTwoHeadHits + fighterTwoBodyHits + fighterTwoDodges + fighterTwoBlocks) AS metric
    FROM mmaMatches
  ),
  aggregated AS (
    SELECT
      f.fighterId,
      f.firstName,
      COALESCE(SUM(s.metric), 0) AS totalMetric
    FROM mmaFighters f
    LEFT JOIN stats s ON s.fighterId = f.fighterId
    GROUP BY f.fighterId, f.firstName
  )
  SELECT
    a.fighterId,
    a.firstName,
    a.totalMetric,
    matchData.matchId,
    matchData.matchFighters,
    matchData.fighterOneId,
    matchData.fighterTwoId,
    matchData.fighterOneHeadHits,
    matchData.fighterTwoHeadHits,
    matchData.fighterOneBodyHits,
    matchData.fighterTwoBodyHits,
    matchData.fighterOneDodges,
    matchData.fighterTwoDodges,
    matchData.fighterOneBlocks,
    matchData.fighterTwoBlocks,
    matchData.fighterOneNotes,
    matchData.fighterTwoNotes,
    matchData.matchDate,
    matchData.location,
    matchData.fighterOne,
    matchData.fighterTwo
  FROM aggregated a
  LEFT JOIN (
    SELECT
      g.matchId,
      g.matchFighters,
      g.fighterOneId,
      g.fighterTwoId,
      g.fighterOneHeadHits,
      g.fighterTwoHeadHits,
      g.fighterOneBodyHits,
      g.fighterTwoBodyHits,
      g.fighterOneDodges,
      g.fighterTwoDodges,
      g.fighterOneBlocks,
      g.fighterTwoBlocks,
      g.fighterOneNotes,
      g.fighterTwoNotes,
      g.matchDate,
      g.location,
      f1.firstName AS fighterOne,
      f2.firstName AS fighterTwo
    FROM mmaMatches g
    JOIN mmaFighters f1 ON g.fighterOneId = f1.fighterId
    JOIN mmaFighters f2 ON g.fighterTwoId = f2.fighterId
  ) matchData ON matchData.matchId = (
    SELECT m2.matchId
    FROM mmaMatches m2
    WHERE m2.fighterOneId = a.fighterId OR m2.fighterTwoId = a.fighterId
    ORDER BY m2.matchDate DESC
    LIMIT 1
  )
  ORDER BY a.totalMetric DESC
  LIMIT 4;
`;

export async function getMmaLeaderboard(req, res) {
  try {
    const rows = await db.query(leaderboardQuery, { type: QueryTypes.SELECT });
    const normalized = rows.map((row) => {
      const {
        matchId,
        matchFighters,
        fighterOneId,
        fighterTwoId,
        fighterOneHeadHits,
        fighterTwoHeadHits,
        fighterOneBodyHits,
        fighterTwoBodyHits,
        fighterOneDodges,
        fighterTwoDodges,
        fighterOneBlocks,
        fighterTwoBlocks,
        fighterOneNotes,
        fighterTwoNotes,
        matchDate,
        location,
        fighterOne,
        fighterTwo,
        totalMetric,
        ...fighter
      } = row;
      return {
        ...fighter,
        totalMetric: Number(totalMetric ?? 0),
        recentMatch: matchId
          ? {
              matchId,
              matchFighters,
              fighterOneId,
              fighterTwoId,
              fighterOneHeadHits,
              fighterTwoHeadHits,
              fighterOneBodyHits,
              fighterTwoBodyHits,
              fighterOneDodges,
              fighterTwoDodges,
              fighterOneBlocks,
              fighterTwoBlocks,
              fighterOneNotes,
              fighterTwoNotes,
              matchDate,
              location,
              fighterOne,
              fighterTwo,
            }
          : null,
      };
    });
    res.json(normalized);
  } catch (error) {
    console.error('GET MMA LEADERBOARD ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch mma leaderboard' });
  }
}

export async function getMmaMatches(req, res) {
  try {
    const matches = await db.query(
      `SELECT 
          m.matchId,
          m.matchFighters,
          f1.firstName AS fighterOne,
          f2.firstName AS fighterTwo,
          m.fighterOneHeadHits,
          m.fighterTwoHeadHits,
          m.fighterOneBodyHits,
          m.fighterTwoBodyHits,
          m.fighterOneDodges,
          m.fighterTwoDodges,
          m.fighterOneBlocks,
          m.fighterTwoBlocks,
          m.fighterOneNotes,
          m.fighterTwoNotes,
          m.matchDate,
          m.location
       FROM mmaMatches m
       LEFT JOIN mmaFighters f1 ON m.fighterOneId = f1.fighterId
       LEFT JOIN mmaFighters f2 ON m.fighterTwoId = f2.fighterId
       ORDER BY m.matchDate DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(matches);
  } catch (err) {
    console.error('GET MMA ERROR:', err);
    res.status(500).json({ error: 'Failed to fetch MMA matches' });
  }
}

export async function postMMA(req, res) {
  try {
    const { fighterOne, fighterTwo, matchDate, location } = req.body ?? {};

    if (!fighterOne?.name || !fighterTwo?.name) {
      return res.status(400).json({ error: 'Both fighter names are required.' });
    }

    if (!location?.trim()) {
      return res.status(400).json({ error: 'Match location is required.' });
    }

    const transaction = await sequelize.transaction();

    try {
      const fighterOneId = await findOrCreateFighter(fighterOne.name, { transaction });
      const fighterTwoId = await findOrCreateFighter(fighterTwo.name, { transaction });

      const matchTimestamp = matchDate ? new Date(matchDate) : new Date();

      await sequelize.query(
        `INSERT INTO mmaMatches (
          matchFighters,
          fighterOneHeadHits,
          fighterTwoHeadHits,
          fighterOneBodyHits,
          fighterTwoBodyHits,
          fighterOneDodges,
          fighterTwoDodges,
          fighterOneBlocks,
          fighterTwoBlocks,
          fighterOneNotes,
          fighterTwoNotes,
          matchDate,
          location,
          fighterOneId,
          fighterTwoId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [
            `${normalizeName(fighterOne.name)} vs ${normalizeName(fighterTwo.name)}`,
            toInt(fighterOne.headHits),
            toInt(fighterTwo.headHits),
            toInt(fighterOne.bodyHits),
            toInt(fighterTwo.bodyHits),
            toInt(fighterOne.dodges),
            toInt(fighterTwo.dodges),
            toInt(fighterOne.blocks),
            toInt(fighterTwo.blocks),
            fighterOne.notes?.trim() || "",
            fighterTwo.notes?.trim() || "",
            matchTimestamp,
            location.trim(),
            fighterOneId,
            fighterTwoId,
          ],
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      return res.status(201).json({ message: 'MMA Match Saved' });
    } catch (innerError) {
      await transaction.rollback();
      throw innerError;
    }
  } catch (error) {
    console.error('MMA ERROR:', error);
    return res.status(500).json({ error: 'Failed to save MMA match' });
  }
}
