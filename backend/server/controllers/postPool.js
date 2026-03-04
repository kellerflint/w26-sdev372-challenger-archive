import db from "../db/db.js";
import { QueryTypes } from "sequelize";

export async function postPool(req, res) {
  console.log("REQUEST BODY:", req.body);

  const { playerOne, playerTwo } = req.body;

  try {
    // ================= PLAYER ONE =================
    const playerOneName = playerOne?.name?.trim();
    console.log("PLAYER ONE NAME:", playerOneName);

    const p1 = await db.query(
      "SELECT playerId FROM poolPlayers WHERE firstName = ?",
      {
        replacements: [playerOneName],
        type: QueryTypes.SELECT,
      }
    );

    let playerOneId;

    if (p1.length > 0) {
      playerOneId = p1[0].playerId;
    } else {
      const insertP1 = await db.query(
        "INSERT INTO poolPlayers (firstName, lastName, win, loss) VALUES (?, '', 0, 0)",
        {
          replacements: [playerOneName],
          type: QueryTypes.INSERT,
        }
      );

      playerOneId = insertP1[0];
    }

    // ================= PLAYER TWO =================
    const playerTwoName = playerTwo?.name?.trim();
    console.log("PLAYER TWO NAME:", playerTwoName);

    const p2 = await db.query(
      "SELECT playerId FROM poolPlayers WHERE firstName = ?",
      {
        replacements: [playerTwoName],
        type: QueryTypes.SELECT,
      }
    );

    let playerTwoId;

    if (p2.length > 0) {
      playerTwoId = p2[0].playerId;
    } else {
      const insertP2 = await db.query(
        "INSERT INTO poolPlayers (firstName, lastName, win, loss) VALUES (?, '', 0, 0)",
        {
          replacements: [playerTwoName],
          type: QueryTypes.INSERT,
        }
      );

      playerTwoId = insertP2[0];
    }

    // ================= INSERT GAME =================
    await db.query(
      `INSERT INTO poolGames (
        playerOneId, playerTwoId,
        playerOneScore, playerTwoScore,
        playerOneShotAtt, playerTwoShotAtt,
        playerOneShotPot, playerTwoShotPot,
        playerOneErrors, playerTwoErrors,
        playerOneSafeties, playerTwoSafeties,
        matchDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          playerOneId,
          playerTwoId,
          playerOne.score,
          playerTwo.score,
          playerOne.attemptedBalls,
          playerTwo.attemptedBalls,
          playerOne.madeBalls,
          playerTwo.madeBalls,
          playerOne.errors,
          playerTwo.errors,
          playerOne.safeties,
          playerTwo.safeties,
        ],
        type: QueryTypes.INSERT,
      }
    );

    res.status(201).json({ message: "Game saved" });

  } catch (err) {
    console.error("POST POOL ERROR:", err);
    res.status(500).json({ error: "Failed to save game" });
  }
}