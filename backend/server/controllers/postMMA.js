import db from "../db/db.js";
import { QueryTypes } from "sequelize";

export async function postMMA(req, res) {

  const fighterOne = req.body.fighterOne;
  const fighterTwo = req.body.fighterTwo;

  // ===== VALIDATION =====
  if (!fighterOne || !fighterOne.name) {
    return res.status(400).json({ error: "Fighter One name is required" });
  }

  if (!fighterTwo || !fighterTwo.name) {
    return res.status(400).json({ error: "Fighter Two name is required" });
  }

  const f1Name = fighterOne.name.trim();
  const f2Name = fighterTwo.name.trim();

  try {

    // ================= FIGHTER ONE =================
    const f1 = await db.query(
      "SELECT fighterId FROM mmaFighters WHERE firstName = ?",
      {
        replacements: [f1Name],
        type: QueryTypes.SELECT,
      }
    );

    let fighterOneId;

    if (f1.length > 0) {
      fighterOneId = f1[0].fighterId;
    } else {
      const insertF1 = await db.query(
        "INSERT INTO mmaFighters (firstName, lastName) VALUES (?, '')",
        {
          replacements: [f1Name],
          type: QueryTypes.INSERT,
        }
      );

      fighterOneId = insertF1[0];
    }

    // ================= FIGHTER TWO =================
    const f2 = await db.query(
      "SELECT fighterId FROM mmaFighters WHERE firstName = ?",
      {
        replacements: [f2Name],
        type: QueryTypes.SELECT,
      }
    );

    let fighterTwoId;

    if (f2.length > 0) {
      fighterTwoId = f2[0].fighterId;
    } else {
      const insertF2 = await db.query(
        "INSERT INTO mmaFighters (firstName, lastName) VALUES (?, '')",
        {
          replacements: [f2Name],
          type: QueryTypes.INSERT,
        }
      );

      fighterTwoId = insertF2[0];
    }

    // ================= INSERT MATCH =================
    await db.query(
      `INSERT INTO mmaMatches (
        matchFighters,
        headHits,
        bodyHits,
        dodges,
        blocks,
        notes,
        fighterOneId,
        fighterTwoId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          `${f1Name} vs ${f2Name}`,
          fighterOne.headHits,
          fighterOne.bodyHits,
          fighterOne.dodges,
          fighterOne.blocks,
          fighterOne.notes,
          fighterOneId,
          fighterTwoId,
        ],
        type: QueryTypes.INSERT,
      }
    );

    res.status(201).json({ message: "MMA Match Saved" });

  } catch (error) {
    console.error("MMA ERROR:", error);
    res.status(500).json({ error: "Failed to save MMA match" });
  }
}