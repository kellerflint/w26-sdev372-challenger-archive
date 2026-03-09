"use client"

import Header from "../Components/Header";
import Footer from "../Components/Footer"
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api.client";

export default function Home() {
  const [matches, setMatches] = useState(null);

  const formatMatchDate = (value) => {
    if (!value) return "TBD";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    const dateOptions = { month: "2-digit", day: "2-digit", year: "numeric" };
    const timeOptions = { hour: "numeric", minute: "2-digit" };
    return `${parsed.toLocaleDateString("en-US", dateOptions)} • ${parsed.toLocaleTimeString("en-US", timeOptions)}`;
  };

  useEffect(() => {
    apiFetch("/pool/getPoolMatches")
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error(err));
  }, []);

  if (!matches) {
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
              <p><strong>Player One Attempts: </strong>{match.playerOneShotAtt ?? "—"}</p>
              <p><strong>Player Two Attempts: </strong>{match.playerTwoShotAtt ?? "—"}</p>
              <p><strong>Player One Pot: </strong>{match.playerOneShotPot ?? "—"}</p>
              <p><strong>Player Two Pot: </strong>{match.playerTwoShotPot ?? "—"}</p>
              <p><strong>Player One Errors: </strong>{match.playerOneErrors ?? "—"}</p>
              <p><strong>Player Two Errors: </strong>{match.playerTwoErrors ?? "—"}</p>
              <p><strong>Player One Safeties: </strong>{match.playerOneSafeties ?? "—"}</p>
              <p><strong>Player Two Safeties: </strong>{match.playerTwoSafeties ?? "—"}</p>
              <p><strong>Match Date: </strong>{formatMatchDate(match.matchDate)}</p>
              {match.location && <p><strong>Location: </strong>{match.location}</p>}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
