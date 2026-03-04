"use client";

import Header from "../Components/Header";
import Footer from "../Components/Footer"
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/matches/mmaMatches")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));

    fetch("http://localhost:3001/players/odds")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!data || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className="page-container">
        <h1>MMA Match</h1>
        <div className="cards-container">
          {data.map(match => (
            <div key={match.matchId} className="matches-class">
              <h2>Match #{match.matchId}</h2>
              <p><strong>Match Fighters: </strong>{match.matchFighters}</p>
              <p><strong>Fighter One: </strong>{match.fighterOne}</p>
              <p><strong>Fighter Two: </strong>{match.fighterTwo}</p>
              <p><strong>Head Hits: </strong>{match.headHits}</p>
              <p><strong>Body Hits: </strong>{match.bodyHits}</p>
              <p><strong>Dodges: </strong>{match.dodges}</p>
              <p><strong>Blocks: </strong>{match.blocks}</p>
              <p><strong>Notes: </strong>{match.notes}</p>
            </div>
          ))}
        </div>

        <h2>Mock Stats</h2>

        <div className="matches-class stats-card">
          <p>Message: {stats.message}</p>
          <p>headshot: {stats.headShot}</p>
          <p>bodyshot: {stats.bodyShot}</p>
          <p>dodges: {stats.dodges}</p>
          <p>takedowns: {stats.takedowns}</p>
          <p><strong>pWin:</strong> {stats.pWin}%</p>
        </div>
      </main>
      <Footer />
    </>
  );

}
