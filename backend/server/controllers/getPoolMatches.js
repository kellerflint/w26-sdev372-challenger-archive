import db from "../db/db.js";
import { QueryTypes } from "sequelize";

export async function getPoolMatches(req, res) {
  try {
    const games = await db.query(
      `SELECT 
          g.gameId,
          p1.firstName AS playerOne,
          p2.firstName AS playerTwo,
          g.playerOneScore,
          g.playerTwoScore,
          g.matchDate
       FROM poolGames g
       JOIN poolPlayers p1 ON g.playerOneId = p1.playerId
       JOIN poolPlayers p2 ON g.playerTwoId = p2.playerId`,
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