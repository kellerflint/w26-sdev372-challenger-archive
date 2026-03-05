import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_ADMIN_USER,
  DB_ADMIN_PASSWORD,
} = process.env;

if (!DB_NAME || !DB_USER) {
  console.error('DB_NAME and DB_USER must be set in your environment.');
  process.exit(1);
}

const schemaPath = path.resolve(new URL('../db/schema.sql', import.meta.url).pathname);
const seedPath = path.resolve(new URL('../db/seed.sql', import.meta.url).pathname);

async function reloadDatabase() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_ADMIN_USER || DB_USER,
    password: DB_ADMIN_PASSWORD || DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    console.log(`Dropping ${DB_NAME} if it exists...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);

    console.log(`Applying schema from ${schemaPath}...`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);

    console.log(`Seeding database from ${seedPath}...`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSql);

    console.log('Recalculating win/loss totals...');
    const winSql = `
      UPDATE poolPlayers p
      LEFT JOIN (
        SELECT playerOneId AS playerId, COUNT(*) AS wins
        FROM poolGames
        WHERE playerOneScore > playerTwoScore
        GROUP BY playerOneId
      ) w ON w.playerId = p.playerId
      SET p.win = COALESCE(w.wins, 0);
    `;
    const lossSql = `
      UPDATE poolPlayers p
      LEFT JOIN (
        SELECT playerTwoId AS playerId, COUNT(*) AS losses
        FROM poolGames
        WHERE playerTwoScore > playerOneScore
        GROUP BY playerTwoId
      ) l ON l.playerId = p.playerId
      SET p.loss = COALESCE(l.losses, 0);
    `;
    await connection.query(winSql);
    await connection.query(lossSql);

    console.log('Database reload complete.');
  } finally {
    await connection.end();
  }
}

reloadDatabase().catch((error) => {
  console.error('Failed to reload database:', error);
  process.exit(1);
});
