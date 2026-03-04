"use client"

import Header from "../Components/Header";
import Footer from "../Components/Footer"
import { useEffect, useState } from "react";

export default function Home() {
  const [matches, setMatches] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/players/poolGames")
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error(err));

    fetch("http://localhost:3001/players/odds")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!matches || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className="page-container">
        <h1>PoolMatch</h1>
        <div className="cards-container">
          {matches.map(match => (
            <div key={match.gameId} className="matches-class stats-card">
              <h2>Match #{match.gameId}</h2>
              <p><strong>Player One: </strong>{match.playerOne}</p>
              <p><strong>Player Two: </strong>{match.playerTwo}</p>
              <p><strong>Player One Score: </strong>{match.playerOneScore}</p>
              <p><strong>Player Two Score: </strong>{match.playerTwoScore}</p>
              <p><strong>Match Date: </strong>{match.matchDate}</p>
            </div>
          ))}
        </div>

        <h2>Mock Stats</h2>
        <div className="matches-class stats-card">
          <p>Message: {stats.message}</p>
          <p>shotAtt: {stats.shotAtt}</p>
          <p>shotPot: {stats.shotPot}</p>
          <p>errors: {stats.errors}</p>
          <p>effSafety: {stats.effSafety}</p>
          <p><strong>pWin:</strong> {stats.pWin}%</p>
          <p>Status: {stats.status}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
