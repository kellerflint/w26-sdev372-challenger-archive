import db from "../db/db.js";
import { QueryTypes } from "sequelize";

export async function getMmaMatches(req, res) {
  try {
    const matches = await db.query(
      `SELECT 
          m.matchId,
          m.matchFighters,
          f1.firstName AS fighterOne,
          f2.firstName AS fighterTwo,
          m.headHits,
          m.bodyHits,
          m.dodges,
          m.blocks,
          m.notes
       FROM mmaMatches m
       LEFT JOIN mmaFighters f1 ON m.fighterOneId = f1.fighterId
       LEFT JOIN mmaFighters f2 ON m.fighterTwoId = f2.fighterId`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(matches);

  } catch (err) {
    console.error("GET MMA ERROR:", err);
    res.status(500).json({ error: "Failed to fetch MMA matches" });
  }
}