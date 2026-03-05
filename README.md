## Project Overview

### Challenger Archive

- **Problem Statement:** Casual pool and MMA competitors struggle to keep match notes organized. Challenger Archive stores each encounter so they can quickly revisit what happened.
- **Target Users:** Recreational players who want a lightweight way to log locations, stats, and outcomes for future reference.

## Feature Breakdown

- **MVP Features:** submit pool or MMA match data (names, stats, date/time, location), persist wins/losses/notes, and view leaderboards plus match history.
- **Extended Features:** TBD

## Data Model Planning

- **Core Entities:**  
  - **Players/Fighters:** store basic identity (first name) along with win/loss totals (pool) or notes/metrics (MMA) so each participant’s record can be ranked.  
  - **Pool Games:** persist player IDs, scores, attempts/pots/errors/safeties, plus match metadata (date/time, location).  
  - **MMA Matches:** store fighter IDs, detail stats (head/body hits, dodges, blocks), notes for each side, and metadata (date, location).
- **Key Relationships:** pool games link to `poolPlayers` via `playerOneId`/`playerTwoId`; MMA matches point at `mmaFighters` the same way. Leaderboard queries join matches back to the player/fighter tables to surface the most recent match and aggregate win/metric totals for each record.

## Prerequisites & Setup

- Install Node.js and MySQL locally (or rely on Docker Compose).  
- Copy `backend/server/.env.example` to `.env` if running locally and update credentials/ports to match your MySQL instance.  
- Run `npm install` in `backend/server` and `frontend`.  
- Execute `npm run db:reload` from `backend/server` to recreate the schema/seed data before starting the server.  
- Start the backend with `npm run dev` (listens on `http://localhost:3001`) and the frontend with `npm run dev` inside the `frontend` directory (`http://localhost:3000`).

## User Experience

- **User Flows:**  
  1. Record a match via the pool or MMA form (stats, notes, date, location).  
  2. Check the leaderboard for ranked players and their latest match.  
  3. Browse the full match list for detailed breakdowns.

## Docker

- Run `docker-compose up --build` from the repo root.  
- The stack brings up MySQL, waits for the database healthcheck, runs `npm run db:reload` via the backend entrypoint (`scripts/docker-entrypoint.sh`), and then starts the Express server and Next frontend.  
- Backend API is available on `http://localhost:3001`; frontend is `http://localhost:3000`.

## Available Scripts

- Backend (`backend/server`):  
  - `npm run dev` – starts Express with nodemon.  
  - `npm run db:reload` – drops and recreates the schema, seeds data, and recalculates pool win/loss totals.  
- Frontend (`frontend`):  
  - `npm run dev` – launches Next dev server.  
  - `npm run build` – builds the production bundle.  
  - `npm run start` – serves the production build.

## Architecture Notes

- Two feature paths (Pool vs. MMA) each have dedicated controllers/routes on the backend (`poolController.js`, `mmaController.js`).  
- Leaderboards combine aggregate stats with the most recent match per player/fighter before sending JSON to the frontend.  
- Frontend pages call `/pool/getPoolMatches`, `/pool/getPoolLeaderboard`, `/mma/getMmaMatches`, and `/mma/getMmaLeaderboard` and render cards for each match/leader.

## Testing & QA

- No automated tests yet; running `npm test` still prints the default placeholder script from `backend/server/package.json`. You can manually verify by submitting matches through the forms and checking the leaderboard/match pages.
